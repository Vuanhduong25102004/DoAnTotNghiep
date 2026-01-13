import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, getImageUrl } from "../../../components/utils";

const ServiceDetailModal = ({ isOpen, onClose, service }) => {
  useEscapeKey(onClose, isOpen);

  // Style constants
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";
  const valueBoxClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium";

  return (
    <AnimatePresence>
      {isOpen && service && (
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
            className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    spa
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Chi tiết Dịch vụ{" "}
                    <span className="text-primary">#{service.dichVuId}</span>
                  </h2>
                  <p className="text-sm text-slate-500">
                    Xem thông tin chi tiết và bảng giá dịch vụ
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
              <div className="flex flex-col md:flex-row gap-8">
                {/* Cột Trái: Hình ảnh & Giá */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                  <div className="aspect-video w-full bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center shadow-sm group">
                    <img
                      src={getImageUrl(service.hinhAnh)}
                      alt={service.tenDichVu}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300?text=Service";
                      }}
                    />
                  </div>

                  <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 text-center space-y-1">
                    <span className="block text-xs font-bold text-teal-600 uppercase tracking-widest">
                      Giá dịch vụ
                    </span>
                    <span className="text-3xl font-extrabold text-primary">
                      {formatCurrency(service.giaDichVu)}
                    </span>
                  </div>
                </div>

                {/* Cột Phải: Thông tin chi tiết */}
                <div className="w-full md:w-2/3 space-y-6">
                  <div>
                    <label className={labelClass}>Tên dịch vụ</label>
                    <div className={`${valueBoxClass} text-lg text-slate-900`}>
                      {service.tenDichVu}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Thời lượng</label>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">
                          schedule
                        </span>
                        <span className="font-bold text-slate-700">
                          {service.thoiLuongUocTinhPhut} phút
                        </span>
                      </div>
                    </div>
                    {/* Có thể thêm Danh mục ở đây nếu có trong object service */}
                  </div>

                  <div>
                    <label className={labelClass}>Mô tả dịch vụ</label>
                    <div
                      className={`${valueBoxClass} min-h-[120px] bg-slate-50/50 leading-relaxed`}
                    >
                      {service.moTa || (
                        <span className="text-slate-400 italic">
                          Chưa có mô tả cho dịch vụ này.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="px-8 py-6 border-t border-slate-100 flex justify-end bg-slate-50/30 shrink-0">
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors bg-white border border-slate-200 shadow-sm"
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
