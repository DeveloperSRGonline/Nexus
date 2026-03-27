import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  Inbox,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Plus,
  Search,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import useUIStore from "@/store/uiStore";
import useProjectStore from "@/store/projectStore";
import styles from "./Sidebar.module.scss";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/events", icon: Calendar, label: "Events" },
  { to: "/queue", icon: Inbox, label: "Queue" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  const { sidebarCollapsed, sidebarOpen, toggleSidebar, openSearch } =
    useUIStore();
  const { projects } = useProjectStore();
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

        {/* Projects */}
        {!sidebarCollapsed && <p className={styles.section}>PROJECTS</p>}
        <NavLink to="/projects" className={styles.navItem}>
          <Plus size={18} />
          {!sidebarCollapsed && <span>New Project</span>}
        </NavLink>
        {projects.map((project) => (
          <NavLink
            key={project._id}
            to={`/projects/${project._id}`}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span
              className={styles.projectDot}
              style={{ background: project.color }}
            />
            {!sidebarCollapsed && (
              <span className={styles.projectName}>{project.name}</span>
            )}
          </NavLink>
        ))}
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
