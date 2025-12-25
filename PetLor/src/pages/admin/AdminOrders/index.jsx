/**
 * @file index.jsx
 * @description Trang quản lý đơn hàng (Container).
 */
import React, { useEffect, useState } from "react";
import useEscapeKey from "../../../hooks/useEscapeKey";
import orderService from "../../../services/orderService"; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";
import { formatCurrency } from "../components/utils";

// Components
import OrderStats from "./components/OrderStats";
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import OrderDetailModal from "./components/modals/OrderDetailModal";
import OrderEditModal from "./components/modals/OrderEditModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const AdminOrders = () => {
  // --- State ---
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({ trangThai: "", diaChi: "" });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [orderToDeleteId, setOrderToDeleteId] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 5; // Theo JSON backend trả về size mặc định là 20

  // State riêng cho các chỉ số thống kê
  const [statsData, setStatsData] = useState({
    totalRevenue: 0,
    pendingOrders: "...",
  });

  const STATUS_MAPPING_TO_BACKEND = {
    "Chờ xử lý": "CHO_XU_LY",
    "Đang giao": "DANG_GIAO",
    "Đã giao": "DA_GIAO", // Hoặc DA_XAC_NHAN tùy logic của bạn, nhưng thường hoàn thành là DA_GIAO
    "Đã hủy": "DA_HUY",
    // Map thêm các trường hợp khác nếu có
  };

  // --- Fetching ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1;
      const params = {
        page,
        size: ITEMS_PER_PAGE,
        search: searchTerm,
        status: statusFilter,
        date: dateFilter,
      };

      // Clean params
      if (!params.search) delete params.search;
      if (!params.status) delete params.status;
      if (!params.date) delete params.date;

      const response = await orderService.getAllOrders(params);

      // Xử lý dữ liệu trả về từ JSON mới
      let ordersList = [];
      let totalPagesCalc = 0;
      let totalElementsCalc = 0;

      if (Array.isArray(response)) {
        // Nếu API trả về mảng (chưa phân trang server), thực hiện phân trang client
        totalElementsCalc = response.length;
        totalPagesCalc = Math.ceil(totalElementsCalc / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        ordersList = response.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      } else {
        // Nếu API trả về Page object (đã phân trang server)
        const content = response?.content || [];
        // Nếu backend trả về 1 trang (totalPages=1) nhưng số lượng bản ghi > ITEMS_PER_PAGE
        // (nghĩa là backend trả về list dài hơn mong muốn), ta thực hiện phân trang client.
        if (
          (response?.totalPages === 1 || response?.totalPages === 0) &&
          content.length > ITEMS_PER_PAGE
        ) {
          totalElementsCalc = content.length;
          totalPagesCalc = Math.ceil(totalElementsCalc / ITEMS_PER_PAGE);
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          ordersList = content.slice(startIndex, startIndex + ITEMS_PER_PAGE);
        } else {
          ordersList = content;
          totalPagesCalc = response?.totalPages || 0;
          totalElementsCalc = response?.totalElements || 0;
        }
      }

      const formattedData = ordersList.map((order) => ({
        ...order,
        // Map các trường từ JSON mới sang tên biến mà Frontend đang dùng
        donHangId: order.donHangId,
        userName: order.tenNguoiDung || "Khách vãng lai", // JSON mới: tenNguoiDung
        userId: order.userId,
        tongTien: order.tongThanhToan || 0, // JSON mới: tongThanhToan
        trangThai: order.trangThai || "Chờ xử lý", // Handle null từ backend
        diaChi: order.diaChiGiaoHang || "Tại cửa hàng", // JSON mới: diaChiGiaoHang

        // Lưu trữ sẵn chi tiết đơn hàng để dùng nhanh nếu cần
        items: order.chiTietDonHangs || [],
      }));

      setOrders(formattedData);
      setTotalPages(totalPagesCalc);
      setTotalElements(totalElementsCalc);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter, dateFilter]);

  // Effect riêng để tính toán các chỉ số trên toàn bộ đơn hàng (không theo trang)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Để tính toán chính xác, ta cần lấy TOÀN BỘ danh sách đơn hàng
        // khớp với bộ lọc hiện tại, không chỉ giới hạn ở trang đang xem.
        const params = {
          page: 0,
          size: 100000, // Lấy tối đa 100,000 đơn hàng để tính toán
          search: searchTerm,
          status: statusFilter,
          date: dateFilter,
        };

        // Clean params
        if (!params.search) delete params.search;
        if (!params.status) delete params.status;
        if (!params.date) delete params.date;

        const response = await orderService.getAllOrders(params);

        // API có thể trả về mảng hoặc Page object
        const allOrders = Array.isArray(response)
          ? response
          : response?.content || [];

        const totalRevenue = allOrders.reduce(
          (sum, order) => sum + (order.tongThanhToan || 0),
          0
        );

        const pendingOrders = allOrders.filter(
          (o) => o.trangThai === "Chờ xử lý" || o.trangThai === "CHO_XU_LY"
        ).length;

        setStatsData({ totalRevenue, pendingOrders });
      } catch (error) {
        console.error("Lỗi tải thống kê đơn hàng:", error);
        setStatsData({ totalRevenue: 0, pendingOrders: "Lỗi" });
      }
    };
    fetchStats();
  }, [searchTerm, statusFilter, dateFilter]);

  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
    setIsConfirmDeleteModalOpen(false);
  };

  useEscapeKey(
    handleCloseModals,
    isModalOpen || isDetailModalOpen || isConfirmDeleteModalOpen
  );

  // --- Handlers ---
  const handleDeleteClick = (id) => {
    setOrderToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDeleteId) return;
    try {
      await orderService.deleteOrder(orderToDeleteId);
      toast.success("Đã xóa đơn hàng.");
      if (orders.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
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

  const handleViewDetail = async (order) => {
    // Logic: Nếu order đã có sẵn chi tiết (từ list) thì dùng luôn,
    // hoặc gọi API getById để chắc chắn có dữ liệu mới nhất.
    try {
      // Cách 1: Dùng API (An toàn nhất để lấy data tươi mới)
      // const response = await orderService.getOrderById(order.donHangId);
      // setOrderItems(response?.chiTietDonHangs || []);

      // Cách 2: Dùng dữ liệu từ list (Nhanh hơn vì backend đã trả về rồi)
      setOrderItems(order.items || []);

      setSelectedOrder({
        ...order,
        // Đảm bảo map đúng các trường nếu dùng data từ list
        trangThai: order.trangThai,
        diaChi: order.diaChi,
      });
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi xem chi tiết:", error);
      toast.error("Có lỗi khi mở chi tiết đơn hàng");
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      trangThai: order.trangThai,
      diaChi: order.diaChi,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingOrder) return;

    // Lấy giá trị Enum tương ứng với tiếng Việt
    const backendStatus = STATUS_MAPPING_TO_BACKEND[formData.trangThai];

    // Kiểm tra xem có map được không, nếu không thì giữ nguyên (phòng trường hợp lỗi)
    if (!backendStatus) {
      console.error(
        "Không tìm thấy mã Enum cho trạng thái:",
        formData.trangThai
      );
      toast.error("Trạng thái không hợp lệ!");
      return;
    }

    try {
      const payload = {
        diaChiGiaoHang: formData.diaChi,
        trangThai: backendStatus, // Gửi mã Enum (ví dụ: DANG_GIAO) thay vì tiếng Việt
      };

      await orderService.updateOrder(editingOrder.donHangId, payload);
      toast.success("Cập nhật đơn hàng thành công!");
      setIsModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error(error);
      // Hiển thị lỗi chi tiết hơn nếu có
      const message = error.response?.data?.message || "Cập nhật thất bại.";
      toast.error(message);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  const stats = [
    {
      title: "Tổng đơn hàng",
      value: totalElements,
      icon: "receipt_long",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    {
      title: "Doanh thu",
      value: formatCurrency(statsData.totalRevenue),
      icon: "monetization_on",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
    {
      title: "Đơn chờ xử lý",
      value: statsData.pendingOrders,
      icon: "pending_actions",
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-500",
    },
  ];

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Đơn hàng
        </p>
      </div>

      <OrderStats stats={stats} />

      <OrderFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        setCurrentPage={setCurrentPage}
      />

      <OrderTable
        loading={loading}
        orders={orders}
        totalElements={totalElements}
        totalPages={totalPages}
        currentPage={currentPage}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        indexOfFirstItem={indexOfFirstItem}
        onPageChange={handlePageChange}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModals}
        order={selectedOrder}
        orderItems={orderItems}
      />

      <OrderEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModals}
        editingOrder={editingOrder}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default AdminOrders;
