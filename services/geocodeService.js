const axios = require('axios');

/**
 * Geocoding service using Nominatim API
 * Converts place names to coordinates (latitude, longitude)
 */
class GeocodeService {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org/search';
    // Add user agent header as required by Nominatim
    this.headers = {
      'User-Agent': 'Multi-Agent-Tourism-System/1.0'
    };
  }

  /**
   * Get coordinates for a place name
   * @param {string} placeName - Name of the place
   * @returns {Promise<Object|null>} - { lat, lon, display_name } or null if not found
   */
  async getCoordinates(placeName) {
    if (!placeName || typeof placeName !== 'string') {
      throw new Error('Place name is required');
    }

    try {
      const params = {
        q: placeName,
        format: 'json',
        limit: 1,
        addressdetails: 1
      };

      const response = await axios.get(this.baseUrl, {
        params,
        headers: this.headers,
        timeout: 10000 // 10 second timeout
      });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name
      };
    } catch (error) {
      console.error('Geocoding error:', error.message);
      throw new Error(`Failed to geocode place: ${error.message}`);
    }
  }
}

module.exports = new GeocodeService();



