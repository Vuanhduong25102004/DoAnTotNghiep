import React, { useState, useEffect } from "react";
import userService from "../../../services/userService";

const EditProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateSuccess,
}) => {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    soDienThoai: "",
    ngaySinh: "",
    diaChi: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // URL API
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // Khi modal mở (isOpen thay đổi thành true), điền dữ liệu
  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        hoTen: currentUser.hoTen || "",
        email: currentUser.email || "",
        soDienThoai: currentUser.soDienThoai || "",
        ngaySinh: currentUser.ngaySinh
          ? currentUser.ngaySinh.split("T")[0]
          : "",
        diaChi: currentUser.diaChi || "",
      });

      // Xử lý hiển thị ảnh
      if (currentUser.anhDaiDien) {
        setPreviewUrl(
          currentUser.anhDaiDien.startsWith("http")
            ? currentUser.anhDaiDien
            : `${API_URL}/uploads/${currentUser.anhDaiDien}`
        );
      } else {
        setPreviewUrl(
          `https://ui-avatars.com/api/?name=${currentUser.hoTen}&background=random`
        );
      }
      setAvatarFile(null);
    }
  }, [isOpen, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dataToSend = new FormData();
      const nguoiDung = {
        hoTen: formData.hoTen,
        email: formData.email,
        soDienThoai: formData.soDienThoai,
        ngaySinh: formData.ngaySinh,
        diaChi: formData.diaChi,
      };

      dataToSend.append("nguoiDung", JSON.stringify(nguoiDung));
      if (avatarFile) {
        dataToSend.append("anhDaiDien", avatarFile);
      }

      await userService.updateMe(dataToSend);
      alert("Cập nhật thành công!");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    } finally {
      setLoading(false);
    }
  };

  // --- THAY ĐỔI QUAN TRỌNG VỀ GIAO DIỆN ---
  // Không dùng "if (!isOpen) return null" để giữ animation khi đóng
  // Thay vào đó dùng class invisible/opacity-0

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden transition-visibility duration-300 ${
        isOpen ? "visible" : "invisible delay-300"
      }`}
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop (Màn hình đen mờ) */}
      <div
        className={`absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Slide-over Panel (Ngăn kéo trượt từ phải) */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10 pointer-events-none">
        <div
          className={`pointer-events-auto w-screen max-w-md transform transition-transform duration-300 ease-in-out sm:duration-500 bg-white shadow-2xl flex flex-col h-full ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-100 bg-white">
            <div>
              <h2
                className="text-lg font-bold text-gray-900"
                id="slide-over-title"
              >
                Chỉnh sửa hồ sơ
              </h2>
              <p className="text-xs text-gray-500">
                Cập nhật thông tin cá nhân
              </p>
            </div>
            <button
              type="button"
              className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all focus:outline-none"
              onClick={onClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Body (Có cuộn dọc) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="relative group">
                <div
                  className="size-28 rounded-full bg-cover bg-center ring-4 ring-gray-50 shadow-sm"
                  style={{ backgroundImage: `url("${previewUrl}")` }}
                ></div>
                <label className="absolute bottom-0 right-0 bg-primary text-[#0d1b0d] p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 hover:bg-[#0fd60f] transition-all border-2 border-white">
                  <span className="material-symbols-outlined text-[20px] block">
                    photo_camera
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setPreviewUrl(
                      `https://ui-avatars.com/api/?name=${formData.hoTen}&background=random`
                    );
                  }}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-full transition-colors"
                >
                  Xóa ảnh hiện tại
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 font-medium text-sm"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="ngaySinh"
                    value={formData.ngaySinh}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Địa chỉ
                </label>
                <textarea
                  name="diaChi"
                  rows="3"
                  value={formData.diaChi}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-sm font-medium"
                  placeholder="Nhập địa chỉ hiện tại"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Footer (Cố định ở dưới) */}
          <div className="shrink-0 border-t border-gray-100 px-6 py-5 bg-gray-50/50 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#0d1b0d] bg-primary hover:bg-[#0fd60f] shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <span className="material-symbols-outlined animate-spin text-sm">
                  progress_activity
                </span>
              )}
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
