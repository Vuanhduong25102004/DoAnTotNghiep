/**
 * @file AdminAppointments.jsx
 * @description Trang quản lý lịch hẹn cho quản trị viên.
 */
import React, { useState, useEffect } from "react";
import petService from "../../services/petService";
import userService from "../../services/userService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// --- Helpers (Hàm hỗ trợ) ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status) => {
  const styles = {
    "CHỜ XÁC NHẬN": "bg-yellow-100 text-yellow-800",
    "ĐÃ XÁC NHẬN": "bg-blue-100 text-blue-800",
    "ĐÃ HOÀN THÀNH": "bg-green-100 text-green-800",
    "ĐÃ HỦY": "bg-red-100 text-red-800",
    "ĐANG THỰC HIỆN": "bg-indigo-100 text-indigo-800",
  };
  const formattedStatus = status ? status.replace(/_/g, " ") : "KHÔNG RÕ";
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {formattedStatus}
    </span>
  );
};

const APPOINTMENT_STATUSES = [
  "CHỜ XÁC NHẬN",
  "ĐÃ XÁC NHẬN",
  "ĐÃ HOÀN THÀNH",
  "ĐÃ HỦY",
];

// Component Skeleton Loading cho Table
const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100 last:border-0">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-12"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
      <div className="h-3 bg-gray-100 rounded w-16"></div>
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

