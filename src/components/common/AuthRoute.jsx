import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';

function AuthRoute() {
  const { customerKey, expiresAt, clearUser } = useUserStore();

  useEffect(() => {
    if (!expiresAt) return;
    const remaining = new Date(expiresAt) - Date.now();
    console.log(remaining);
    if (remaining <= -32400000) {
      clearUser();
      return;
    }
  }, [expiresAt, clearUser]);

  if (!customerKey) {
    return <Navigate to="/entry" replace />;
  }

  return <Outlet />;
}

export default AuthRoute;
