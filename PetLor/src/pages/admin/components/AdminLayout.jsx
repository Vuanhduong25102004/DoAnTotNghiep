import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import userService from "../../../services/userService";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * AdminLayout là component khung chính cho toàn bộ trang quản trị.
 * Nó bao gồm Sidebar, Header và khu vực nội dung chính sẽ thay đổi tùy theo route.
 * Component này cũng chịu trách nhiệm lấy thông tin người dùng đang đăng nhập để hiển thị.
 */
const AdminLayout = () => {
  // State để lưu thông tin chi tiết của người dùng đang đăng nhập.
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Sử dụng useEffect để xử lý các tác vụ khi component mount
  useEffect(() => {
    // Khóa cuộn trên body
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Lấy dữ liệu người dùng
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.userId) {
            const fullUserData = await userService.getUserById(
              decodedToken.userId
            );
            setUser(fullUserData);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error);
          setUser(null);
        }
      }
    };

    fetchUserData();

    // Cleanup function: khôi phục lại style cũ khi component unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []); // Mảng rỗng đảm bảo effect chỉ chạy một lần khi mount và cleanup khi unmount

  // Hàm xử lý việc đăng xuất.
  const handleLogout = () => {
    authService.logout(); // Gọi service để xóa token.
    setUser(null); // Xóa thông tin người dùng khỏi state.
    navigate("/"); // Chuyển hướng về trang chủ.
  };

  return (
    // 1. Khung bao ngoài cùng: h-screen, w-screen và overflow-hidden
    <div className="flex h-screen w-screen overflow-hidden bg-background-light font-display text-text-main">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <AdminSidebar onLogout={handleLogout} />

      {/* 2. Khu vực chính bên phải Sidebar */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <AdminHeader user={user} />

        {/* 3. Vùng nội dung: Đây là nơi DUY NHẤT được phép cuộn */}
        <div
          id="admin-content-area"
          // overflow-y-auto: Cho phép cuộn nội dung nếu dài
          // no-scrollbar: (Tùy chọn) Thêm class này nếu bạn muốn cuộn được nhưng KHÔNG nhìn thấy thanh scrollbar
          className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
