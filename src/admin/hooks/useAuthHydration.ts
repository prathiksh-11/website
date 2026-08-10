import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

/** Wait for Zustand persist to rehydrate before auth redirects. */
export const useAuthHydration = () => {
  const [hydrated, setHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    setHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
};
