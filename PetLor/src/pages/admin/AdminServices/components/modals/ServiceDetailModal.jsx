import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, getImageUrl } from "../../../components/utils";

const ServiceDetailModal = ({ isOpen, onClose, service }) => {
  return (
    <AnimatePresence>
      {isOpen && service && (
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
            className="w-full max-w-3xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden font-body mx-auto my-8"
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
                    Chi tiết Dịch vụ #{service.dichVuId}
                  </h1>
                  <p className="text-sm text-text-body/70 mt-1 font-light">
                    Xem thông tin chi tiết dịch vụ
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
              <div className="space-y-8">
                <div className="input-group">
                  <label className="form-label block text-sm font-medium text-text-heading mb-2">
                    Tên dịch vụ
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body font-medium text-lg">
                    {service.tenDichVu}
                  </div>
                </div>
                <div className="input-group">
                  <label className="form-label block text-sm font-medium text-text-heading mb-2">
                    Mô tả
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body min-h-[80px]">
                    {service.moTa}
                  </div>
                </div>
                {service.hinhAnh && (
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Hình ảnh
                    </label>
                    <img
                      src={getImageUrl(service.hinhAnh)}
                      alt={service.tenDichVu}
                      className="mt-2 rounded-lg max-w-xs h-auto shadow-md border border-gray-200"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Giá dịch vụ
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body font-bold text-primary">
                      {formatCurrency(service.giaDichVu)}
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Thời lượng
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                      {service.thoiLuongUocTinhPhut} phút
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

export default ServiceDetailModal;
