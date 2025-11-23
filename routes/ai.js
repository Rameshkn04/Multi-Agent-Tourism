const express = require('express');
const router = express.Router();

// Load controller with error handling
let aiController;
try {
  aiController = require('../controllers/aiController');
} catch (error) {
  console.error('Error loading aiController:', error);
  throw error;
}

/**
 * POST /api/ask
 * Main endpoint for tourism queries
 * 
 * Request body:
 * {
 *   "query": "I'm going to go to Bangalore, let's plan my trip."
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "In Bangalore these are the places you can go,\nLalbagh\n..."
 * }
 */
router.post('/ask', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required in request body'
      });
    }

    const result = await aiController.processQuery(query);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(200).json(result); // Still return 200 as per examples
    }
  } catch (error) {
    console.error('Route error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;



