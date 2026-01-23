import React, { useState, useEffect } from "react";

const PetDetailModal = ({ isOpen, onClose, onEdit, pet }) => {
  // Không dùng conditional return null ở đây để giữ animation
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const getPetAvatarUrl = (petData) => {
    if (petData?.hinhAnh) {
      return petData.hinhAnh.startsWith("http")
        ? petData.hinhAnh
        : `${API_URL}/uploads/${petData.hinhAnh}`;
    }
    return `https://placehold.co/150/E7F3E7/4C9A4C?text=${
      petData?.tenThuCung ? petData.tenThuCung.charAt(0) : "P"
    }`;
  };

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden transition-visibility duration-500 ${
        isOpen ? "visible" : "invisible delay-500"
      }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop (Mờ dần) */}
      <div
        className={`absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Slide-over Panel (Trượt từ phải sang) */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10 pointer-events-none">
        <div
          className={`pointer-events-auto w-screen max-w-md transform transition-transform duration-500 ease-in-out flex flex-col h-full bg-white shadow-2xl relative ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Action Buttons (Close & Edit) */}
          {/* Action Buttons (Close & Edit) */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {/* Nút Edit - Mới thêm */}
            <button
              onClick={() => {
                onEdit(pet);
              }}
              className="bg-white/20 hover:bg-white/40 text-gray-800 p-2 rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/30 shadow-sm flex items-center justify-center"
              title="Chỉnh sửa thông tin"
            >
              <span className="material-symbols-outlined text-xl font-bold">
                edit
              </span>
            </button>

            {/* Nút Close */}
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/40 text-gray-800 p-2 rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/30 shadow-sm flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-xl font-bold">
                close
              </span>
            </button>
          </div>

          {/* Vùng cuộn chứa cả Header và Body (Fix lỗi cắt ảnh) */}
          <div className="h-full overflow-y-auto custom-scrollbar bg-white">
            {/* Header Image Background */}
            <div className="h-48 bg-[#e7f3e7] relative shrink-0 overflow-hidden">
              {/* Họa tiết trang trí */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#4C9A4C_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-300/20 rounded-full blur-3xl"></div>
              <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl"></div>
            </div>

            {/* Body Content */}
            <div className="px-6 pb-10 relative">
              {/* Avatar - Nổi lên trên Header nhờ margin âm */}
              <div className="-mt-20 mb-4 flex justify-center relative z-10">
                <div className="p-1.5 bg-white rounded-full shadow-lg">
                  <div
                    className="w-36 h-36 rounded-full bg-cover bg-center border border-gray-100"
                    style={
                      pet
                        ? { backgroundImage: `url("${getPetAvatarUrl(pet)}")` }
                        : {}
                    }
                  ></div>
                </div>
              </div>

              {/* Tên & Loại */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-black text-[#0d1b0d] tracking-tight mb-2">
                  {pet?.tenThuCung || "Đang tải..."}
                </h3>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">
                    pets
                  </span>
                  {pet?.chungLoai || pet?.loai || "Thú cưng"}
                </span>
              </div>

              {/* Thông tin chi tiết */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Giống loài */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
                      Giống loài
                    </p>
                    <p className="font-bold text-gray-800 text-sm truncate">
                      {pet?.giongLoai || pet?.giong || "Không rõ"}
                    </p>
                  </div>

                  {/* Giới tính */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
                      Giới tính
                    </p>
                    <p
                      className={`font-bold text-sm ${
                        pet?.gioiTinh === "Đực"
                          ? "text-blue-600"
                          : "text-pink-600"
                      }`}
                    >
                      {pet?.gioiTinh || "--"}
                    </p>
                  </div>

                  {/* Ngày sinh */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
                      Ngày sinh
                    </p>
                    <p className="font-bold text-gray-800 text-sm">
                      {pet?.ngaySinh
                        ? new Date(pet.ngaySinh).toLocaleDateString("vi-VN")
                        : "Chưa cập nhật"}
                    </p>
                  </div>

                  {/* Cân nặng */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 flex items-center gap-1">
                      Cân nặng
                    </p>
                    <p className="font-bold text-gray-800 text-sm">
                      {pet?.canNang ? `${pet.canNang} kg` : "--"}
                    </p>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="bg-yellow-50/50 p-5 rounded-2xl border border-yellow-200/60 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-yellow-100">
                    <span className="material-symbols-outlined text-[80px]">
                      format_quote
                    </span>
                  </div>
                  <p className="text-[10px] text-yellow-700 uppercase font-bold mb-2 flex items-center gap-1 relative z-10">
                    <span className="material-symbols-outlined text-[16px]">
                      medical_services
                    </span>
                    Ghi chú sức khỏe
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed italic relative z-10">
                    "
                    {pet?.ghiChuSucKhoe ||
                      pet?.ghiChu ||
                      "Sức khỏe bình thường."}
                    "
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailModal;
