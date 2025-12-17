import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // Not logged in -> Redirect to login page
    return <Navigate to="/login" replace />;
  }

  try {
    const user = jwtDecode(token);

    // Check for token expiration
    const currentTime = Date.now() / 1000;
    if (user.exp && user.exp < currentTime) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/login" replace />;
    }

    // Check for ADMIN role
    if (user.role === "ADMIN") {
      return <Outlet />;
    } else {
      // Logged in but not an Admin -> Redirect to home page
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    // Invalid token -> Clear token and redirect to login
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
