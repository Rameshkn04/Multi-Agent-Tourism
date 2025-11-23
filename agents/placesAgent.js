const geocodeService = require('../services/geocodeService');
const placeService = require('../services/placeService');

/**
 * Places Agent
 * Fetches tourist attractions and places of interest for a given place
 */
class PlacesAgent {
  /**
   * Get tourist places for a location
   * @param {string} placeName - Name of the place
   * @param {number} limit - Maximum number of places to return (default: 5)
   * @returns {Promise<Object>} - { success: boolean, message: string, data?: Array }
   */
  async getPlaces(placeName, limit = 5) {
    try {
      // Step 1: Geocode the place
      const coordinates = await geocodeService.getCoordinates(placeName);
      
      if (!coordinates) {
        return {
          success: false,
          message: "I don't know this place exists"
        };
      }

      // Step 2: Get tourist places
      const places = await placeService.getTouristPlaces(
        coordinates.lat,
        coordinates.lon,
        limit
      );

      if (!places || places.length === 0) {
        // If no places found, still return success but with a message
        return {
          success: true,
          message: `In ${placeName} I couldn't find specific tourist attractions, but you can explore the area.`,
          data: []
        };
      }

      // Step 3: Format response message with more human-like language
      // Format: "In [place] these are the places you can go, \n\n[place1]\n\n[place2]\n\n..."
      // Using more natural language while maintaining the structure
      let message = `In ${placeName}, here are some great places you can visit:\n\n`;
      places.forEach((place, index) => {
        message += place;
        if (index < places.length - 1) {
          message += '\n\n';
        }
      });

      return {
        success: true,
        message,
        data: places
      };
    } catch (error) {
      console.error('PlacesAgent error:', error);
      return {
        success: false,
        message: "I don't know this place exists"
      };
    }
  }
}

module.exports = new PlacesAgent();



