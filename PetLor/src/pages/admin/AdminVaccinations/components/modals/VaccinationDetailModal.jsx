import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, VaccinationStatusBadge } from "../../../components/utils";
import useEscapeKey from "../../../../../hooks/useEscapeKey";

const VaccinationDetailModal = ({ isOpen, onClose, data }) => {
  useEscapeKey(onClose, isOpen);

  return (
    <AnimatePresence>
      {isOpen && data && (
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
            className="w-full max-w-3xl bg-white rounded-2xl shadow-modal flex flex-col font-body mx-auto my-8 overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                  Chi tiết Hồ sơ Tiêm #{data.tiemChungId}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Ngày ghi nhận: {formatDate(data.ngayTiem)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8 bg-white overflow-y-auto max-h-[70vh]">
              {/* Section 1: Thông tin chính */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500">
                      pets
                    </span>{" "}
                    Thông tin Thú cưng
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Tên bé:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {data.tenThuCung}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        ID Hệ thống:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        #{data.thuCungId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500">
                      vaccines
                    </span>{" "}
                    Thông tin Vắc xin
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Loại vắc xin:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {data.tenVacXin}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Bác sĩ:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {data.tenBacSi}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Lịch hẹn gốc:
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {data.lichHenId ? `#${data.lichHenId}` : "Không có"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Lịch trình & Trạng thái */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Lịch trình & Sức khỏe
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Ngày tiêm</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatDate(data.ngayTiem)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200 bg-amber-50 border-amber-100">
                    <p className="text-xs text-amber-700 mb-1">
                      Ngày tái chủng dự kiến
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-amber-900">
                        {formatDate(data.ngayTaiChung)}
                      </p>
                      {VaccinationStatusBadge(data.ngayTaiChung)}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200 md:col-span-1">
                    <p className="text-xs text-gray-500 mb-1">Ghi chú y tế</p>
                    <p className="text-sm text-gray-700 italic">
                      "{data.ghiChu || "Không có ghi chú nào"}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VaccinationDetailModal;
