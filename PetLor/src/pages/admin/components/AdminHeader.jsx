import React from "react"; // Xóa import useState, useEffect, axios, authService
import useEscapeKey from "../../../hooks/useEscapeKey";
import { UserAvatar } from "./utils"; // Import Component mới từ file utils

const AdminHeader = ({ user, title }) => {
  // Không cần logic fetch ảnh ở đây nữa

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-gray-200 bg-white px-6 py-3">
      {/* Phần tiêu đề */}
      <div className="flex items-center gap-8">
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900">
          {title || "Pet Lor Dashboard"}
        </h2>
      </div>
      {/* Phần các nút chức năng bên phải */}
      <div className="flex items-center gap-4">
        {/* Thanh tìm kiếm */}
        <label className="!h-10 flex min-w-40 max-w-64 flex-col">
          <div className="flex h-full w-full flex-1 items-stretch rounded-lg">
            <div className="flex items-center justify-center rounded-l-lg border-r-0 border-none bg-gray-100 pl-4 text-gray-500">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="flex h-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none border-l-0 border-none bg-gray-100 px-4 pl-2 text-base font-normal leading-normal text-gray-900 placeholder:text-gray-500 focus:border-none focus:outline-0 focus:ring-0"
              placeholder="Tìm kiếm..."
            />
          </div>
        </label>
        {/* Nút thông báo */}
        <button className="flex h-10 w-10 max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-gray-100 text-sm font-bold leading-normal tracking-[0.015em] text-gray-900 transition-colors hover:bg-gray-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        {/* Thông tin người dùng và ảnh đại diện */}
        <div className="flex items-center">
          {/* 👇 Thay thế thẻ img cũ bằng UserAvatar */}
          <UserAvatar user={user} className="h-8 w-8" />

          <span className="ml-2 hidden text-sm font-medium text-gray-700 md:block">
            {user?.hoTen || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
