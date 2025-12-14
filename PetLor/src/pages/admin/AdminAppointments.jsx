import React, { useEffect, useState } from "react";
import petService from "../../services/petService"; // Dùng chung service với Pet
import userService from "../../services/userservice"; // Thêm service để lấy nhân viên

// Helper: Format ngày giờ
const formatDateTime = (dateString) => {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper: Badge trạng thái
const getStatusBadge = (status) => {
  const s = status ? status.toLowerCase() : "";
  if (s.includes("xác nhận") || s.includes("confirmed"))
    return "bg-blue-100 text-blue-800 border-blue-200";
  if (s.includes("hoàn thành") || s.includes("completed"))
    return "bg-green-100 text-green-800 border-green-200";
  if (s.includes("hủy") || s.includes("cancelled"))
    return "bg-red-100 text-red-800 border-red-200";
  // Mặc định: Chờ xác nhận / Pending
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
};

const AdminAppointments = () => {
  // 1. State
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    thoiGianBatDau: "",
    dichVuId: "",
    nhanVienId: "",
    tenKhachHang: "",
    soDienThoaiKhachHang: "",
    tenThuCung: "",
    chungLoai: "Chó",
    giongLoai: "",
    ngaySinh: "",
    gioiTinh: "Đực",
    ghiChu: "",
  });
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  // 2. Fetch Data
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const [response, servicesRes, staffRes] = await Promise.all([
        petService.getAllAppointments(),
        petService.getAllServices(),
        userService.getAllStaff(),
      ]);

      // Map dữ liệu từ API
      const formattedData = Array.isArray(response)
        ? response.map((app) => ({
            ...app,
            lichHenId: app.lichHenId || app.id,
            // Map tên Khách hàng
            khachHang:
              app.tenKhachHang ||
              (app.user
                ? app.user.hoTen || app.user.tenNguoiDung
                : "Khách vãng lai"),
            soDienThoai:
              app.soDienThoaiKhachHang ||
              (app.user ? app.user.soDienThoai : ""),
            // Map tên Thú cưng
            thuCung:
              app.tenThuCung || (app.thuCung ? app.thuCung.tenThuCung : "---"),
            // Map tên Dịch vụ
            dichVu:
              app.tenDichVu || (app.dichVu ? app.dichVu.tenDichVu : "---"),
            // Map tên Nhân viên (Bác sĩ/KTV)
            nhanVien:
              app.tenNhanVien ||
              (app.nhanVien
                ? app.nhanVien.hoTen || app.nhanVien.tenNhanVien
                : "Chưa phân công"),

            thoiGianBatDau: app.thoiGianBatDau,
            thoiGianKetThuc: app.thoiGianKetThuc,
            trangThai: app.trangThaiLichHen || app.trangThai || "Chờ xác nhận",
            ghiChu: app.ghiChuKhachHang || app.ghiChu || "",
          }))
        : [];

      // Sắp xếp: Lịch mới nhất lên đầu
      formattedData.sort(
        (a, b) => new Date(b.thoiGianBatDau) - new Date(a.thoiGianBatDau)
      );

      setAppointments(formattedData);
      // Store services and staff for dropdowns
      setServices(
        Array.isArray(servicesRes)
          ? servicesRes.map((s) => ({ ...s, dichVuId: s.id || s.dichVuId }))
          : []
      );
      const formattedStaff = Array.isArray(staffRes)
        ? staffRes.map((emp) => ({
            ...emp,
            nhanVienId: emp.id || emp.nhanVienId,
            hoTen: emp.hoTen || emp.tenNhanVien,
            chucVu: emp.chucVu || emp.vaiTro || "Nhân viên",
          }))
        : [];
      setStaff(formattedStaff);
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
      alert("Không thể tải danh sách lịch hẹn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Reset trang về 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDate]);

  // 3. Actions
  const handleViewDetail = async (id) => {
    try {
      const data = await petService.getAppointmentById(id);
      setSelectedAppointment(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi tải chi tiết lịch hẹn:", error);
      alert("Không thể tải chi tiết lịch hẹn.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy/xóa lịch hẹn này?")) return;
    try {
      await petService.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.lichHenId !== id));
      alert("Đã xóa lịch hẹn.");
    } catch (error) {
      alert("Xóa thất bại.");
    }
  };

  const handleEditClick = (app) => {
    const formatForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setEditingAppointment({
      ...app,
      thoiGianBatDau: formatForInput(app.thoiGianBatDau),
      thoiGianKetThuc: formatForInput(app.thoiGianKetThuc),
      trangThaiLichHen: app.trangThai,
      ghiChuKhachHang: app.ghiChu,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAppointment = async () => {
    if (!editingAppointment) return;
    try {
      const payload = {
        thoiGianBatDau: editingAppointment.thoiGianBatDau + ":00",
        thoiGianKetThuc: editingAppointment.thoiGianKetThuc + ":00",
        trangThaiLichHen: editingAppointment.trangThaiLichHen,
        ghiChuKhachHang: editingAppointment.ghiChuKhachHang,
      };

      await petService.updateAppointment(editingAppointment.lichHenId, payload);

      setAppointments((prev) =>
        prev.map((a) =>
          a.lichHenId === editingAppointment.lichHenId
            ? {
                ...a,
                thoiGianBatDau: payload.thoiGianBatDau,
                thoiGianKetThuc: payload.thoiGianKetThuc,
                trangThai: payload.trangThaiLichHen,
                ghiChu: payload.ghiChuKhachHang,
              }
            : a
        )
      );
      setIsEditModalOpen(false);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại.");
    }
  };

  const handleCreateAppointment = async () => {
    // Validation
    if (
      !newAppointment.thoiGianBatDau ||
      !newAppointment.dichVuId ||
      !newAppointment.tenKhachHang
    ) {
      alert(
        "Vui lòng điền các trường bắt buộc: Thời gian, Dịch vụ, Tên khách hàng."
      );
      return;
    }

    // Find service to get duration
    const selectedService = services.find(
      (s) => s.dichVuId == newAppointment.dichVuId
    );
    if (!selectedService) {
      alert("Dịch vụ không hợp lệ.");
      return;
    }

    // Calculate end time based on service duration
    const startDate = new Date(newAppointment.thoiGianBatDau);
    const durationMinutes = selectedService.thoiLuongUocTinhPhut || 60; // Default to 60 mins if not set
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    // Prepare payload
    const payload = {
      ...newAppointment,
      thoiGianBatDau: newAppointment.thoiGianBatDau + ":00",
      thoiGianKetThuc: endDate.toISOString(), // Backend should handle this format
      dichVuId: parseInt(newAppointment.dichVuId),
      nhanVienId: newAppointment.nhanVienId
        ? parseInt(newAppointment.nhanVienId)
        : null,
    };

    try {
      await petService.createAppointment(payload);
      alert("Tạo lịch hẹn thành công!");
      setIsAddModalOpen(false);
      setNewAppointment({
        thoiGianBatDau: "",
        dichVuId: "",
        nhanVienId: "",
        tenKhachHang: "",
        soDienThoaiKhachHang: "",
        tenThuCung: "",
        chungLoai: "Chó",
        giongLoai: "",
        ngaySinh: "",
        gioiTinh: "Đực",
        ghiChu: "",
      }); // Reset form
      fetchAppointments(); // Refresh list
    } catch (error) {
      console.error("Lỗi tạo lịch hẹn:", error);
      alert("Tạo lịch hẹn thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  // 4. Filter Logic
  const filteredApps = appointments.filter((app) => {
    const matchSearch =
      (app.khachHang &&
        app.khachHang.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.thuCung &&
        app.thuCung.toLowerCase().includes(searchTerm.toLowerCase()));

    // Lọc theo ngày bắt đầu (So sánh chuỗi ngày YYYY-MM-DD)
    const matchDate = filterDate
      ? app.thoiGianBatDau.startsWith(filterDate)
      : true;

    return matchSearch && matchDate;
  });

  // Logic Phân trang
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredApps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 5. Stats
  // Lịch hôm nay: So sánh ngày hiện tại với ngày bắt đầu của lịch
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = appointments.filter(
    (a) => a.thoiGianBatDau && a.thoiGianBatDau.startsWith(todayStr)
  ).length;

  const pendingCount = appointments.filter(
    (a) =>
      a.trangThai.toLowerCase().includes("chờ") ||
      a.trangThai.toLowerCase().includes("pending")
  ).length;

  const completedMonthCount = appointments.filter(
    (a) =>
      (a.trangThai.toLowerCase().includes("hoàn thành") ||
        a.trangThai.toLowerCase().includes("completed")) &&
      new Date(a.thoiGianBatDau).getMonth() === new Date().getMonth() // Trong tháng này
  ).length;

  const stats = [
    {
      title: "Lịch hẹn hôm nay",
      value: todayCount,
      icon: "today",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    {
      title: "Đang chờ xác nhận",
      value: pendingCount,
      icon: "pending_actions",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      border: "border-yellow-500",
    },
    {
      title: "Đã hoàn thành (Tháng)",
      value: completedMonthCount,
      icon: "event_available",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
  ];

  if (loading)
    return <div className="p-10 text-center">Đang tải lịch hẹn...</div>;

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Lịch hẹn
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
                placeholder="Tìm tên khách, thú cưng..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Date Filter */}
            <div className="relative">
              <input
                className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
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
                  Thông tin Khách & Pet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dịch vụ & Nhân viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
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
              {currentItems.length > 0 ? (
                currentItems.map((app, index) => (
                  <tr
                    key={app.lichHenId || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{app.lichHenId}
                    </td>

                    {/* Thông tin Khách */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {app.khachHang}
                      </div>
                      {app.soDienThoai && (
                        <div className="text-xs text-gray-500">
                          {app.soDienThoai}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Pet:{" "}
                        <span className="font-semibold">{app.thuCung}</span>
                      </div>
                    </td>

                    {/* Dịch vụ & NV */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.dichVu}</div>
                      <div className="text-xs text-gray-500">
                        Phụ trách: {app.nhanVien}
                      </div>
                    </td>

                    {/* Thời gian */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        Bắt đầu:{" "}
                        <span className="text-gray-900">
                          {formatDateTime(app.thoiGianBatDau)}
                        </span>
                      </div>
                      {/* <div>Kết thúc: {formatDateTime(app.thoiGianKetThuc)}</div> */}
                    </td>

                    {/* Ghi chú */}
                    <td className="px-6 py-4 whitespace-normal max-w-xs text-sm text-gray-500 italic">
                      {app.ghiChu || "---"}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                          app.trangThai
                        )}`}
                      >
                        {app.trangThai}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          title="Xem chi tiết"
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          onClick={() => handleViewDetail(app.lichHenId)}
                        >
                          <span className="material-symbols-outlined text-base">
                            visibility
                          </span>
                        </button>
                        <button
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                          title="Chỉnh sửa"
                          onClick={() => handleEditClick(app)}
                        >
                          <span className="material-symbols-outlined text-base">
                            edit_note
                          </span>
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Hủy lịch"
                          onClick={() => handleDelete(app.lichHenId)}
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
                    Không tìm thấy lịch hẹn nào.
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
                  {filteredApps.length > 0 ? indexOfFirstItem + 1 : 0}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredApps.length)}
                </span>{" "}
                trong số{" "}
                <span className="font-medium">{filteredApps.length}</span> kết
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
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.tenKhachHang}
                  </p>
                  <p className="text-xs text-gray-500">
                    SĐT: {selectedAppointment.soDienThoaiKhachHang}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thú cưng</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.tenThuCung}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: #{selectedAppointment.thuCungId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dịch vụ</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.tenDichVu}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nhân viên phụ trách</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.tenNhanVien}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                      selectedAppointment.trangThaiLichHen
                    )}`}
                  >
                    {selectedAppointment.trangThaiLichHen}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Thời gian</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(selectedAppointment.thoiGianBatDau)} -{" "}
                    {formatDateTime(selectedAppointment.thoiGianKetThuc)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Ghi chú khách hàng</p>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-700 border border-gray-100 italic">
                    {selectedAppointment.ghiChuKhachHang || "Không có ghi chú."}
                  </div>
                </div>
              </div>
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
                <label className="block text-sm font-medium text-gray-700">
                  Thời gian bắt đầu
                </label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingAppointment.thoiGianBatDau || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      thoiGianBatDau: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thời gian kết thúc
                </label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingAppointment.thoiGianKetThuc || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      thoiGianKetThuc: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingAppointment.trangThaiLichHen || "CHỜ XÁC NHẬN"}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      trangThaiLichHen: e.target.value,
                    })
                  }
                >
                  <option value="CHỜ XÁC NHẬN">Chờ xác nhận</option>
                  <option value="ĐÃ XÁC NHẬN">Đã xác nhận</option>
                  <option value="ĐÃ HOÀN THÀNH">Đã hoàn thành</option>
                  <option value="ĐÃ HỦY">Đã hủy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú khách hàng
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingAppointment.ghiChuKhachHang || ""}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      ghiChuKhachHang: e.target.value,
                    })
                  }
                />
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
                onClick={handleSaveAppointment}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 font-medium"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm mới Lịch hẹn */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Tạo Lịch hẹn mới
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Appointment Info */}
              <div className="p-4 border rounded-lg bg-gray-50/50">
                <h4 className="font-semibold text-gray-800 mb-3">
                  1. Thông tin Lịch hẹn
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      value={newAppointment.dichVuId}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          dichVuId: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Chọn dịch vụ --</option>
                      {services.map((service) => (
                        <option key={service.dichVuId} value={service.dichVuId}>
                          {service.tenDichVu}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nhân viên phụ trách
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      value={newAppointment.nhanVienId}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          nhanVienId: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Tự động/Chưa phân công --</option>{" "}
                      {staff.map((employee) => (
                        <option
                          key={employee.nhanVienId}
                          value={employee.nhanVienId}
                        >
                          {employee.hoTen} ({employee.chucVu})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Thời gian bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      value={newAppointment.thoiGianBatDau}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          thoiGianBatDau: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Customer and Pet Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg space-y-4">
                  <h4 className="font-semibold text-gray-800">
                    2. Thông tin Khách hàng (Mới)
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên khách hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={newAppointment.tenKhachHang}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          tenKhachHang: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={newAppointment.soDienThoaiKhachHang}
                      placeholder="Để nhận thông báo qua Zalo/SMS"
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          soDienThoaiKhachHang: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-4">
                  <h4 className="font-semibold text-gray-800">
                    3. Thông tin Thú cưng (Mới)
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên thú cưng
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={newAppointment.tenThuCung}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          tenThuCung: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Chủng loại
                      </label>
                      <select
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={newAppointment.chungLoai}
                        onChange={(e) =>
                          setNewAppointment({
                            ...newAppointment,
                            chungLoai: e.target.value,
                          })
                        }
                      >
                        <option value="Chó">Chó</option>
                        <option value="Mèo">Mèo</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Giới tính
                      </label>
                      <select
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={newAppointment.gioiTinh}
                        onChange={(e) =>
                          setNewAppointment({
                            ...newAppointment,
                            gioiTinh: e.target.value,
                          })
                        }
                      >
                        <option value="Đực">Đực</option>
                        <option value="Cái">Cái</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Giống loài
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={newAppointment.giongLoai}
                      placeholder="VD: Poodle, Mèo Anh lông ngắn"
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          giongLoai: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú của khách hàng
                </label>
                <textarea
                  rows={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newAppointment.ghiChu}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      ghiChu: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateAppointment}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 font-medium"
              >
                Tạo lịch hẹn
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminAppointments;
