import { useEffect, useRef } from 'react';
import { activityApi } from '@/api/activity.api';
import { useAuthStore } from '@/store/auth.store';

const HEARTBEAT_INTERVAL_MS = 90_000;

export const useActivityHeartbeat = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const inFlight = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const sendHeartbeat = async () => {
      if (document.visibilityState !== 'visible' || inFlight.current) {
        return;
      }

      inFlight.current = true;
      try {
        await activityApi.heartbeat();
      } catch {
        // Ignore transient heartbeat failures; auth interceptor handles 401s.
      } finally {
        inFlight.current = false;
      }
    };

    void sendHeartbeat();

    const intervalId = window.setInterval(() => {
      void sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void sendHeartbeat();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isAuthenticated]);
};
