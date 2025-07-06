// API Service for Sports Events Data
// Handles all API calls to the sports events endpoint

const API_CONFIG = {
  BASE_URL:
    "https://gist.githubusercontent.com/kundan-iguru/94d1b58ca3d16376fda4bd7a0689a662/raw/events.json",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  constructor(message, status = null, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the delay
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch with timeout support
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Fetch promise with timeout
 */
const fetchWithTimeout = async (
  url,
  options = {},
  timeout = API_CONFIG.TIMEOUT
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }
    throw error;
  }
};

/**
 * Make API request with retry logic
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} retries - Number of retry attempts
 * @returns {Promise} API response data
 */
const makeApiRequest = async (
  url,
  options = {},
  retries = API_CONFIG.RETRY_ATTEMPTS
) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error;

      if (error.status >= 400 && error.status < 500 && error.status !== 408) {
        throw error;
      }

      if (attempt === retries) {
        throw error;
      }

      await sleep(API_CONFIG.RETRY_DELAY * (attempt + 1));
      console.warn(
        `API request failed, retrying... (attempt ${attempt + 1}/${retries})`
      );
    }
  }

  throw lastError;
};

/**
 * Fetch sports events data from the API
 * @returns {Promise<Array>} Array of sports events
 */
export const fetchSportsEvents = async () => {
  try {
    console.log("Fetching sports events from API...");
    const data = await makeApiRequest(API_CONFIG.BASE_URL);

    if (!Array.isArray(data)) {
      throw new ApiError("Invalid API response: expected array of events");
    }

    console.log(`Successfully fetched ${data.length} sports events`);
    return data;
  } catch (error) {
    console.error("Failed to fetch sports events:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Failed to fetch sports events: ${error.message}`,
      null,
      error
    );
  }
};

/**
 * Fetch specific event by ID (for future use)
 * @param {number} eventId - Event ID to fetch
 * @returns {Promise<Object>} Event data
 */
export const fetchEventById = async (eventId) => {
  try {
    const events = await fetchSportsEvents();
    const event = events.find((e) => e.id === eventId);

    if (!event) {
      throw new ApiError(`Event with ID ${eventId} not found`, 404);
    }

    return event;
  } catch (error) {
    console.error(`Failed to fetch event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Health check for the API endpoint
 * @returns {Promise<boolean>} True if API is healthy
 */
export const checkApiHealth = async () => {
  try {
    await makeApiRequest(API_CONFIG.BASE_URL, { method: "HEAD" });
    return true;
  } catch (error) {
    console.warn("API health check failed:", error);
    return false;
  }
};

/**
 * Get API configuration
 * @returns {Object} API configuration object
 */
export const getApiConfig = () => ({ ...API_CONFIG });

export default {
  fetchSportsEvents,
  fetchEventById,
  checkApiHealth,
  getApiConfig,
  ApiError,
};
