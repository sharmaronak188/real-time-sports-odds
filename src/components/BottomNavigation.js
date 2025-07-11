import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFutbol,
  faFileLines,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

/**
 * NavigationItem component - Individual navigation item
 * @param {Object} props - Component props
 * @param {Object} props.icon - FontAwesome icon
 * @param {string} props.label - Navigation label
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.isActive - Whether item is active
 * @returns {JSX.Element} Navigation item
 */
const NavigationItem = ({ icon, label, onClick, isActive = false }) => (
  <div
    className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
      isActive ? "text-white" : "text-gray-300 hover:text-gray-100"
    }`}
    onClick={onClick}
  >
    <div className="w-5 h-5 flex items-center justify-center">
      <FontAwesomeIcon icon={icon} className="text-lg" />
    </div>
    <span className="text-xs">{label}</span>
  </div>
);

/**
 * BottomNavigation component - App bottom navigation bar
 * @param {Object} props - Component props
 * @param {string} props.activeItem - Currently active navigation item
 * @param {Function} props.onNavigate - Navigation handler
 * @returns {JSX.Element} Bottom navigation
 */
const BottomNavigation = ({ activeItem = "sports", onNavigate }) => {
  const navigationItems = [
    { id: "menu", icon: faBars, label: "Menu" },
    { id: "sports", icon: faFutbol, label: "Sports" },
    { id: "betslip", icon: faFileLines, label: "Betslip" },
    { id: "join", icon: faPlus, label: "Join" },
    { id: "account", icon: faUser, label: "Account" },
  ];

  const handleItemClick = (itemId) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  return (
    <div className="bg-gray-700 p-3 border-t border-gray-600">
      <div className="flex items-center justify-between text-xs">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeItem === item.id}
            onClick={() => handleItemClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
