import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatCurrency,
  AppointmentStatusBadge,
  formatTimeRange, // 1. Import hàm mới từ utils
} from "../../../components/utils";
import useEscapeKey from "../../../../../hooks/useEscapeKey";

const AppointmentDetailModal = ({ isOpen, onClose, appointment }) => {
  useEscapeKey(onClose, isOpen);

  // (Đã xóa hàm formatTimeRange cục bộ ở đây)

  return (
    <AnimatePresence>
      {isOpen && appointment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">
                    visibility
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Chi tiết Lịch hẹn #{appointment.lichHenId}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Xem thông tin chi tiết của lịch hẹn
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8 overflow-y-auto bg-white">
              {/* Section 1: Thông tin chung */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">
                    calendar_today
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">
                    Thông tin Lịch hẹn
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dịch vụ */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Dịch vụ
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium">
                      {appointment.tenDichVu}
                    </div>
                  </div>

                  {/* Giá dịch vụ */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Giá dịch vụ
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-primary font-bold">
                      {formatCurrency(appointment.giaDichVu)}
                    </div>
                  </div>

                  {/* Thời gian (SỬ DỤNG HÀM TỪ UTILS) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Thời gian
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium">
                      {formatTimeRange(
                        appointment.thoiGianBatDau,
                        appointment.thoiGianKetThuc
                      )}
                    </div>
                  </div>

                  {/* Nhân viên */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Nhân viên phụ trách
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium">
                      {appointment.tenNhanVien || "Chưa gán"}
                    </div>
                  </div>

                  {/* Trạng thái (Cột trái) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Trạng thái
                    </label>
                    {/* Dùng h-full và items-center để căn giữa dọc badge nếu bên kia cao hơn */}
                    <div className="flex items-center h-[48px]">
                      <AppointmentStatusBadge
                        status={appointment.trangThaiLichHen}
                      />
                    </div>
                  </div>

                  {/* Lý do hủy (Cột phải) - Đã xóa md:col-span-2 để nằm ngang hàng */}
                  {appointment.lyDoHuy && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-red-400 uppercase tracking-widest ml-1">
                        Lý do hủy lịch
                      </label>
                      <div className="w-full px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-red-700 font-medium">
                        {appointment.lyDoHuy}
                      </div>
                    </div>
                  )}

                  {/* Ghi chú khách hàng */}
                  {appointment.ghiChuKhachHang && (
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Ghi chú của khách hàng
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium min-h-[80px]">
                        {appointment.ghiChuKhachHang}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-gray-100 w-full"></div>

              {/* Section 2: Khách hàng & Thú cưng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Khách hàng */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      person
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">
                      Khách hàng
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Họ và tên
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium">
                        {appointment.tenKhachHang}
                      </div>
                    </div>
                    {appointment.soDienThoaiKhachHang && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                          Số điện thoại
                        </label>
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium">
                          {appointment.soDienThoaiKhachHang}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Thú cưng */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      pets
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">
                      Thú cưng
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Tên thú cưng
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-700 font-medium">
                        {appointment.tenThuCung || "Không có thông tin"}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-gray-100 flex justify-end bg-white sticky bottom-0 z-10">
              <button
                onClick={onClose}
                className="px-10 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 transition-all transform hover:-translate-y-0.5"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentDetailModal;
