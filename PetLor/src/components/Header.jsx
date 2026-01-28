import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import userService from "../services/userService";
// Import useCart hook
import { useCart } from "../context/CartContext";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get cartData from CartContext
  const { cartData } = useCart();

  // Logic active link
  const isActive = (path) => {
    return location.pathname === path
      ? "text-primary font-bold"
      : "text-slate-600 hover:text-primary";
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await userService.getMe();
          setUser(response);
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          authService.logout();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/");
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // Class chung cho các nút tròn (Search, Cart, Logout)
  const iconButtonClass =
    "w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-slate-100 text-slate-600";

  // Calculate unique item count
  // We use cartData?.items?.length to count distinct products, ignoring their individual quantities.
  const cartItemCount = cartData?.items?.length || 0;

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/50 backdrop-blur-md shadow-sm" // Khi kéo xuống: Trong suốt mờ ảo (Glassmorphism)
          : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LEFT SECTION: LOGO & NAV */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">pets</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              PetLor
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link className={`${isActive("/")} transition-colors`} to="/">
              Trang chủ
            </Link>
            <Link
              className={`${isActive("/services")} transition-colors`}
              to="/services"
            >
              Dịch vụ
            </Link>
            <Link
              className={`${isActive("/products")} transition-colors`}
              to="/products"
            >
              Sản phẩm
            </Link>
            <Link
              className={`${isActive("/aboutus")} transition-colors`}
              to="/aboutus"
            >
              Về chúng tôi
            </Link>
            <Link
              className={`${isActive("/blog")} transition-colors`}
              to="/blog"
            >
              Bài viết
            </Link>
            <Link
              className={`${isActive("/profilepage")} transition-colors`}
              to="/profilepage"
            >
              Thông tin cá nhân
            </Link>
          </nav>
        </div>

        {/* RIGHT SECTION: ACTIONS & AUTH */}
        <div className="flex items-center gap-3">
          <Link to="/cart" className={`relative ${iconButtonClass}`}>
            <span className="material-symbols-outlined">shopping_cart</span>
            {/* Render badge dynamically if count > 0 */}
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>

          {/* User Auth Logic */}
          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1 pl-2 pr-1 hover:bg-slate-100 rounded-full transition-all border border-transparent hover:border-slate-200"
              >
                <span className="text-sm font-semibold text-slate-700 hidden sm:block max-w-[100px] truncate">
                  {user.hoTen?.split(" ").pop()}
                </span>
                <img
                  src={
                    user.anhDaiDien
                      ? `${API_URL}/uploads/${user.anhDaiDien}`
                      : `https://ui-avatars.com/api/?name=${user.hoTen}&background=random`
                  }
                  alt={user.hoTen}
                  className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${user.hoTen}&background=random`;
                  }}
                />
              </Link>

              {/* Nút Logout - Đã sửa thành tròn và căn giữa */}
              <button
                onClick={handleLogout}
                // Sử dụng lại logic căn giữa, nhưng override màu sắc khi hover
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors text-slate-400 hover:text-red-600 hover:bg-red-50"
                title="Đăng xuất"
              >
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
              >
                Đăng nhập
              </Link>
              <Link to="/booking">
                <button className="bg-primary text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Đặt lịch ngay
                </button>
              </Link>
            </div>
          )}

          {/* Nút Đặt lịch (Chỉ hiện khi đã đăng nhập) */}
          {user && (
            <Link to="/booking">
              <button className="hidden lg:block ml-2 bg-primary text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Đặt lịch ngay
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
