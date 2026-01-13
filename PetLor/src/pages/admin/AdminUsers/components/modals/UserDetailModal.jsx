import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, RoleBadge } from "../../../components/utils";

const UserDetailModal = ({ isOpen, onClose, user }) => {
  useEscapeKey(onClose, isOpen);

  // Style constants
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";
  const valueBoxClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium";

  return (
    <AnimatePresence>
      {isOpen && user && (
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
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    assignment_ind
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Thông tin Người dùng
                  </h2>
                  <p className="text-sm text-slate-500">
                    Chi tiết tài khoản{" "}
                    <span className="text-primary font-semibold">
                      #{user.userId}
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
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              {/* Profile Card */}
              <div className="flex flex-col items-center mb-10">
                <div className="h-28 w-28 rounded-full border-4 border-slate-50 shadow-lg overflow-hidden mb-4 bg-slate-100">
                  {user.anhDaiDien ? (
                    <img
                      src={`http://localhost:8080/uploads/${user.anhDaiDien}`}
                      className="w-full h-full object-cover"
                      alt={user.hoTen}
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/150x150?text=Avatar";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-teal-50 flex items-center justify-center text-primary text-4xl font-bold">
                      {user.hoTen?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {user.hoTen}
                </h2>
                <div className="mt-2 scale-110">{RoleBadge(user.role)}</div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Email</label>
                  <div className={valueBoxClass}>{user.email}</div>
                </div>
                <div>
                  <label className={labelClass}>Số điện thoại</label>
                  <div className={valueBoxClass}>
                    {user.soDienThoai || "N/A"}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Địa chỉ</label>
                  <div className={valueBoxClass}>
                    {user.diaChi || "Chưa cập nhật"}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Ngày tham gia</label>
                  <div className={`${valueBoxClass} bg-slate-50/50`}>
                    {formatDate(user.ngayTao)}
                  </div>
                </div>

                {/* Hiển thị thêm thông tin nếu là nhân viên */}
                {user.role !== "USER" && (
                  <>
                    <div className="md:col-span-2 h-px bg-slate-100 my-2"></div>
                    <div>
                      <label className={labelClass}>Chức vụ</label>
                      <div className={valueBoxClass}>
                        {user.chucVu || "N/A"}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Chuyên khoa</label>
                      <div className={valueBoxClass}>
                        {user.chuyenKhoa || "N/A"}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="px-8 py-6 border-t border-slate-100 flex justify-end bg-slate-50/30 shrink-0">
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors bg-white border border-slate-200 shadow-sm"
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
