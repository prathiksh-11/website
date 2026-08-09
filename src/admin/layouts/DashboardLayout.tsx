import { Grid } from 'antd';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import {
  useFcmRegistration,
  useNotificationRealtime,
} from '@/hooks/useNotifications';
import { unlockNotificationAudio } from '@/utils/notification-sound';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { useThemeStore } from '@/store/theme.store';

const { useBreakpoint } = Grid;

export const DashboardLayout = () => {
  const screens = useBreakpoint();
  const setCollapsed = useThemeStore((s) => s.setCollapsed);
  useFcmRegistration();
  useNotificationRealtime();

  useEffect(() => {
    if (screens.md === false) {
      setCollapsed(true);
    }
  }, [screens.md, setCollapsed]);

  // Browsers block audio until a user gesture — unlock on first interaction
  useEffect(() => {
    const unlock = () => {
      void unlockNotificationAudio();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  return (
    <div className="admin-layout">
      <AppSidebar />
      <div className="admin-main">
        <AppHeader />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
