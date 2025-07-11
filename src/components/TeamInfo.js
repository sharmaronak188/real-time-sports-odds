import React from "react";

/**
 * TeamInfo component - Displays team names and league information
 * @param {Object} props - Component props
 * @param {string} props.homeTeam - Home team name
 * @param {string} props.awayTeam - Away team name
 * @param {string} props.league - League name
 * @returns {JSX.Element} Team information display
 */
const TeamInfo = ({ homeTeam, awayTeam, league }) => {
  return (
    <div>
      <div className="font-semibold text-gray-900 mb-1">{homeTeam}</div>
      <div className="font-semibold text-gray-900 mb-2">{awayTeam}</div>
      <div className="text-xs text-gray-500">{league}</div>
    </div>
  );
};

export default TeamInfo;
