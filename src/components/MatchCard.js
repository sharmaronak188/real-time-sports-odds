import { useDispatch } from "react-redux";
import { ChevronRight } from "lucide-react";
import { updateOdds, updateTrend } from "../store/matchesSlice";
import OddsButton from "./OddsButton";

const MatchCard = ({ match }) => {
  const dispatch = useDispatch();

  const formatTime = (timeString) => {
    const parts = timeString.split(" ");
    if (parts.length >= 3) {
      const time = parts[0];
      const dayDate = parts.slice(1).join(" ");
      return { time, dayDate };
    }
    return { time: timeString, dayDate: "" };
  };

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
    <div className="bg-white border-b-2 border-gray-200 p-4 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-xs text-gray-500">
              {(() => {
                const { time, dayDate } = formatTime(match.time);
                return (
                  <>
                    {time}
                    {dayDate && (
                      <>
                        {" "}
                        <span className="font-semibold text-black">
                          {dayDate}
                        </span>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
          <div className="font-semibold text-gray-900 mb-1">
            {match.homeTeam}
          </div>
          <div className="font-semibold text-gray-900 mb-2">
            {match.awayTeam}
          </div>
          <div className="text-xs text-gray-500">{match.league}</div>
        </div>
      </div>

      <div className="flex gap-2">
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
        <div className="flex items-center justify-between p-2 rounded-lg border bg-white border-gray-200 max-w-[60px]">
          <span className="text-sm text-gray-900 font-semibold">
            {match.totalMatches}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400 font-semibold" />
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
