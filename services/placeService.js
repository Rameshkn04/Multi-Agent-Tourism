const axios = require('axios');

/**
 * Places service using Overpass API
 * Fetches tourist attractions and places of interest
 */
class PlaceService {
  constructor() {
    this.baseUrl = 'https://overpass-api.de/api/interpreter';
  }

  /**
   * Get tourist attractions for coordinates
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {number} limit - Maximum number of places to return (default: 5)
   * @returns {Promise<Array>} - Array of place names
   */
  async getTouristPlaces(latitude, longitude, limit = 5) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('Valid latitude and longitude are required');
    }

    try {
      // Overpass QL query to find tourist attractions within ~10km radius
      // Searches for tourism-related places: attractions, museums, parks, monuments, etc.
      const query = `[out:json][timeout:25];
(
  node["tourism"](around:10000,${latitude},${longitude});
  way["tourism"](around:10000,${latitude},${longitude});
  relation["tourism"](around:10000,${latitude},${longitude});
  node["leisure"](around:10000,${latitude},${longitude});
  way["leisure"](around:10000,${latitude},${longitude});
  relation["leisure"](around:10000,${latitude},${longitude});
  node["historic"](around:10000,${latitude},${longitude});
  way["historic"](around:10000,${latitude},${longitude});
  relation["historic"](around:10000,${latitude},${longitude});
);
out body;
>;
out skel qt;`;

      const response = await axios.post(
        this.baseUrl,
        `data=${encodeURIComponent(query)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 30000 // 30 second timeout for Overpass
        }
      );

      if (!response.data || !response.data.elements) {
        return [];
      }

      // Extract place names from results
      const places = new Set(); // Use Set to avoid duplicates
      
      response.data.elements.forEach(element => {
        if (element.tags) {
          // Priority order for name extraction
          const name = element.tags.name || 
                      element.tags['name:en'] || 
                      element.tags['name:en-US'] ||
                      element.tags.official_name ||
                      element.tags['tourism'] ||
                      element.tags['leisure'] ||
                      element.tags['historic'];
          
          if (name && name.trim().length > 0) {
            places.add(name.trim());
          }
        }
      });

      // Convert to array and limit results
      const placesArray = Array.from(places).slice(0, limit);
      
      return placesArray;
    } catch (error) {
      console.error('Places API error:', error.message);
      // If Overpass fails, return empty array (not an error, just no places found)
      return [];
    }
  }
}

module.exports = new PlaceService();

