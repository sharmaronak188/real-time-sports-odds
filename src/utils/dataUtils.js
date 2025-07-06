// Utility functions for data management

/**
 * Simulates odds fluctuation based on market conditions
 * @param {number} currentOdds - Current odds value
 * @param {number} volatility - Volatility factor (0-1)
 * @returns {number} New odds value
 */
export const simulateOddsChange = (currentOdds, volatility = 0.1) => {
  const variation = (Math.random() - 0.5) * volatility;
  const newOdds = currentOdds * (1 + variation);
  return Math.max(1.01, Math.round(newOdds * 100) / 100);
};

/**
 * Determines trend direction based on odds change
 * @param {number} oldOdds - Previous odds value
 * @param {number} newOdds - New odds value
 * @returns {string} Trend direction: 'up', 'down', or 'neutral'
 */
export const calculateTrend = (oldOdds, newOdds) => {
  const threshold = 0.01; // Minimum change to register as trend
  const difference = newOdds - oldOdds;

  if (Math.abs(difference) < threshold) return "neutral";
  return difference > 0 ? "up" : "down";
};

/**
 * Validates match data structure
 * @param {Object} match - Match object to validate
 * @returns {boolean} True if valid
 */
export const validateMatchData = (match) => {
  if (!match || typeof match !== "object") return false;

  const requiredFields = ["id", "homeTeam", "awayTeam", "odds"];
  const hasRequiredFields = requiredFields.every((field) =>
    match.hasOwnProperty(field)
  );

  if (!hasRequiredFields) return false;

  // Validate odds structure
  const { odds } = match;
  if (!odds || typeof odds !== "object") return false;

  const requiredOdds = ["home", "draw", "away"];
  const hasValidOdds = requiredOdds.every(
    (type) => typeof odds[type] === "number" && odds[type] > 0
  );

  return hasValidOdds;
};

/**
 * Generates mock match updates for testing
 * @param {Array} matches - Array of match objects
 * @param {number} updateProbability - Probability of each match being updated (0-1)
 * @returns {Array} Array of update objects
 */
export const generateMockUpdates = (matches, updateProbability = 0.3) => {
  const updates = [];
  const oddsTypes = ["home", "draw", "away"];

  matches.forEach((match) => {
    if (Math.random() < updateProbability) {
      const oddsType = oddsTypes[Math.floor(Math.random() * oddsTypes.length)];
      const currentOdds = match.odds[oddsType];
      const newOdds = simulateOddsChange(currentOdds, 0.15);
      const trend = calculateTrend(currentOdds, newOdds);

      updates.push({
        matchId: match.id,
        oddsType,
        newOdds,
        trend,
      });
    }
  });

  return updates;
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Transform API event data to match Redux store format
 * @param {Object} apiEvent - Event data from API
 * @returns {Object} Transformed match object
 */
const transformApiEventToMatch = (apiEvent) => {
  if (!apiEvent || typeof apiEvent !== "object") {
    throw new Error("Invalid API event data");
  }

  // Format the date to match existing format
  const formatEventTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
      });
      const time = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return `${time} ${day} ${dateStr}`;
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "TBD";
    }
  };

  // Transform odds from API format to Redux format
  const transformOdds = (apiOdds) => {
    if (!apiOdds || typeof apiOdds !== "object") {
      return { home: 1.0, draw: 1.0, away: 1.0 };
    }

    return {
      home: parseFloat(apiOdds.homeWin) || 1.0,
      draw: parseFloat(apiOdds.draw) || 1.0,
      away: parseFloat(apiOdds.awayWin) || 1.0,
    };
  };

  // Format league name to match existing format
  const formatLeague = (category, league) => {
    return `${category} / ${league}`;
  };

  return {
    id: apiEvent.id,
    time: formatEventTime(apiEvent.date),
    homeTeam: apiEvent.homeTeam || "Unknown Team",
    awayTeam: apiEvent.awayTeam || "Unknown Team",
    league: formatLeague(
      apiEvent.category || "Sports",
      apiEvent.league || "Unknown League"
    ),
    odds: transformOdds(apiEvent.odds),
    totalMatches: apiEvent.betCount || 0,
    trends: { home: "neutral", draw: "neutral", away: "neutral" },
    isHot: apiEvent.isHot || false,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Transform array of API events to matches format
 * @param {Array} apiEvents - Array of API events
 * @returns {Array} Array of transformed match objects
 */
export const transformApiEventsToMatches = (apiEvents) => {
  if (!Array.isArray(apiEvents)) {
    console.warn("Expected array of API events, got:", typeof apiEvents);
    return [];
  }

  const transformedMatches = [];

  apiEvents.forEach((event, index) => {
    try {
      const transformedMatch = transformApiEventToMatch(event);
      transformedMatches.push(transformedMatch);
    } catch (error) {
      console.warn(
        `Failed to transform event at index ${index}:`,
        error,
        event
      );
      // Continue processing other events
    }
  });

  console.log(
    `Transformed ${transformedMatches.length} out of ${apiEvents.length} events`
  );
  return transformedMatches;
};

/**
 * Validate API event data structure
 * @param {Object} apiEvent - API event to validate
 * @returns {boolean} True if valid
 */
const validateApiEvent = (apiEvent) => {
  if (!apiEvent || typeof apiEvent !== "object") return false;

  const requiredFields = ["id", "homeTeam", "awayTeam", "odds"];
  const hasRequiredFields = requiredFields.every(
    (field) =>
      apiEvent.hasOwnProperty(field) &&
      apiEvent[field] !== null &&
      apiEvent[field] !== undefined
  );

  if (!hasRequiredFields) return false;

  // Validate odds structure
  const { odds } = apiEvent;
  if (!odds || typeof odds !== "object") return false;

  const requiredOdds = ["homeWin", "draw", "awayWin"];
  const hasValidOdds = requiredOdds.every((type) => {
    const value = parseFloat(odds[type]);
    return !isNaN(value) && value > 0;
  });

  return hasValidOdds;
};

/**
 * Filter and validate API events
 * @param {Array} apiEvents - Array of API events
 * @returns {Array} Array of valid API events
 */
export const filterValidApiEvents = (apiEvents) => {
  if (!Array.isArray(apiEvents)) return [];

  const validEvents = apiEvents.filter(validateApiEvent);

  if (validEvents.length !== apiEvents.length) {
    console.warn(
      `Filtered out ${apiEvents.length - validEvents.length} invalid events`
    );
  }

  return validEvents;
};
