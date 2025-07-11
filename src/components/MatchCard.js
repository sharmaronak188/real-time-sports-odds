import React from "react";
import MatchTime from "./MatchTime";
import TeamInfo from "./TeamInfo";
import OddsSection from "./OddsSection";
import MatchStats from "./MatchStats";

/**
 * MatchCard component - Displays a single match with all its information
 * @param {Object} props - Component props
 * @param {Object} props.match - Match object containing all match data
 * @returns {JSX.Element} Match card display
 */
const MatchCard = ({ match }) => {
  return (
    <div className="bg-white border-b-2 border-gray-200 p-4 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MatchTime timeString={match.time} />
          </div>
          <TeamInfo
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            league={match.league}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <OddsSection match={match} />
        <MatchStats totalMatches={match.totalMatches} />
      </div>
    </div>
  );
};

export default MatchCard;
