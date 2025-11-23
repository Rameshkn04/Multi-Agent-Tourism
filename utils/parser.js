/**
 * Parser utility to extract place name and user intent from natural language input
 */

/**
 * Extract place name from user input
 * Looks for patterns like "going to [place]", "visit [place]", "in [place]", etc.
 * @param {string} input - User's natural language input
 * @returns {string|null} - Extracted place name or null
 */
function extractPlace(input) {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const lowerInput = input.toLowerCase();
  
  // Common patterns for place mentions
  const patterns = [
    /going to (?:go to )?([A-Z][a-zA-Z\s]+?)(?:,|\.|$|let|what|and)/i,
    /visit ([A-Z][a-zA-Z\s]+?)(?:,|\.|$|let|what|and)/i,
    /in ([A-Z][a-zA-Z\s]+?)(?:,|\.|$|let|what|and)/i,
    /to ([A-Z][a-zA-Z\s]+?)(?:,|\.|$|let|what|and)/i,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      const place = match[1].trim();
      // Filter out common words that might be captured
      if (place.length > 2 && !['the', 'my', 'your', 'their'].includes(place.toLowerCase())) {
        return place;
      }
    }
  }

  // Fallback: try to find capitalized words (likely place names)
  const words = input.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[.,!?;:]$/, '');
    if (word[0] === word[0]?.toUpperCase() && word.length > 2) {
      // Check if it's followed by more capitalized words (multi-word place names)
      let place = word;
      let j = i + 1;
      while (j < words.length && words[j][0] === words[j][0]?.toUpperCase()) {
        place += ' ' + words[j].replace(/[.,!?;:]$/, '');
        j++;
      }
      if (place.length > 2) {
        return place;
      }
    }
  }

  return null;
}

/**
 * Determine user intent from input
 * @param {string} input - User's natural language input
 * @returns {Object} - { wantsWeather: boolean, wantsPlaces: boolean }
 */
function extractIntent(input) {
  if (!input || typeof input !== 'string') {
    return { wantsWeather: false, wantsPlaces: false };
  }

  const lowerInput = input.toLowerCase();

  // Weather-related keywords
  const weatherKeywords = [
    'temperature', 'temp', 'weather', 'rain', 'raining', 'rainfall',
    'forecast', 'climate', 'hot', 'cold', 'sunny', 'cloudy'
  ];

  // Places/tourism-related keywords
  const placesKeywords = [
    'places', 'place', 'attractions', 'attraction', 'visit', 'tourist',
    'sightseeing', 'sights', 'see', 'explore', 'tour', 'tourism', 'plan'
  ];

  const wantsWeather = weatherKeywords.some(keyword => lowerInput.includes(keyword));
  const wantsPlaces = placesKeywords.some(keyword => lowerInput.includes(keyword));

  // If neither is explicitly mentioned but user mentions "plan" or "trip", assume places
  if (!wantsWeather && !wantsPlaces) {
    if (lowerInput.includes('plan') || lowerInput.includes('trip')) {
      return { wantsWeather: false, wantsPlaces: true };
    }
    // If only place is mentioned without specific intent, default to places
    if (extractPlace(input)) {
      return { wantsWeather: false, wantsPlaces: true };
    }
  }

  return { wantsWeather, wantsPlaces };
}

/**
 * Main parser function
 * @param {string} input - User's natural language input
 * @returns {Object} - { place: string|null, wantsWeather: boolean, wantsPlaces: boolean }
 */
function parseInput(input) {
  const place = extractPlace(input);
  const intent = extractIntent(input);

  return {
    place,
    ...intent
  };
}

module.exports = {
  parseInput,
  extractPlace,
  extractIntent
};



