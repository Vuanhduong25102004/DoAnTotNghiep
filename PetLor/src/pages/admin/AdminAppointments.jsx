import React, { useState, useEffect } from "react";
import petService from "../../services/petService";
import userService from "../../services/userService";

// --- Helpers ---

// Format ngày giờ
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

// Hiển thị badge cho trạng thái
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
  "ĐANG THỰC HIỆN",
  "ĐÃ HOÀN THÀNH",
  "ĐÃ HỦY",
];

const AdminAppointments = () => {
  // --- State ---
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Filter and Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 6;

  // Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Data for Modals
  const [staffList, setStaffList] = useState([]);

  // --- Data Fetching ---

  // Fetch Appointments
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
      // Remove empty params
      if (!params.search) delete params.search;
      if (!params.status) delete params.status;

      const response = await petService.getAllAppointments(params);
      setAppointments(response?.content || []);
      setTotalPages(response?.totalPages || 0);
      setTotalElements(response?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
      alert("Không thể tải danh sách lịch hẹn.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch supporting data (staff) for modals
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // Fetch all staff for the dropdown by requesting a large page size.
        const response = await userService.getAllStaff({ page: 0, size: 200 });
        // The response is a page object, we need the 'content' array.
        const staffData = response?.content || [];
        setStaffList(staffData);
      } catch (error) {
        console.error("Lỗi tải danh sách nhân viên:", error);
      }
    };
    fetchStaff();
  }, []);

  // Re-fetch appointments when filters or page change
  useEffect(() => {
    fetchAppointments();
  }, [currentPage, searchTerm, statusFilter]);

  // --- Handlers ---

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (appointment) => {
    setEditingAppointment({ ...appointment });
    setIsEditModalOpen(true);
  };

  const handleUpdateAppointment = async () => {
    if (!editingAppointment) return;
    try {
      const payload = {
        nhanVienId: editingAppointment.nhanVienId,
        trangThaiLichHen: editingAppointment.trangThaiLichHen,
      };
      await petService.updateAppointment(editingAppointment.lichHenId, payload);
      alert("Cập nhật lịch hẹn thành công!");
      setIsEditModalOpen(false);
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error("Lỗi cập nhật lịch hẹn:", error);
      alert(
        `Cập nhật lịch hẹn thất bại: ${error.message || "Lỗi không xác định"}`
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) return;
    try {
      await petService.deleteAppointment(id);
      fetchAppointments(); // Refresh list
      alert("Xóa thành công!");
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại!");
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // --- UI ---

  if (loading && appointments.length === 0) {
    return (
      <div className="p-10 text-center">Đang tải danh sách lịch hẹn...</div>
    );
  }

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Lịch hẹn
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 border-l-4 border-blue-600">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <span className="material-symbols-outlined text-blue-600 text-2xl">
                  event_note
                </span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng số lịch hẹn
                  </dt>
                  <dd>
                    <div className="text-lg font-bold text-gray-900">
                      {totalElements}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        {/* Add more stats cards if needed */}
      </div>

      {/* Filters & Actions */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
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
                onChange={handleSearchChange}
              />
            </div>
            {/* Status Filter */}
            <div className="relative rounded-md shadow-sm max-w-xs">
              <select
                value={statusFilter}
                onChange={handleFilterChange}
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
        </div>
      </div>

      {/* Data Table */}
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
                  Dịch vụ cho thú cưng
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
              {loading && (
                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    Đang tải...
                  </td>
                </tr>
              )}
              {!loading && appointments.length > 0
                ? appointments.map((apt) => (
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
                            title="Xem chi tiết"
                          >
                            <span className="material-symbols-outlined text-base">
                              visibility
                            </span>
                          </button>
                          <button
                            onClick={() => handleEditClick(apt)}
                            className="text-gray-400 hover:text-blue-500"
                            title="Chỉnh sửa"
                          >
                            <span className="material-symbols-outlined text-base">
                              edit_note
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(apt.lichHenId)}
                            className="text-gray-400 hover:text-red-500"
                            title="Xóa"
                          >
                            <span className="material-symbols-outlined text-base">
                              cancel
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Không tìm thấy lịch hẹn nào phù hợp.
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
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
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
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

      {/* Modal Chi tiết Lịch hẹn */}
      {isDetailModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chi tiết Lịch hẹn #{selectedAppointment.lichHenId}
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p>{getStatusBadge(selectedAppointment.trangThaiLichHen)}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.tenKhachHang}
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedAppointment.soDienThoaiKhachHang}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thú cưng</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.tenThuCung || "Chưa có"}
                  </p>
                </div>
              </div>
              <hr />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Dịch vụ cho thú cưng</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.tenDichVu}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nhân viên thực hiện</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.tenNhanVien || "Chưa gán"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-medium text-gray-900">
                  {formatDate(selectedAppointment.thoiGianBatDau)} -{" "}
                  {formatDate(selectedAppointment.thoiGianKetThuc)}
                </p>
              </div>
              {selectedAppointment.ghiChuKhachHang && (
                <div>
                  <p className="text-sm text-gray-500">Ghi chú của khách</p>
                  <p className="text-gray-800 bg-gray-50 p-2 rounded-md">
                    {selectedAppointment.ghiChuKhachHang}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
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

      {/* Modal Chỉnh sửa Lịch hẹn */}
      {isEditModalOpen && editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chỉnh sửa Lịch hẹn #{editingAppointment.lichHenId}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium text-gray-900">
                  {editingAppointment.tenKhachHang}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dịch vụ cho thú cưng</p>
                <p className="font-medium text-gray-900">
                  {editingAppointment.tenDichVu}
                </p>
              </div>
              <hr />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingAppointment.trangThaiLichHen || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      trangThaiLichHen: e.target.value,
                    })
                  }
                >
                  {APPOINTMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gán nhân viên
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingAppointment.nhanVienId || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      nhanVienId: e.target.value,
                    })
                  }
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {staffList.map((staff) => (
                    <option key={staff.nhanVienId} value={staff.nhanVienId}>
                      {staff.hoTen} ({staff.chucVu || "Nhân viên"})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateAppointment}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 font-medium"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminAppointments;
