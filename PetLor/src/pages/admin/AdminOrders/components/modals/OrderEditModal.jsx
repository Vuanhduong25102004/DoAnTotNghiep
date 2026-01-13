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
  useEscapeKey(onClose, isOpen);

  // Shared Styles
  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium focus:ring-0 transition-all focus:border-primary outline-none";
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";

  return (
    <AnimatePresence>
      {isOpen && editingOrder && (
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
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    edit_note
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Cập nhật Đơn hàng
                  </h2>
                  <p className="text-sm text-slate-500">
                    Chỉnh sửa trạng thái và địa chỉ giao hàng cho{" "}
                    <span className="font-semibold text-primary">
                      #{editingOrder.donHangId}
                    </span>
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
              <div className="space-y-6">
                {/* Trạng thái */}
                <div>
                  <label className={labelClass}>Trạng thái đơn hàng</label>
                  <div className="relative">
                    <select
                      className={`${inputClass} appearance-none`}
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
                    {/* Mũi tên tùy chỉnh cho đẹp nếu muốn, hoặc dùng default */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-xl">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className={labelClass}>Địa chỉ giao hàng</label>
                  <textarea
                    rows="4"
                    className={`${inputClass} resize-none`}
                    value={formData.diaChi}
                    onChange={(e) =>
                      setFormData({ ...formData, diaChi: e.target.value })
                    }
                    placeholder="Nhập địa chỉ giao hàng mới..."
                  ></textarea>
                </div>
              </div>

              {/* Tips / Note nhỏ */}
              <div className="flex items-start gap-3 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                <span className="material-symbols-outlined text-orange-400 text-xl mt-0.5">
                  warning
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Lưu ý: Việc thay đổi trạng thái đơn hàng có thể gửi thông báo
                  tự động đến khách hàng. Hãy kiểm tra kỹ trước khi lưu.
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
