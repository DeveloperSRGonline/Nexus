import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Inbox,
  Calendar,
  FolderKanban,
} from "lucide-react";
import styles from "./MobileNav.module.scss";

const MOBILE_NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/queue", icon: Inbox, label: "Queue" },
  { to: "/events", icon: Calendar, label: "Events" },
  { to: "/projects", icon: FolderKanban, label: "Projects" },
];

const MobileNav = () => (
  <nav className={styles.nav}>
    {MOBILE_NAV.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `${styles.item} ${isActive ? styles.active : ""}`
        }
      >
        <Icon size={20} />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

export default MobileNav;
