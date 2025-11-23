const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Load routes with error handling
let aiRoutes;
try {
  aiRoutes = require('./routes/ai');
  console.log('✓ Routes loaded successfully');
} catch (error) {
  console.error('✗ Error loading routes:', error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', aiRoutes);
console.log('✓ Routes mounted at /api');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Multi-Agent Tourism System is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/health`);
  console.log(`  POST http://localhost:${PORT}/api/ask`);
  console.log(`\n`);
});



