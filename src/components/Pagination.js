import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination component - Handles pagination controls and navigation
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current active page (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.itemsPerPage - Number of items per page
 * @param {Function} props.onPageChange - Function called when page changes
 * @param {boolean} props.showInfo - Whether to show pagination info
 * @returns {JSX.Element} Pagination controls
 */
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
}) => {
  const [inputValue, setInputValue] = useState(currentPage.toString());

  // Update input value when currentPage changes
  React.useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      onPageChange(newPage);
      setInputValue(newPage.toString());
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      onPageChange(newPage);
      setInputValue(newPage.toString());
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputValue, 10);

    if (
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      pageNumber !== currentPage
    ) {
      onPageChange(pageNumber);
    } else {
      // Reset to current page if invalid input
      setInputValue(currentPage.toString());
    }
  };

  const handleInputBlur = () => {
    handleInputSubmit({ preventDefault: () => {} });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit(e);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white px-4 py-8 mt-4">
      {/* Pagination Info */}
      {showInfo && (
        <div className="text-sm text-gray-700 text-center mb-3">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> matches
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <ChevronLeft className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Input */}
        <div className="flex items-center space-x-2">
          <form
            onSubmit={handleInputSubmit}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-12 px-2 py-1 text-center text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={currentPage.toString()}
            />
            <span className="text-sm text-gray-500">
              of <span className="font-medium">{totalPages}</span>
            </span>
          </form>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 sm:ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
