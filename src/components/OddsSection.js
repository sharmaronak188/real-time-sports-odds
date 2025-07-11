import React from "react";
import { useDispatch } from "react-redux";
import { updateOdds, updateTrend } from "../store/matchesSlice";
import OddsButton from "./OddsButton";

/**
 * OddsSection component - Manages odds display and interactions
 * @param {Object} props - Component props
 * @param {Object} props.match - Match object containing odds and trends
 * @returns {JSX.Element} Odds section with three betting buttons
 */
const OddsSection = ({ match }) => {
  const dispatch = useDispatch();

  const simulateOddsUpdate = (oddsType) => {
    const currentOdds = match.odds[oddsType];
    const variation = (Math.random() - 0.5) * 0.3;
    const newOdds = Math.max(
      1.01,
      Math.round((currentOdds + variation) * 100) / 100
    );

    const trend =
      newOdds > currentOdds ? "up" : newOdds < currentOdds ? "down" : "neutral";

    dispatch(updateOdds({ matchId: match.id, oddsType, newOdds }));
    dispatch(updateTrend({ matchId: match.id, oddsType, trend }));

    setTimeout(() => {
      dispatch(updateTrend({ matchId: match.id, oddsType, trend: "neutral" }));
    }, 2000);
  };

  return (
    <div className="flex-1 grid grid-cols-3 gap-2">
      <OddsButton
        label="1"
        odds={match.odds.home}
        trend={match.trends.home}
        onClick={() => simulateOddsUpdate("home")}
      />
      <OddsButton
        label="X"
        odds={match.odds.draw}
        trend={match.trends.draw}
        onClick={() => simulateOddsUpdate("draw")}
      />
      <OddsButton
        label="2"
        odds={match.odds.away}
        trend={match.trends.away}
        onClick={() => simulateOddsUpdate("away")}
        isHot={match.isHot}
      />
    </div>
  );
};

export default OddsSection;
