import express from 'express';

const router = express.Router();

// Simple ping endpoint to test connection
router.get('/ping', (req, res) => {
  console.log(`Test ping route hit at: ${new Date().toISOString()}`);
  res.json({ 
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

// Echo endpoint to test data transmission
router.post('/echo', (req, res) => {
  console.log('Echo endpoint received data:', req.body);
  res.json({
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// Status endpoint to check server status
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router; 