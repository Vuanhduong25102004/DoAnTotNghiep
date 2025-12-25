import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatCurrency,
  AppointmentStatusBadge,
  formatDate,
} from "../../../components/utils";

const OrderDetailModal = ({ isOpen, onClose, order, orderItems }) => {
  return (
    <AnimatePresence>
      {isOpen && order && (
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
            className="w-full max-w-5xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden font-body mx-auto my-8"
          >
            {/* Header */}
            <div className="px-10 py-6 border-b border-border-light/50 flex justify-between items-center bg-white sticky top-0 z-20 backdrop-blur-sm bg-white/95">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-surface border border-border-light flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">
                    receipt_long
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                    Chi tiết Đơn hàng #{order.donHangId}
                  </h1>
                  <p className="text-sm text-text-body/70 mt-1 font-light">
                    Xem thông tin chi tiết của đơn hàng
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
                {/* Thông tin chung */}
                <div className="pb-8 border-b border-border-light">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary font-light text-2xl">
                      info
                    </span>
                    <h2 className="text-lg font-semibold text-text-heading">
                      Thông tin chung
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-muted">
                        Khách hàng
                      </label>
                      <div className="font-medium text-text-heading">
                        {order.userName}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-muted">
                        Ngày đặt
                      </label>
                      <div className="font-medium text-text-heading">
                        {formatDate(order.ngayDatHang)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-muted">
                        Trạng thái
                      </label>
                      <div>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${AppointmentStatusBadge(
                            order.trangThai
                          )}`}
                        >
                          {order.trangThai}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-muted">
                        Địa chỉ
                      </label>
                      <div className="font-medium text-text-heading">
                        {order.diaChi}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-blue-500 font-light text-2xl">
                      shopping_cart
                    </span>
                    <h2 className="text-lg font-semibold text-text-heading">
                      Danh sách sản phẩm
                    </h2>
                  </div>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-3">Sản phẩm</th>
                          <th className="px-4 py-3 text-right">Đơn giá</th>
                          <th className="px-4 py-3 text-center">Số lượng</th>
                          <th className="px-4 py-3 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.length > 0 ? (
                          orderItems.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b last:border-b-0 hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 font-medium text-gray-900">
                                <div className="flex items-center">
                                  {/* Cập nhật logic hiển thị ảnh theo JSON mới */}
                                  <img
                                    src={
                                      item.hinhAnhUrl
                                        ? `/api/products/images/${item.hinhAnhUrl}` // Giả sử path ảnh cần prefix, hoặc nếu full url thì để nguyên
                                        : "https://via.placeholder.com/40?text=SP"
                                    }
                                    alt="Product"
                                    className="w-10 h-10 object-cover rounded mr-3 border border-gray-200"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/40?text=SP";
                                    }}
                                  />
                                  {/* Cập nhật logic hiển thị tên theo JSON mới */}
                                  <span>
                                    {item.tenSanPham ||
                                      "Sản phẩm không xác định"}
                                  </span>
                                </div>
                              </td>
                              {/* Cập nhật đơn giá (JSON mới là donGia) */}
                              <td className="px-4 py-3 text-right">
                                {formatCurrency(item.donGia || 0)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {item.soLuong}
                              </td>
                              <td className="px-4 py-3 text-right font-medium">
                                {formatCurrency(
                                  (item.donGia || 0) * item.soLuong
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-4 py-3 text-center text-gray-500"
                            >
                              Không có dữ liệu sản phẩm
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-between items-center sticky bottom-0 z-20">
              <div className="text-lg font-bold text-gray-900">
                Tổng cộng: {/* Sử dụng tongTien đã được map ở index.jsx */}
                <span className="text-primary text-xl">
                  {formatCurrency(order.tongTien)}
                </span>
              </div>
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

export default OrderDetailModal;
