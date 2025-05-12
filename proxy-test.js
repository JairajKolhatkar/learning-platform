// A simple proxy server to debug API connectivity issues
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8888;

// Enable CORS for all requests
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

// Add debug endpoint
app.get('/test', (req, res) => {
  res.json({
    status: 'Proxy server is working',
    timestamp: new Date().toISOString()
  });
});

// Proxy all /api requests to the actual backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:4000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // no rewrite needed
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.url} -> ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] Response: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('[PROXY] Error:', err);
    res.status(500).json({ message: 'Proxy error', error: err.message });
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
}); 