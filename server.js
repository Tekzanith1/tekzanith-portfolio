const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// API Route Handlers
const apiRoutes = {
  '/api': require('./api/index.js'),
  '/api/health': require('./api/health.js'),
  '/api/projects': require('./api/projects.js'),
  '/api/experience': require('./api/experience.js'),
  '/api/skills': require('./api/skills.js'),
  '/api/stats': require('./api/stats.js'),
  '/api/contact': require('./api/contact.js')
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname.replace(/\/$/, '') || '/';

  // Attach query to req for API handlers
  req.query = parsedUrl.query;

  // Enhance res with status and json helpers
  res.status = function(code) {
    this.statusCode = code;
    return this;
  };
  res.json = function(data) {
    this.setHeader('Content-Type', 'application/json; charset=utf-8');
    this.end(JSON.stringify(data, null, 2));
    return this;
  };

  // Route API Requests
  if (pathname.startsWith('/api')) {
    const handler = apiRoutes[pathname];
    if (handler) {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            req.body = body ? JSON.parse(body) : {};
          } catch (e) {
            req.body = body;
          }
          handler(req, res);
        });
        return;
      }
      return handler(req, res);
    }
    return res.status(404).json({ error: `API route '${pathname}' not found.` });
  }

  // Serve Static Files
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for client-side routing
        fs.readFile(path.join(__dirname, 'index.html'), (err2, fallbackContent) => {
          if (err2) {
            res.writeHead(404);
            res.end('File Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fallbackContent);
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`\n🚀 Tek Zanith Portfolio Server running at: http://localhost:${PORT}`);
    console.log(`📡 API Endpoints live at: http://localhost:${PORT}/api\n`);
  });
}

module.exports = server;
