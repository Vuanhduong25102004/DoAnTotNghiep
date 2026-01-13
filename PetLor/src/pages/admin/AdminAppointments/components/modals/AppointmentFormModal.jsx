import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_STATUS_MAP,
} from "../../../components/utils";
import useEscapeKey from "../../../../../hooks/useEscapeKey";

const AppointmentFormModal = ({
  isOpen,
  onClose,
  initialData, // null = Create, object = Edit
  servicesList,
  staffList,
  onSubmit,
}) => {
  const isEdit = !!initialData;

  // State form
  const [formData, setFormData] = useState({
    dichVuId: "",
    nhanVienId: "",
    tenKhachHang: "",
    soDienThoaiKhachHang: "",
    tenThuCung: "",
    chungLoai: "", // Chó, Mèo...
    giongLoai: "", // Poodle, Husky...
    gioiTinh: "",
    ngaySinh: "",
    ghiChu: "",
    date: "", // Tách ngày từ thoiGianBatDau
    time: "", // Tách giờ từ thoiGianBatDau
    trangThai: "CHO_XAC_NHAN",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // --- CHẾ ĐỘ EDIT ---
        const dateTime = initialData.thoiGianBatDau || "";
        const [datePart, timePart] = dateTime.split("T");

        setFormData({
          dichVuId:
            initialData.dichVuId ||
            (initialData.dichVu ? initialData.dichVu.id : "") ||
            "",
          nhanVienId: initialData.nhanVienId || "",
          tenKhachHang: initialData.tenKhachHang || "",
          soDienThoaiKhachHang: initialData.soDienThoaiKhachHang || "",
          tenThuCung: initialData.tenThuCung || "",
          chungLoai: initialData.chungLoai || "",
          giongLoai: initialData.giongLoai || "",
          gioiTinh: initialData.gioiTinh || "",
          ngaySinh: initialData.ngaySinh
            ? initialData.ngaySinh.split("T")[0]
            : "",
          ghiChu: initialData.ghiChuKhachHang || initialData.ghiChu || "",
          date: datePart || "",
          time: timePart ? timePart.slice(0, 5) : "",
          trangThai: initialData.trangThai || "CHỜ XÁC NHẬN",
        });
      } else {
        // --- CHẾ ĐỘ CREATE ---
        const today = new Date().toISOString().split("T")[0];
        setFormData({
          dichVuId: "",
          nhanVienId: "",
          tenKhachHang: "",
          soDienThoaiKhachHang: "",
          tenThuCung: "",
          chungLoai: "",
          giongLoai: "",
          gioiTinh: "",
          ngaySinh: "",
          ghiChu: "",
          date: today,
          time: "08:00",
          trangThai: "CHO_XAC_NHAN",
        });
      }
    }
  }, [isOpen, initialData]);

  useEscapeKey(onClose, isOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const combinedDateTime = `${formData.date}T${formData.time}:00`;
    const submitData = {
      ...formData,
      thoiGianBatDau: combinedDateTime,
    };
    onSubmit(submitData);
  };

  // Class style chung cho input để code gọn hơn
  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium focus:ring-0 transition-all focus:border-primary outline-none";
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
                    {isEdit ? "edit_calendar" : "calendar_add_on"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isEdit ? (
                      <>
                        Cập nhật Lịch hẹn{" "}
                        <span className="text-primary">
                          #{initialData?.lichHenId}
                        </span>
                      </>
                    ) : (
                      "Tạo Lịch Hẹn Mới"
                    )}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEdit
                      ? "Thay đổi thông tin hoặc trạng thái lịch hẹn"
                      : "Điền thông tin chi tiết cho cuộc hẹn"}
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

            {/* --- BODY (Scrollable) --- */}
            <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar flex-1">
              {/* SECTION 1: THÔNG TIN LỊCH HẸN */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary bg-teal-50 p-1.5 rounded-lg text-xl">
                    calendar_month
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Thông tin Lịch hẹn
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      Dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="dichVuId"
                      value={formData.dichVuId}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="" disabled>
                        Chọn dịch vụ...
                      </option>
                      {servicesList.map((s) => (
                        <option
                          key={s.dichVuId || s.id}
                          value={s.dichVuId || s.id}
                        >
                          {s.tenDichVu}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Nhân viên phụ trách</label>
                    <select
                      name="nhanVienId"
                      value={formData.nhanVienId}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">-- Tự động / Chưa chọn --</option>
                      {staffList.map((s) => (
                        <option key={s.nhanVienId} value={s.nhanVienId}>
                          {s.hoTen} ({s.chucVu})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Ngày hẹn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Giờ hẹn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  {isEdit && (
                    <div className="md:col-span-2">
                      <label className={labelClass}>Trạng thái</label>
                      <select
                        name="trangThai"
                        value={formData.trangThai}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        {APPOINTMENT_STATUSES.map((statusKey) => (
                          <option key={statusKey} value={statusKey}>
                            {APPOINTMENT_STATUS_MAP[statusKey]}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </section>

              <div className="h-px bg-slate-100 w-full"></div>

              {/* GRID: KHÁCH HÀNG & THÚ CƯNG */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* SECTION 2: KHÁCH HÀNG */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary bg-teal-50 p-1.5 rounded-lg text-xl">
                      person
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Thông tin Khách hàng
                    </h3>
                  </div>
                  <div className="space-y-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div>
                      <label className={labelClass}>
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="tenKhachHang"
                        value={formData.tenKhachHang}
                        onChange={handleChange}
                        className={`${inputClass} bg-white border-slate-200 py-2.5`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="soDienThoaiKhachHang"
                        value={formData.soDienThoaiKhachHang}
                        onChange={handleChange}
                        className={`${inputClass} bg-white border-slate-200 py-2.5`}
                        placeholder="09xx xxx xxx"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Ghi chú</label>
                      <textarea
                        name="ghiChu"
                        value={formData.ghiChu}
                        onChange={handleChange}
                        className={`${inputClass} bg-white border-slate-200 py-2.5 resize-none`}
                        rows="3"
                        placeholder="Ghi chú thêm..."
                      ></textarea>
                    </div>
                  </div>
                </section>

                {/* SECTION 3: THÚ CƯNG */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-1.5 rounded-lg text-xl">
                      pets
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Thông tin Thú cưng
                    </h3>
                  </div>
                  <div className="space-y-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div>
                      <label className={labelClass}>Tên thú cưng</label>
                      <input
                        type="text"
                        name="tenThuCung"
                        value={formData.tenThuCung}
                        onChange={handleChange}
                        className={`${inputClass} bg-white border-slate-200 py-2.5`}
                        placeholder="Tên bé"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Chủng loại</label>
                        <select
                          name="chungLoai"
                          value={formData.chungLoai}
                          onChange={handleChange}
                          className={`${inputClass} bg-white border-slate-200 py-2.5`}
                        >
                          <option value="">-- Chọn --</option>
                          <option value="Chó">Chó</option>
                          <option value="Mèo">Mèo</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Giới tính</label>
                        <select
                          name="gioiTinh"
                          value={formData.gioiTinh}
                          onChange={handleChange}
                          className={`${inputClass} bg-white border-slate-200 py-2.5`}
                        >
                          <option value="">-- Chọn --</option>
                          <option value="Đực">Đực</option>
                          <option value="Cái">Cái</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Giống loài</label>
                      <input
                        type="text"
                        name="giongLoai"
                        value={formData.giongLoai}
                        onChange={handleChange}
                        className={`${inputClass} bg-white border-slate-200 py-2.5`}
                        placeholder="VD: Poodle"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Ngày sinh</label>
                      <input
                        type="date"
                        name="ngaySinh"
                        value={formData.ngaySinh}
                        onChange={handleChange}
                        className={`${inputClass} bg-white border-slate-200 py-2.5`}
                      />
                    </div>
                  </div>
                </section>
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
                {isEdit ? "Lưu thay đổi" : "Tạo lịch hẹn"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentFormModal;
