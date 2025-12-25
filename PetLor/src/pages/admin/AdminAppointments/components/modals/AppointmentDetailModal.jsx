import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, AppointmentStatusBadge } from "../../../components/utils";
import useEscapeKey from "../../../../../hooks/useEscapeKey";

const AppointmentDetailModal = ({ isOpen, onClose, appointment }) => {
  // Sử dụng custom hook để đóng modal khi nhấn phím Escape
  useEscapeKey(onClose, isOpen);

  return (
    <AnimatePresence>
      {isOpen && appointment && (
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
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-5xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden font-body mx-auto my-8"
          >
            {/* Header */}
            <div className="px-10 py-6 border-b border-border-light/50 flex justify-between items-center bg-white sticky top-0 z-20 backdrop-blur-sm bg-white/95">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-surface border border-border-light flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">
                    visibility
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                    Chi tiết Lịch hẹn #{appointment.lichHenId}
                  </h1>
                  <p className="text-sm text-text-body/70 mt-1 font-light">
                    Xem thông tin chi tiết của lịch hẹn
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-text-heading hover:bg-surface transition-all duration-300"
              >
                <span className="material-symbols-outlined font-light">
                  close
                </span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-8 md:p-10 bg-white overflow-y-auto">
              <div className="space-y-12 max-w-4xl mx-auto">
                {/* Thông tin chung */}
                <div className="pb-8 border-b border-border-light">
                  <div className="section-header flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary font-light text-2xl">
                      event_note
                    </span>
                    <h2 className="text-lg font-semibold text-text-heading">
                      Thông tin Lịch hẹn
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Dịch vụ
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                        {appointment.tenDichVu}
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Thời gian
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                        {formatDate(appointment.thoiGianBatDau)}
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Nhân viên phụ trách
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                        {appointment.tenNhanVien || "Chưa gán"}
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Trạng thái
                      </label>
                      <div className="mt-1">
                        {AppointmentStatusBadge(appointment.trangThai)}
                      </div>
                    </div>
                    {appointment.ghiChuKhachHang && (
                      <div className="input-group md:col-span-2">
                        <label className="form-label block text-sm font-medium text-text-heading mb-2">
                          Ghi chú của khách hàng
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                          {appointment.ghiChuKhachHang}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Khách hàng & Thú cưng */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="flex flex-col h-full">
                    <div className="section-header flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-blue-400 font-light text-2xl">
                        person_outline
                      </span>
                      <h2 className="text-lg font-semibold text-text-heading">
                        Khách hàng
                      </h2>
                    </div>
                    <div className="space-y-6">
                      <div className="input-group">
                        <label className="form-label block text-sm font-medium text-text-heading mb-2">
                          Họ và tên
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                          {appointment.tenKhachHang}
                        </div>
                      </div>
                      {appointment.soDienThoaiKhachHang && (
                        <div className="input-group">
                          <label className="form-label block text-sm font-medium text-text-heading mb-2">
                            Số điện thoại
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                            {appointment.soDienThoaiKhachHang}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col h-full">
                    <div className="section-header flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-orange-400 font-light text-2xl">
                        pets
                      </span>
                      <h2 className="text-lg font-semibold text-text-heading">
                        Thú cưng
                      </h2>
                    </div>
                    <div className="space-y-6">
                      <div className="input-group">
                        <label className="form-label block text-sm font-medium text-text-heading mb-2">
                          Tên thú cưng
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                          {appointment.tenThuCung || "Không có thông tin"}
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
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
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
