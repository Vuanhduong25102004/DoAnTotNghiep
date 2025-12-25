import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatCurrency,
  formatDate,
  StockBadge,
  getDiscountTypeLabel,
} from "../../../components/utils";
import useEscapeKey from "../../../../../hooks/useEscapeKey";

const PromotionDetailModal = ({ isOpen, onClose, promotion }) => {
  useEscapeKey(onClose, isOpen);

  return (
    <AnimatePresence>
      {isOpen && promotion && (
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
            className="w-full max-w-2xl bg-white rounded-2xl shadow-modal flex flex-col font-body mx-auto my-8"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                  Chi tiết Khuyến Mãi
                  {StockBadge(promotion.trangThai, promotion.ngayKetThuc)}
                </h1>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6 bg-white rounded-b-2xl">
              {/* Code & Discount Info */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                <p className="text-sm text-blue-600 mb-1 font-medium">
                  MÃ KHUYẾN MÃI
                </p>
                <p className="text-4xl font-black text-blue-800 tracking-widest">
                  {promotion.maCode}
                </p>
                <p className="mt-2 text-blue-700">
                  Giảm{" "}
                  <span className="font-bold">
                    {promotion.loaiGiamGia === "SO_TIEN"
                      ? formatCurrency(promotion.giaTriGiam)
                      : `${promotion.giaTriGiam}%`}
                  </span>{" "}
                  cho đơn từ {formatCurrency(promotion.donToiThieu)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Mô tả
                  </label>
                  <p className="text-gray-900 font-medium">
                    {promotion.moTa || "Không có mô tả"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Loại giảm giá
                  </label>
                  <p className="text-gray-900 font-medium">
                    {getDiscountTypeLabel(promotion.loaiGiamGia)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Số lượng giới hạn
                  </label>
                  <p className="text-gray-900 font-medium">
                    {promotion.soLuongGioiHan}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Thời gian hiệu lực
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formatDate(promotion.ngayBatDau)} - <br />
                    {formatDate(promotion.ngayKetThuc)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromotionDetailModal;
