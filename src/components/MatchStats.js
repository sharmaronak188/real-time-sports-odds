import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * MatchStats component - Displays match statistics with navigation indicator
 * @param {Object} props - Component props
 * @param {number} props.totalMatches - Total number of matches/bets
 * @returns {JSX.Element} Match statistics display
 */
const MatchStats = ({ totalMatches }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg border bg-white border-gray-200 max-w-[60px]">
      <span className="text-sm text-gray-900 font-semibold">
        {totalMatches}
      </span>
      <ChevronRight className="w-4 h-4 text-gray-400 font-semibold" />
    </div>
  );
};

export default MatchStats;
