import { useEffect } from 'react';
import { App as AntApp, ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/common';
import { AppRouter } from '@/routes';
import { useThemeStore } from '@/store/theme.store';
import { getAntdTheme } from '@/utils/theme';
import './admin.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

/** Admin dashboard shell — mounted on /login, /dashboard, etc. */
export const AdminApp = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="admin-shell">
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={getAntdTheme('light')}>
            <AntApp
              notification={{
                placement: 'topRight',
                maxCount: 4,
                top: 72,
              }}
            >
              <AppRouter />
            </AntApp>
          </ConfigProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
};
