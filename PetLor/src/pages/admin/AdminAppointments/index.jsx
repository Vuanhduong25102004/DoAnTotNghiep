/**
 * @file index.jsx
 * @description Trang quản lý lịch hẹn (Container) - Đã cập nhật dùng bookingService.
 */
import React, { useState, useEffect } from "react";
import useEscapeKey from "../../../hooks/useEscapeKey";
import petService from "../../../services/petService"; // Giữ lại để lấy Dịch vụ
import userService from "../../../services/userService";
import bookingService from "../../../services/bookingService"; // <--- IMPORT MỚI
import { toast } from "react-toastify";

// Components
import AppointmentStats from "./components/AppointmentStats";
import AppointmentFilters from "./components/AppointmentFilters";
import AppointmentTable from "./components/AppointmentTable";
import AppointmentDetailModal from "./components/modals/AppointmentDetailModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import AppointmentFormModal from "./components/modals/AppointmentFormModal";

const AdminAppointments = () => {
  // --- State ---
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  // Data Selection
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [appointmentToDeleteId, setAppointmentToDeleteId] = useState(null);

  // Dropdown Data
  const [staffList, setStaffList] = useState([]);
  const [servicesList, setServicesList] = useState([]);

  // Stats
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    confirmed: 0,
    completedMonth: 0,
  });

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 5;

  // --- 1. Fetch Logic ---

  // Hàm tính toán thống kê (Fix lỗi logic năm)
  const fetchStats = async () => {
    try {
      // SỬA: Dùng bookingService
      const response = await bookingService.getAllAppointments({
        page: 0,
        size: 1000, // Lấy danh sách lớn để tính toán
      });
      const allApts = response?.content || [];

      const now = new Date();
      // Chuỗi YYYY-MM-DD hôm nay
      const todayStr = now.toISOString().slice(0, 10);
      const currentMonth = now.getMonth(); // 0-11
      const currentYear = now.getFullYear();

      let countToday = 0;
      let countPending = 0;
      let countConfirmed = 0;
      let countCompletedMonth = 0;

      allApts.forEach((apt) => {
        // 1. Đếm hôm nay
        if (apt.thoiGianBatDau && apt.thoiGianBatDau.startsWith(todayStr)) {
          countToday++;
        }

        // 2. Đếm trạng thái
        if (apt.trangThaiLichHen === "CHO_XAC_NHAN") {
          countPending++;
        } else if (apt.trangThaiLichHen === "DA_XAC_NHAN") {
          countConfirmed++;
        }

        // 3. Đếm hoàn thành trong tháng (Check cả Tháng + Năm)
        if (apt.trangThaiLichHen === "DA_HOAN_THANH" && apt.thoiGianBatDau) {
          const aptDate = new Date(apt.thoiGianBatDau);
          if (
            aptDate.getMonth() === currentMonth &&
            aptDate.getFullYear() === currentYear
          ) {
            countCompletedMonth++;
          }
        }
      });

      setStats({
        today: countToday,
        pending: countPending,
        confirmed: countConfirmed,
        completedMonth: countCompletedMonth,
      });
    } catch (error) {
      console.error("Lỗi tải thống kê:", error);
    }
  };

  // Hàm tải dữ liệu bảng (Phân trang)
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1;
      const params = {
        page,
        size: ITEMS_PER_PAGE,
        search: debouncedSearchTerm,
        status: statusFilter,
      };
      if (!params.search) delete params.search;
      if (!params.status) delete params.status;

      // SỬA: Dùng bookingService
      const response = await bookingService.getAllAppointments(params);
      setAppointments(response?.content || []);
      setTotalPages(response?.totalPages || 0);
      setTotalElements(response?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch (Dropdowns & Stats)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [staffRes, servicesRes] = await Promise.all([
          userService.getAllStaff({ page: 0, size: 100 }),
          petService.getAllServices(), // Vẫn dùng petService cho Dịch vụ
        ]);
        setStaffList(staffRes?.content || []);
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

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Table Data
  useEffect(() => {
    fetchAppointments();
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  // --- Handlers ---

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  const handleDeleteClick = (id) => {
    setAppointmentToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!appointmentToDeleteId) return;
    try {
      // SỬA: Dùng bookingService
      await bookingService.deleteAppointment(appointmentToDeleteId);

      toast.success("Xóa lịch hẹn thành công!");
      fetchAppointments();
      fetchStats(); // Update stats logic
    } catch (error) {
      toast.error("Xóa thất bại!");
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setAppointmentToDeleteId(null);
    }
  };

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingAppointment(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (appointment) => {
    const appointmentForForm = {
      ...appointment,
      trangThai: appointment.trangThaiLichHen,
    };
    setEditingAppointment(appointmentForForm);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (
      !formData.thoiGianBatDau ||
      !formData.dichVuId ||
      !formData.tenKhachHang
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }
    try {
      if (editingAppointment) {
        // UPDATE Logic
        const updatePayload = {
          dichVuId: formData.dichVuId ? parseInt(formData.dichVuId) : null,
          nhanVienId: formData.nhanVienId
            ? parseInt(formData.nhanVienId)
            : null,
          thoiGianBatDau: formData.thoiGianBatDau,
          trangThai: formData.trangThai,
          ghiChuKhachHang: formData.ghiChu,
          tenKhachHang: formData.tenKhachHang,
          soDienThoaiKhachHang: formData.soDienThoaiKhachHang,
          tenThuCung: formData.tenThuCung,
        };
        const cleanPayload = Object.fromEntries(
          Object.entries(updatePayload).filter(
            ([_, v]) => v !== null && v !== undefined && v !== ""
          )
        );

        // SỬA: Dùng bookingService
        await bookingService.updateAppointment(
          editingAppointment.lichHenId,
          cleanPayload
        );
        toast.success("Cập nhật lịch hẹn thành công!");
      } else {
        // CREATE Logic
        const createPayload = {
          thoiGianBatDau: formData.thoiGianBatDau,
          dichVuId: parseInt(formData.dichVuId),
          nhanVienId: formData.nhanVienId
            ? parseInt(formData.nhanVienId)
            : null,
          tenKhachHang: formData.tenKhachHang,
          soDienThoaiKhachHang: formData.soDienThoaiKhachHang,
          tenThuCung: formData.tenThuCung,
          chungLoai: formData.chungLoai,
          giongLoai: formData.giongLoai,
          gioiTinh: formData.gioiTinh,
          ngaySinh: formData.ngaySinh,
          ghiChuKhachHang: formData.ghiChu,
        };
        const cleanPayload = Object.fromEntries(
          Object.entries(createPayload).filter(
            ([_, v]) => v != null && v !== ""
          )
        );

        // SỬA: Dùng bookingService
        await bookingService.createAppointment(cleanPayload);
        toast.success("Tạo lịch hẹn mới thành công!");
      }
      setIsFormModalOpen(false);
      fetchAppointments();
      fetchStats(); // Update stats logic
    } catch (error) {
      console.error("Lỗi thao tác:", error);
      toast.error(error.response?.data?.message || "Thao tác thất bại.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Lịch hẹn
        </p>
      </div>

      <AppointmentStats
        today={stats.today}
        pending={stats.pending}
        confirmed={stats.confirmed}
        completedMonth={stats.completedMonth}
      />

      <AppointmentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setCurrentPage={setCurrentPage}
        onOpenAddModal={handleOpenCreateModal}
      />

      <AppointmentTable
        loading={loading}
        appointments={appointments}
        totalElements={totalElements}
        totalPages={totalPages}
        currentPage={currentPage}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
        indexOfFirstItem={indexOfFirstItem}
        onViewDetail={handleViewDetail}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteClick}
      />

      {/* Modals */}
      <AppointmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        appointment={selectedAppointment}
      />
      <AppointmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={editingAppointment}
        servicesList={servicesList}
        staffList={staffList}
        onSubmit={handleFormSubmit}
      />
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default AdminAppointments;
