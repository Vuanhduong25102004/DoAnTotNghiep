import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { ORDER_STATUSES } from "../../../components/utils";

const OrderEditModal = ({
  isOpen,
  onClose,
  editingOrder,
  formData,
  setFormData,
  onSave,
}) => {
  return (
    <AnimatePresence>
      {isOpen && editingOrder && (
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
                    edit_note
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                    Cập nhật Đơn hàng #{editingOrder.donHangId}
                  </h1>
                  <p className="text-sm text-text-body/70 mt-1 font-light">
                    Chỉnh sửa trạng thái và địa chỉ giao hàng
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
                    Trạng thái đơn hàng
                  </label>
                  <select
                    className="form-control w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                    value={formData.trangThai}
                    onChange={(e) =>
                      setFormData({ ...formData, trangThai: e.target.value })
                    }
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="form-label block text-sm font-medium text-text-heading mb-2">
                    Địa chỉ giao hàng
                  </label>
                  <textarea
                    rows="3"
                    className="form-control w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                    value={formData.diaChi}
                    onChange={(e) =>
                      setFormData({ ...formData, diaChi: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
              >
                Hủy bỏ
              </button>
              <button
                onClick={onSave}
                className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 tracking-wide"
              >
                <span className="material-symbols-outlined text-[18px]">
                  save
                </span>
                Lưu thay đổi
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderEditModal;
