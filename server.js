import http from 'node:http';

const port = Number(process.env.PORT || 10000);

const panelHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ZEUS-PANEL</title>
    <style>
      body { margin:0; min-height:100vh; display:grid; place-items:center; background:#071224; color:#f8fafc; font-family:Arial, sans-serif; }
      .card { width:min(420px, 92vw); padding:28px; border-radius:14px; background:#0f172a; border:1px solid #334155; box-shadow:0 18px 40px rgba(0,0,0,.35); }
      h1 { margin:0 0 12px; }
      label { display:block; margin-bottom:6px; font-weight:bold; }
      input { width:100%; box-sizing:border-box; margin-bottom:14px; padding:10px; border-radius:8px; border:1px solid #475569; background:#020617; color:#f8fafc; }
      button { width:100%; padding:11px; border:none; border-radius:8px; background:#2563eb; color:white; cursor:pointer; font-weight:bold; }
      .note { margin-top:12px; color:#93c5fd; font-size:0.95rem; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>ZEUS-PANEL</h1>
      <form method="post" action="/panel">
        <label for="username">Username</label>
        <input id="username" name="username" value="admin" required />
        <label for="password">Password</label>
        <input id="password" name="password" type="password" value="admin" required />
        <button type="submit">Login</button>
      </form>
      <div class="note">Default login: admin / admin</div>
    </div>
  </body>
</html>`;

const panelSuccess = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ZEUS-PANEL</title>
    <style>
      body { margin:0; min-height:100vh; display:grid; place-items:center; background:#071224; color:#f8fafc; font-family:Arial, sans-serif; }
      .card { width:min(520px, 92vw); padding:28px; border-radius:14px; background:#0f172a; border:1px solid #334155; }
      h1 { margin:0 0 12px; }
      p { color:#cbd5e1; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>ZEUS-PANEL</h1>
      <p>Admin login successful.</p>
      <p>Render deployment is now exposed at /panel with the default credentials admin / admin.</p>
    </div>
  </body>
</html>`;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', port, panel: '/panel' }));
    return;
  }

  if (url.pathname === '/panel') {
    if (req.method === 'POST') {
      const body = await readBody(req);
      const params = new URLSearchParams(body);
      const username = params.get('username') || '';
      const password = params.get('password') || '';

      if (username === 'admin' && password === 'admin') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(panelSuccess);
        return;
      }

      res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<html><body><h1>Unauthorized</h1></body></html>');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(panelHtml);
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ status: 'ok', service: 'zeus-panel-render', port, panel: '/panel', login: 'admin/admin' }));
});

server.listen(port, () => {
  console.log(`Render service listening on port ${port}`);
});
