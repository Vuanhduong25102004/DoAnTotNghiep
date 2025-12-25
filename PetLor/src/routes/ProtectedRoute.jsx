import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");

  // 1. Chưa đăng nhập -> Đá về Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = jwtDecode(token);

    // 2. Check hết hạn token
    const currentTime = Date.now() / 1000;
    if (user.exp && user.exp < currentTime) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  } catch (error) {
    // Token lỗi -> Đá về Login
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
