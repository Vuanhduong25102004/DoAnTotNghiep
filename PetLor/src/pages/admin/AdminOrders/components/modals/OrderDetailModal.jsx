import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatCurrency,
  OrderStatusBadge,
  formatDate,
  getImageUrl,
  PaymentStatusBadge, // 1. IMPORT COMPONENT MỚI TẠI ĐÂY
} from "../../../components/utils";

const OrderDetailModal = ({ isOpen, onClose, order, orderItems }) => {
  useEscapeKey(onClose, isOpen);

  // Đảm bảo lấy đúng danh sách sản phẩm từ order nếu prop orderItems không truyền vào
  const itemsToRender = orderItems || order?.chiTietDonHangs || [];

  // Style constants
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 block";
  const valueClass = "text-slate-700 font-medium text-base";
  const sectionHeaderClass = "flex items-center gap-3 mb-6";
  const iconBoxClass = "p-1.5 rounded-lg text-xl";

  return (
    <AnimatePresence>
      {isOpen && order && (
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
            className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    receipt_long
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Chi tiết Đơn hàng{" "}
                    <span className="text-primary">#{order.donHangId}</span>
                  </h2>
                  <p className="text-sm text-slate-500">
                    Xem thông tin chi tiết và danh sách sản phẩm
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
            <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar flex-1">
              {/* Thông tin chung */}
              <section>
                <div className={sectionHeaderClass}>
                  <span
                    className={`material-symbols-outlined text-blue-500 bg-blue-50 ${iconBoxClass}`}
                  >
                    info
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Thông tin chung
                  </h3>
                </div>

                {/* Grid layout cho thông tin khách hàng */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  {/* Cột 1: Người đặt */}
                  <div>
                    <span className={labelClass}>Khách hàng</span>
                    <div className={valueClass}>{order.tenNguoiDung}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      {order.soDienThoaiNhan}
                    </div>
                  </div>

                  {/* Cột 2: Thời gian */}
                  <div>
                    <span className={labelClass}>Ngày đặt</span>
                    <div className={valueClass}>
                      {formatDate(order.ngayDatHang)}
                    </div>
                  </div>

                  {/* Cột 3: Thanh toán */}
                  <div>
                    <span className={labelClass}>Thanh toán</span>
                    <div className={valueClass}>
                      {order.phuongThucThanhToan}
                    </div>
                    {/* 2. SỬ DỤNG COMPONENT MỚI TẠI ĐÂY */}
                    <div className="mt-1">
                      <PaymentStatusBadge status={order.trangThaiThanhToan} />
                    </div>
                  </div>

                  {/* Cột 4: Trạng thái đơn */}
                  <div>
                    <span className={labelClass}>Trạng thái</span>
                    <div className="mt-1">
                      <OrderStatusBadge status={order.trangThai} />
                    </div>
                  </div>

                  {/* Dòng 2: Địa chỉ (Full width) */}
                  <div className="md:col-span-2 lg:col-span-4 border-t border-slate-200/60 pt-4 mt-2">
                    <span className={labelClass}>Địa chỉ giao hàng</span>
                    <div className={valueClass}>{order.diaChiGiaoHang}</div>
                  </div>

                  {/* Dòng 2: Ghi chú hủy (Nếu có) */}
                  {order.lyDoHuy && (
                    <div className="md:col-span-2 lg:col-span-4 border-t border-red-200 pt-4 mt-2 bg-red-50 p-3 rounded-lg">
                      <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest mb-1 block">
                        Lý do hủy đơn
                      </span>
                      <div className="text-red-700 font-medium">
                        {order.lyDoHuy}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <div className="h-px bg-slate-100 w-full"></div>

              {/* Danh sách sản phẩm */}
              <section>
                <div className={sectionHeaderClass}>
                  <span
                    className={`material-symbols-outlined text-orange-500 bg-orange-50 ${iconBoxClass}`}
                  >
                    shopping_cart
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Danh sách sản phẩm
                  </h3>
                </div>

                <div className="overflow-hidden border border-slate-100 rounded-2xl">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-50 font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Sản phẩm</th>
                        <th className="px-6 py-4 text-right">Đơn giá</th>
                        <th className="px-6 py-4 text-center">Số lượng</th>
                        <th className="px-6 py-4 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {itemsToRender && itemsToRender.length > 0 ? (
                        itemsToRender.map((item, index) => (
                          <tr
                            key={item.id || index}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-medium text-slate-900">
                              <div className="flex items-center">
                                <img
                                  src={getImageUrl(item.hinhAnhUrl)}
                                  alt={item.tenSanPham}
                                  className="w-12 h-12 object-contain mix-blend-multiply rounded-lg mr-4 border border-slate-100 shadow-sm bg-white"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://placehold.co/100x100?text=No+Img";
                                  }}
                                />
                                <div>
                                  <div
                                    className="line-clamp-2"
                                    title={item.tenSanPham}
                                  >
                                    {item.tenSanPham}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {formatCurrency(item.donGia)}
                            </td>
                            <td className="px-6 py-4 text-center font-semibold text-slate-700">
                              {item.soLuong}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-primary">
                              {formatCurrency(item.donGia * item.soLuong)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-6 py-8 text-center text-slate-400 italic"
                          >
                            Không có dữ liệu sản phẩm
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* TỔNG KẾT CHI PHÍ */}
              <section className="flex justify-end">
                <div className="w-full md:w-1/2 lg:w-1/3 bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Tổng tiền hàng</span>
                    <span className="font-medium">
                      {formatCurrency(order.tongTienHang)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium">
                      {formatCurrency(order.phiVanChuyen)}
                    </span>
                  </div>
                  {order.soTienGiam > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        Giảm giá{" "}
                        {order.maKhuyenMai ? `(${order.maKhuyenMai})` : ""}
                      </span>
                      <span className="font-medium">
                        -{formatCurrency(order.soTienGiam)}
                      </span>
                    </div>
                  )}
                  <div className="h-px bg-slate-200 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-lg">
                      Tổng thanh toán
                    </span>
                    <span className="font-extrabold text-primary text-xl">
                      {formatCurrency(order.tongThanhToan)}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* --- FOOTER --- */}
            <div className="px-8 py-6 border-t border-slate-100 flex justify-end items-center bg-slate-50/30 shrink-0 gap-3">
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors bg-slate-100 border border-transparent"
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

export default OrderDetailModal;
