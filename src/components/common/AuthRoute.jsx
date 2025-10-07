import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';

function AuthRoute() {
  const { customerKey, expiry, clearUser } = useUserStore();

  useEffect(() => {
    if (!expiry) return;
    const remaining = expiry - Date.now();
    if (remaining <= 0) {
      clearUser();
      return;
    }
    const id = setTimeout(() => clearUser(), remaining);
    return () => clearTimeout(id);
  }, [expiry, clearUser]);

  if (!customerKey) {
    return <Navigate to="/entry" replace />;
  }

  return <Outlet />;
}

export default AuthRoute;
