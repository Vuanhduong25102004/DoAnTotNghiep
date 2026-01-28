import React, { useState, useEffect } from "react";
import userService from "../../../services/userService";
// 1. Import toast
import { toast } from "react-toastify";

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
    gioiTinh: "Nam",
    diaChi: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // Khi modal mở, điền dữ liệu
  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        hoTen: currentUser.hoTen || "",
        email: currentUser.email || "",
        soDienThoai: currentUser.soDienThoai || "",
        ngaySinh: currentUser.ngaySinh
          ? currentUser.ngaySinh.split("T")[0]
          : "",
        gioiTinh: currentUser.gioiTinh || "Nam",
        diaChi: currentUser.diaChi || "",
      });

      if (currentUser.anhDaiDien) {
        setPreviewUrl(
          currentUser.anhDaiDien.startsWith("http")
            ? currentUser.anhDaiDien
            : `${API_URL}/uploads/${currentUser.anhDaiDien}`,
        );
      } else {
        setPreviewUrl(
          `https://ui-avatars.com/api/?name=${currentUser.hoTen}&background=random`,
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

      const finalNgaySinh = formData.ngaySinh
        ? formData.ngaySinh
        : currentUser.ngaySinh
          ? currentUser.ngaySinh.split("T")[0]
          : "";

      const nguoiDung = {
        hoTen: formData.hoTen,
        email: formData.email,
        soDienThoai: formData.soDienThoai,
        ngaySinh: finalNgaySinh,
        gioiTinh: formData.gioiTinh,
        diaChi: formData.diaChi,
      };

      dataToSend.append("nguoiDung", JSON.stringify(nguoiDung));
      if (avatarFile) {
        dataToSend.append("anhDaiDien", avatarFile);
      }

      await userService.updateMe(dataToSend);

      // 2. Thay alert bằng toast success
      toast.success("Cập nhật hồ sơ thành công!");

      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      // 3. Thay alert bằng toast error
      toast.error("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative z-[100]"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible delay-300"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed inset-0 overflow-hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
            <div
              className={`pointer-events-auto w-screen max-w-md transform transition-transform duration-300 ease-in-out bg-white shadow-2xl flex flex-col h-full ${
                isOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {/* Header */}
              <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-100 bg-white">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Chỉnh sửa hồ sơ
                  </h2>
                  <p className="text-xs text-gray-500">
                    Cập nhật thông tin cá nhân
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all focus:outline-none cursor-pointer"
                  onClick={onClose}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="relative group">
                    <div
                      className="size-28 rounded-full bg-cover bg-center ring-4 ring-gray-50 shadow-sm"
                      style={{ backgroundImage: `url("${previewUrl}")` }}
                    ></div>
                    <label className="absolute bottom-0 right-0 bg-primary text-[#0d1b0d] p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 hover:bg-[#0fd60f] transition-all border-2 border-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px] block text-white">
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
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
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

                  {/* Giới tính */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Giới tính
                    </label>
                    <div className="flex gap-4">
                      <label className="flex-1 cursor-pointer group">
                        <input
                          type="radio"
                          name="gioiTinh"
                          value="Nam"
                          className="sr-only"
                          checked={formData.gioiTinh === "Nam"}
                          onChange={handleChange}
                        />
                        <div
                          className={`rounded-xl border p-2.5 flex items-center justify-center gap-2 text-sm font-medium transition-all hover:shadow-sm ${
                            formData.gioiTinh === "Nam"
                              ? "bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-white"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            male
                          </span>
                          Nam
                        </div>
                      </label>

                      <label className="flex-1 cursor-pointer group">
                        <input
                          type="radio"
                          name="gioiTinh"
                          value="Nữ"
                          className="sr-only"
                          checked={formData.gioiTinh === "Nữ"}
                          onChange={handleChange}
                        />
                        <div
                          className={`rounded-xl border p-2.5 flex items-center justify-center gap-2 text-sm font-medium transition-all hover:shadow-sm ${
                            formData.gioiTinh === "Nữ"
                              ? "bg-pink-50 border-pink-500 text-pink-600"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-white"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            female
                          </span>
                          Nữ
                        </div>
                      </label>

                      <label className="flex-1 cursor-pointer group">
                        <input
                          type="radio"
                          name="gioiTinh"
                          value="Khác"
                          className="sr-only"
                          checked={formData.gioiTinh === "Khác"}
                          onChange={handleChange}
                        />
                        <div
                          className={`rounded-xl border p-2.5 flex items-center justify-center gap-2 text-sm font-medium transition-all hover:shadow-sm ${
                            formData.gioiTinh === "Khác"
                              ? "bg-purple-50 border-purple-500 text-purple-600"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-white"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            transgender
                          </span>
                          Khác
                        </div>
                      </label>
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
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-gray-100 px-6 py-5 bg-gray-50/50 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#0d1b0d] bg-primary hover:bg-[#0fd60f] shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer text-white"
                >
                  {loading && (
                    <span className="material-symbols-outlined animate-spin text-sm ">
                      progress_activity
                    </span>
                  )}
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
