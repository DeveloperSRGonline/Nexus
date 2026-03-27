import styles from "./Spinner.module.scss";

const Spinner = ({ size = "md" }) => (
  <span className={`${styles.spinner} ${styles[size]}`} />
);

export default Spinner;
