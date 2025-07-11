import React from "react";

/**
 * ErrorDisplay component - Displays error messages with consistent styling
 * @param {Object} props - Component props
 * @param {string} props.error - Error message to display
 * @param {Function} props.onRetry - Optional retry function
 * @param {string} props.variant - Error variant ('inline', 'full')
 * @returns {JSX.Element} Error display
 */
const ErrorDisplay = ({ error, onRetry, variant = "inline" }) => {
  if (variant === "full") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 text-lg font-semibold mb-2">
              Something went wrong
            </div>
            <p className="text-red-700 text-sm mb-4">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
      <div className="flex items-start">
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
