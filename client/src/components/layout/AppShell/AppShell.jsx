import { Outlet } from 'react-router-dom';
import Sidebar   from '../Sidebar/Sidebar';
import MobileNav from '../MobileNav/MobileNav';
import useUIStore from '@/store/uiStore';
import styles from './AppShell.module.scss';

const AppShell = () => {
  const { sidebarCollapsed, sidebarOpen, closeMobileSidebar } = useUIStore();

  return (
    <div className={`${styles.shell} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className={styles.backdrop} onClick={closeMobileSidebar} />
      )}

      <Sidebar />

      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default AppShell;