import React, { useState, useEffect, useRef } from 'react';
import styles from './TimerRing.module.scss';

const TimerRing = ({ 
  timeRemaining, 
  totalTime, 
  mode = 'pomo',
  isRunning = false 
}) => {
  const radius = 120;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (mode === 'stopwatch') {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={styles.timerRing}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className={styles.svg}
      >
        <circle
          stroke="#E5E5EA"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#3B5BDB"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={styles.progressRing}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
      <div className={styles.timeDisplay}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  );
};

export default TimerRing;
