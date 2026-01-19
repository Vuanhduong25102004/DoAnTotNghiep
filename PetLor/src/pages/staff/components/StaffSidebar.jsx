import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Thêm useLocation, Link
import authService from "../../../services/authService";

const StaffSidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy URL hiện tại để highlight menu
  const API_URL = "http://localhost:8080/uploads/";

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const getAvatarUrl = () => {
    if (user?.anhDaiDien) {
      return user.anhDaiDien.startsWith("http")
        ? user.anhDaiDien
        : `${API_URL}${user.anhDaiDien}`;
    }
    return "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200";
  };

  // --- CẤU HÌNH MENU VỚI ĐƯỜNG DẪN URL (PATH) ---
  const MENU_CONFIG = {
    DOCTOR: [
      { path: "/staff/doctor", label: "Tổng quan", icon: "grid_view" }, // Dashboard
      {
        path: "/staff/doctor/schedule", // Link tới trang lịch
        label: "Duyệt lịch hẹn",
        icon: "event_note",
      },
      { path: "/staff/doctor/patients", label: "Bệnh nhân", icon: "pets" },
      { path: "/staff/doctor/reports", label: "Báo cáo", icon: "analytics" },
    ],
    RECEPTIONIST: [
      { path: "/staff/receptionist", label: "Tổng quan", icon: "grid_view" },
      {
        path: "/staff/receptionist/booking",
        label: "Đặt lịch",
        icon: "calendar_add_on",
      },
      {
        path: "/staff/receptionist/posts",
        label: "Bài viết",
        icon: "article",
      },
      {
        path: "/staff/receptionist/prescriptions",
        label: "Đơn thuốc",
        icon: "medication",
      },
    ],
    SPA: [
      { path: "/staff/spa", label: "Tổng quan", icon: "grid_view" },
      { path: "/staff/spa/schedule", label: "Lịch Spa", icon: "spa" },
    ],
    DEFAULT: [],
  };

  // Xác định menu dựa trên role
  const currentMenu = MENU_CONFIG[user?.role] || MENU_CONFIG.DEFAULT;

  // Tên hiển thị cạnh Logo
  const getRoleDisplayName = () => {
    switch (user?.role) {
      case "DOCTOR":
        return "Doctor";
      case "RECEPTIONIST":
        return "Reception";
      case "SPA_STAFF":
        return "Spa";
      default:
        return "Staff";
    }
  };

  // Hàm kiểm tra xem menu này có đang Active không (Dựa vào URL)
  const isActive = (path) => {
    // So sánh chính xác hoặc path con (nếu cần)
    // Ví dụ: đang ở /staff/doctor thì tab Tổng quan sáng
    // Lưu ý: Logic này có thể tùy chỉnh nếu bạn muốn strict mode
    return location.pathname === path;
  };

  const getItemClass = (path) => {
    if (isActive(path)) {
      return "flex items-center gap-3 px-4 py-3 transition-all duration-300 bg-white rounded-xl shadow-sm border border-gray-100 text-[#2a9d8f] font-bold cursor-pointer";
    }
    return "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all cursor-pointer group";
  };

  return (
    <aside className="w-72 flex flex-col border-r border-gray-100 bg-white h-full shrink-0 font-sans">
      <div className="p-8 flex flex-col h-full">
        {/* Logo */}
        <div className="mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2a9d8f] rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white">pets</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#2a9d8f]">
            PetLor{" "}
            <span className="text-gray-400 font-light">
              {getRoleDisplayName()}
            </span>
          </h1>
        </div>

        {/* Profile Card */}
        <div className="mb-10 p-4 bg-gray-50/50 rounded-3xl flex items-center gap-3">
          <div className="size-12 rounded-2xl overflow-hidden bg-gray-200 border-2 border-white shadow-sm shrink-0">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src={getAvatarUrl()}
            />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-gray-900 leading-tight truncate">
              {user?.hoTen || "Đang tải..."}
            </h2>
            <p className="text-[10px] font-bold text-[#007A7A]/60 uppercase tracking-widest mt-0.5">
              {user?.role === "DOCTOR"
                ? "KHOA NỘI VỤ"
                : user?.role || "NHÂN VIÊN"}
            </p>
          </div>
        </div>

        {/* Dynamic Menu Items */}
        <nav className="flex flex-col gap-2 flex-grow">
          {currentMenu.map((item, index) => (
            <Link
              key={index}
              to={item.path} // Dùng Link của router
              className={getItemClass(item.path)}
            >
              <span
                className="material-symbols-outlined"
                style={
                  isActive(item.path)
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                {item.icon}
              </span>
              <p className="text-[15px] font-semibold">{item.label}</p>

              {/* Badge */}
              {item.badge && (
                <span
                  className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive(item.path)
                      ? "bg-[#007A7A] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          {/* Mini Calendar */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">
              Lịch trực tháng 10
            </p>
            {/* ... Giữ nguyên phần calendar của bạn ... */}
            <div className="px-2 py-4 bg-gray-50/50 rounded-[28px]">
              <div className="grid grid-cols-7 gap-1 text-center">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <span key={i} className="text-[10px] text-gray-400 font-bold">
                    {d}
                  </span>
                ))}
                <span className="text-[11px] py-1.5 text-gray-300">11</span>
                <span className="text-[11px] py-1.5 text-gray-300">12</span>
                <span className="text-[11px] py-1.5 bg-[#2a9d8f] text-white rounded-lg font-bold">
                  13
                </span>
                {[14, 15, 16, 17].map((d) => (
                  <span key={d} className="text-[11px] py-1.5 text-gray-500">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full rounded-2xl h-12 text-gray-400 hover:text-[#ef5350] transition-colors font-bold text-sm"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;
