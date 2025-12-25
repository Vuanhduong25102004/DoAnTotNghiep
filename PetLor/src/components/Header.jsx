import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import userService from "../services/userService";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const linkClass = (path) => {
    if (location.pathname === path) {
      return "block border-2 border-primary rounded-full";
    }
    return "block border-2 border-transparent";
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
    navigate("/login");
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

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? " backdrop-blur-md shadow-sm border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Tôi cũng bọc Link vào đây để khi bấm vào Logo thì về trang chủ */}
          <Link
            to="/"
            className="flex items-center gap-4 text-gray-900 cursor-pointer"
          >
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-[28px]">
                pets
              </span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
              PetLor
            </h2>
          </Link>

          {/* Menu Navigation - Đã thay toàn bộ <a> thành <Link> */}
          <div className="hidden md:flex items-center gap-9">
            <Link
              className="text-sm font-medium leading-normal hover:text-primary transition-colors"
              to="/"
            >
              Trang chủ
            </Link>
            <Link
              className="text-sm font-medium leading-normal hover:text-primary transition-colors"
              to="/services"
            >
              Dịch vụ
            </Link>
            <Link
              className="text-sm font-medium leading-normal hover:text-primary transition-colors"
              to="/products"
            >
              Sản phẩm
            </Link>
            <Link
              className="text-sm font-medium leading-normal hover:text-primary transition-colors"
              to="/aboutus"
            >
              Về chúng tôi
            </Link>
            <Link
              className="text-sm font-medium leading-normal hover:text-primary transition-colors"
              to="/blog"
            >
              Blog
            </Link>
            <Link
              className="text-sm font-medium leading-normal hover:text-primary transition-colors"
              to="/contact"
            >
              Liên hệ
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-9">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className={linkClass("/profile")}>
                  <img
                    src={
                      user.anhDaiDien
                        ? `${API_URL}/uploads/${user.anhDaiDien}`
                        : `https://ui-avatars.com/api/?name=${user.hoTen}&background=random`
                    }
                    alt={user.hoTen}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${user.hoTen}&background=random`;
                    }}
                  />
                </Link>
              </div>
            ) : (
              <Link
                className="text-sm font-medium leading-normal hover:text-primary transition-colors"
                to="/login"
              >
                Đăng nhập
              </Link>
            )}
            <button className="hidden md:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#111813] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity">
              <span className="truncate">Đặt lịch ngay</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
