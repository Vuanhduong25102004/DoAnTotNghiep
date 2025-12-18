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
