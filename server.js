import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT || 10000);

const fallbackHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ZEUS-PANEL</title>
    <style>
      body { margin:0; min-height:100vh; display:grid; place-items:center; background:#0f172a; color:#f8fafc; font-family:Arial,sans-serif; }
      .card { padding:24px; border:1px solid #334155; border-radius:16px; background:#111827; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>ZEUS-PANEL</h1>
      <p>Render deployment is online. Static assets are unavailable in this snapshot, but the service is running.</p>
      <p>Entry file: source.js</p>
      <p><a href="/health">Health check</a></p>
    </div>
  </body>
</html>`;

const fallbackCss = `body { background:#0f172a; color:#f8fafc; font-family:Arial,sans-serif; }`;

let indexHtml = fallbackHtml;
let stylesCss = fallbackCss;

try {
  indexHtml = await readFile(path.join(__dirname, 'public', 'index.html'), 'utf8');
} catch {}

try {
  stylesCss = await readFile(path.join(__dirname, 'public', 'styles.css'), 'utf8');
} catch {}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', service: 'zeus-panel-render', timestamp: new Date().toISOString() }));
    return;
  }

  if (url.pathname === '/styles.css') {
    res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'public, max-age=3600' });
    res.end(stylesCss);
    return;
  }

  if (url.pathname === '/source.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    try {
      const source = await readFile(path.join(__dirname, 'Source.js'), 'utf8');
      res.end(source);
    } catch {
      res.end('console.log("Source.js is unavailable in this deployment snapshot.");');
    }
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' });
  res.end(indexHtml);
});

server.listen(port, () => {
  console.log(`ZEUS-PANEL Render service listening on port ${port}`);
});
