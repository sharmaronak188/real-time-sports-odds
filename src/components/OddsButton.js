const OddsButton = ({ label, odds, trend, onClick, isHot }) => (
  <button
    onClick={onClick}
    className={`flex bg-gray-100 flex-row items-center justify-between p-2 rounded-lg border transition-all duration-200 active:scale-95 ${
      trend === "up"
        ? "bg-green-50 border-green-200"
        : trend === "down"
        ? "bg-red-50 border-red-200"
        : "border-gray-200"
    }`}
  >
    <div className="text-xs text-gray-600 font-semibold">{label}</div>
    <div className="flex items-center gap-1">
      {isHot && (
        <span className="text-orange-500" title="Hot match">
          🔥
        </span>
      )}
      <span className="font-semibold text-sm">{odds}</span>
    </div>
  </button>
);

export default OddsButton;
