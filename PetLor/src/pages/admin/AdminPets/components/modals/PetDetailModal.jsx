import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculateAge,
  formatDate,
  getImageUrl,
} from "../../../components/utils";

const PetDetailModal = ({ isOpen, onClose, pet }) => {
  return (
    <AnimatePresence>
      {isOpen && pet && (
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
                    visibility
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                    Chi tiết Thú cưng #{pet.thuCungId}
                  </h1>
                  <p className="text-sm text-text-body/70 mt-1 font-light">
                    Xem thông tin chi tiết hồ sơ
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
                <div className="flex justify-center mb-8">
                  <img
                    src={getImageUrl(pet.img)}
                    alt={pet.tenThuCung}
                    className="h-40 w-40 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=Pet";
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Tên thú cưng
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body font-medium">
                      {pet.tenThuCung}
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Chủ nuôi
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                      {pet.ownerName}{" "}
                      <span className="text-xs text-gray-500 ml-2">
                        (ID: #{pet.ownerId})
                      </span>
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Chủng loại
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                      {pet.chungLoai}
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Giống
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                      {pet.giongLoai}
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Giới tính
                    </label>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          pet.gioiTinh === "Đực"
                            ? "bg-blue-100 text-blue-800"
                            : pet.gioiTinh === "Cái"
                            ? "bg-pink-100 text-pink-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pet.gioiTinh}
                      </span>
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Ngày sinh / Tuổi
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                      {formatDate(pet.ngaySinh)} ({calculateAge(pet.ngaySinh)})
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2 input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Ghi chú sức khỏe
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body min-h-[80px]">
                      {pet.ghiChuSucKhoe}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
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

export default PetDetailModal;
