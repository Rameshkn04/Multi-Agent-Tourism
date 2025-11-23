const { parseInput } = require('../utils/parser');
const weatherAgent = require('../agents/weatherAgent');
const placesAgent = require('../agents/placesAgent');

/**
 * Tourism AI Controller (Parent Agent)
 * Orchestrates the entire multi-agent system
 */
class AIController {
  /**
   * Process user query and coordinate child agents
   * @param {string} userQuery - User's natural language input
   * @returns {Promise<Object>} - { success: boolean, message: string }
   */
  async processQuery(userQuery) {
    try {
      if (!userQuery || typeof userQuery !== 'string' || userQuery.trim().length === 0) {
        return {
          success: false,
          message: 'Please provide a valid query about a place you want to visit.'
        };
      }

      // Parse user input to extract place and intent
      const parsed = parseInput(userQuery);
      const { place, wantsWeather, wantsPlaces } = parsed;

      // Validate place was extracted
      if (!place) {
        return {
          success: false,
          message: "I don't know this place exists"
        };
      }

      // Determine what the user wants
      const needsWeather = wantsWeather;
      const needsPlaces = wantsPlaces || (!wantsWeather && !wantsPlaces); // Default to places if nothing specified

      // Execute child agents based on intent
      const results = await Promise.allSettled([
        needsWeather ? weatherAgent.getWeather(place) : Promise.resolve(null),
        needsPlaces ? placesAgent.getPlaces(place, 5) : Promise.resolve(null)
      ]);

      // Process results
      const weatherResult = results[0].status === 'fulfilled' ? results[0].value : null;
      const placesResult = results[1].status === 'fulfilled' ? results[1].value : null;

      // Check if any agent failed with "place doesn't exist" error
      if (weatherResult && !weatherResult.success && weatherResult.message === "I don't know this place exists") {
        return {
          success: false,
          message: "I don't know this place exists"
        };
      }

      if (placesResult && !placesResult.success && placesResult.message === "I don't know this place exists") {
        return {
          success: false,
          message: "I don't know this place exists"
        };
      }

      // Build combined response
      let responseMessage = '';

      // Add weather information if requested and available
      if (needsWeather && weatherResult && weatherResult.success) {
        responseMessage += weatherResult.message;
      }

      // Add places information if requested and available
      if (needsPlaces && placesResult && placesResult.success) {
        if (responseMessage.length > 0) {
          responseMessage += ' And ';
        }
        
        const placesMessage = placesResult.message;
        // When combined with weather, make it more conversational
        if (responseMessage.length > 0) {
          // Extract the places list (everything after "In [place], here are some amazing places you can visit:\n\n")
          // The format is: "In [place], here are some amazing places you can visit:\n\n• [place1]\n\n• [place2]..."
          // We want: "here are some amazing places you can visit:\n\n• [place1]\n\n• [place2]..."
          const match = placesMessage.match(/In .+?, here are some great places you can visit:\n\n(.+)/s);
          if (match && match[1]) {
            const placesList = match[1];
            responseMessage += `Here are some great places you can visit:\n\n${placesList}`;
          } else {
            // Fallback: try to extract places after the first line
            const lines = placesMessage.split('\n');
            const placesList = lines.slice(2).join('\n'); // Skip "In [place]..." and blank line
            responseMessage += `Here are some great places you can visit:\n\n${placesList}`;
          }
        } else {
          // If only places, use the original message
          responseMessage += placesMessage;
        }
      }

      // If no results were successful, return error
      if (responseMessage.length === 0) {
        return {
          success: false,
          message: "I don't know this place exists"
        };
      }

      return {
        success: true,
        message: responseMessage
      };
    } catch (error) {
      console.error('AIController error:', error);
      return {
        success: false,
        message: "I don't know this place exists"
      };
    }
  }
}

module.exports = new AIController();

