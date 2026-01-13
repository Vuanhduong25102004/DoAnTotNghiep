import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculateAge,
  formatDate,
  getImageUrl,
} from "../../../components/utils";

const PetDetailModal = ({ isOpen, onClose, pet }) => {
  useEscapeKey(onClose, isOpen);

  // Style constants
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";
  const valueBoxClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium";

  return (
    <AnimatePresence>
      {isOpen && pet && (
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
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
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
                    Chi tiết Thú cưng{" "}
                    <span className="text-primary">#{pet.thuCungId}</span>
                  </h2>
                  <p className="text-sm text-slate-500">
                    Xem thông tin hồ sơ và sức khỏe
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
              <div className="flex flex-col md:flex-row gap-8">
                {/* Cột Trái: Avatar & Tên */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="relative group w-full aspect-square max-w-[200px] mb-4">
                    <div className="w-full h-full rounded-3xl border-4 border-slate-50 shadow-md overflow-hidden bg-slate-100">
                      <img
                        src={getImageUrl(pet.img)}
                        alt={pet.tenThuCung}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/200?text=Pet";
                        }}
                      />
                    </div>
                    <span className="absolute bottom-3 right-3 bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-xl">
                      {pet.chungLoai === "Mèo"
                        ? "🐱"
                        : pet.chungLoai === "Chó"
                        ? "🐶"
                        : "🐾"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-1">
                    {pet.tenThuCung}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {pet.giongLoai || "Chưa rõ giống"}
                  </p>
                </div>

                {/* Cột Phải: Thông tin chi tiết */}
                <div className="w-full md:w-2/3 space-y-6">
                  {/* Chủ sở hữu */}
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-lg">
                        person
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Chủ sở hữu
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-lg">
                        {pet.tenChu || pet.ownerName || "---"}
                      </span>
                      <span className="text-sm font-medium text-slate-500">
                        {pet.soDienThoaiChuSoHuu || "---"}
                      </span>
                    </div>
                  </div>

                  {/* Grid Thông tin */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Ngày sinh / Tuổi</label>
                      <div className={valueBoxClass}>
                        {formatDate(pet.ngaySinh)}
                        <span className="block text-xs text-primary mt-0.5 font-bold">
                          ({calculateAge(pet.ngaySinh)})
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Giới tính</label>
                      <div
                        className={`${valueBoxClass} flex items-center gap-2`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            pet.gioiTinh === "Đực"
                              ? "bg-blue-500"
                              : pet.gioiTinh === "Cái"
                              ? "bg-pink-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        {pet.gioiTinh}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Cân nặng</label>
                      <div className={valueBoxClass}>
                        {pet.canNang ? `${pet.canNang} kg` : "---"}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Chủng loại</label>
                      <div className={valueBoxClass}>{pet.chungLoai}</div>
                    </div>
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className={labelClass}>Ghi chú sức khỏe</label>
                    <div
                      className={`${valueBoxClass} min-h-[80px] bg-slate-50/50 italic text-slate-500 leading-relaxed`}
                    >
                      {pet.ghiChuSucKhoe || "Không có ghi chú nào."}
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

export default PetDetailModal;
