import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const StaffRoute = () => {
  const token = localStorage.getItem("accessToken");

  // 1. Định nghĩa danh sách các Role được phép truy cập trang Nhân viên
  const ALLOWED_ROLES = ["DOCTOR", "RECEPTIONIST", "SPA", "ADMIN"];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = jwtDecode(token);

    // Kiểm tra token hết hạn
    const currentTime = Date.now() / 1000;
    if (user.exp && user.exp < currentTime) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/login" replace />;
    }

    // --- KIỂM TRA QUYỀN (LOGIC MỚI) ---
    // Nếu role của user nằm trong danh sách cho phép -> Cho vào
    if (ALLOWED_ROLES.includes(user.role)) {
      return <Outlet />;
    } else {
      // Đã đăng nhập nhưng là khách hàng (CUSTOMER) -> Về trang chủ
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }
};

export default StaffRoute;
