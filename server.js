import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT || 10000);

const indexHtml = await readFile(path.join(__dirname, 'public', 'index.html'), 'utf8');
const stylesCss = await readFile(path.join(__dirname, 'public', 'styles.css'), 'utf8');

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
    const source = await readFile(path.join(__dirname, 'Source.js'), 'utf8');
    res.end(source);
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' });
  res.end(indexHtml);
});

server.listen(port, () => {
  console.log(`ZEUS-PANEL Render service listening on port ${port}`);
});
