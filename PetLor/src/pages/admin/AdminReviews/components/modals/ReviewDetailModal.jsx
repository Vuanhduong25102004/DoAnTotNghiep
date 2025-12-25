import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatDate,
  StarRating,
  getReviewTargetInfo,
} from "../../../components/utils";
import useEscapeKey from "../../../../../hooks/useEscapeKey";

const ReviewDetailModal = ({ isOpen, onClose, review, onReply }) => {
  useEscapeKey(onClose, isOpen);

  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (review) {
      setReplyText(review.phanHoi || "");
    }
  }, [review]);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    await onReply(review.danhGiaId, replyText);
    setIsSubmitting(false);
  };

  if (!review) return null;

  const target = getReviewTargetInfo(review);

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
            className="w-full max-w-2xl bg-white rounded-2xl shadow-modal flex flex-col font-body mx-auto my-8 overflow-hidden max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <h1 className="text-xl font-bold text-gray-900">
                Chi tiết Đánh giá
              </h1>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6 bg-white overflow-y-auto">
              {/* 1. Thông tin người dùng & Đối tượng */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {review.nguoiDung?.anhDaiDien ? (
                    <img
                      src={review.nguoiDung.anhDaiDien}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900">
                    {review.nguoiDung?.hoTen}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {review.nguoiDung?.email}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">Đánh giá cho:</span>
                    <span
                      className={`px-2 py-0.5 rounded ${target.badgeColor} font-medium`}
                    >
                      {target.type}
                    </span>
                    <span className="font-medium text-gray-700">
                      {target.name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">
                    {formatDate(review.ngayTao)}
                  </div>
                  {review.trangThai ? (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      Hiển thị
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      Đang ẩn
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Nội dung đánh giá */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {StarRating(review.soSao)}
                  <span className="text-sm font-medium text-gray-700">
                    ({review.soSao}/5)
                  </span>
                </div>
                <div className="text-gray-800 leading-relaxed bg-white p-4 border border-gray-100 rounded-xl shadow-sm">
                  {review.noiDung}
                </div>
                {/* Ảnh đánh giá (nếu có) */}
                {review.hinhAnh && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Hình ảnh đính kèm:
                    </p>
                    <img
                      src={review.hinhAnh}
                      alt="Review attachment"
                      className="h-32 w-auto rounded-lg border border-gray-200 object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* 3. Phản hồi của Admin */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">
                    support_agent
                  </span>
                  Phản hồi của Shop
                </h3>
                <div className="relative">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[120px] text-sm"
                    placeholder="Nhập nội dung phản hồi khách hàng tại đây..."
                  ></textarea>
                  <div className="absolute bottom-3 right-3">
                    {review.phanHoi ? (
                      <span className="text-xs text-green-600 font-medium mr-2">
                        Đã phản hồi trước đó
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all"
              >
                Đóng
              </button>
              <button
                onClick={handleSendReply}
                disabled={
                  isSubmitting ||
                  !replyText.trim() ||
                  replyText === review.phanHoi
                }
                className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex items-center gap-2"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
                <span className="material-symbols-outlined text-[18px]">
                  send
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewDetailModal;
