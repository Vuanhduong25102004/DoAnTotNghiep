import React from "react";
import useEscapeKey from "../../../hooks/useEscapeKey";
import { UserAvatar } from "./utils";

const AdminHeader = ({ user, title }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      {/* Phần tiêu đề */}
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-slate-500">
          {title || "Bảng điều khiển PetLor"}
        </h2>
      </div>

      {/* Phần các nút chức năng bên phải */}
      <div className="flex items-center gap-6">
        {/* Thanh tìm kiếm */}
        <div className="relative">
          <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            className="w-64 rounded-full border bordder-slate-200 bg-slate-50 py-1.5 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary"
            placeholder="Tìm kiếm..."
            type="text"
          />
        </div>

        {/* Nút thông báo */}
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <span className="material-symbols-rounded">notifications</span>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
        </button>

        {/* Thông tin người dùng và ảnh đại diện */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-gray-900">
              {user?.hoTen || "Admin"}
            </p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>

          {/* Component UserAvatar thay thế cho thẻ img */}
          <UserAvatar
            user={user}
            className="h-10 w-10 rounded-full border-2 border-slate-200"
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
