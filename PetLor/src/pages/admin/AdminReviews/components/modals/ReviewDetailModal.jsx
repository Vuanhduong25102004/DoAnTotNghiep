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

  // Shared Styles
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";
  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium focus:ring-0 transition-all focus:border-primary outline-none placeholder:text-slate-400";

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
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600 border border-yellow-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    rate_review
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Chi tiết Đánh giá
                  </h2>
                  <p className="text-sm text-slate-500">
                    Xem nội dung và phản hồi khách hàng
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
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {/* 1. Thông tin người dùng & Đối tượng */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-white border border-slate-200 shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {review.nguoiDung?.anhDaiDien ? (
                    <img
                      src={review.nguoiDung.anhDaiDien}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-slate-300 text-2xl">
                      person
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {review.nguoiDung?.hoTen || "Khách hàng ẩn danh"}
                      </h3>
                      <p className="text-xs text-slate-500 mb-2">
                        {review.nguoiDung?.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 block mb-1">
                        {formatDate(review.ngayTao)}
                      </span>
                      {review.trangThai ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">
                          Hiển thị
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-200 text-slate-600">
                          Đang ẩn
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm bg-white px-3 py-1.5 rounded-lg border border-slate-100 w-fit shadow-sm">
                    <span className="text-slate-400 text-xs uppercase font-bold">
                      Mục tiêu:
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${target.badgeColor}`}
                    >
                      {target.type}
                    </span>
                    <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                      {target.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Nội dung đánh giá */}
              <div>
                <label className={labelClass}>Nội dung đánh giá</label>
                <div className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    {StarRating(review.soSao)}
                    <span className="text-sm font-bold text-slate-700">
                      ({review.soSao}/5)
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-sm">
                    {review.noiDung}
                  </p>

                  {/* Ảnh đánh giá */}
                  {review.hinhAnh && (
                    <div className="mt-3 pt-3 border-t border-slate-50">
                      <p className={labelClass}>Hình ảnh đính kèm</p>
                      <img
                        src={review.hinhAnh}
                        alt="Review attachment"
                        className="h-32 w-auto rounded-xl border border-slate-200 object-cover hover:scale-105 transition-transform cursor-pointer shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Phản hồi của Admin */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Phản hồi của Shop</label>
                  {review.phanHoi && (
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      Đã phản hồi
                    </span>
                  )}
                </div>
                <div className="relative">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className={`${inputClass} min-h-[120px] resize-none`}
                    placeholder="Nhập nội dung phản hồi khách hàng tại đây..."
                  ></textarea>
                  <div className="absolute bottom-3 right-3 text-slate-300">
                    <span className="material-symbols-outlined text-xl">
                      support_agent
                    </span>
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
                Đóng
              </button>
              <button
                onClick={handleSendReply}
                disabled={
                  isSubmitting ||
                  !replyText.trim() ||
                  replyText === review.phanHoi
                }
                className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewDetailModal;
