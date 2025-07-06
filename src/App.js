import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronRight } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFutbol,
  faFileLines,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  loadInitialMatches,
  selectMatches,
  selectMatchesLoading,
  selectMatchesError,
} from "./store/matchesSlice";
import MatchCard from "./components/MatchCard";

const App = () => {
  const matches = useSelector(selectMatches);
  const loading = useSelector(selectMatchesLoading);
  const error = useSelector(selectMatchesError);
  const dispatch = useDispatch();

  // Load initial data
  useEffect(() => {
    // Load initial matches from JSON file (fallback to mock data)
    dispatch(loadInitialMatches("json"));
  }, [dispatch]);

  if (loading && matches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6flex items-center justify-center">
              <img src="/favicon.ico" alt="Football" className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Football</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
              806
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        <div className="bg-gray-700 p-3 mt-8">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faBars}
                  className="text-gray-300 text-lg"
                />
              </div>
              <span>Menu</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faFutbol}
                  className="text-gray-300 text-lg"
                />
              </div>
              <span>Sports</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faFileLines}
                  className="text-gray-300 text-lg"
                />
              </div>
              <span>Betslip</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-gray-300 text-lg"
                />
              </div>
              <span>Join</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-gray-300 text-lg"
                />
              </div>
              <span>Account</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
