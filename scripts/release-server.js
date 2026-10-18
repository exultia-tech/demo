const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(fs.existsSync('D:\\releases') ? 'D:\\releases' : 'C:\\releases');
const LOG_DIR = 'C:\\ProgramData\\Exultia\\logs';
try {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
} catch (e) {}

const LOG_FILE = path.join(LOG_DIR, 'access.log');
const CERT_FILE = 'C:\\releases\\cert.pem';
const KEY_FILE = 'C:\\releases\\key.pem';

const ALLOWED_EXTENSIONS = new Set([
  '.zip',
  '.exe',
  '.dmg',
  '.tar.gz',
  '.json',
  '.txt',
  '.sha256'
]);

const BLOCKED_FILENAMES = new Set([
  'cert.pem',
  'key.pem',
  'server.js',
  'access.log',
  'token',
  'svc-builder.secret'
]);

const MIME_TYPES = {
  '.zip': 'application/zip',
  '.exe': 'application/vnd.microsoft.portable-executable',
  '.dmg': 'application/x-apple-diskimage',
  '.tar.gz': 'application/gzip',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.sha256': 'text/plain',
};

function requestHandler(req, res) {
  try {
    const proto = req.socket.encrypted ? 'HTTPS' : 'HTTP';
    const entry = `${new Date().toISOString()} [${proto}] [${req.method}] ${req.url}\n`;
    fs.appendFileSync(LOG_FILE, entry);
  } catch (e) {}

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const proto = req.socket.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(req.url, `${proto}://${req.headers.host || 'download.exultia.tech'}`);
  const urlPath = decodeURIComponent(parsedUrl.pathname);

  // Health endpoint: cloaked to prevent internal path/identity exposure
  if (urlPath === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'exultia-release-cdn' }));
    return;
  }

  // Root directory listing: only exposes authorized distribution artifacts
  if (urlPath === '/' || urlPath === '') {
    try {
      const files = fs.readdirSync(ROOT, { withFileTypes: true })
        .filter(f => {
          if (!f.isFile()) return false;
          if (f.name.startsWith('.')) return false;
          if (BLOCKED_FILENAMES.has(f.name.toLowerCase())) return false;
          const ext = path.extname(f.name).toLowerCase();
          return ALLOWED_EXTENSIONS.has(ext);
        })
        .map(f => {
          const full = path.join(ROOT, f.name);
          const stat = fs.statSync(full);
          return {
            name: f.name,
            size: stat.size,
            mtime: stat.mtime
          };
        });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ service: 'Exultia Release CDN', files }, null, 2));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
    return;
  }

  // Prevent path traversal and enforce strict filename sanity
  const relativePath = urlPath.replace(/^[/\\]+/, '');
  const filePath = path.resolve(ROOT, relativePath);

  if (!filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden' }));
    return;
  }

  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // Strict allowlist: reject non-distribution extensions and hidden/system files
  if (fileName.startsWith('.') || BLOCKED_FILENAMES.has(fileName.toLowerCase()) || !ALLOWED_EXTENSIONS.has(ext)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'File not found' }));
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found' }));
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

      if (start >= stats.size || end >= stats.size || start > end || isNaN(start)) {
        res.writeHead(416, { 'Content-Range': `bytes */${stats.size}` });
        res.end();
        return;
      }

      const chunksize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Content-Length': chunksize,
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Length': stats.size });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

const key = fs.readFileSync(KEY_FILE);
const cert = fs.readFileSync(CERT_FILE);

// Native HTTPS server on 7070 bound strictly to loopback (127.0.0.1)
const httpsServer7070 = https.createServer({ key, cert }, requestHandler);
httpsServer7070.listen(7070, '127.0.0.1', () => {
  console.log(`HTTPS server listening on 127.0.0.1:7070, serving: ${ROOT}`);
});

// Native HTTP backup server on 8080 bound strictly to loopback (127.0.0.1)
const httpServer8080 = http.createServer(requestHandler);
httpServer8080.listen(8080, '127.0.0.1', () => {
  console.log(`HTTP server listening on 127.0.0.1:8080, serving: ${ROOT}`);
});
