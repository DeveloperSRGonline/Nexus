import Spinner from "../Spinner/Spinner";
import styles from "./Button.module.scss";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  icon,
}) => (
  <button
    type={type}
    className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
    disabled={disabled || loading}
    onClick={onClick}
  >
    {loading ? (
      <Spinner size="sm" />
    ) : (
      icon && <span className={styles.icon}>{icon}</span>
    )}
    {children}
  </button>
);

export default Button;
