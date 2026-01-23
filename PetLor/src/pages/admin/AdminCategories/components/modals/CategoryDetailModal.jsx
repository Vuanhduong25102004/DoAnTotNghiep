import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";

const CategoryDetailModal = ({ isOpen, onClose, category }) => {
  useEscapeKey(onClose, isOpen);

  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";
  const valueBoxClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium";

  return (
    <AnimatePresence>
      {isOpen && category && (
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
            {/* HEADER */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-2xl">
                    visibility
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Chi tiết Danh mục{" "}
                    <span className="text-primary">#{category.id}</span>
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* BODY */}
            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              <div>
                <label className={labelClass}>Tên danh mục</label>
                <div className={`${valueBoxClass} text-lg text-slate-900`}>
                  {category.name} {/* Đã chuẩn hóa */}
                </div>
              </div>

              <div>
                <label className={labelClass}>Mô tả</label>
                <div
                  className={`${valueBoxClass} min-h-[100px] bg-slate-50/50`}
                >
                  {category.description ? (
                    <span className="leading-relaxed">
                      {category.description}
                    </span> // Đã chuẩn hóa
                  ) : (
                    <span className="text-slate-400 italic">
                      Không có mô tả.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-8 py-6 border-t border-slate-100 flex justify-end bg-slate-50/30 shrink-0">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors bg-white border border-slate-200 shadow-sm"
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

export default CategoryDetailModal;
