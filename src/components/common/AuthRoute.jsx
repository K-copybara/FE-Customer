import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';

function AuthRoute() {
  const { customerKey, expiresAt, clearUser } = useUserStore();

  useEffect(() => {
    if (!expiresAt) return;
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      clearUser();
      return;
    }
    const id = setTimeout(() => clearUser(), remaining);
    return () => clearTimeout(id);
  }, [expiresAt, clearUser]);

  if (!customerKey) {
    return <Navigate to="/entry" replace />;
  }

  return <Outlet />;
}

export default AuthRoute;
