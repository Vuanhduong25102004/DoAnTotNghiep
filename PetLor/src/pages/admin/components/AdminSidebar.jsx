import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = ({ onLogout }) => {
  const location = useLocation();

  // State để quản lý đóng/mở menu Danh mục
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // --- HELPER FUNCTIONS ---
  const isActive = (path) => location.pathname.startsWith(path);

  // Tự động mở menu nếu URL hiện tại nằm trong nhóm danh mục
  useEffect(() => {
    if (location.pathname.startsWith("/admin/categories")) {
      setIsCategoryMenuOpen(true);
    }
  }, [location.pathname]);

  const linkClass = (path) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive(path)
        ? "border border-primary/20 bg-primary/10 text-primary"
        : "text-gray-600 hover:bg-gray-50 hover:text-primary"
    }`;

  // Class riêng cho link con (thụt đầu dòng, font nhỏ hơn xíu)
  const subLinkClass = (path) =>
    `flex items-center pl-11 pr-3 py-2 text-sm font-medium rounded-md transition-colors ${
      location.pathname === path // Dùng strict equality (===) cho link con để highlight chính xác
        ? "text-primary font-bold bg-gray-50"
        : "text-gray-500 hover:text-primary hover:bg-gray-50"
    }`;

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
      {/* === HEADER === */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <Link to="/admin" className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-3xl text-primary">
            pets
          </span>
          <span className="text-xl font-bold text-text-main">
            Quản trị viên PetLor
          </span>
        </Link>
      </div>

      {/* === NAVIGATION === */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        {/* --- DASHBOARD --- */}
        <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
          <span className="material-symbols-outlined mr-3">dashboard</span>
          Tổng quan
        </Link>

        {/* --- NHÓM 1: BÁN HÀNG & MARKETING --- */}
        <div className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Bán hàng & Marketing
        </div>

        <Link to="/admin/orders" className={linkClass("/admin/orders")}>
          <span className="material-symbols-outlined mr-3">receipt_long</span>
          Đơn hàng
        </Link>

        <Link to="/admin/promotions" className={linkClass("/admin/promotions")}>
          <span className="material-symbols-outlined mr-3">local_offer</span>
          Khuyến mãi
        </Link>

        {/* --- NHÓM 2: SẢN PHẨM & KHO --- */}
        <div className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Sản phẩm & Kho
        </div>

        {/* === START: MENU ĐA CẤP DANH MỤC === */}
        <div>
          <button
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            className={`flex w-full items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive("/admin/categories") // Highlight cha nếu đang ở con
                ? "text-primary"
                : "text-gray-600 hover:bg-gray-50 hover:text-primary"
            }`}
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined mr-3">category</span>
              Quản lý Danh mục
            </div>
            {/* Icon mũi tên xoay khi đóng mở */}
            <span
              className={`material-symbols-outlined text-lg transition-transform duration-200 ${
                isCategoryMenuOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>

          {/* Sub-menu items */}
          {isCategoryMenuOpen && (
            <div className="mt-1 space-y-1 animate-fadeIn">
              <Link
                to="/admin/categories/products"
                className={subLinkClass("/admin/categories/products")}
              >
                DM Sản phẩm
              </Link>
              <Link
                to="/admin/categories/services"
                className={subLinkClass("/admin/categories/services")}
              >
                DM Dịch vụ
              </Link>
              <Link
                to="/admin/categories/posts"
                className={subLinkClass("/admin/categories/posts")}
              >
                DM Bài viết
              </Link>
            </div>
          )}
        </div>
        {/* === END: MENU ĐA CẤP DANH MỤC === */}

        <Link to="/admin/products" className={linkClass("/admin/products")}>
          <span className="material-symbols-outlined mr-3">inventory_2</span>
          Sản phẩm
        </Link>

        <Link to="/admin/imports" className={linkClass("/admin/imports")}>
          <span className="material-symbols-outlined mr-3">move_to_inbox</span>
          Nhập hàng
        </Link>

        <Link to="/admin/suppliers" className={linkClass("/admin/suppliers")}>
          <span className="material-symbols-outlined mr-3">store</span>
          Nhà cung cấp
        </Link>

        {/* --- NHÓM 3: DỊCH VỤ & Y TẾ --- */}
        <div className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Dịch vụ & Y Tế
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
          Dịch vụ Spa/Khám
        </Link>

        <Link
          to="/admin/vaccinations"
          className={linkClass("/admin/vaccinations")}
        >
          <span className="material-symbols-outlined mr-3">vaccines</span>
          Sổ tiêm chủng
        </Link>

        {/* --- NHÓM 4: KHÁCH HÀNG & NHÂN SỰ --- */}
        <div className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Con người & Thú cưng
        </div>

        <Link to="/admin/users" className={linkClass("/admin/users")}>
          <span className="material-symbols-outlined mr-3">person</span>
          Khách hàng
        </Link>

        <Link to="/admin/pets" className={linkClass("/admin/pets")}>
          <span className="material-symbols-outlined mr-3">pets</span>
          Thú cưng
        </Link>

        <Link to="/admin/reviews" className={linkClass("/admin/reviews")}>
          <span className="material-symbols-outlined mr-3">star_rate</span>
          Đánh giá
        </Link>

        <Link to="/admin/employees" className={linkClass("/admin/employees")}>
          <span className="material-symbols-outlined mr-3">badge</span>
          Nhân Viên
        </Link>

        {/* --- NHÓM 5: NỘI DUNG --- */}
        <div className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Nội dung & CMS
        </div>

        <Link to="/admin/posts" className={linkClass("/admin/posts")}>
          <span className="material-symbols-outlined mr-3">article</span>
          Bài viết / Blog
        </Link>
      </nav>

      {/* === FOOTER === */}
      <div className="border-t border-gray-200 p-4">
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
