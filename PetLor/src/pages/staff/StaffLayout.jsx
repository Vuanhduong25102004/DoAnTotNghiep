import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import userService from "../../services/userService";

// Giữ lại các thành phần khung sườn
import StaffSidebar from "./components/StaffSidebar";
import StaffHeader from "./components/StaffHeader";

const StaffLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const userData = await userService.getMe();
        setUser(userData);
      } catch (err) {
        console.error("Lỗi lấy thông tin user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white font-sans text-[#1A1C1E] overflow-hidden">
      {/* Sidebar cố định */}
      <StaffSidebar user={user} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F9FAFB] min-w-0">
        {/* Header cố định */}
        <StaffHeader user={user} />

        {/* --- PHẦN SỬA LỖI Ở ĐÂY --- */}
        {/* Thay overflow-hidden bằng overflow-y-auto để nội dung con có thể cuộn */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
};

export default StaffLayout;
