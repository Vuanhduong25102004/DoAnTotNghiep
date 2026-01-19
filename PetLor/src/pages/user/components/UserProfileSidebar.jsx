import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../../../services/authService";

const UserProfileSidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // Helper xử lý ảnh đại diện
  const getAvatarUrl = (user) => {
    if (user?.anhDaiDien) {
      return user.anhDaiDien.startsWith("http")
        ? user.anhDaiDien
        : `${API_URL}/uploads/${user.anhDaiDien}`;
    }
    return `https://ui-avatars.com/api/?name=${
      user?.hoTen || "User"
    }&background=random`;
  };

  // Helper xác định trạng thái Active của menu
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    const baseClass =
      "flex items-center gap-3 px-4 py-3 transition-all duration-300";
    const activeStyle =
      "bg-white rounded-xl shadow-sm border border-gray-100 text-[#2a9d8f] font-bold";
    const inactiveStyle =
      "text-gray-500 hover:bg-white hover:text-[#111827] hover:shadow-sm hover:rounded-xl";

    return `${baseClass} ${isActive ? activeStyle : inactiveStyle}`;
  };

  // Helper icon style
  const getIconClass = (path) => {
    return location.pathname === path
      ? "material-symbols-outlined icon-filled"
      : "material-symbols-outlined";
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0" data-aos="fade-right">
      <div className="sticky top-24 space-y-8">
        {/* User Mini Card */}
        <div className="flex items-center gap-4 px-2">
          <div
            className="size-14 rounded-full bg-neutral-200 bg-cover bg-center border-2 border-white shadow-sm"
            style={{ backgroundImage: `url("${getAvatarUrl(user)}")` }}
          ></div>
          <div>
            <h2 className="font-bold text-[#111827]">
              {user?.hoTen || "Khách"}
            </h2>
            <p className="text-xs text-gray-500">
              {/* Hiển thị chức danh nếu là Bác sĩ */}
              {user?.role === "DOCTOR" ? "Bác sĩ Thú Y" : "Thành viên Bạc"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {/* --- [MỚI] LOGIC KIỂM TRA QUYỀN DOCTOR --- */}
          {user?.role === "DOCTOR" && (
            <Link
              to="/staff/doctor"
              className={`${getLinkClass(
                "/staff/doctor",
              )} mb-2 border-l-4 border-red-500 bg-red-50 hover:bg-red-100`}
            >
              <span className={`${getIconClass("/staff")} text-red-500`}>
                stethoscope
              </span>
              <span className="text-red-600 font-bold">Khu vực làm việc</span>
            </Link>
          )}
          {/* 2. Nút cho Lễ tân (Màu Teal/Xanh ngọc) */}
          {user?.role === "RECEPTIONIST" && (
            <Link
              to="/staff/receptionist"
              className={`${getLinkClass(
                "/staff/receptionist",
              )} mb-2 border-l-4 border-teal-500 bg-teal-50 hover:bg-teal-100`}
            >
              <span className="material-symbols-outlined text-teal-600 text-[20px]">
                desk
              </span>
              <span className="text-teal-700 font-bold">Khu vực Lễ tân</span>
            </Link>
          )}

          {/* 3. Nút cho Spa (Màu Tím) */}
          {user?.role === "SPA" && (
            <Link
              to="/staff/spa"
              className={`${getLinkClass(
                "/staff/spa",
              )} mb-2 border-l-4 border-purple-500 bg-purple-50 hover:bg-purple-100`}
            >
              <span className="material-symbols-outlined text-purple-500 text-[20px]">
                spa
              </span>
              <span className="text-purple-600 font-bold">
                Khu vực làm việc
              </span>
            </Link>
          )}

          {/* ----------------------------------------- */}

          <Link to="/profile" className={getLinkClass("/profile")}>
            <span className={getIconClass("/profile")}>person</span>
            Hồ sơ của tôi
          </Link>

          <Link to="/my-pets" className={getLinkClass("/my-pets")}>
            <span className={getIconClass("/my-pets")}>pets</span>
            Thú cưng
          </Link>

          <Link
            to="/my-appointments"
            className={getLinkClass("/my-appointments")}
          >
            <span className={getIconClass("/my-appointments")}>
              calendar_month
            </span>
            Lịch sử hẹn
          </Link>

          <Link to="/my-orders" className={getLinkClass("/my-orders")}>
            <span className={getIconClass("/my-orders")}>receipt_long</span>
            Lịch sử đơn hàng
          </Link>

          <Link to="/settings" className={getLinkClass("/settings")}>
            <span className={getIconClass("/settings")}>settings</span>
            Cài đặt
          </Link>
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-gray-200 mx-2">
          <button
            onClick={() => {
              authService.logout();
              navigate("/");
            }}
            className="flex items-center gap-3 px-2 py-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserProfileSidebar;
