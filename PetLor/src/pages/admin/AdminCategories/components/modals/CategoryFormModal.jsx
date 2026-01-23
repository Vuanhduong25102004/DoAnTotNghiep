import React, { useEffect, useState } from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey"; // Kiểm tra lại đường dẫn hook này
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import categoryService from "../../../../../services/categoryService"; // Kiểm tra đường dẫn service

const CategoryFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData, // Dữ liệu để sửa (nếu có)
  categoryType, // "PRODUCT", "SERVICE", "POST"
  placeholder,
}) => {
  useEscapeKey(onClose, isOpen);

  // State form nội bộ
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Style constants
  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium focus:ring-0 transition-all focus:border-primary outline-none placeholder:text-slate-400";
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";

  // EFFECT: Load dữ liệu khi mở modal (nếu đang sửa)
  useEffect(() => {
    if (initialData) {
      // Nếu có dữ liệu cũ (Sửa), fill vào form
      setFormData({
        name: initialData.name || "", // Dữ liệu đã chuẩn hóa từ index.jsx
        description: initialData.description || "",
      });
    } else {
      // Nếu không (Thêm mới), reset form
      setFormData({ name: "", description: "" });
    }
  }, [initialData, isOpen]);

  // HANDLE: Lưu dữ liệu
  const handleSave = async () => {
    // Validate cơ bản
    if (!formData.name.trim()) {
      toast.warning("Vui lòng nhập tên danh mục!");
      return;
    }

    setIsSubmitting(true);
    try {
      // --- MAP DỮ LIỆU NGƯỢC LẠI CHO BACKEND ---
      // Vì backend Spring Boot yêu cầu đúng tên trường (tenDanhMuc vs tenDanhMucDv)
      let payload = {
        type: categoryType, // Để service chọn đúng API URL
      };

      if (categoryType === "SERVICE") {
        // Dịch vụ dùng 'tenDanhMucDv'
        payload.tenDanhMucDv = formData.name;
        payload.moTa = formData.description;
      } else {
        // Sản phẩm (và mặc định) dùng 'tenDanhMuc'
        payload.tenDanhMuc = formData.name;
        payload.moTa = formData.description;
      }

      // Gọi API
      if (initialData && initialData.id) {
        await categoryService.update(initialData.id, payload);
      } else {
        await categoryService.create(payload);
      }

      // Thành công
      onSuccess();
    } catch (error) {
      console.error("Lỗi lưu danh mục:", error);
      toast.error("Thao tác thất bại! Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-2xl">
                    {initialData ? "edit_note" : "library_add"}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {initialData ? "Cập nhật Danh mục" : "Thêm Danh Mục Mới"}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {categoryType === "PRODUCT"
                      ? "Sản phẩm"
                      : categoryType === "SERVICE"
                        ? "Dịch vụ"
                        : "Bài viết"}
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
            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              {/* Tên danh mục */}
              <div>
                <label className={labelClass}>
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  // Sử dụng state nội bộ của Modal (formData.name), không dùng props cũ
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={placeholder || "Nhập tên danh mục..."}
                  autoFocus
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className={labelClass}>Mô tả</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows="4"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
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
                  Đảm bảo tên danh mục ngắn gọn, dễ hiểu. Đối với Dịch vụ, hãy
                  mô tả quy trình cơ bản trong phần mô tả.
                </p>
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="p-6 border-t border-slate-100 flex justify-end items-center gap-4 bg-slate-50/30 shrink-0">
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 font-bold text-sm px-4 py-2 transition-colors"
                disabled={isSubmitting}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin text-xl">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-xl">
                    save
                  </span>
                )}
                {initialData ? "Lưu thay đổi" : "Tạo danh mục"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryFormModal;
