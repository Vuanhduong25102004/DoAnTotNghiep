import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";

const CategoryFormModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  isEditing,
  onSave,
}) => {
  useEscapeKey(onClose, isOpen);

  // Style constants (Design System)
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
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    {isEditing ? "edit_note" : "library_add"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isEditing ? "Cập nhật Danh mục" : "Thêm Danh Mục Mới"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEditing
                      ? "Chỉnh sửa thông tin và mô tả danh mục"
                      : "Điền thông tin để tạo danh mục sản phẩm mới"}
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
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
              {/* Tên danh mục */}
              <div>
                <label className={labelClass}>
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.tenDanhMuc}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tenDanhMuc: e.target.value,
                    })
                  }
                  placeholder="Ví dụ: Thức ăn cho mèo, Đồ chơi..."
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className={labelClass}>Mô tả</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows="5"
                  value={formData.moTa}
                  onChange={(e) =>
                    setFormData({ ...formData, moTa: e.target.value })
                  }
                  placeholder="Mô tả chi tiết về danh mục này..."
                ></textarea>
              </div>

              {/* Hint */}
              <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <span className="material-symbols-outlined text-blue-400 text-xl mt-0.5">
                  info
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Danh mục giúp phân loại sản phẩm để khách hàng dễ dàng tìm
                  kiếm hơn. Hãy đặt tên ngắn gọn và mô tả đầy đủ.
                </p>
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
                onClick={onSave}
                className="flex items-center gap-2 px-10 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">save</span>
                {isEditing ? "Lưu thay đổi" : "Tạo danh mục"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryFormModal;
