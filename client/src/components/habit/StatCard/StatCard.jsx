import React from "react";
import styles from "./StatCard.module.scss";

const StatCard = ({ icon, value, label, color }) => {
  return (
    <div className={styles.statCard} style={{ borderColor: color }}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};

export default StatCard;
