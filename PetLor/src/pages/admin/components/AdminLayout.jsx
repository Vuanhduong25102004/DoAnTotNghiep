import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import userService from "../../../services/userService";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { jwtDecode } from "jwt-decode";

/**
 * AdminLayout là component khung chính cho toàn bộ trang quản trị.
 * Nó bao gồm Sidebar, Header và khu vực nội dung chính sẽ thay đổi tùy theo route.
 * Component này cũng chịu trách nhiệm lấy thông tin người dùng đang đăng nhập để hiển thị.
 */
const AdminLayout = () => {
  // State để lưu thông tin chi tiết của người dùng đang đăng nhập.
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Sử dụng useEffect để lấy dữ liệu người dùng khi component được mount.
  useEffect(() => {
    const fetchUserData = async () => {
      // Lấy token xác thực từ localStorage.
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          // Giải mã token để lấy ID người dùng.
          const decodedToken = jwtDecode(token);
          
          // Nếu token chứa userId, dùng nó để gọi API lấy thông tin đầy đủ của người dùng.
          if (decodedToken.userId) {
            const fullUserData = await userService.getUserById(
              decodedToken.userId
            );
            // Cập nhật state với dữ liệu người dùng đầy đủ.
            setUser(fullUserData);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error);
          // Nếu có lỗi (ví dụ: token không hợp lệ), đặt state người dùng về null.
          // Việc chuyển hướng đã được xử lý bởi AdminRoute, ở đây chỉ cần xử lý lỗi dữ liệu.
          setUser(null);
        }
      }
    };

    fetchUserData();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần sau khi component mount.

  // Hàm xử lý việc đăng xuất.
  const handleLogout = () => {
    authService.logout(); // Gọi service để xóa token.
    setUser(null); // Xóa thông tin người dùng khỏi state.
    navigate("/"); // Chuyển hướng về trang chủ.
  };

  return (
    // Cấu trúc layout chính sử dụng Flexbox.
    <div className="flex h-screen overflow-hidden bg-background-light font-display text-text-main">
      {/* Sidebar chung cho toàn trang admin, truyền hàm logout vào. */}
      <AdminSidebar onLogout={handleLogout} />

      {/* Khu vực nội dung chính */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header chung, truyền thông tin người dùng vào để hiển thị. */}
        <AdminHeader user={user} />

        {/* 
          Khu vực hiển thị nội dung của các trang con (nested routes).
          <Outlet /> là một component của React Router, nó sẽ render component con tương ứng với URL hiện tại.
        */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
