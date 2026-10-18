#!/usr/bin/env python3
import sys
import os

gateway = "127.0.0.1"
try:
    with open("/proc/net/route") as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) >= 3 and parts[1] == "00000000":
                gw_hex = parts[2]
                gateway = ".".join(str(int(gw_hex[i:i+2], 16)) for i in (6, 4, 2, 0))
                break
except Exception:
    pass

default_feed = f"http://{gateway}:3000/api/patches/feed"

args = sys.argv[1:]
if args and args[0] in ("apply", "daemon", "verify"):
    if not any(a.startswith("--feed-url") for a in args):
        args.insert(1, f"--feed-url={default_feed}")

pyz_path = "/usr/local/lib/kinetic/kinetic.pyz"
os.execv(sys.executable, [sys.executable, pyz_path] + args)
