import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLogin } from 'utils/jwt';

// Guard nhẹ cho asset-hub: chỉ kiểm tra token, KHÔNG kéo theo idle-timer/logic nặng của DefaultLayout.
// Chưa đăng nhập (không có access token) → điều hướng về /login.
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isLogin()) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default RequireAuth;
