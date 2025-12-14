import React, { useEffect, useState } from "react";
import orderService from "../../services/orderService";

// Helper: Format tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper: Format ngày giờ
const formatDateTime = (dateString) => {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper: Style cho trạng thái đơn hàng
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

const AdminOrders = () => {
  // 1. State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal Cập nhật
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({ trangThai: "", diaChi: "" });

  // State cho Modal Chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // 2. Fetch Data
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAllOrders();
      // Map dữ liệu cho khớp với UI
      const formattedData = Array.isArray(response)
        ? response.map((order) => ({
            ...order,
            donHangId: order.id || order.donHangId,
            // Map thông tin khách hàng
            userName:
              order.tenNguoiDung ||
              (order.user
                ? order.user.hoTen || order.user.tenNguoiDung
                : order.hoTenNguoiNhan || "Khách vãng lai"),
            userId: order.user
              ? order.user.id || order.user.userId
              : order.userId,
            tongTien: order.tongTien || 0,
            trangThai: order.trangThaiDonHang || order.trangThai || "Chờ xử lý",
            diaChi: order.diaChiGiaoHang || order.diaChi || "Tại cửa hàng",
          }))
        : [];

      // Sắp xếp đơn mới nhất lên đầu
      formattedData.sort(
        (a, b) => new Date(b.ngayDatHang) - new Date(a.ngayDatHang)
      );

      setOrders(formattedData);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      alert("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset trang về 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

  // 3. Handle Actions
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa lịch sử đơn hàng này? Thao tác này không thể hoàn tác."
      )
    )
      return;
    try {
      await orderService.deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.donHangId !== id));
      alert("Đã xóa đơn hàng.");
    } catch (error) {
      alert("Xóa thất bại.");
    }
  };

  // Hàm xem chi tiết đơn hàng
  const handleViewDetail = async (order) => {
    try {
      // Gọi API lấy chi tiết (danh sách sản phẩm)
      const response = await orderService.getOrderById(order.donHangId);

      // Cập nhật state dựa trên dữ liệu trả về
      if (response && response.chiTietDonHangs) {
        setOrderItems(response.chiTietDonHangs);
        // Cập nhật thông tin chi tiết đơn hàng
        setSelectedOrder({
          ...order,
          ...response,
          userName: response.tenNguoiDung || order.userName,
          trangThai: response.trangThaiDonHang || order.trangThai,
          diaChi: response.diaChiGiaoHang || order.diaChi,
        });
      } else {
        // Fallback cho cấu trúc dữ liệu cũ
        setOrderItems(Array.isArray(response) ? response : []);
        setSelectedOrder(order);
      }
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
      alert("Không thể tải chi tiết đơn hàng.");
    }
  };

  // Hàm mở Modal sửa
  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      trangThai: order.trangThai,
      diaChi: order.diaChi,
    });
    setIsModalOpen(true);
  };

  // Hàm lưu thay đổi
  const handleSave = async () => {
    if (!editingOrder) return;

    try {
      // Chuẩn bị payload: Loại bỏ các trường frontend tự tạo
      const { userName, donHangId, ...rest } = editingOrder;
      const payload = {
        ...rest,
        diaChi: formData.diaChi,
        diaChiGiaoHang: formData.diaChi, // Đồng bộ field cho backend
        trangThai: formData.trangThai,
        trangThaiDonHang: formData.trangThai, // Đồng bộ field cho backend
      };

      await orderService.updateOrder(editingOrder.donHangId, payload);

      // Update UI
      setOrders((prev) =>
        prev.map((o) =>
          o.donHangId === editingOrder.donHangId ? { ...o, ...formData } : o
        )
      );
      alert("Cập nhật đơn hàng thành công!");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại.");
    }
  };

  // 4. Filter Logic
  const filteredOrders = orders.filter((order) => {
    // Tìm kiếm theo ID hoặc Tên khách
    const matchSearch =
      order.donHangId.toString().includes(searchTerm) ||
      (order.userName &&
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Lọc trạng thái (Backend trả về tiếng Việt hay Anh thì phải khớp ở đây)
    // Tạm thời so sánh tương đối
    const matchStatus = statusFilter
      ? order.trangThai.toLowerCase().includes(statusFilter.toLowerCase())
      : true;

    // Lọc ngày
    const matchDate = dateFilter
      ? order.ngayDatHang.startsWith(dateFilter)
      : true;

    return matchSearch && matchStatus && matchDate;
  });

  // Logic Phân trang
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 5. Tính toán Stats
  const totalOrders = orders.length;
  // Tính tổng tiền các đơn KHÔNG bị hủy
  const revenue = orders
    .filter(
      (o) =>
        !o.trangThai.toLowerCase().includes("hủy") &&
        !o.trangThai.toLowerCase().includes("cancelled")
    )
    .reduce((sum, o) => sum + o.tongTien, 0);

  const pendingOrders = orders.filter(
    (o) =>
      o.trangThai.toLowerCase().includes("chờ") ||
      o.trangThai.toLowerCase().includes("pending")
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

  if (loading)
    return <div className="p-10 text-center">Đang tải dữ liệu đơn hàng...</div>;

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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Select Status */}
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="chờ">Chờ xử lý</option>
                <option value="giao">Đang giao</option>
                <option value="hoàn thành">Hoàn thành</option>
                <option value="hủy">Đã hủy</option>
              </select>
            </div>

            {/* Date Picker */}
            <div className="relative">
              <input
                className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
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
              {currentItems.length > 0 ? (
                currentItems.map((order, index) => (
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
                          onClick={() => handleDelete(order.donHangId)}
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
                Hiển thị{" "}
                <span className="font-medium">
                  {filteredOrders.length > 0 ? indexOfFirstItem + 1 : 0}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredOrders.length)}
                </span>{" "}
                trong số{" "}
                <span className="font-medium">{filteredOrders.length}</span> kết
                quả
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Cập nhật Đơn hàng #{editingOrder?.donHangId}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái đơn hàng
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  value={formData.trangThai}
                  onChange={(e) =>
                    setFormData({ ...formData, trangThai: e.target.value })
                  }
                >
                  <option value="Chờ xử lý">Chờ xử lý</option>
                  <option value="Đang giao">Đang giao</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ giao hàng
                </label>
                <textarea
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  value={formData.diaChi}
                  onChange={(e) =>
                    setFormData({ ...formData, diaChi: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600"
                >
                  Lưu lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi tiết Đơn hàng */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chi tiết Đơn hàng #{selectedOrder.donHangId}
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Thông tin chung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium text-gray-900">
                  {selectedOrder.userName}
                </p>
                <p className="text-xs text-gray-400">
                  ID: #{selectedOrder.userId || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                <p className="font-medium text-gray-900">
                  {formatDateTime(selectedOrder.ngayDatHang)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                    selectedOrder.trangThai
                  )}`}
                >
                  {selectedOrder.trangThai}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                <p className="font-medium text-gray-900">
                  {selectedOrder.diaChi}
                </p>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <h4 className="font-bold text-gray-800 mb-3">Danh sách sản phẩm</h4>
            <div className="overflow-x-auto border rounded-lg mb-4">
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
                                (item.sanPham && item.sanPham.hinhAnhUrl) ||
                                "https://via.placeholder.com/40?text=SP"
                              }
                              alt={
                                item.tenSanPham ||
                                (item.sanPham && item.sanPham.tenSanPham)
                              }
                              className="w-10 h-10 object-cover rounded mr-3 border border-gray-200"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/40?text=SP";
                              }}
                            />
                            <span>
                              {item.tenSanPham ||
                                (item.sanPham && item.sanPham.tenSanPham) ||
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

            {/* Footer: Tổng tiền & Nút đóng */}
            <div className="flex justify-between items-center border-t pt-4">
              <div className="text-lg font-bold text-gray-900">
                Tổng cộng:{" "}
                <span className="text-primary text-xl">
                  {formatCurrency(selectedOrder.tongTien)}
                </span>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrders;