const AdminAppointments = () => {
  // --- State Management ---
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Modals
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal tạo mới (Form cũ)
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [appointmentToDeleteId, setAppointmentToDeleteId] = useState(null);

  // State Phân trang & Lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // State cho debounce
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 6;

  // Dữ liệu dropdown
  const [staffList, setStaffList] = useState([]);
  const [servicesList, setServicesList] = useState([]); // Danh sách dịch vụ

  // State Form Tạo mới (Cấu trúc cũ)
  const [newAppointment, setNewAppointment] = useState({
    thoiGianBatDau: "",
    dichVuId: "",
    nhanVienId: "",
    tenKhachHang: "",
    soDienThoaiKhachHang: "",
    tenThuCung: "",
    chungLoai: "",
    giongLoai: "",
    ngaySinh: "",
    gioiTinh: "",
    ghiChu: "",
  });

  // State thống kê
  const [statsData, setStatsData] = useState({
    today: 0,
    pending: 0,
    confirmed: 0,
    completedMonth: 0,
  });

  // --- Data Fetching ---
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1;
      const params = {
        page,
        size: ITEMS_PER_PAGE,
        search: searchTerm,
        status: statusFilter,
      };
      if (!params.search) delete params.search;
      if (!params.status) delete params.status;

      const response = await petService.getAllAppointments(params);
      setAppointments(response?.content || []);
      setTotalPages(response?.totalPages || 0);
      setTotalElements(response?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy thống kê (lấy tất cả dữ liệu để tính toán chính xác)
  const fetchStats = async () => {
    try {
      // Lấy số lượng lớn bản ghi để tính toán client-side
      const response = await petService.getAllAppointments({
        page: 0,
        size: 1000,
      });
      const allApts = response?.content || [];

      const todayStr = new Date().toISOString().slice(0, 10);
      const todayCount = allApts.filter(
        (a) => a.thoiGianBatDau && a.thoiGianBatDau.startsWith(todayStr)
      ).length;

      const pendingCount = allApts.filter(
        (a) =>
          a.trangThaiLichHen &&
          (a.trangThaiLichHen.toLowerCase().includes("chờ") ||
            a.trangThaiLichHen.toLowerCase().includes("pending"))
      ).length;

      const confirmedCount = allApts.filter(
        (a) => a.trangThaiLichHen === "ĐÃ XÁC NHẬN"
      ).length;

      const completedMonthCount = allApts.filter(
        (a) =>
          a.trangThaiLichHen &&
          (a.trangThaiLichHen.toLowerCase().includes("hoàn thành") ||
            a.trangThaiLichHen.toLowerCase().includes("completed")) &&
          new Date(a.thoiGianBatDau).getMonth() === new Date().getMonth()
      ).length;

      setStatsData({
        today: todayCount,
        pending: pendingCount,
        confirmed: confirmedCount,
        completedMonth: completedMonthCount,
      });
    } catch (error) {
      console.error("Lỗi tải thống kê:", error);
    }
  };

  // Fetch initial data (Staff & Services)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [staffRes, servicesRes] = await Promise.all([
          userService.getAllStaff({ page: 0, size: 100 }),
          petService.getAllServices(),
        ]);

        setStaffList(staffRes?.content || []);
        // Xử lý servicesRes tùy theo format trả về (nếu là array hay object page)
        setServicesList(
          Array.isArray(servicesRes) ? servicesRes : servicesRes?.content || []
        );
      } catch (error) {
        console.error("Lỗi tải dữ liệu ban đầu:", error);
      }
    };
    fetchInitialData();
    fetchStats();
  }, []);

  // Xử lý Debounce cho tìm kiếm (đợi 500ms sau khi ngừng gõ)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch dữ liệu khi các điều kiện thay đổi (dùng debouncedSearchTerm thay vì searchTerm)
  useEffect(() => {
    fetchAppointments();
  }, [currentPage, debouncedSearchTerm, statusFilter]);
  // Xử lý phím ESC để đóng modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsDetailModalOpen(false);
        setIsEditModalOpen(false);
        setIsAddModalOpen(false);
        setIsConfirmDeleteModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  // --- Handlers ---

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (appointment) => {
    setEditingAppointment({ ...appointment });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setAppointmentToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!appointmentToDeleteId) return;
    try {
      await petService.deleteAppointment(appointmentToDeleteId);
      fetchAppointments();
      fetchStats();
      toast.success("Xóa lịch hẹn thành công!");
    } catch (error) {
      toast.error("Xóa thất bại! Vui lòng thử lại.");
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setAppointmentToDeleteId(null);
    }
  };

  const handleUpdateAppointment = async () => {
    if (!editingAppointment) return;
    try {
      const payload = {
        nhanVienId: editingAppointment.nhanVienId,
        trangThaiLichHen: editingAppointment.trangThaiLichHen,
      };
      await petService.updateAppointment(editingAppointment.lichHenId, payload);
      toast.success("Cập nhật lịch hẹn thành công!");
      setIsEditModalOpen(false);
      fetchAppointments();
      fetchStats();
    } catch (error) {
      toast.error(`Cập nhật thất bại: ${error.message}`);
    }
  };

  // --- Handlers cho Form Tạo Mới ---

  const handleCreateAppointment = async () => {
    // Validation
    if (
      !newAppointment.thoiGianBatDau ||
      !newAppointment.dichVuId ||
      !newAppointment.tenKhachHang
    ) {
      toast.warning(
        "Vui lòng điền các trường bắt buộc: Thời gian, Dịch vụ, Tên khách hàng."
      );
      return;
    }

    // Validate Time Format and Business Hours
    const selectedDate = new Date(newAppointment.thoiGianBatDau);
    if (isNaN(selectedDate.getTime())) {
      toast.error("Định dạng thời gian không hợp lệ.");
      return;
    }
    const hours = selectedDate.getHours();
    if (hours < 8 || hours >= 18) {
      toast.warning("Vui lòng chọn giờ hẹn trong khoảng 08:00 đến 18:00.");
      return;
    }

    // Find service to get duration
    const selectedService = servicesList.find(
      (s) => (s.dichVuId || s.id) == newAppointment.dichVuId
    );
    if (!selectedService) {
      toast.error("Dịch vụ không hợp lệ.");
      return;
    }

    // Prepare payload
    const { nhanVienId, ...appointmentData } = newAppointment;
    const rawPayload = {
      ...appointmentData,
      thoiGianBatDau: newAppointment.thoiGianBatDau + ":00",
      dichVuId: parseInt(newAppointment.dichVuId),
      nhanVienId: newAppointment.nhanVienId
        ? parseInt(newAppointment.nhanVienId)
        : null,
      ghiChuKhachHang: newAppointment.ghiChu, // Map ghiChu to ghiChuKhachHang
    };

    // Filter out empty fields
    const payload = Object.keys(rawPayload).reduce((acc, key) => {
      if (
        rawPayload[key] !== "" &&
        rawPayload[key] !== null &&
        rawPayload[key] !== undefined
      ) {
        acc[key] = rawPayload[key];
      }
      return acc;
    }, {});

    try {
      console.log("Payload createAppointment:", payload);
      await petService.createAppointment(payload);
      toast.success("Tạo lịch hẹn mới thành công!");
      setIsAddModalOpen(false);
      setNewAppointment({
        thoiGianBatDau: "",
        dichVuId: "",
        nhanVienId: "",
        tenKhachHang: "",
        soDienThoaiKhachHang: "",
        tenThuCung: "",
        chungLoai: "",
        giongLoai: "",
        ngaySinh: "",
        gioiTinh: "",
        ghiChu: "",
      }); // Reset form
      fetchAppointments(); // Refresh list
      fetchStats();
    } catch (error) {
      console.error("Lỗi tạo lịch hẹn:", error);
      const errorMessage =
        error.response?.data?.message ||
        (typeof error.response?.data === "string" ? error.response.data : "") ||
        "Tạo lịch hẹn thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(errorMessage);
    }
  };

  const stats = [
    {
      title: "Lịch hẹn hôm nay",
      value: statsData.today,
      icon: "today",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    {
      title: "Đang chờ xác nhận",
      value: statsData.pending,
      icon: "pending_actions",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      border: "border-yellow-500",
    },
    {
      title: "Đã xác nhận",
      value: statsData.confirmed,
      icon: "check_circle",
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      border: "border-indigo-500",
    },
    {
      title: "Đã hoàn thành (Tháng)",
      value: statsData.completedMonth,
      icon: "event_available",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
  ];

  // --- UI ---

  return (
    <>
      {/* --- PHẦN HEADER & THỐNG KÊ (GIỮ NGUYÊN) --- */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Lịch hẹn
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
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

      {/* --- PHẦN BỘ LỌC (GIỮ NGUYÊN) --- */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative rounded-md shadow-sm max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400">
                  search
                </span>
              </div>
              <input
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
                placeholder="Tìm khách hàng, thú cưng..."
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="relative rounded-md shadow-sm max-w-xs">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md h-10"
              >
                <option value="">Tất cả trạng thái</option>
                {APPOINTMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              <span className="material-symbols-outlined text-sm mr-2">
                calendar_month
              </span>{" "}
              Lịch biểu
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none"
              onClick={() => setIsAddModalOpen(true)}
            >
              <span className="material-symbols-outlined text-sm mr-2">
                add
              </span>{" "}
              Tạo Lịch hẹn
            </button>
          </div>
        </div>
      </div>

      {/* --- BẢNG DỮ LIỆU (GIỮ NGUYÊN) --- */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thú cưng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhân viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                  <SkeletonRow key={idx} />
                ))
              ) : appointments.length > 0 ? (
                appointments.map((apt) => (
                  <tr
                    key={apt.lichHenId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{apt.lichHenId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {apt.tenKhachHang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {apt.tenThuCung || "Chưa có"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {apt.tenDichVu}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(apt.thoiGianBatDau)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {apt.tenNhanVien || "Chưa gán"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(apt.trangThaiLichHen)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetail(apt)}
                          className="text-gray-400 hover:text-green-600"
                        >
                          <span className="material-symbols-outlined text-base">
                            visibility
                          </span>
                        </button>
                        <button
                          onClick={() => handleEditClick(apt)}
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <span className="material-symbols-outlined text-base">
                            edit_note
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(apt.lichHenId)}
                          className="text-gray-400 hover:text-red-500"
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
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy lịch hẹn nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Phân trang đơn giản */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {totalElements > 0
                    ? (currentPage - 1) * ITEMS_PER_PAGE + 1
                    : 0}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {(currentPage - 1) * ITEMS_PER_PAGE + appointments.length}
                </span>{" "}
                trong số <span className="font-medium">{totalElements}</span>{" "}
                kết quả
              </p>
            </div>
            {totalPages > 1 && (
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
                        onClick={() => setCurrentPage(number)}
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
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <span className="material-symbols-outlined text-base">
                      chevron_right
                    </span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL CHI TIẾT (STYLE MỚI) --- */}
      <AnimatePresence>
        {isDetailModalOpen && selectedAppointment && (
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
                      visibility
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                      Chi tiết Lịch hẹn #{selectedAppointment.lichHenId}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Xem thông tin chi tiết của lịch hẹn
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
                <div className="space-y-12 max-w-4xl mx-auto">
                  {/* Section 1: Thông tin chung */}
                  <div className="pb-8 border-b border-border-light">
                    <div className="section-header flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-primary font-light text-2xl">
                        event_note
                      </span>
                      <h2 className="text-lg font-semibold text-text-heading">
                        Thông tin Lịch hẹn
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="input-group">
                        <label className="form-label block text-sm font-medium text-text-heading mb-2">
                          Dịch vụ
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                          {selectedAppointment.tenDichVu}
                        </div>
                      </div>
                      <div className="input-group">
                        <label className="form-label block text-sm font-medium text-text-heading mb-2">
                          Thời gian
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                          {formatDate(selectedAppointment.thoiGianBatDau)}
                        </div>
                      </div>
                      <div className="input-group">
                        <label className="form-label block text-sm font-medium text-text-heading mb-2">
                          Nhân viên phụ trách
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                          {selectedAppointment.tenNhanVien || "Chưa gán"}
                        </div>
                      </div>
                      <div className="input-group">
                        <label className="form-label block text-sm font-medium text-text-heading mb-2">
                          Trạng thái
                        </label>
                        <div className="mt-1">
                          {getStatusBadge(selectedAppointment.trangThaiLichHen)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Khách hàng & Thú cưng */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="flex flex-col h-full">
                      <div className="section-header flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-blue-400 font-light text-2xl">
                          person_outline
                        </span>
                        <h2 className="text-lg font-semibold text-text-heading">
                          Khách hàng
                        </h2>
                      </div>
                      <div className="space-y-6">
                        <div className="input-group">
                          <label className="form-label block text-sm font-medium text-text-heading mb-2">
                            Họ và tên
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                            {selectedAppointment.tenKhachHang}
                          </div>
                        </div>
                        {selectedAppointment.soDienThoaiKhachHang && (
                          <div className="input-group">
                            <label className="form-label block text-sm font-medium text-text-heading mb-2">
                              Số điện thoại
                            </label>
                            <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                              {selectedAppointment.soDienThoaiKhachHang}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col h-full">
                      <div className="section-header flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-orange-400 font-light text-2xl">
                          pets
                        </span>
                        <h2 className="text-lg font-semibold text-text-heading">
                          Thú cưng
                        </h2>
                      </div>
                      <div className="space-y-6">
                        <div className="input-group">
                          <label className="form-label block text-sm font-medium text-text-heading mb-2">
                            Tên thú cưng
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                            {selectedAppointment.tenThuCung ||
                              "Không có thông tin"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
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

      {/* --- MODAL XÁC NHẬN XÓA --- */}
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
                    Bạn có chắc chắn muốn xóa lịch hẹn này không? Hành động này
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

      {/* --- MODAL CHỈNH SỬA (STYLE MỚI) --- */}
      <AnimatePresence>
        {isEditModalOpen && editingAppointment && (
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
                      edit_note
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                      Chỉnh sửa Lịch hẹn #{editingAppointment.lichHenId}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Cập nhật trạng thái và nhân viên phụ trách
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-text-heading hover:bg-surface transition-all duration-300"
                >
                  <span className="material-symbols-outlined font-light">
                    close
                  </span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-8 md:p-10 bg-white overflow-y-auto">
                <div className="space-y-12 max-w-4xl mx-auto">
                  {/* Read-only Context Info */}
                  <div className="pb-8 border-b border-border-light">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-gray-400 font-light text-2xl">
                        info
                      </span>
                      <h2 className="text-lg font-semibold text-text-heading">
                        Thông tin chung
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">
                          Khách hàng
                        </label>
                        <div className="font-medium text-text-heading">
                          {editingAppointment.tenKhachHang}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">
                          Dịch vụ
                        </label>
                        <div className="font-medium text-text-heading">
                          {editingAppointment.tenDichVu}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">
                          Thời gian
                        </label>
                        <div className="font-medium text-text-heading">
                          {formatDate(editingAppointment.thoiGianBatDau)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-primary font-light text-2xl">
                        manage_accounts
                      </span>
                      <h2 className="text-lg font-semibold text-text-heading">
                        Cập nhật thông tin
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="input-group">
                        <label className="form-label">
                          Trạng thái <span className="text-primary">*</span>
                        </label>
                        <select
                          className="form-control"
                          value={editingAppointment.trangThaiLichHen || ""}
                          onChange={(e) =>
                            setEditingAppointment({
                              ...editingAppointment,
                              trangThaiLichHen: e.target.value,
                            })
                          }
                        >
                          {APPOINTMENT_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="input-group">
                        <label className="form-label">
                          Nhân viên phụ trách
                        </label>
                        <select
                          className="form-control"
                          value={editingAppointment.nhanVienId || ""}
                          onChange={(e) =>
                            setEditingAppointment({
                              ...editingAppointment,
                              nhanVienId: e.target.value,
                            })
                          }
                        >
                          <option value="">-- Chọn nhân viên --</option>
                          {staffList.map((s) => (
                            <option key={s.nhanVienId} value={s.nhanVienId}>
                              {s.hoTen}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleUpdateAppointment}
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

      {/* Modal Thêm mới Lịch hẹn (Form Mới) */}
      <AnimatePresence>
        {isAddModalOpen && (
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
                      edit_calendar
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                      Tạo Lịch Hẹn Mới
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Điền thông tin chi tiết cho cuộc hẹn
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-text-heading hover:bg-surface transition-all duration-300"
                >
                  <span className="material-symbols-outlined font-light">
                    close
                  </span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-8 md:p-10 bg-white">
                <div className="space-y-12 max-w-4xl mx-auto">
                  <div className="pb-8 border-b border-border-light">
                    <div className="section-header">
                      <span className="material-symbols-outlined text-primary font-light text-2xl">
                        event_note
                      </span>
                      <h2 className="section-title">Thông tin Lịch hẹn</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="input-group">
                        <label className="form-label">
                          Dịch vụ <span className="text-primary">*</span>
                        </label>
                        <select
                          className="form-control"
                          value={newAppointment.dichVuId}
                          onChange={(e) =>
                            setNewAppointment({
                              ...newAppointment,
                              dichVuId: e.target.value,
                            })
                          }
                        >
                          <option disabled value="">
                            Chọn loại dịch vụ...
                          </option>
                          {servicesList.map((service) => (
                            <option
                              key={service.dichVuId || service.id}
                              value={service.dichVuId || service.id}
                            >
                              {service.tenDichVu}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="input-group">
                        <label className="form-label">
                          Nhân viên phụ trách
                        </label>
                        <select
                          className="form-control text-text-body"
                          value={newAppointment.nhanVienId}
                          onChange={(e) =>
                            setNewAppointment({
                              ...newAppointment,
                              nhanVienId: e.target.value,
                            })
                          }
                        >
                          <option value="">Tự động chỉ định</option>
                          {staffList.map((employee) => (
                            <option
                              key={employee.nhanVienId}
                              value={employee.nhanVienId}
                            >
                              {employee.hoTen} ({employee.chucVu})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="input-group">
                        <label className="form-label">
                          Ngày hẹn <span className="text-primary">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="date"
                          value={
                            (newAppointment.thoiGianBatDau || "").split("T")[0]
                          }
                          onChange={(e) => {
                            const timePart =
                              (newAppointment.thoiGianBatDau || "").split(
                                "T"
                              )[1] || "08:00";
                            setNewAppointment({
                              ...newAppointment,
                              thoiGianBatDau: `${e.target.value}T${timePart}`,
                            });
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <label className="form-label">
                          Giờ hẹn <span className="text-primary">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="time"
                          value={
                            (newAppointment.thoiGianBatDau || "").split("T")[1]
                          }
                          onChange={(e) => {
                            const datePart =
                              (newAppointment.thoiGianBatDau || "").split(
                                "T"
                              )[0] || new Date().toISOString().split("T")[0];
                            setNewAppointment({
                              ...newAppointment,
                              thoiGianBatDau: `${datePart}T${e.target.value}`,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="flex flex-col h-full">
                      <div className="section-header">
                        <span className="material-symbols-outlined text-blue-400 font-light text-2xl">
                          person_outline
                        </span>
                        <h2 className="section-title">Thông tin Khách hàng</h2>
                      </div>
                      <div className="space-y-8 flex-1">
                        <div className="input-group">
                          <label className="form-label">
                            Họ và tên <span className="text-primary">*</span>
                          </label>
                          <input
                            className="form-control"
                            placeholder="Nhập tên khách hàng"
                            type="text"
                            value={newAppointment.tenKhachHang}
                            onChange={(e) =>
                              setNewAppointment({
                                ...newAppointment,
                                tenKhachHang: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="input-group">
                          <label className="form-label">
                            Số điện thoại{" "}
                            <span className="text-primary">*</span>
                          </label>
                          <div className="relative group">
                            <input
                              className="form-control pl-8"
                              placeholder="09xx xxx xxx"
                              type="tel"
                              value={newAppointment.soDienThoaiKhachHang}
                              onChange={(e) =>
                                setNewAppointment({
                                  ...newAppointment,
                                  soDienThoaiKhachHang: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="input-group">
                          <label className="form-label flex justify-between items-baseline mb-2">
                            <span>Ghi chú của khách hàng</span>
                            <span className="text-[10px] text-text-muted font-normal uppercase tracking-widest">
                              Tùy chọn
                            </span>
                          </label>
                          <textarea
                            className="form-control resize-none h-14 border-b border-border-light focus:border-primary bg-surface/50 p-2 rounded-sm overflow-hidden"
                            placeholder="Nhập các yêu cầu đặc biệt hoặc tình trạng sức khỏe của thú cưng..."
                            value={newAppointment.ghiChu}
                            onChange={(e) =>
                              setNewAppointment({
                                ...newAppointment,
                                ghiChu: e.target.value,
                              })
                            }
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col h-full">
                      <div className="section-header">
                        <span className="material-symbols-outlined text-orange-400 font-light text-2xl">
                          pets
                        </span>
                        <h2 className="section-title">Thông tin Thú cưng</h2>
                      </div>
                      <div className="space-y-8">
                        <div className="input-group">
                          <label className="form-label">Tên thú cưng</label>
                          <input
                            className="form-control"
                            placeholder="Tên bé"
                            type="text"
                            value={newAppointment.tenThuCung}
                            onChange={(e) =>
                              setNewAppointment({
                                ...newAppointment,
                                tenThuCung: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="input-group">
                            <label className="form-label">Chủng loại</label>
                            <select
                              className="form-control"
                              value={newAppointment.chungLoai}
                              onChange={(e) =>
                                setNewAppointment({
                                  ...newAppointment,
                                  chungLoai: e.target.value,
                                })
                              }
                            >
                              <option value="" disabled>
                                Chọn chủng loại...
                              </option>
                              <option value="Chó">Chó</option>
                              <option value="Mèo">Mèo</option>
                              <option value="Khác">Khác</option>
                            </select>
                          </div>
                          <div className="input-group">
                            <label className="form-label">Giới tính</label>
                            <select
                              className="form-control"
                              value={newAppointment.gioiTinh}
                              onChange={(e) =>
                                setNewAppointment({
                                  ...newAppointment,
                                  gioiTinh: e.target.value,
                                })
                              }
                            >
                              <option value="" disabled>
                                Chọn giới tính...
                              </option>
                              <option value="Đực">Đực</option>
                              <option value="Cái">Cái</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="input-group">
                            <label className="form-label">Giống loài</label>
                            <input
                              className="form-control"
                              placeholder="VD: Poodle"
                              type="text"
                              value={newAppointment.giongLoai}
                              onChange={(e) =>
                                setNewAppointment({
                                  ...newAppointment,
                                  giongLoai: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="input-group">
                            <label className="form-label">Ngày sinh</label>
                            <input
                              className="form-control"
                              type="date"
                              value={newAppointment.ngaySinh}
                              onChange={(e) =>
                                setNewAppointment({
                                  ...newAppointment,
                                  ngaySinh: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCreateAppointment}
                  className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 tracking-wide"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  Tạo Lịch Hẹn
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminAppointments;
