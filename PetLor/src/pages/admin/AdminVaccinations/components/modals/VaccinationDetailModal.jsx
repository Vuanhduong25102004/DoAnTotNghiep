import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, VaccinationStatusBadge } from "../../../components/utils";
import useEscapeKey from "../../../../../hooks/useEscapeKey";

const VaccinationDetailModal = ({ isOpen, onClose, data }) => {
  useEscapeKey(onClose, isOpen);

  // Style constants
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";
  const valueBoxClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium";

  return (
    <AnimatePresence>
      {isOpen && data && (
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
                    vaccines
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Chi tiết Tiêm chủng{" "}
                    <span className="text-primary">#{data.tiemChungId}</span>
                  </h2>
                  <p className="text-sm text-slate-500">
                    Xem thông tin vắc xin và lịch trình tái chủng
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
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {/* Thông tin chính */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Tên thú cưng</label>
                  <div
                    className={`${valueBoxClass} flex justify-between items-center`}
                  >
                    <span>{data.tenThuCung}</span>
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                      ID: {data.thuCungId}
                    </span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Loại vắc xin</label>
                  <div className={`${valueBoxClass} font-bold text-slate-900`}>
                    {data.tenVacXin}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Bác sĩ thực hiện</label>
                  <div className={valueBoxClass}>
                    {data.tenBacSi || "Không xác định"}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Lịch hẹn gốc</label>
                  <div className={valueBoxClass}>
                    {data.lichHenId ? (
                      <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                        #{data.lichHenId}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Không có</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              {/* Lịch trình & Ghi chú */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500">
                    calendar_month
                  </span>
                  Lịch trình & Sức khỏe
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className={labelClass}>Ngày tiêm</label>
                    <div
                      className={`${valueBoxClass} bg-white border-2 border-slate-100`}
                    >
                      {formatDate(data.ngayTiem)}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Ngày tái chủng dự kiến</label>
                    <div className="flex items-center gap-3">
                      <div
                        className={`${valueBoxClass} bg-white border-2 border-slate-100 w-auto min-w-[150px]`}
                      >
                        {formatDate(data.ngayTaiChung)}
                      </div>
                      <VaccinationStatusBadge
                        reVaccinationDate={data.ngayTaiChung}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className={labelClass}>Ghi chú y tế</label>
                    <div
                      className={`${valueBoxClass} min-h-[80px] bg-slate-50/50 italic text-slate-500`}
                    >
                      {data.ghiChu ||
                        "Không có ghi chú nào về phản ứng sau tiêm."}
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

export default VaccinationDetailModal;
