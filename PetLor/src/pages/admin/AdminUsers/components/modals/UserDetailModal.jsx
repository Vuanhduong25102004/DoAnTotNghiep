import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, RoleBadge } from "../../../components/utils";

const UserDetailModal = ({ isOpen, onClose, user }) => {
  return (
    <AnimatePresence>
      {isOpen && user && (
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
            className="w-full max-w-2xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[90vh] relative overflow-hidden mx-4"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined">
                    assignment_ind
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Thông tin Người dùng
                  </h1>
                  <p className="text-sm text-gray-500">ID: #{user.userId}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto">
              <div className="flex flex-col items-center mb-8">
                <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
                  {user.anhDaiDien ? (
                    <img
                      src={`http://localhost:8080/uploads/${user.anhDaiDien}`}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                      {user.hoTen?.charAt(0)}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.hoTen}
                </h2>
                <div className="mt-2">{RoleBadge(user.role)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-semibold">
                    Email
                  </label>
                  <p className="text-gray-900 font-medium border-b pb-2">
                    {user.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-semibold">
                    Số điện thoại
                  </label>
                  <p className="text-gray-900 font-medium border-b pb-2">
                    {user.soDienThoai}
                  </p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-gray-500 uppercase font-semibold">
                    Địa chỉ
                  </label>
                  <p className="text-gray-900 font-medium border-b pb-2">
                    {user.diaChi}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase font-semibold">
                    Ngày tạo
                  </label>
                  <p className="text-gray-900 font-medium border-b pb-2">
                    {formatDate(user.ngayTao)}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
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

export default UserDetailModal;
