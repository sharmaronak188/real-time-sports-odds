import React, { useState, useEffect } from "react";
import MatchCard from "./MatchCard";
import Pagination from "./Pagination";

/**
 * MatchList component - Displays paginated list of matches
 * @param {Object} props - Component props
 * @param {Array} props.matches - Array of match objects
 * @param {number} props.itemsPerPage - Number of matches per page (default: 4)
 * @returns {JSX.Element} Paginated match list
 */
const MatchList = ({ matches, itemsPerPage = 4 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination values
  const totalItems = matches.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMatches = matches.slice(startIndex, endIndex);

  // Reset to first page when matches change (e.g., after data refresh)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [matches.length, currentPage, totalPages]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of match list when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show message if no matches
  if (totalItems === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg mb-2">No matches available</div>
        <div className="text-gray-400 text-sm">
          Check back later for upcoming matches
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Match Cards */}
      <div className="space-y-0">
        {currentMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        showInfo={true}
      />
    </div>
  );
};

export default MatchList;
