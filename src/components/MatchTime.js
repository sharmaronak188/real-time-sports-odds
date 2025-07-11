import React from "react";

/**
 * MatchTime component - Displays formatted match time and date
 * @param {Object} props - Component props
 * @param {string} props.timeString - Time string to format and display
 * @returns {JSX.Element} Formatted time display
 */
const MatchTime = ({ timeString }) => {
  const formatTime = (timeString) => {
    const parts = timeString.split(" ");
    if (parts.length >= 3) {
      const time = parts[0];
      const dayDate = parts.slice(1).join(" ");
      return { time, dayDate };
    }
    return { time: timeString, dayDate: "" };
  };

  const { time, dayDate } = formatTime(timeString);

  return (
    <div className="text-xs text-gray-500">
      {time}
      {dayDate && (
        <>
          {" "}
          <span className="font-semibold text-black">{dayDate}</span>
        </>
      )}
    </div>
  );
};

export default MatchTime;
