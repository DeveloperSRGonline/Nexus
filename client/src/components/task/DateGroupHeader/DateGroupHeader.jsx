import React from 'react';
import './DateGroupHeader.scss';

const DateGroupHeader = ({ date, taskCount, isCollapsed, onToggle }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateObj = new Date(dateStr + 'T00:00:00');
    dateObj.setHours(0, 0, 0, 0);

    if (dateObj.getTime() === today.getTime()) {
      return 'Today';
    } else if (dateObj.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else if (dateObj.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      // Show day name and date
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <button className="date-group-header" onClick={onToggle}>
      <span className="date-group-header__toggle">
        <span className={`arrow ${isCollapsed ? '' : 'open'}`}>▼</span>
      </span>
      <span className="date-group-header__date">{formatDate(date)}</span>
      <span className="date-group-header__count">{taskCount}</span>
    </button>
  );
};

export default DateGroupHeader;
