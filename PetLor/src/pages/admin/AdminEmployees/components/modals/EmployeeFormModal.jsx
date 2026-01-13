import React, { useState, useEffect } from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";

const EmployeeFormModal = ({
  isOpen,
  onClose,
  initialData, // Dữ liệu để sửa (nếu có)
  onSubmit, // Hàm xử lý khi bấm Lưu
}) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    password: "", // Password chỉ bắt buộc khi tạo mới
    soDienThoai: "",
    chucVu: "",
    chuyenKhoa: "",
    kinhNghiem: "",
    role: "STAFF",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          hoTen: initialData.hoTen || "",
          email: initialData.email || "",
          password: "",
          soDienThoai: initialData.soDienThoai || "",
          chucVu: initialData.chucVu || "",
          chuyenKhoa: initialData.chuyenKhoa || "",
          kinhNghiem: initialData.kinhNghiem || "",
          role: initialData.role || "STAFF",
        });
        setPreviewAvatar(
          initialData.img || initialData.anhDaiDien
            ? initialData.img ||
                `http://localhost:8080/uploads/${initialData.anhDaiDien}`
            : ""
        );
      } else {
        setFormData({
          hoTen: "",
          email: "",
          password: "",
          soDienThoai: "",
          chucVu: "",
          chuyenKhoa: "",
          kinhNghiem: "",
          role: "STAFF",
        });
        setPreviewAvatar("");
      }
      setAvatarFile(null);
    }
  }, [isOpen, initialData]);

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
    onSubmit(formData, avatarFile);
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
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    {isEdit ? "edit_note" : "person_add"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isEdit ? "Cập nhật Nhân viên" : "Thêm mới Nhân viên"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEdit
                      ? `Cập nhật thông tin hồ sơ #${initialData.nhanVienId}`
                      : "Tạo tài khoản và hồ sơ nhân sự mới"}
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
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-8">
                {/* Form Inputs - Dùng chung */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Avatar Upload - Đưa lên đầu hoặc để bên cạnh */}
                  <div className="md:col-span-2 flex items-center gap-6 mb-2">
                    <div className="relative group w-24 h-24 rounded-full border-4 border-slate-50 shadow-md overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={
                          previewAvatar ||
                          "https://placehold.co/150x150?text=Avatar"
                        }
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/150x150?text=Avatar";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className={labelClass}>Ảnh đại diện</label>
                      <div className="flex items-center gap-3">
                        <span
                          onClick={() =>
                            document.getElementById("emp-avatar-upload").click()
                          }
                          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer shadow-sm transition-colors"
                        >
                          Chọn ảnh...
                        </span>
                        <span className="text-xs text-slate-400 italic truncate max-w-[200px]">
                          {avatarFile ? avatarFile.name : "Chưa chọn tệp"}
                        </span>
                      </div>
                      <input
                        id="emp-avatar-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="hoTen"
                      className={inputClass}
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
                      type="email"
                      name="email"
                      className={inputClass}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
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
                      type="password"
                      name="password"
                      className={inputClass}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Số điện thoại</label>
                    <input
                      type="text"
                      name="soDienThoai"
                      className={inputClass}
                      value={formData.soDienThoai}
                      onChange={handleChange}
                      placeholder="09xx xxx xxx"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Chức vụ</label>
                    <input
                      type="text"
                      name="chucVu"
                      className={inputClass}
                      value={formData.chucVu}
                      onChange={handleChange}
                      placeholder="VD: Bác sĩ thú y"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Vai trò hệ thống</label>
                    <div className="relative">
                      <select
                        name="role"
                        className={`${inputClass} appearance-none`}
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="STAFF">Nhân viên (STAFF)</option>
                        <option value="DOCTOR">Bác sĩ (DOCTOR)</option>
                        <option value="SPA">Spa (SPA)</option>
                        <option value="ADMIN">Quản trị (ADMIN)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-xl">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={labelClass}>Chuyên khoa</label>
                        <input
                          type="text"
                          name="chuyenKhoa"
                          placeholder="VD: Nội khoa, Ngoại khoa..."
                          className={`${inputClass} bg-white`}
                          value={formData.chuyenKhoa}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Kinh nghiệm</label>
                        <input
                          type="text"
                          name="kinhNghiem"
                          placeholder="VD: 5 năm"
                          className={`${inputClass} bg-white`}
                          value={formData.kinhNghiem}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
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
                <span className="material-symbols-outlined text-xl">save</span>
                {isEdit ? "Lưu thay đổi" : "Tạo nhân viên"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmployeeFormModal;
