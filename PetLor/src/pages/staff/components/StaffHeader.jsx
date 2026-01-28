import React from "react";

const StaffHeader = ({ user, countConfirmed }) => {
  // Hàm lấy tên chức danh hiển thị
  const getRoleLabel = () => {
    switch (user?.role) {
      case "DOCTOR":
        return "Bác sĩ";
      case "RECEPTIONIST":
        return "Lễ tân";
      case "SPA":
        return "Spa";
      case "ADMIN":
        return "Quản trị viên";
      default:
        return "Bạn";
    }
  };

  return (
    // Giữ nguyên CSS Layout cũ của bạn
    <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0 sticky top-0 z-20">
      <div>
        {/* Hiển thị Tên nhân viên */}
        <h2 className="text-2xl font-extrabold text-[#0c1d1d] tracking-tight">
          {user?.hoTen ? `Xin chào, ${user.hoTen}` : "Hệ thống PetLor"}
        </h2>

        <p className="text-xs font-medium text-gray-400 mt-0.5">
          {user?.role === "DOCTOR" ? (
            // LOGIC CHO BÁC SĨ: Hiện số ca chờ
            <>
              {getRoleLabel()} có{" "}
              <span className="text-[#007A7A] font-bold">
                {countConfirmed || 0} yêu cầu
              </span>{" "}
              đang chờ khám.
            </>
          ) : (
            // LOGIC CHO NHÂN VIÊN KHÁC: Hiện câu chúc
            <>Chúc {getRoleLabel().toLowerCase()} một ngày làm việc hiệu quả!</>
          )}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">
            search
          </span>
          {/* Input giữ nguyên style */}
          <input
            className="pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#007A7A]/10 w-72 placeholder:text-gray-400 outline-none transition-all"
            placeholder="Tìm tên thú cưng, mã số..."
            type="text"
          />
        </div>

        {/* Nút thông báo giữ nguyên */}
        <button className="flex items-center justify-center size-10 bg-white border border-gray-100 text-gray-600 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
          <span className="material-symbols-outlined text-xl">
            notifications
          </span>
        </button>
      </div>
    </header>
  );
};

export default StaffHeader;
