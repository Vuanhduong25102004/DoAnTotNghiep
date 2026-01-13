import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, formatDate } from "../../../../../utils/formatters";

const ImportDetailModal = ({ isOpen, onClose, importData }) => {
  useEscapeKey(onClose, isOpen);

  if (!importData) return null;

  const detailList =
    importData.chiTietList || importData.chiTietPhieuNhapList || [];

  // Style constants
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";
  const valueBoxClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium";

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    description
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Chi tiết Phiếu nhập{" "}
                    <span className="text-primary">
                      #{importData.phieuNhapId}
                    </span>
                  </h2>
                  <p className="text-sm text-slate-500">
                    Xem thông tin chi tiết và danh sách sản phẩm nhập kho
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
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-10">
              {/* Section 1: Thông tin chung */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary bg-teal-50 p-1.5 rounded-lg text-xl">
                    info
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Thông tin Phiếu
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Nhà cung cấp</label>
                    <div className={`${valueBoxClass} bg-white text-lg`}>
                      {importData.tenNhaCungCap || importData.tenNcc}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Người thực hiện</label>
                    <div className={`${valueBoxClass} bg-white`}>
                      {importData.tenNhanVien || "Admin"}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Ngày nhập</label>
                    <div className={`${valueBoxClass} bg-white`}>
                      {formatDate(importData.ngayNhap)}
                    </div>
                  </div>

                  <div className="md:col-span-4">
                    <label className={labelClass}>Ghi chú</label>
                    <div
                      className={`${valueBoxClass} bg-white italic text-slate-500`}
                    >
                      {importData.ghiChu || "Không có ghi chú"}
                    </div>
                  </div>
                </div>
              </section>

              <div className="h-px bg-slate-100 w-full"></div>

              {/* Section 2: Danh sách sản phẩm */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-1.5 rounded-lg text-xl">
                      inventory_2
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Danh sách Sản phẩm ({detailList.length})
                    </h3>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Sản phẩm</th>
                        <th className="px-6 py-4 text-center">Số lượng</th>
                        <th className="px-6 py-4 text-right">Giá nhập</th>
                        <th className="px-6 py-4 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {detailList.length > 0 ? (
                        detailList.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                              {item.tenSanPham}
                            </td>
                            <td className="px-6 py-4 text-sm text-center font-medium text-slate-600">
                              {item.soLuong}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-slate-600">
                              {formatCurrency(item.giaNhap)}
                            </td>
                            <td className="px-6 py-4 text-sm text-right font-bold text-primary">
                              {formatCurrency(item.soLuong * item.giaNhap)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-6 py-12 text-center text-slate-400 text-sm italic"
                          >
                            Không tìm thấy chi tiết sản phẩm.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* --- FOOTER --- */}
            <div className="px-8 py-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/30 shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  Tổng giá trị:
                </span>
                <span className="text-2xl font-extrabold text-primary">
                  {formatCurrency(importData.tongTien)}
                </span>
              </div>
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

export default ImportDetailModal;
