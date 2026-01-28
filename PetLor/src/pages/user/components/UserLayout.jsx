import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import userService from "../../../services/userService";
import UserProfileSidebar from "./UserProfileSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";

const UserLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getMe();
        setUser(response);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    AOS.init({ duration: 800, once: true });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-light)]">
        <p className="text-[var(--color-primary)] font-bold animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-background-light)] font-display text-[var(--color-text-main)] min-h-screen flex flex-col mt-16">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col lg:flex-row gap-8 py-8 px-4 sm:px-6 lg:px-8">
        {/* Sidebar đứng yên không load lại */}
        <UserProfileSidebar user={user} />

        {/* Nội dung các trang con (MyPets, Appointments,...) thay đổi ở đây */}
        <div className="flex-1 min-w-0">
          <Outlet context={[user]} />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
