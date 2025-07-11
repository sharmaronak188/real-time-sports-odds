import React from "react";

/**
 * LoadingSpinner component - Displays a loading spinner with optional message
 * @param {Object} props - Component props
 * @param {string} props.message - Optional loading message to display
 * @param {string} props.size - Size of the spinner ('sm', 'md', 'lg')
 * @returns {JSX.Element} Loading spinner display
 */
const LoadingSpinner = ({ message = "Loading...", size = "md" }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-b-2 border-gray-900 mx-auto mb-4 ${
            sizeClasses[size] || sizeClasses.md
          }`}
        ></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
