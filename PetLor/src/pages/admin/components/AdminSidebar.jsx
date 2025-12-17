import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Component AdminSidebar: Thanh điều hướng bên trái cho trang quản trị.
 * @param {object} props - Props của component.
 * @param {function} props.onLogout - Hàm xử lý khi người dùng nhấn nút đăng xuất.
 */
const AdminSidebar = ({ onLogout }) => {
  // Sử dụng hook useLocation để lấy thông tin về URL hiện tại
  const location = useLocation();

  // --- HELPER FUNCTIONS ---

  /**
   * Kiểm tra xem một đường dẫn có phải là đường dẫn đang hoạt động (active) hay không.
   * @param {string} path - Đường dẫn cần kiểm tra.
   * @returns {boolean} - True nếu đường dẫn khớp, ngược lại là false.
   */
  const isActive = (path) => location.pathname === path;

  /**
   * Tạo chuỗi class CSS động cho các mục menu.
   * Thay đổi style dựa trên việc mục đó có đang active hay không.
   * @param {string} path - Đường dẫn của mục menu.
   * @returns {string} - Chuỗi class CSS.
   */
  const linkClass = (path) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive(path)
        ? "border border-primary/20 bg-primary/10 text-primary" // Style khi active
        : "text-gray-600 hover:bg-gray-50 hover:text-primary" // Style mặc định
    }`;

  return (
    // Container chính của Sidebar, ẩn trên màn hình nhỏ (mobile)
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
      {/* === PHẦN HEADER CỦA SIDEBAR === */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <Link to="/admin" className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-3xl text-primary">
            pets
          </span>
          <span className="text-xl font-bold text-text-main">PetLor Admin</span>
        </Link>
      </div>

      {/* === PHẦN ĐIỀU HƯỚNG CHÍNH === */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {/* --- Mục Tổng quan (Dashboard) --- */}
        <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
          <span className="material-symbols-outlined mr-3">dashboard</span>
          Tổng quan
        </Link>

        {/* --- NHÓM 1: CỬA HÀNG (E-commerce) --- */}
        <div className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Quản lý Cửa hàng
        </div>

        <Link to="/admin/categories" className={linkClass("/admin/categories")}>
          <span className="material-symbols-outlined mr-3">category</span>
          Danh mục
        </Link>

        <Link to="/admin/products" className={linkClass("/admin/products")}>
          <span className="material-symbols-outlined mr-3">inventory_2</span>
          Sản phẩm
        </Link>

        <Link to="/admin/orders" className={linkClass("/admin/orders")}>
          <span className="material-symbols-outlined mr-3">receipt_long</span>
          Đơn hàng
        </Link>

        {/* --- NHÓM 2: KHÁCH HÀNG & THÚ CƯNG (CRM) --- */}
        <div className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Khách hàng & Thú cưng
        </div>

        <Link to="/admin/users" className={linkClass("/admin/users")}>
          <span className="material-symbols-outlined mr-3">person</span>
          Người dùng
        </Link>

        <Link to="/admin/pets" className={linkClass("/admin/pets")}>
          <span className="material-symbols-outlined mr-3">pets</span>
          Thú cưng
        </Link>

        {/* --- NHÓM 3: DỊCH VỤ & VẬN HÀNH --- */}
        <div className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Dịch vụ & Vận hành
        </div>

        <Link
          to="/admin/appointments"
          className={linkClass("/admin/appointments")}
        >
          <span className="material-symbols-outlined mr-3">calendar_month</span>
          Lịch hẹn
        </Link>

        <Link to="/admin/services" className={linkClass("/admin/services")}>
          <span className="material-symbols-outlined mr-3">
            medical_services
          </span>
          Dịch vụ
        </Link>

        <Link to="/admin/employees" className={linkClass("/admin/employees")}>
          <span className="material-symbols-outlined mr-3">badge</span>
          Nhân Viên
        </Link>
      </nav>

      {/* === PHẦN FOOTER CỦA SIDEBAR === */}
      <div className="border-t border-gray-200 p-4">
        {/* Nút đăng xuất */}
        <button
          onClick={onLogout}
          className="flex w-full items-center text-sm font-medium text-gray-600 transition-colors hover:text-red-500"
        >
          <span className="material-symbols-outlined mr-3">logout</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
