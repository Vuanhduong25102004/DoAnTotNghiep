/**
 * @file AdminOrders.jsx
 * @description Trang quản lý đơn hàng cho quản trị viên.
 * Cho phép xem, tìm kiếm, lọc, cập nhật và xóa đơn hàng.
 * Tối ưu hóa bằng cách sử dụng phân trang và lọc phía máy chủ.
 */
import React, { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// --- Helpers (Hàm hỗ trợ) ---

/**
 * Định dạng một số thành chuỗi tiền tệ VND.
 * @param {number} amount - Số tiền cần định dạng.
 * @returns {string} - Chuỗi tiền tệ đã định dạng (ví dụ: "50.000 ₫").
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Định dạng chuỗi ngày giờ sang định dạng dd/MM/yyyy, HH:mm.
 * @param {string} dateString - Chuỗi ngày giờ đầu vào (ISO 8601).
 * @returns {string} - Chuỗi ngày giờ đã định dạng hoặc "---" nếu không có.
 */
const formatDateTime = (dateString) => {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Trả về các lớp CSS của Tailwind để tạo badge cho trạng thái đơn hàng.
 * @param {string} status - Trạng thái của đơn hàng.
 * @returns {string} - Chuỗi các lớp CSS.
 */
const getStatusBadge = (status) => {
  // Chuẩn hóa status về chữ thường để so sánh
  const normalizedStatus = status ? status.toLowerCase() : "";

  if (
    normalizedStatus.includes("hoàn thành") ||
    normalizedStatus.includes("completed")
  ) {
    return "bg-green-100 text-green-800 border-green-200";
  }
  if (
    normalizedStatus.includes("đang giao") ||
    normalizedStatus.includes("shipping")
  ) {
    return "bg-blue-100 text-blue-800 border-blue-200";
  }
  if (
    normalizedStatus.includes("đã hủy") ||
    normalizedStatus.includes("cancelled")
  ) {
    return "bg-red-100 text-red-800 border-red-200";
  }
  // Mặc định là Chờ xử lý
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
};

// Danh sách các trạng thái có thể có của một đơn hàng
const ORDER_STATUSES = ["Chờ xử lý", "Đang giao", "Hoàn thành", "Đã hủy"];

// Component Skeleton Loading cho Table
const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100 last:border-0">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
    <td className="px-6 py-4 flex items-center gap-3">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-3 bg-gray-100 rounded w-20"></div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-40"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div>
    </td>
  </tr>
);

/**
 * Component chính cho trang quản lý đơn hàng.
 */
const AdminOrders = () => {
  // --- 1. State Management (Quản lý Trạng thái) ---

  // State lưu trữ dữ liệu chính và trạng thái tải
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal Cập nhật trạng thái
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({ trangThai: "", diaChi: "" });

  // State cho Modal xem Chi tiết đơn hàng
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  // State cho Modal xác nhận xóa
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [orderToDeleteId, setOrderToDeleteId] = useState(null);

  // State cho các bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 6; // Số đơn hàng trên mỗi trang

  // --- 2. Data Fetching (Lấy Dữ liệu từ API) ---

  /**
   * Lấy danh sách đơn hàng từ API dựa trên các tham số phân trang và lọc.
   */
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1; // API sử dụng trang bắt đầu từ 0
      const params = {
        page,
        size: ITEMS_PER_PAGE,
        search: searchTerm,
        status: statusFilter,
        date: dateFilter,
      };
      // Xóa các tham số rỗng để không gửi lên server
      if (!params.search) delete params.search;
      if (!params.status) delete params.status;
      if (!params.date) delete params.date;

      const response = await orderService.getAllOrders(params);

      // Xác định dữ liệu là mảng trực tiếp hay nằm trong thuộc tính content (phân trang)
      const ordersList = Array.isArray(response)
        ? response
        : response?.content || [];

      // Map dữ liệu trả về từ API để đảm bảo tính nhất quán
      const formattedData = ordersList.map((order) => ({
        ...order,
        donHangId: order.id || order.donHangId,
        userName:
          order.tenNguoiDung ||
          (order.user ? order.user.hoTen : order.hoTenNguoiNhan) ||
          "Khách vãng lai",
        userId: order.user ? order.user.id || order.user.userId : order.userId,
        tongTien: order.tongTien || 0,
        trangThai: order.trangThaiDonHang || order.trangThai || "Chờ xử lý",
        diaChi: order.diaChiGiaoHang || order.diaChi || "Tại cửa hàng",
      }));

      setOrders(formattedData);
      setTotalPages(response?.totalPages || (Array.isArray(response) ? 1 : 0));
      setTotalElements(
        response?.totalElements ||
          (Array.isArray(response) ? response.length : 0)
      );
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Side Effects (Xử lý Tác vụ Phụ) ---

  // Tải lại danh sách đơn hàng mỗi khi trang, từ khóa tìm kiếm hoặc bộ lọc thay đổi.
  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter, dateFilter]);

  // Khóa cuộn trang khi có bất kỳ modal nào đang mở
  useEffect(() => {
    const isAnyModalOpen =
      isModalOpen || isDetailModalOpen || isConfirmDeleteModalOpen;

    const contentArea = document.getElementById("admin-content-area");
    const header = document.querySelector("header"); // Target the main header

    if (contentArea) {
      if (isAnyModalOpen) {
        const scrollbarWidth =
          contentArea.offsetWidth - contentArea.clientWidth;
        contentArea.style.overflow = "hidden";
        contentArea.style.paddingRight = `${scrollbarWidth}px`;
        if (header) header.style.paddingRight = `${scrollbarWidth}px`;
      } else {
        contentArea.style.overflow = "auto";
        contentArea.style.paddingRight = "";
        if (header) header.style.paddingRight = "";
      }
      return () => {
        contentArea.style.overflow = "auto";
        contentArea.style.paddingRight = "";
        if (header) header.style.paddingRight = "";
      };
    }
  }, [isModalOpen, isDetailModalOpen, isConfirmDeleteModalOpen]);

  // Xử lý phím ESC để đóng modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setIsDetailModalOpen(false);
        setIsConfirmDeleteModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  // --- 4. Event Handlers (Hàm Xử lý Sự kiện) ---

  /**
   * Xử lý xóa một đơn hàng.
   * @param {number} id - ID của đơn hàng cần xóa.
   */
  const handleDeleteClick = (id) => {
    setOrderToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDeleteId) return;
    try {
      await orderService.deleteOrder(orderToDeleteId);
      toast.success("Đã xóa đơn hàng.");
      // Tải lại dữ liệu sau khi xóa
      if (orders.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1); // Lùi về trang trước nếu trang hiện tại trống
      } else {
        fetchOrders();
      }
    } catch (error) {
      console.error("Lỗi xóa đơn hàng:", error);
      toast.error("Xóa thất bại.");
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setOrderToDeleteId(null);
    }
  };

  /**
   * Mở modal và tải chi tiết đơn hàng (bao gồm danh sách sản phẩm).
   * @param {object} order - Đối tượng đơn hàng được chọn.
   */
  const handleViewDetail = async (order) => {
    try {
      // Gọi API lấy chi tiết (danh sách sản phẩm)
      const response = await orderService.getOrderById(order.donHangId);

      setOrderItems(response?.chiTietDonHangs || []);
      setSelectedOrder({
        ...order,
        ...response, // Ghi đè với dữ liệu chi tiết mới nhất từ API
        userName: response.tenNguoiDung || order.userName,
        trangThai: response.trangThaiDonHang || order.trangThai,
        diaChi: response.diaChiGiaoHang || order.diaChi,
      });
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
      toast.error("Không thể tải chi tiết đơn hàng.");
    }
  };

  /**
   * Mở modal để cập nhật trạng thái/địa chỉ đơn hàng.
   * @param {object} order - Đối tượng đơn hàng cần chỉnh sửa.
   */
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      trangThai: order.trangThai,
      diaChi: order.diaChi,
    });
    setIsModalOpen(true);
  };

  /**
   * Gửi yêu cầu cập nhật đơn hàng lên server.
   */
  const handleSave = async () => {
    if (!editingOrder) return;

    try {
      // Chuẩn bị payload: Loại bỏ các trường frontend tự tạo
      const { userName, donHangId, ...rest } = editingOrder;
      const payload = {
        // Chỉ gửi những trường cần cập nhật
        diaChiGiaoHang: formData.diaChi,
        trangThaiDonHang: formData.trangThai,
      };

      await orderService.updateOrder(editingOrder.donHangId, payload);

      toast.success("Cập nhật đơn hàng thành công!");
      setIsModalOpen(false);
      fetchOrders(); // Tải lại dữ liệu để hiển thị thay đổi
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại.");
    }
  };

  /**
   * Xử lý thay đổi trang.
   * @param {number} pageNumber - Số trang muốn chuyển đến.
   */
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // --- 5. Derived Data & Calculations (Dữ liệu & Tính toán) ---

  // Tính toán index của item đầu tiên trên trang để hiển thị thông tin phân trang
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  // Lưu ý: Các chỉ số thống kê bên dưới (Doanh thu, Đơn chờ) chỉ được tính cho các đơn hàng trên trang hiện tại.
  // Để có số liệu toàn bộ, backend cần cung cấp API riêng cho thống kê.
  const totalOrders = totalElements;
  // Tính tổng tiền các đơn KHÔNG bị hủy
  const revenue = orders
    .filter(
      (o) =>
        !o.trangThai.toLowerCase().includes("hủy") &&
        !o.trangThai.toLowerCase().includes("cancelled")
    )
    .reduce((sum, o) => sum + o.tongTien, 0);

  // Đếm số đơn hàng đang chờ xử lý
  const pendingOrders = orders.filter((o) =>
    o.trangThai.toLowerCase().includes("chờ")
  ).length;

  const stats = [
    {
      title: "Tổng đơn hàng",
      value: totalOrders,
      icon: "receipt_long",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    {
      title: "Doanh thu thực tế", // Đã trừ đơn hủy
      value: formatCurrency(revenue),
      icon: "payments",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
    {
      title: "Đơn chờ xử lý",
      value: pendingOrders,
      icon: "pending_actions",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      border: "border-yellow-500",
    },
  ];

  // --- 6. UI Rendering (Kết xuất Giao diện) ---

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Đơn hàng
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 border-l-4 ${stat.border}`}
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bg} rounded-md p-3`}>
                  <span
                    className={`material-symbols-outlined ${stat.color} text-2xl`}
                  >
                    {stat.icon}
                  </span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <div className="flex-1 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative rounded-md shadow-sm max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400">
                  search
                </span>
              </div>
              <input
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
                placeholder="Tìm mã đơn, tên khách..."
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Quay về trang đầu khi tìm kiếm
                }}
              />
            </div>

            {/* Select Status */}
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1); // Quay về trang đầu khi lọc
                }}
              >
                <option value="">Tất cả trạng thái</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="relative">
              <input
                className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1); // Quay về trang đầu khi lọc
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              type="button"
            >
              <span className="material-symbols-outlined text-sm mr-2">
                file_download
              </span>
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mã Đơn
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Khách Hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày Đặt
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Địa Chỉ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tổng Tiền
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng Thái
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                  <SkeletonRow key={idx} />
                ))
              ) : orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr
                    key={order.donHangId || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Mã Đơn */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      #{order.donHangId}
                    </td>

                    {/* Khách Hàng */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.userName}
                      </div>
                      <div className="text-xs text-gray-500">
                        User ID: #{order.userId || "N/A"}
                      </div>
                    </td>

                    {/* Ngày Đặt */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(order.ngayDatHang)}
                    </td>

                    {/* Địa Chỉ */}
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate"
                      title={order.diaChi}
                    >
                      {order.diaChi}
                    </td>

                    {/* Tổng Tiền */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(order.tongTien)}
                    </td>

                    {/* Trạng Thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                          order.trangThai
                        )}`}
                      >
                        {order.trangThai}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          title="Xem chi tiết"
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          onClick={() => handleViewDetail(order)}
                        >
                          <span className="material-symbols-outlined text-base">
                            visibility
                          </span>
                        </button>
                        <button
                          title="Cập nhật đơn hàng"
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                          onClick={() => handleEdit(order)}
                        >
                          <span className="material-symbols-outlined text-base">
                            edit_note
                          </span>
                        </button>
                        <button
                          title="Xóa/Hủy"
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => handleDeleteClick(order.donHangId)}
                        >
                          <span className="material-symbols-outlined text-base">
                            cancel
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị
                <span className="font-medium">
                  {totalElements > 0 ? indexOfFirstItem + 1 : 0}
                </span>
                đến
                <span className="font-medium">
                  {indexOfFirstItem + orders.length}
                </span>
                trong số
                <span className="font-medium">{totalElements}</span>
                kết quả
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <span className="material-symbols-outlined text-base">
                    chevron_left
                  </span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number
                          ? "z-10 bg-primary border-primary text-white"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages || totalPages === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <span className="material-symbols-outlined text-base">
                    chevron_right
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Cập nhật Đơn hàng */}
      <AnimatePresence>
        {isModalOpen && (
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
                      edit_note
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                      Cập nhật Đơn hàng #{editingOrder?.donHangId}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Chỉnh sửa trạng thái và địa chỉ giao hàng
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
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
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Trạng thái đơn hàng
                    </label>
                    <select
                      className="form-control w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                      value={formData.trangThai}
                      onChange={(e) =>
                        setFormData({ ...formData, trangThai: e.target.value })
                      }
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Địa chỉ giao hàng
                    </label>
                    <textarea
                      rows="3"
                      className="form-control w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                      value={formData.diaChi}
                      onChange={(e) =>
                        setFormData({ ...formData, diaChi: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 tracking-wide"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    save
                  </span>
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Chi tiết Đơn hàng */}
      <AnimatePresence>
        {isDetailModalOpen && selectedOrder && (
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
                      Chi tiết Đơn hàng #{selectedOrder.donHangId}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Xem thông tin chi tiết của đơn hàng
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
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
                          {selectedOrder.userName}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">
                          Ngày đặt
                        </label>
                        <div className="font-medium text-text-heading">
                          {formatDateTime(selectedOrder.ngayDatHang)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">
                          Trạng thái
                        </label>
                        <div>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                              selectedOrder.trangThai
                            )}`}
                          >
                            {selectedOrder.trangThai}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">
                          Địa chỉ
                        </label>
                        <div className="font-medium text-text-heading">
                          {selectedOrder.diaChi}
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
                                    <img
                                      src={
                                        item.hinhAnhUrl ||
                                        (item.sanPham &&
                                          item.sanPham.hinhAnhUrl) ||
                                        "https://via.placeholder.com/40?text=SP"
                                      }
                                      alt={
                                        item.tenSanPham ||
                                        (item.sanPham &&
                                          item.sanPham.tenSanPham)
                                      }
                                      className="w-10 h-10 object-cover rounded mr-3 border border-gray-200"
                                      onError={(e) => {
                                        e.target.src =
                                          "https://via.placeholder.com/40?text=SP";
                                      }}
                                    />
                                    <span>
                                      {item.tenSanPham ||
                                        (item.sanPham &&
                                          item.sanPham.tenSanPham) ||
                                        "Sản phẩm không xác định"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {formatCurrency(item.donGiaLucMua || 0)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {item.soLuong}
                                </td>
                                <td className="px-4 py-3 text-right font-medium">
                                  {formatCurrency(
                                    (item.donGiaLucMua || 0) * item.soLuong
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
                  Tổng cộng:{" "}
                  <span className="text-primary text-xl">
                    {formatCurrency(selectedOrder.tongTien)}
                  </span>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Xác nhận Xóa */}
      <AnimatePresence>
        {isConfirmDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            >
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <span className="material-symbols-outlined text-red-600 text-3xl">
                    warning
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  Xác nhận xóa
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này
                    không thể hoàn tác.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmDeleteModalOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminOrders;
