import { NavLink, useNavigate } from "react-router-dom";
import {
  Calendar,
  Inbox,
  CalendarDays,
  Target,
  Timer,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Plus,
  Search,
  Tag,
  ListTodo,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import useUIStore from "@/store/uiStore";
import styles from "./Sidebar.module.scss";

const NAV_ITEMS = [
  { to: "/inbox", icon: Inbox, label: "Inbox" },
  { to: "/today", icon: Calendar, label: "Today" },
  { to: "/next-7-days", icon: CalendarDays, label: "Next 7 Days" },
  { to: "/completed", icon: CheckCircle, label: "Completed" },
  { to: "/trash", icon: Trash2, label: "Trash" },
];

const Sidebar = () => {
  const { sidebarCollapsed, sidebarOpen, toggleSidebar, openSearch } =
    useUIStore();
  const { user } = useUser();

  return (
    <aside
      className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ""} ${sidebarOpen ? styles.open : ""}`}
    >
      {/* Header */}
      <div className={styles.header}>
        {!sidebarCollapsed && (
          <div className={styles.brand}>
            <span className={styles.logo}>⬡</span>
            <span className={styles.name}>NEXUS</span>
          </div>
        )}
        <button className={styles.collapseBtn} onClick={toggleSidebar}>
          {sidebarCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {/* Search */}
      {!sidebarCollapsed && (
        <button className={styles.searchBtn} onClick={openSearch}>
          <Search size={14} />
          <span>Search...</span>
          <kbd>⌘K</kbd>
        </button>
      )}

      {/* Nav */}
      <nav className={styles.nav}>
        {!sidebarCollapsed && <p className={styles.section}>HOME</p>}
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <Icon size={18} />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* Lists Section */}
        {!sidebarCollapsed && <p className={styles.section}>LISTS</p>}
        <NavLink to="/lists" className={styles.navItem}>
          <ListTodo size={18} />
          {!sidebarCollapsed && <span>All Lists</span>}
        </NavLink>

        {/* Tags Section */}
        {!sidebarCollapsed && <p className={styles.section}>TAGS</p>}
        <NavLink to="/tags" className={styles.navItem}>
          <Tag size={18} />
          {!sidebarCollapsed && <span>All Tags</span>}
        </NavLink>

        {/* Modules */}
        {!sidebarCollapsed && <p className={styles.section}>MODULES</p>}
        <NavLink to="/habits" className={styles.navItem}>
          <Target size={18} />
          {!sidebarCollapsed && <span>Habits</span>}
        </NavLink>
        <NavLink to="/focus" className={styles.navItem}>
          <Timer size={18} />
          {!sidebarCollapsed && <span>Focus / Pomodoro</span>}
        </NavLink>

        {/* Settings */}
        {!sidebarCollapsed && <p className={styles.section}>PREFERENCES</p>}
        <NavLink to="/settings" className={styles.navItem}>
          <Settings size={18} />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && user && (
        <div className={styles.footer}>
          <img
            src={user.imageUrl}
            alt={user.fullName}
            className={styles.avatar}
          />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.fullName}</span>
            <span className={styles.userEmail}>
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
