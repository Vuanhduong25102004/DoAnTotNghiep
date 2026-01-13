import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEscapeKey from "../../../../../hooks/useEscapeKey";

const VaccinationFormModal = ({
  isOpen,
  onClose,
  initialData,
  staffList,
  onSubmit,
}) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    thuCungId: "",
    tenThuCung: "",
    tenVacXin: "",
    ngayTiem: "",
    ngayTaiChung: "",
    nhanVienId: "",
    ghiChu: "",
    lichHenId: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          thuCungId: initialData.thuCungId || "",
          tenThuCung: initialData.tenThuCung || "",
          tenVacXin: initialData.tenVacXin || "",
          ngayTiem: initialData.ngayTiem
            ? initialData.ngayTiem.split("T")[0]
            : "",
          ngayTaiChung: initialData.ngayTaiChung
            ? initialData.ngayTaiChung.split("T")[0]
            : "",
          nhanVienId: initialData.nhanVienId || "",
          ghiChu: initialData.ghiChu || "",
          lichHenId: initialData.lichHenId || "",
        });
      } else {
        const today = new Date().toISOString().split("T")[0];
        setFormData({
          thuCungId: "",
          tenThuCung: "",
          tenVacXin: "",
          ngayTiem: today,
          ngayTaiChung: "",
          nhanVienId: "",
          ghiChu: "",
          lichHenId: "",
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
    if (!formData.tenThuCung || !formData.tenVacXin || !formData.ngayTiem) {
      alert("Vui lòng điền các thông tin bắt buộc!");
      return;
    }
    onSubmit(formData);
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
                    {isEdit ? "edit_note" : "vaccines"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isEdit ? "Cập nhật Hồ sơ Tiêm" : "Ghi Hồ sơ Tiêm Chủng"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEdit
                      ? `Chỉnh sửa thông tin tiêm chủng #${initialData.tiemChungId}`
                      : "Ghi lại thông tin tiêm phòng và lịch tái chủng"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {/* CỘT TRÁI: Thông tin cơ bản */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary bg-teal-50 p-1.5 rounded-lg text-xl">
                      pets
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Thông tin Cơ bản
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className={labelClass}>ID Thú cưng</label>
                      <input
                        type="number"
                        name="thuCungId"
                        value={formData.thuCungId}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="ID"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClass}>
                        Tên Thú cưng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="tenThuCung"
                        value={formData.tenThuCung}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Tên bé"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Tên Vắc xin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tenVacXin"
                      value={formData.tenVacXin}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="VD: Vắc xin 4 bệnh (Mèo)"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Bác sĩ thực hiện</label>
                    <div className="relative">
                      <select
                        name="nhanVienId"
                        value={formData.nhanVienId}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none`}
                      >
                        <option value="">-- Chọn bác sĩ --</option>
                        {staffList &&
                          staffList.map((staff) => (
                            <option
                              key={staff.nhanVienId}
                              value={staff.nhanVienId}
                            >
                              {staff.hoTen}
                            </option>
                          ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-xl">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* CỘT PHẢI: Lịch trình & Ghi chú */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-1.5 rounded-lg text-xl">
                      calendar_month
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Lịch trình & Ghi chú
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        Ngày tiêm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="ngayTiem"
                        value={formData.ngayTiem}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Ngày tái chủng</label>
                      <input
                        type="date"
                        name="ngayTaiChung"
                        value={formData.ngayTaiChung}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Mã Lịch hẹn (Nếu có)</label>
                    <input
                      type="number"
                      name="lichHenId"
                      value={formData.lichHenId}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Nhập ID lịch hẹn gốc"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Ghi chú / Phản ứng</label>
                    <textarea
                      name="ghiChu"
                      value={formData.ghiChu}
                      onChange={handleChange}
                      className={`${inputClass} resize-none`}
                      rows="3"
                      placeholder="Ghi chú về sức khỏe sau tiêm..."
                    />
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
                Lưu hồ sơ
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VaccinationFormModal;
