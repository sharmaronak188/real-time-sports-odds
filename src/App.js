import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadInitialMatches,
  selectMatches,
  selectMatchesLoading,
  selectMatchesError,
  selectIsAutoUpdateEnabled,
  selectConnectionStatus,
  startAutoUpdates,
  stopAutoUpdates,
  toggleAutoUpdate,
} from "./store/matchesSlice";
import MatchList from "./components/MatchList";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorDisplay from "./components/ErrorDisplay";
import BottomNavigation from "./components/BottomNavigation";

const App = () => {
  const matches = useSelector(selectMatches);
  const loading = useSelector(selectMatchesLoading);
  const error = useSelector(selectMatchesError);
  const isAutoUpdateEnabled = useSelector(selectIsAutoUpdateEnabled);
  const connectionStatus = useSelector(selectConnectionStatus);
  const dispatch = useDispatch();
  const [activeNavItem, setActiveNavItem] = useState("sports");

  // Load initial data
  useEffect(() => {
    // Load initial matches from API endpoint
    dispatch(loadInitialMatches("api"));
  }, [dispatch]);

  // Start real-time updates after initial data is loaded
  useEffect(() => {
    if (matches.length > 0 && isAutoUpdateEnabled) {
      console.log("Starting real-time updates...");
      startAutoUpdates(dispatch, () => ({
        matches: {
          matches,
          isAutoUpdateEnabled,
          pollingInterval: 5000,
          updateMode: "api",
        },
      }));

      // Cleanup interval on unmount or when auto-update is disabled
      return () => {
        console.log("Stopping real-time updates...");
        stopAutoUpdates(dispatch);
      };
    }
  }, [matches.length, isAutoUpdateEnabled, dispatch]);

  // Handle navigation
  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    // Add navigation logic here if needed
    console.log(`Navigated to: ${itemId}`);
  };

  // Handle retry for error cases
  const handleRetry = () => {
    dispatch(loadInitialMatches("api"));
  };

  // Handle auto-update toggle
  const handleToggleAutoUpdate = () => {
    dispatch(toggleAutoUpdate());
  };

  if (loading && matches.length === 0) {
    return <LoadingSpinner message="Loading matches..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
        <Header
          title="Football"
          matchCount={matches.length}
          iconSrc="/favicon.ico"
          isAutoUpdateEnabled={isAutoUpdateEnabled}
          connectionStatus={connectionStatus}
          onToggleAutoUpdate={handleToggleAutoUpdate}
        />

        {error && (
          <ErrorDisplay error={error} onRetry={handleRetry} variant="inline" />
        )}

        <div className="flex-1">
          <MatchList matches={matches} itemsPerPage={4} />
        </div>

        <BottomNavigation
          activeItem={activeNavItem}
          onNavigate={handleNavigation}
        />
      </div>
    </div>
  );
};

export default App;
