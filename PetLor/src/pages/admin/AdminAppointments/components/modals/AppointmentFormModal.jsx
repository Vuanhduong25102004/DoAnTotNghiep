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
        // --- CHẾ ĐỘ EDIT: Điền dữ liệu cũ ---
        // Tách chuỗi ISO "2023-10-25T09:00:00" thành ngày và giờ riêng
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
            : "", // Lấy YYYY-MM-DD
          ghiChu: initialData.ghiChuKhachHang || initialData.ghiChu || "",
          date: datePart || "",
          time: timePart ? timePart.slice(0, 5) : "", // HH:mm
          trangThai: initialData.trangThai || "CHỜ XÁC NHẬN",
        });
      } else {
        // --- CHẾ ĐỘ CREATE: Reset form ---
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

  // Sử dụng custom hook để đóng modal khi nhấn phím Escape
  useEscapeKey(onClose, isOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Kết hợp ngày và giờ thành chuỗi ISO/datetime
    const combinedDateTime = `${formData.date}T${formData.time}:00`;

    // Gửi data đã xử lý ra ngoài
    const submitData = {
      ...formData,
      thoiGianBatDau: combinedDateTime,
    };

    onSubmit(submitData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-5xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden font-body mx-auto my-8"
          >
            {/* Header */}
            <div className="px-10 py-6 border-b border-border-light/50 flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-surface border border-border-light flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">
                    {isEdit ? "edit_calendar" : "add_circle"}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text-heading">
                    {isEdit
                      ? `Cập nhật Lịch hẹn #${initialData.lichHenId}`
                      : "Tạo Lịch Hẹn Mới"}
                  </h1>
                  <p className="text-sm text-text-body/70 mt-1 font-light">
                    {isEdit
                      ? "Thay đổi thông tin hoặc trạng thái lịch hẹn"
                      : "Điền thông tin chi tiết cho cuộc hẹn"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface transition-all"
              >
                <span className="material-symbols-outlined font-light">
                  close
                </span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-8 md:p-10 bg-white overflow-y-auto">
              <div className="space-y-12 max-w-4xl mx-auto">
                {/* Phần 1: Thông tin lịch hẹn & Dịch vụ */}
                <div className="pb-8 border-b border-border-light">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary font-light text-2xl">
                      event_note
                    </span>
                    <h2 className="text-lg font-semibold text-text-heading">
                      Thông tin Lịch hẹn
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="input-group">
                      <label className="form-label">
                        Dịch vụ <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="dichVuId"
                        className="form-control"
                        value={formData.dichVuId}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Chọn loại dịch vụ...
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

                    <div className="input-group">
                      <label className="form-label">Nhân viên phụ trách</label>
                      <select
                        name="nhanVienId"
                        className="form-control"
                        value={formData.nhanVienId}
                        onChange={handleChange}
                      >
                        <option value="">-- Tự động chỉ định --</option>
                        {staffList.map((s) => (
                          <option key={s.nhanVienId} value={s.nhanVienId}>
                            {s.hoTen} ({s.chucVu})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="form-label">
                        Ngày hẹn <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={formData.date}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="input-group">
                      <label className="form-label">
                        Giờ hẹn <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="time"
                        className="form-control"
                        value={formData.time}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Chỉ hiển thị Status khi Edit */}
                    {isEdit && (
                      <div className="input-group md:col-span-2">
                        <label className="form-label">Trạng thái</label>
                        <select
                          name="trangThai"
                          className="form-control"
                          value={formData.trangThai}
                          onChange={handleChange}
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Phần 2: Khách hàng */}
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-blue-400 font-light text-2xl">
                        person_outline
                      </span>
                      <h2 className="text-lg font-semibold text-text-heading">
                        Thông tin Khách hàng
                      </h2>
                    </div>
                    <div className="space-y-6">
                      <div className="input-group">
                        <label className="form-label">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="tenKhachHang"
                          className="form-control"
                          value={formData.tenKhachHang}
                          onChange={handleChange}
                          placeholder="Nhập tên khách hàng"
                        />
                      </div>
                      <div className="input-group">
                        <label className="form-label">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="soDienThoaiKhachHang"
                          className="form-control"
                          value={formData.soDienThoaiKhachHang}
                          onChange={handleChange}
                          placeholder="09xx xxx xxx"
                        />
                      </div>
                      <div className="input-group">
                        <label className="form-label">Ghi chú</label>
                        <textarea
                          name="ghiChu"
                          className="form-control h-20"
                          value={formData.ghiChu}
                          onChange={handleChange}
                          placeholder="Ghi chú thêm..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Phần 3: Thú cưng */}
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-orange-400 font-light text-2xl">
                        pets
                      </span>
                      <h2 className="text-lg font-semibold text-text-heading">
                        Thông tin Thú cưng
                      </h2>
                    </div>
                    <div className="space-y-6">
                      <div className="input-group">
                        <label className="form-label">Tên thú cưng</label>
                        <input
                          type="text"
                          name="tenThuCung"
                          className="form-control"
                          value={formData.tenThuCung}
                          onChange={handleChange}
                          placeholder="Tên bé"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                          <label className="form-label">Chủng loại</label>
                          <select
                            name="chungLoai"
                            className="form-control"
                            value={formData.chungLoai}
                            onChange={handleChange}
                          >
                            <option value="">-- Chọn --</option>
                            <option value="Chó">Chó</option>
                            <option value="Mèo">Mèo</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </div>
                        <div className="input-group">
                          <label className="form-label">Giới tính</label>
                          <select
                            name="gioiTinh"
                            className="form-control"
                            value={formData.gioiTinh}
                            onChange={handleChange}
                          >
                            <option value="">-- Chọn --</option>
                            <option value="Đực">Đực</option>
                            <option value="Cái">Cái</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                          <label className="form-label">Giống loài</label>
                          <input
                            type="text"
                            name="giongLoai"
                            className="form-control"
                            value={formData.giongLoai}
                            onChange={handleChange}
                            placeholder="VD: Poodle"
                          />
                        </div>
                        <div className="input-group">
                          <label className="form-label">Ngày sinh</label>
                          <input
                            type="date"
                            name="ngaySinh"
                            className="form-control"
                            value={formData.ngaySinh}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface border border-transparent hover:border-border-light transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-lg flex items-center gap-2 transition-all hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isEdit ? "save" : "check"}
                </span>
                {isEdit ? "Lưu thay đổi" : "Tạo Lịch Hẹn"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentFormModal;
