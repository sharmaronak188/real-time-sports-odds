import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  generateMockUpdates,
  validateMatchData,
  transformApiEventsToMatches,
  filterValidApiEvents,
} from "../utils/dataUtils";
import { fetchSportsEvents, ApiError } from "../services/apiService";

// Async thunk for loading initial match data
export const loadInitialMatches = createAsyncThunk(
  "matches/loadInitial",
  async (source = "api", { rejectWithValue }) => {
    try {
      if (source === "api") {
        // Fetch from API endpoint
        try {
          console.log("Loading matches from API...");
          const apiEvents = await fetchSportsEvents();

          // Filter and validate API events
          const validEvents = filterValidApiEvents(apiEvents);

          // Transform API events to match format
          const matches = transformApiEventsToMatches(validEvents);

          console.log(`Successfully loaded ${matches.length} matches from API`);
          return matches;
        } catch (apiError) {
          console.error("Failed to load from API:", apiError);

          // If it's a network error or server error, re-throw the error
          if (
            apiError instanceof ApiError &&
            (apiError.status >= 500 || !apiError.status)
          ) {
            throw apiError;
          }

          // For other API errors, re-throw to be handled by rejected case
          throw apiError;
        }
      } else if (source === "json") {
        // Load from JSON file
        try {
          const response = await fetch("/data/matches.json");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const matches = data.matches || [];

          // Validate match data
          const validMatches = matches.filter(validateMatchData);
          if (validMatches.length !== matches.length) {
            console.warn(
              `${
                matches.length - validMatches.length
              } invalid matches filtered out`
            );
          }

          return validMatches;
        } catch (jsonError) {
          console.error("Failed to load from JSON:", jsonError);
          throw jsonError;
        }
      } else {
        // Invalid source specified
        throw new Error(`Invalid data source: ${source}. Use 'api' or 'json'.`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? `API Error: ${error.message}`
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching updated match data
export const fetchMatchUpdates = createAsyncThunk(
  "matches/fetchUpdates",
  async (useRealApi = true, { getState, rejectWithValue }) => {
    try {
      const currentMatches = getState().matches.matches;

      if (useRealApi && currentMatches.length > 0) {
        try {
          // Fetch fresh data from API
          const apiEvents = await fetchSportsEvents();
          const validEvents = filterValidApiEvents(apiEvents);
          const freshMatches = transformApiEventsToMatches(validEvents);

          // Compare with current matches to generate updates
          const updates = [];

          freshMatches.forEach((freshMatch) => {
            const currentMatch = currentMatches.find(
              (m) => m.id === freshMatch.id
            );
            if (currentMatch) {
              // Check for odds changes
              ["home", "draw", "away"].forEach((oddsType) => {
                const currentOdds = currentMatch.odds[oddsType];
                const newOdds = freshMatch.odds[oddsType];

                if (Math.abs(currentOdds - newOdds) > 0.01) {
                  // Threshold for change
                  const trend = newOdds > currentOdds ? "up" : "down";
                  updates.push({
                    matchId: freshMatch.id,
                    oddsType,
                    newOdds,
                    trend,
                  });
                }
              });
            }
          });

          console.log(`Generated ${updates.length} real-time updates from API`);
          return updates;
        } catch (apiError) {
          console.warn(
            "Failed to fetch real-time updates from API, using mock updates:",
            apiError
          );
          // Fall back to mock updates
          const updates = generateMockUpdates(currentMatches, 0.3);
          return updates;
        }
      } else {
        // Use mock updates when real API is disabled or no current matches
        await new Promise((resolve) => setTimeout(resolve, 200));
        const updates = generateMockUpdates(currentMatches, 0.3);
        return updates;
      }
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? `API Error: ${error.message}`
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for refreshing all matches from API (for real-time updates)
export const refreshAllMatches = createAsyncThunk(
  "matches/refreshAll",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Refreshing all matches from API...");
      const apiEvents = await fetchSportsEvents();
      const validEvents = filterValidApiEvents(apiEvents);
      const matches = transformApiEventsToMatches(validEvents);

      console.log(`Successfully refreshed ${matches.length} matches from API`);
      return matches;
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? `API Error: ${error.message}`
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  matches: [],
  loading: false,
  error: null,
  lastUpdated: null,
  updateInterval: null,
  isAutoUpdateEnabled: true,
  updateMode: "api",
  pollingInterval: 5000,
  lastApiCall: null,
  apiCallCount: 0,
  errorHistory: [],
  connectionStatus: "disconnected",
  retryCount: 0,
  maxRetries: 3,
  loadingStates: {
    initial: false,
    updates: false,
    refresh: false,
  },
};

const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    // Manual odds update (for user interactions)
    updateOdds: (state, action) => {
      const { matchId, oddsType, newOdds } = action.payload;
      const match = state.matches.find((m) => m.id === matchId);
      if (match) {
        match.odds[oddsType] = newOdds;
        state.lastUpdated = new Date().toISOString();
      }
    },

    // Manual trend update
    updateTrend: (state, action) => {
      const { matchId, oddsType, trend } = action.payload;
      const match = state.matches.find((m) => m.id === matchId);
      if (match) {
        match.trends[oddsType] = trend;
      }
    },

    // Batch update multiple odds at once
    batchUpdateOdds: (state, action) => {
      const updates = action.payload;
      updates.forEach(({ matchId, oddsType, newOdds, trend }) => {
        const match = state.matches.find((m) => m.id === matchId);
        if (match) {
          match.odds[oddsType] = newOdds;
          if (trend) {
            match.trends[oddsType] = trend;
          }
        }
      });
      state.lastUpdated = new Date().toISOString();
    },

    // Toggle auto-update functionality
    toggleAutoUpdate: (state) => {
      state.isAutoUpdateEnabled = !state.isAutoUpdateEnabled;
    },

    // Set update interval reference
    setUpdateInterval: (state, action) => {
      state.updateInterval = action.payload;
    },

    // Clear update interval
    clearUpdateInterval: (state) => {
      state.updateInterval = null;
    },

    // Reset trends to neutral
    resetTrends: (state) => {
      state.matches.forEach((match) => {
        match.trends = { home: "neutral", draw: "neutral", away: "neutral" };
      });
    },

    // Clear error state
    clearError: (state) => {
      state.error = null;
    },

    // Set update mode (api or mock)
    setUpdateMode: (state, action) => {
      state.updateMode = action.payload;
    },

    // Set polling interval
    setPollingInterval: (state, action) => {
      state.pollingInterval = action.payload;
    },

    // Track API calls for monitoring
    incrementApiCallCount: (state) => {
      state.apiCallCount += 1;
      state.lastApiCall = new Date().toISOString();
    },

    // Reset API call tracking
    resetApiCallCount: (state) => {
      state.apiCallCount = 0;
      state.lastApiCall = null;
    },

    // Enhanced error handling
    addError: (state, action) => {
      const error = {
        message: action.payload.message,
        timestamp: new Date().toISOString(),
        type: action.payload.type || "general",
        details: action.payload.details || null,
      };

      state.errorHistory.unshift(error);

      // Keep only last 10 errors
      if (state.errorHistory.length > 10) {
        state.errorHistory = state.errorHistory.slice(0, 10);
      }

      state.error = error.message;
    },

    // Clear error history
    clearErrorHistory: (state) => {
      state.errorHistory = [];
    },

    // Set connection status
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },

    // Increment retry count
    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },

    // Reset retry count
    resetRetryCount: (state) => {
      state.retryCount = 0;
    },

    // Set loading state for specific operation
    setLoadingState: (state, action) => {
      const { operation, loading } = action.payload;
      if (state.loadingStates.hasOwnProperty(operation)) {
        state.loadingStates[operation] = loading;
      }
    },
  },

  // Handle async thunk actions
  extraReducers: (builder) => {
    builder
      // Load initial matches
      .addCase(loadInitialMatches.pending, (state) => {
        state.loading = true;
        state.loadingStates.initial = true;
        state.connectionStatus = "connecting";
        state.error = null;
      })
      .addCase(loadInitialMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingStates.initial = false;
        state.matches = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.connectionStatus = "connected";
        state.error = null;
        state.retryCount = 0;
      })
      .addCase(loadInitialMatches.rejected, (state, action) => {
        state.loading = false;
        state.loadingStates.initial = false;
        state.connectionStatus = "error";

        const errorPayload = {
          message: action.payload || "Failed to load matches",
          type: "api",
          details: action.meta?.rejectedWithValue ? action.payload : null,
        };

        // Use the enhanced error handling
        const error = {
          message: errorPayload.message,
          timestamp: new Date().toISOString(),
          type: errorPayload.type,
          details: errorPayload.details,
        };

        state.errorHistory.unshift(error);
        if (state.errorHistory.length > 10) {
          state.errorHistory = state.errorHistory.slice(0, 10);
        }

        state.error = error.message;
        state.retryCount += 1;
      })

      // Fetch match updates
      .addCase(fetchMatchUpdates.pending, (state) => {
        // Don't set loading to true for updates to avoid UI flicker
        state.error = null;
      })
      .addCase(fetchMatchUpdates.fulfilled, (state, action) => {
        const updates = action.payload;
        updates.forEach(({ matchId, oddsType, newOdds, trend }) => {
          const match = state.matches.find((m) => m.id === matchId);
          if (match) {
            match.odds[oddsType] = newOdds;
            match.trends[oddsType] = trend;
          }
        });
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchMatchUpdates.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch updates";
      })

      // Refresh all matches
      .addCase(refreshAllMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAllMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(refreshAllMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to refresh matches";
      });
  },
});

export const {
  updateOdds,
  updateTrend,
  batchUpdateOdds,
  toggleAutoUpdate,
  setUpdateInterval,
  clearUpdateInterval,
  resetTrends,
  clearError,
  setUpdateMode,
  setPollingInterval,
  incrementApiCallCount,
  resetApiCallCount,
  addError,
  clearErrorHistory,
  setConnectionStatus,
  incrementRetryCount,
  resetRetryCount,
  setLoadingState,
} = matchesSlice.actions;

// Interval management functions
let updateIntervalId = null;

export const startAutoUpdates = (dispatch, getState) => {
  // Clear any existing interval
  if (updateIntervalId) {
    clearInterval(updateIntervalId);
  }

  const state = getState();
  const pollingInterval = state.matches.pollingInterval || 5000;
  const updateMode = state.matches.updateMode || "api";

  console.log(
    `Starting auto-updates with ${updateMode} mode, interval: ${pollingInterval}ms`
  );

  const intervalId = setInterval(() => {
    const currentState = getState();
    if (
      currentState.matches.isAutoUpdateEnabled &&
      currentState.matches.matches.length > 0
    ) {
      // Track API calls
      if (updateMode === "api") {
        dispatch(incrementApiCallCount());
      }

      // Use real API or mock updates based on mode
      const useRealApi = updateMode === "api";
      dispatch(fetchMatchUpdates(useRealApi));

      // Reset trends after 2 seconds
      setTimeout(() => {
        dispatch(resetTrends());
      }, 2000);
    }
  }, pollingInterval);

  updateIntervalId = intervalId;
  dispatch(setUpdateInterval(intervalId));

  return intervalId;
};

export const stopAutoUpdates = (dispatch) => {
  if (updateIntervalId) {
    clearInterval(updateIntervalId);
    updateIntervalId = null;
    dispatch(clearUpdateInterval());
  }
};

// Selectors
export const selectMatches = (state) => state.matches.matches;
export const selectMatchesLoading = (state) => state.matches.loading;
export const selectMatchesError = (state) => state.matches.error;
export const selectLastUpdated = (state) => state.matches.lastUpdated;
export const selectIsAutoUpdateEnabled = (state) =>
  state.matches.isAutoUpdateEnabled;
export const selectMatchById = (matchId) => (state) =>
  state.matches.matches.find((match) => match.id === matchId);
export const selectUpdateMode = (state) => state.matches.updateMode;
export const selectPollingInterval = (state) => state.matches.pollingInterval;
export const selectApiCallCount = (state) => state.matches.apiCallCount;
export const selectLastApiCall = (state) => state.matches.lastApiCall;
export const selectHotMatches = (state) =>
  state.matches.matches.filter((match) => match.isHot);
export const selectMatchesCount = (state) => state.matches.matches.length;
export const selectErrorHistory = (state) => state.matches.errorHistory;
export const selectConnectionStatus = (state) => state.matches.connectionStatus;
export const selectRetryCount = (state) => state.matches.retryCount;
export const selectMaxRetries = (state) => state.matches.maxRetries;
export const selectLoadingStates = (state) => state.matches.loadingStates;
export const selectIsConnected = (state) =>
  state.matches.connectionStatus === "connected";
export const selectCanRetry = (state) =>
  state.matches.retryCount < state.matches.maxRetries;

export default matchesSlice.reducer;
