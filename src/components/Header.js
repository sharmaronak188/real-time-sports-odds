import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * Header component - Displays app header with title, match count, and controls
 * @param {Object} props - Component props
 * @param {string} props.title - Header title (default: "Football")
 * @param {number} props.matchCount - Number of matches to display
 * @param {string} props.iconSrc - Icon source path (default: "/favicon.ico")
 * @param {boolean} props.isAutoUpdateEnabled - Whether auto-updates are enabled
 * @param {string} props.connectionStatus - Connection status ("connected", "connecting", "error", "disconnected")
 * @param {Function} props.onToggleAutoUpdate - Function to toggle auto-updates
 * @returns {JSX.Element} Header display
 */
const Header = ({
  title = "Football",
  matchCount = 0,
  iconSrc = "/favicon.ico",
  isAutoUpdateEnabled = true,
  connectionStatus = "disconnected",
  onToggleAutoUpdate,
}) => {
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "connecting":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Live";
      case "connecting":
        return "...";
      case "error":
        return "Error";
      default:
        return "Off";
    }
  };
  return (
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 flex items-center justify-center">
          <img src={iconSrc} alt={title} className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Connection Status Indicator */}
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getConnectionStatusColor()}`}
          title={`Connection status: ${connectionStatus}`}
        >
          {getConnectionStatusText()}
        </span>

        {/* Match Count */}
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          {matchCount}
        </span>

        {/* Auto-update Toggle */}
        {onToggleAutoUpdate && (
          <button
            onClick={onToggleAutoUpdate}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              isAutoUpdateEnabled
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            title={`Auto-updates: ${isAutoUpdateEnabled ? "ON" : "OFF"}`}
          >
            {isAutoUpdateEnabled ? "🔄" : "⏸️"}
          </button>
        )}

        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};

export default Header;
