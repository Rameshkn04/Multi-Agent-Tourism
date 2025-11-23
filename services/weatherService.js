const axios = require('axios');

/**
 * Weather service using Open-Meteo API
 * Fetches current weather and forecast data
 */
class WeatherService {
  constructor() {
    this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
  }

  /**
   * Get current weather for coordinates
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise<Object>} - Weather data with temperature and precipitation
   */
  async getCurrentWeather(latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('Valid latitude and longitude are required');
    }

    try {
      const params = {
        latitude: latitude,
        longitude: longitude,
        current: 'temperature_2m,precipitation_probability',
        timezone: 'auto'
      };

      const response = await axios.get(this.baseUrl, {
        params,
        timeout: 10000 // 10 second timeout
      });

      if (!response.data || !response.data.current) {
        throw new Error('Invalid weather data received');
      }

      const current = response.data.current;
      return {
        temperature: Math.round(current.temperature_2m),
        precipitationProbability: current.precipitation_probability || 0,
        unit: response.data.current_units?.temperature_2m || '°C'
      };
    } catch (error) {
      console.error('Weather API error:', error.message);
      throw new Error(`Failed to fetch weather: ${error.message}`);
    }
  }
}

module.exports = new WeatherService();



