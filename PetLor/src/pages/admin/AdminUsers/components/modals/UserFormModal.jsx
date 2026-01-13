import React, { useState, useEffect } from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../../../components/utils"; // Giả sử bạn có util này

const UserFormModal = ({
  isOpen,
  onClose,
  initialData, // null = Create, object = Edit
  onSubmit,
}) => {
  const isEdit = !!initialData;
  const [creationType, setCreationType] = useState("USER"); // 'USER' | 'EMPLOYEE'

  const defaultFormState = {
    hoTen: "",
    email: "",
    password: "", // Bắt buộc khi tạo mới
    soDienThoai: "",
    diaChi: "",
    role: "USER",
    chucVu: "",
    chuyenKhoa: "",
    kinhNghiem: "",
  };

  // State form
  const [formData, setFormData] = useState(defaultFormState);

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");

  // Reset form khi mở modal
  useEffect(() => {
    if (isOpen) {
      // Hợp nhất dữ liệu
      const newFormData = { ...defaultFormState, ...(initialData || {}) };
      newFormData.password = ""; // Luôn xóa mật khẩu khi mở modal
      setFormData(newFormData);

      // Cập nhật ảnh đại diện và loại tài khoản
      setPreviewAvatar(
        initialData?.anhDaiDien
          ? `http://localhost:8080/uploads/${initialData.anhDaiDien}` // Hoặc dùng getImageUrl
          : ""
      );
      setCreationType(
        initialData?.role && initialData.role !== "USER" ? "EMPLOYEE" : "USER"
      );

      setAvatarFile(null);
    }
  }, [isOpen, initialData]);

  // Handle Tab Switch (Create Mode Only)
  const handleTypeChange = (type) => {
    setCreationType(type);
    setFormData((prev) => ({
      ...prev,
      role: type === "USER" ? "USER" : "STAFF",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    let submitData = { ...formData };

    if (isEdit) {
      if (!submitData.password || submitData.password.trim() === "") {
        delete submitData.password;
      }
    }

    if (!isEdit && creationType === "USER") {
      submitData.role = "USER";
      delete submitData.chucVu;
      delete submitData.chuyenKhoa;
      delete submitData.kinhNghiem;
    }

    onSubmit(submitData, avatarFile);
  };

  // Shared Styles (Design System)
  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium focus:ring-0 transition-all focus:border-primary outline-none placeholder:text-slate-400";
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-hidden p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    {isEdit ? "manage_accounts" : "person_add"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isEdit ? "Cập nhật Người dùng" : "Thêm mới Tài khoản"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEdit
                      ? `Chỉnh sửa thông tin cho ID #${initialData.userId}`
                      : "Tạo tài khoản khách hàng hoặc nhân viên mới"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* --- BODY --- */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Switcher (Chỉ hiện khi Create) */}
                {!isEdit && (
                  <div className="flex bg-slate-100 p-1.5 rounded-xl w-full max-w-md mx-auto">
                    <button
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                        creationType === "USER"
                          ? "bg-white text-primary shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                      onClick={() => handleTypeChange("USER")}
                    >
                      Khách hàng
                    </button>
                    <button
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                        creationType === "EMPLOYEE"
                          ? "bg-white text-primary shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                      onClick={() => handleTypeChange("EMPLOYEE")}
                    >
                      Nhân viên
                    </button>
                  </div>
                )}

                {/* Avatar Upload */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-full border-4 border-slate-50 shadow-md overflow-hidden bg-slate-100">
                      <img
                        src={
                          previewAvatar ||
                          "https://placehold.co/150x150?text=Avatar"
                        }
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/150x150?text=Avatar";
                        }}
                      />
                    </div>
                    <label className="absolute bottom-1 right-1 w-9 h-9 bg-primary text-white rounded-full shadow-lg border-2 border-white flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors">
                      <span className="material-symbols-outlined text-sm">
                        upload
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className={labelClass}>
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={inputClass}
                      name="hoTen"
                      value={formData.hoTen}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={inputClass}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Mật khẩu{" "}
                      {isEdit ? (
                        <span className="text-slate-400 normal-case font-normal tracking-normal">
                          (Bỏ trống nếu không đổi)
                        </span>
                      ) : (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      className={inputClass}
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Số điện thoại</label>
                    <input
                      className={inputClass}
                      name="soDienThoai"
                      value={formData.soDienThoai}
                      onChange={handleChange}
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Địa chỉ</label>
                    <input
                      className={inputClass}
                      name="diaChi"
                      value={formData.diaChi}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ..."
                    />
                  </div>

                  {/* Employee Specific Fields - Giữ nguyên logic hiển thị */}
                  {creationType === "EMPLOYEE" && (
                    <div className="md:col-span-2 bg-slate-50/80 p-6 rounded-2xl border border-slate-100 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                      <div className="md:col-span-2 flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary">
                          badge
                        </span>
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                          Thông tin chuyên môn
                        </span>
                      </div>

                      <div>
                        <label className={labelClass}>Vai trò hệ thống</label>
                        <select
                          className={`${inputClass} bg-white`}
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                        >
                          <option value="STAFF">Nhân viên</option>
                          <option value="DOCTOR">Bác sĩ</option>
                          <option value="SPA">Spa</option>
                          <option value="ADMIN">Quản trị</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Chức vụ</label>
                        <input
                          className={`${inputClass} bg-white`}
                          name="chucVu"
                          value={formData.chucVu}
                          onChange={handleChange}
                          placeholder="VD: Trưởng phòng"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Chuyên khoa</label>
                        <input
                          className={`${inputClass} bg-white`}
                          name="chuyenKhoa"
                          value={formData.chuyenKhoa}
                          onChange={handleChange}
                          placeholder="VD: Nội khoa"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Kinh nghiệm</label>
                        <input
                          className={`${inputClass} bg-white`}
                          name="kinhNghiem"
                          value={formData.kinhNghiem}
                          onChange={handleChange}
                          placeholder="VD: 5 năm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="p-8 border-t border-slate-100 flex justify-end items-center gap-6 bg-slate-50/30 shrink-0">
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 font-semibold transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-10 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">
                  {isEdit ? "save" : "check"}
                </span>
                {isEdit ? "Lưu thay đổi" : "Tạo tài khoản"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserFormModal;
