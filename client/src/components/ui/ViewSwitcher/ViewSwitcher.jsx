import { List, Kanban , Calendar, AlignLeft } from "lucide-react";
import { VIEW_MODES } from "@/constants/viewModes";
import styles from "./ViewSwitcher.module.scss";

const VIEWS = [
  { mode: VIEW_MODES.LIST, icon: List, label: "List" },
  { mode: VIEW_MODES.KANBAN, icon: Kanban , label: "Kanban" },
  { mode: VIEW_MODES.CALENDAR, icon: Calendar, label: "Calendar" },
  { mode: VIEW_MODES.TIMELINE, icon: AlignLeft, label: "Timeline" },
];

const ViewSwitcher = ({ active, onChange }) => (
  <div className={styles.switcher}>
    {VIEWS.map(({ mode, icon: Icon, label }) => (
      <button
        key={mode}
        className={`${styles.btn} ${active === mode ? styles.active : ""}`}
        onClick={() => onChange(mode)}
      >
        <Icon size={15} />
        <span>{label}</span>
      </button>
    ))}
  </div>
);

export default ViewSwitcher;
