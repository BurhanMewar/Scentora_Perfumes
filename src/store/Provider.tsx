'use client';

import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from './index';
import { DEMO_ADMIN_SESSION_KEY, restoreAuthSession, type User } from '../slice/AuthSlice';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedSession = localStorage.getItem(DEMO_ADMIN_SESSION_KEY);
    if (!savedSession) return;

    try {
      const user = JSON.parse(savedSession) as User;
      if (user.username === 'admin' && user.accessToken && user.permissions?.length) {
        store.dispatch(restoreAuthSession(user));
      } else {
        localStorage.removeItem(DEMO_ADMIN_SESSION_KEY);
      }
    } catch {
      localStorage.removeItem(DEMO_ADMIN_SESSION_KEY);
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
