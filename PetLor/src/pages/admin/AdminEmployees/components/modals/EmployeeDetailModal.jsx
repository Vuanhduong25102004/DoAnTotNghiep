import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { PositionBadge } from "../../../components/utils";

const EmployeeDetailModal = ({ isOpen, onClose, employee }) => {
  useEscapeKey(onClose, isOpen);

  // Style constants
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";
  const valueBoxClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium";

  return (
    <AnimatePresence>
      {isOpen && employee && (
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
                    visibility
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Chi tiết Nhân viên{" "}
                    <span className="text-primary">#{employee.nhanVienId}</span>
                  </h2>
                  <p className="text-sm text-slate-500">
                    Xem thông tin hồ sơ nhân sự
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
              <div className="flex flex-col md:flex-row gap-10">
                {/* Cột Trái: Avatar & Tên */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="relative group w-32 h-32 mb-4">
                    <img
                      src={
                        employee.anhDaiDien
                          ? `http://localhost:8080/uploads/${employee.anhDaiDien}`
                          : "https://placehold.co/128x128?text=Staff"
                      }
                      alt={employee.hoTen}
                      className="w-full h-full rounded-full object-cover border-4 border-slate-50 shadow-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/128?text=NV";
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-1">
                    {employee.hoTen}
                  </h2>
                  <div className="mt-2 scale-110">
                    {PositionBadge(employee.chucVu)}
                  </div>
                </div>

                {/* Cột Phải: Thông tin chi tiết */}
                <div className="w-full md:w-2/3 space-y-6">
                  {/* Thông tin liên hệ */}
                  <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-primary text-lg">
                        contact_mail
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Liên hệ
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">
                        mail
                      </span>
                      <span className="text-slate-700 font-medium">
                        {employee.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">
                        phone
                      </span>
                      <span className="text-slate-700 font-medium">
                        {employee.soDienThoai}
                      </span>
                    </div>
                  </div>

                  {/* Grid Thông tin chuyên môn */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Chuyên khoa</label>
                      <div className={valueBoxClass}>
                        {employee.chuyenKhoa || "N/A"}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Kinh nghiệm</label>
                      <div className={valueBoxClass}>
                        {employee.kinhNghiem || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
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

export default EmployeeDetailModal;
