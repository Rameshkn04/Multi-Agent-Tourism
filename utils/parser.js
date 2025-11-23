/**
 * Parser utility to extract place name and user intent
 */

/* ------------------------- PLACE EXTRACTION ------------------------- */
/**
 * Extracts a place name from user input using strong NLP patterns.
 * Handles: "in Bangalore", "going to Paris", "visit New York", etc.
 */
function extractPlace(input) {
  if (!input || typeof input !== "string") return null;

  // Clean input
  const cleaned = input.replace(/\s+/g, " ").trim();

  // Strong regex patterns for typical travel queries
  const patterns = [
    /\bgoing to\s+([A-Za-z][A-Za-z\s]+?)(?=[?.!,]|$)/i,
    /\bgo to\s+([A-Za-z][A-Za-z\s]+?)(?=[?.!,]|$)/i,
    /\bvisit\s+([A-Za-z][A-Za-z\s]+?)(?=[?.!,]|$)/i,
    /\btrip to\s+([A-Za-z][A-Za-z\s]+?)(?=[?.!,]|$)/i,
    /\bin\s+([A-Za-z][A-Za-z\s]+?)(?=[?.!,]|$)/i,
    /\bto\s+([A-Za-z][A-Za-z\s]+?)(?=[?.!,]|$)/i
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match && match[1]) {
      let place = match[1].trim();

      // Remove punctuation
      place = place.replace(/[?.!,]/g, "").trim();

      // Exclude irrelevant words (bug fix)
      const banned = ["what", "where", "who", "is", "the", "temperature"];
      if (banned.includes(place.toLowerCase())) continue;

      return place;
    }
  }

  /* ---- Fallback: Detect multi-word capitalized places ---- */
  const words = cleaned.split(" ");
  let place = "";

  for (let i = 0; i < words.length; i++) {
    if (/^[A-Z][a-z]+$/.test(words[i])) {
      place = words[i];
      let j = i + 1;

      while (j < words.length && /^[A-Z][a-z]+$/.test(words[j])) {
        place += " " + words[j];
        j++;
      }

      return place.trim();
    }
  }

  return null;
}

/* ---------------------------- INTENT ---------------------------- */
/**
 * Determines whether the user wants weather, places, or both.
 */
function extractIntent(input) {
  if (!input || typeof input !== "string") {
    return { wantsWeather: false, wantsPlaces: false };
  }

  const lower = input.toLowerCase();

  const weatherKeywords = [
    "temperature", "temp", "weather", "rain", "raining",
    "forecast", "climate", "hot", "cold", "sunny", "cloudy"
  ];

  const placesKeywords = [
    "places", "place", "attractions", "attraction", "visit",
    "tourist", "sightseeing", "see", "explore", "tour", "tourism",
    "plan", "trip"
  ];

  const wantsWeather = weatherKeywords.some(k => lower.includes(k));
  const wantsPlaces = placesKeywords.some(k => lower.includes(k));

  /* Smart fallback logic */
  if (!wantsWeather && !wantsPlaces) {
    if (lower.includes("plan") || lower.includes("trip")) {
      return { wantsWeather: false, wantsPlaces: true };
    }
  }

  return { wantsWeather, wantsPlaces };
}

/* ---------------------------- MAIN ---------------------------- */
function parseInput(input) {
  return {
    place: extractPlace(input),
    ...extractIntent(input)
  };
}

module.exports = {
  parseInput,
  extractPlace,
  extractIntent
};
