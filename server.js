import http from 'node:http';

const port = Number(process.env.PORT || 10000);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', port }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ status: 'ok', service: 'zeus-panel-render', port }));
});

server.listen(port, () => {
  console.log(`Render service listening on port ${port}`);
});
