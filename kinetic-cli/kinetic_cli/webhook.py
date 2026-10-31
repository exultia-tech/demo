import hashlib
import hmac
import json
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse

from .engine import KineticEngine


class KineticWebhookListener:
    """
    Enterprise Webhook & HTTP Control Listener for the Exultia Kinetic Daemon.
    Allows external enterprise patch management consoles (ServiceNow, Ansible
    Automation Platform / AWX, Red Hat Satellite, BigFix, Rundeck, SCCM) to:
      - Trigger on-demand feed + vendor-native patching (`POST /webhook/trigger`)
      - Schedule or update deferred disruptive windows (`POST /webhook/defer`)
      - Trigger sub-second deterministic rollbacks (`POST /webhook/rollback`)
      - Query real-time patch & HA readiness status (`GET /health`, `GET /api/v1/status`)
    """

    def __init__(
        self,
        engine: KineticEngine,
        host: str = "127.0.0.1",
        port: int = 8765,
        secret: Optional[str] = None,
        os_filter: Optional[str] = None,
        feed_url: str = "https://exultia.tech/api/patches/feed",
        argent_feed_url: str = "https://exultia.tech/api/argent/feed?format=kinetic",
        secondary_feed: Optional[Any] = None,
        dry_run: bool = False,
    ):
        self.engine = engine
        self.host = host
        self.port = int(port)
        self.secret = secret
        self.os_filter = os_filter
        self.feed_url = feed_url
        self.argent_feed_url = argent_feed_url
        self.secondary_feed = secondary_feed
        self.dry_run = dry_run
        self._server: Optional[ThreadingHTTPServer] = None
        self._thread: Optional[threading.Thread] = None
        self.trigger_history: List[Dict[str, Any]] = []

    def _verify_auth(self, headers: Any, raw_body: bytes) -> bool:
        if not self.secret:
            return True

        auth_header = headers.get("Authorization", "")
        if auth_header == f"Bearer {self.secret}":
            return True

        token_header = headers.get("X-Webhook-Token", "")
        if token_header and hmac.compare_digest(token_header, self.secret):
            return True

        sig_header = headers.get("X-Exultia-Signature", "")
        if sig_header.startswith("sha256="):
            expected = hmac.new(
                self.secret.encode("utf-8"),
                raw_body,
                hashlib.sha256,
            ).hexdigest()
            provided = sig_header.split("=", 1)[1].strip()
            if hmac.compare_digest(expected, provided):
                return True

        return False

    def handle_trigger_payload(self, payload: Dict[str, Any]) -> Tuple[int, Dict[str, Any]]:
        mode = str(payload.get("mode", "non-reboot")).strip().lower()
        target_os = payload.get("os") or self.os_filter
        include_vendor = bool(payload.get("include_vendor_native", True))
        force_disruptive = bool(payload.get("force_disruptive_now", mode in ("disruptive", "all", "fullauto")))
        source_console = str(payload.get("source", "enterprise-webhook"))
        dry_run = bool(payload.get("dry_run", self.dry_run))
        secondary_feed = payload.get("secondary_feed") or payload.get("secondary_feeds") or self.secondary_feed
        kernel_livepatch = bool(payload.get("kernel_livepatch", payload.get("livepatch", False)))

        if mode == "fullauto":
            confirmed = bool(payload.get("confirm", False))
            if not confirmed:
                return 400, {
                    "ok": False,
                    "error": "fullauto mode via webhook requires explicit 'confirm': true in request payload",
                }
            res = self.engine.execute_fullauto_cycle(
                confirm=True,
                os_filter=target_os,
                feed_url=self.feed_url,
                argent_feed_url=self.argent_feed_url,
                secondary_feed=secondary_feed,
                pre_patch_hook=payload.get("pre_patch_hook"),
                post_patch_hook=payload.get("post_patch_hook"),
                simulated_metrics=payload.get("simulated_metrics"),
                dry_run=dry_run,
            )
        elif mode == "vendor-native":
            res = self.engine.execute_vendor_native_updates(
                os_filter=target_os,
                include_disruptive=force_disruptive,
                enable_builtin_autoupdate=True,
                dry_run=dry_run,
            )
        else:
            res = self.engine.execute_staged_patch_policy(
                os_filter=target_os,
                feed_url=self.argent_feed_url,
                secondary_feed=secondary_feed,
                auto_patch_non_reboot=True,
                disruptive_auto_reboot=(mode in ("disruptive", "all")) or force_disruptive,
                off_peak_window=str(payload.get("off_peak_window", "02:00-05:00")),
                deferred_windows=payload.get("deferred_windows"),
                defer_disruptive_until=payload.get("defer_disruptive_until"),
                vendor_native_updates=include_vendor,
                kernel_livepatch=kernel_livepatch,
                force_disruptive_now=force_disruptive,
                dry_run=dry_run,
            )

        event = {
            "event_id": f"WH-{int(time.time() * 1000)}",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "source": source_console,
            "mode": mode,
            "result": res,
        }
        self.trigger_history.append(event)
        self.engine.log_audit(
            "WEBHOOK_TRIGGER",
            event["event_id"],
            "SUCCESS",
            f"External webhook trigger from '{source_console}' (mode={mode})",
        )
        return 200, {"ok": True, "webhook_event": event}

    def handle_defer_payload(self, payload: Dict[str, Any]) -> Tuple[int, Dict[str, Any]]:
        policy = self.engine.get_patch_policy()
        if "off_peak_window" in payload and payload["off_peak_window"]:
            policy.off_peak_window = str(payload["off_peak_window"])
        if "deferred_windows" in payload and isinstance(payload["deferred_windows"], list):
            policy.deferred_windows = [str(x) for x in payload["deferred_windows"]]
            if policy.deferred_windows:
                policy.off_peak_window = ", ".join(policy.deferred_windows)
        if "defer_disruptive_until" in payload:
            policy.defer_disruptive_until = payload["defer_disruptive_until"]

        self.engine.save_patch_policy(policy)
        self.engine.log_audit(
            "WEBHOOK_DEFER",
            "POLICY-DEFER",
            "SUCCESS",
            f"Updated deferred windows={policy.deferred_windows}, defer_until={policy.defer_disruptive_until}",
        )
        return 200, {
            "ok": True,
            "patch_policy": policy.to_dict(),
        }

    def _build_handler(self):
        listener = self

        class WebhookHandler(BaseHTTPRequestHandler):
            def log_message(self, format: str, *args: Any):
                return

            def _send_json(self, status_code: int, data: Dict[str, Any]):
                body = json.dumps(data, indent=2).encode("utf-8")
                self.send_response(status_code)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)

            def do_GET(self):
                parsed = urlparse(self.path)
                if parsed.path in ("/health", "/api/v1/status", "/webhook/status"):
                    st = listener.engine.status()
                    readiness = listener.engine.assess_dynamic_patch_readiness()
                    self._send_json(
                        200,
                        {
                            "ok": True,
                            "service": "exultia-kinetic-webhook-listener",
                            "bound_address": f"{listener.host}:{listener.bound_port}",
                            "triggers_processed": len(listener.trigger_history),
                            "dynamic_readiness": readiness,
                            "status": st,
                        },
                    )
                elif parsed.path in ("/webhook/cbom", "/api/v1/cbom"):
                    cbom = listener.engine.generate_activity_cbom()
                    self._send_json(200, cbom)
                else:
                    self._send_json(404, {"ok": False, "error": f"Unknown endpoint {parsed.path}"})

            def do_POST(self):
                parsed = urlparse(self.path)
                length = int(self.headers.get("Content-Length", "0") or "0")
                raw_body = self.rfile.read(length) if length > 0 else b"{}"

                if not listener._verify_auth(self.headers, raw_body):
                    listener.engine.log_audit("WEBHOOK_AUTH", parsed.path, "DENIED", "Invalid webhook token/signature")
                    self._send_json(401, {"ok": False, "error": "Unauthorized webhook request"})
                    return

                try:
                    payload = json.loads(raw_body.decode("utf-8") or "{}")
                except Exception as e:
                    self._send_json(400, {"ok": False, "error": f"Invalid JSON payload: {e}"})
                    return

                if parsed.path in ("/webhook/trigger", "/api/v1/patch/trigger"):
                    code, resp = listener.handle_trigger_payload(payload)
                    self._send_json(code, resp)
                elif parsed.path in ("/webhook/defer", "/api/v1/patch/defer"):
                    code, resp = listener.handle_defer_payload(payload)
                    self._send_json(code, resp)
                elif parsed.path in ("/webhook/rollback", "/api/v1/patch/rollback"):
                    cve_id = payload.get("cve_id")
                    latest = bool(payload.get("latest", not bool(cve_id)))
                    ok = listener.engine.rollback_patch(cve_id=cve_id, latest=latest)
                    self._send_json(200 if ok else 404, {"ok": ok, "cve_id": cve_id, "latest": latest})
                else:
                    self._send_json(404, {"ok": False, "error": f"Unknown webhook endpoint {parsed.path}"})

        return WebhookHandler

    @property
    def bound_port(self) -> int:
        if self._server:
            return int(self._server.server_address[1])
        return self.port

    def start_background(self) -> int:
        if self._server is not None:
            return self.bound_port

        handler_cls = self._build_handler()
        self._server = ThreadingHTTPServer((self.host, self.port), handler_cls)
        self._thread = threading.Thread(
            target=self._server.serve_forever,
            name="ExultiaWebhookListener",
            daemon=True,
        )
        self._thread.start()

        policy = self.engine.get_patch_policy()
        policy.webhook_enabled = True
        policy.webhook_host = self.host
        policy.webhook_port = self.bound_port
        self.engine.save_patch_policy(policy)

        print(f"[Kinetic Webhook] Enterprise listener active on http://{self.host}:{self.bound_port}")
        return self.bound_port

    def serve_forever(self):
        self.start_background()
        try:
            while self._thread and self._thread.is_alive():
                time.sleep(0.5)
        except KeyboardInterrupt:
            self.stop()

    def stop(self):
        if self._server is not None:
            try:
                self._server.shutdown()
                self._server.server_close()
            except Exception:
                pass
            self._server = None
            self._thread = None
