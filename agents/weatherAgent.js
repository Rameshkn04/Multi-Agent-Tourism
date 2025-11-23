const geocodeService = require('../services/geocodeService');
const weatherService = require('../services/weatherService');

/**
 * Weather Agent
 * Fetches current weather information for a given place
 */
class WeatherAgent {
  /**
   * Get weather information for a place
   * @param {string} placeName - Name of the place
   * @returns {Promise<Object>} - { success: boolean, message: string, data?: Object }
   */
  async getWeather(placeName) {
    try {
      // Step 1: Geocode the place
      const coordinates = await geocodeService.getCoordinates(placeName);
      
      if (!coordinates) {
        return {
          success: false,
          message: "I don't know this place exists"
        };
      }

      // Step 2: Get weather data
      const weatherData = await weatherService.getCurrentWeather(
        coordinates.lat,
        coordinates.lon
      );

      // Step 3: Format response message with more human-like language
      let rainDescription = '';
      if (weatherData.precipitationProbability === 0) {
        rainDescription = 'no chance of rain';
      } else if (weatherData.precipitationProbability < 20) {
        rainDescription = `a slight chance of ${weatherData.precipitationProbability}% rain`;
      } else if (weatherData.precipitationProbability < 50) {
        rainDescription = `a chance of ${weatherData.precipitationProbability}% rain`;
      } else {
        rainDescription = `a high chance of ${weatherData.precipitationProbability}% rain`;
      }
      
      const message = `In ${placeName}, it's currently ${weatherData.temperature}${weatherData.unit} with ${rainDescription}.`;

      return {
        success: true,
        message,
        data: {
          place: placeName,
          temperature: weatherData.temperature,
          unit: weatherData.unit,
          precipitationProbability: weatherData.precipitationProbability
        }
      };
    } catch (error) {
      console.error('WeatherAgent error:', error);
      return {
        success: false,
        message: "I don't know this place exists"
      };
    }
  }
}

module.exports = new WeatherAgent();



