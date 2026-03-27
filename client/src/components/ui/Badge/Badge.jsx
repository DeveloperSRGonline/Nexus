import styles from "./Badge.module.scss";

const Badge = ({ children, variant = "default", size = "md", dot = false }) => (
  <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
    {dot && <span className={styles.dot} />}
    {children}
  </span>
);

export default Badge;
