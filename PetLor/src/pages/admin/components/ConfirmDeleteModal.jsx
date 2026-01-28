import { createPortal } from "react-dom"; // 1. Import createPortal
import { motion, AnimatePresence } from "framer-motion";
import useEscapeKey from "../../../hooks/useEscapeKey";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.",
  confirmText = "Xóa",
  cancelText = "Hủy",
}) => {
  useEscapeKey(onClose, isOpen);

  // 2. Nội dung Modal
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // z-[9999] để đảm bảo nó luôn nằm trên cùng nhất (trên cả thanh Slide-over z-100)
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4 relative"
          >
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-4">
                <span className="material-symbols-outlined text-red-500 text-3xl">
                  warning
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full justify-center rounded-xl bg-gray-100 px-3 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all focus:outline-none"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex w-full justify-center rounded-xl bg-red-600 px-3 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-500 transition-all focus:outline-none"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // 3. Render Modal vào body thay vì vị trí hiện tại
  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default ConfirmDeleteModal;
