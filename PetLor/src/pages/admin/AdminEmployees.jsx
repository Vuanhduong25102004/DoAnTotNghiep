import React, { useEffect, useState } from "react";
import userService from "../../services/userService"; // Sử dụng service đã có
import { motion, AnimatePresence } from "framer-motion";

// --- Helpers (Hàm hỗ trợ) ---

/**
 * Trả về các lớp CSS cho badge dựa trên chức vụ của nhân viên.
 * @param {string} position - Chức vụ của nhân viên (ví dụ: "Bác sĩ", "Groomer").
 * @returns {string} - Chuỗi các lớp CSS của Tailwind.
 */
const getPositionBadge = (position) => {
  // Chuẩn hóa chuỗi để so sánh
  const pos = position ? position.toLowerCase() : "";

  if (pos.includes("bác sĩ") || pos.includes("doctor"))
    return "bg-green-100 text-green-800 border-green-200";
  if (
    pos.includes("làm đẹp") ||
    pos.includes("groomer") ||
    pos.includes("grooming") ||
    pos.includes("spa") ||
    pos.includes("cắt tỉa") ||
    pos.includes("chăm sóc")
  )
    return "bg-pink-100 text-pink-800 border-pink-200";
  if (pos.includes("huấn luyện") || pos.includes("trainer"))
    return "bg-orange-100 text-orange-800 border-orange-200";
  if (pos.includes("quản lý") || pos.includes("manager"))
    return "bg-purple-100 text-purple-800 border-purple-200";

  return "bg-gray-100 text-gray-800 border-gray-200";
};

// Component Skeleton Loading cho Table
const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100 last:border-0">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
    <td className="px-6 py-4 flex items-center gap-3">
      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div>
    </td>
  </tr>
);

/**
 * Component chính cho trang quản lý nhân viên.
 */
const AdminEmployees = () => {
  // --- 1. State Management (Quản lý Trạng thái) ---

  // State lưu trữ dữ liệu chính
  const [employees, setEmployees] = useState([]); // Danh sách nhân viên
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  // State cho các modal (cửa sổ pop-up)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Modal xem chi tiết
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal chỉnh sửa
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal thêm mới
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [employeeToDeleteId, setEmployeeToDeleteId] = useState(null);

  // State lưu trữ dữ liệu cho các form
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Nhân viên được chọn để xem chi tiết
  const [editingEmployee, setEditingEmployee] = useState(null); // Nhân viên đang được chỉnh sửa
  const [newEmployeeData, setNewEmployeeData] = useState({
    // Dữ liệu cho form thêm nhân viên mới
    hoTen: "",
    email: "",
    password: "",
    soDienThoai: "",
    diaChi: "",
    chucVu: "",
    chuyenKhoa: "",
    kinhNghiem: "",
    role: "STAFF",
  });
  const [avatarFile, setAvatarFile] = useState(null); // File ảnh đại diện được chọn

  // State cho bộ lọc và phân trang
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [filterPosition, setFilterPosition] = useState(""); // Lọc theo chức vụ
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [totalElements, setTotalElements] = useState(0); // Tổng số nhân viên
  const ITEMS_PER_PAGE = 5;

  // --- 2. Data Fetching (Lấy Dữ liệu từ API) ---

  /**
   * Lấy danh sách nhân viên từ API dựa trên các tham số phân trang và lọc.
   */
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1; // API is 0-indexed
      const params = {
        page,
        size: ITEMS_PER_PAGE,
        search: searchTerm,
        position: filterPosition, // Backend sẽ lọc theo 'position' (chức vụ)
      };
      if (!params.search) delete params.search;
      if (!params.position) delete params.position;

      const response = await userService.getAllStaff(params);

      // Map dữ liệu từ API
      const employeesData = response?.content ?? [];
      const formattedData = employeesData.map((emp) => ({
        ...emp,
        nhanVienId: emp.nhanVienId,
        hoTen: emp.hoTen || "Chưa có tên",
        email: emp.email || "---",
        soDienThoai: emp.soDienThoai || "---",
        chucVu: emp.chucVu || "Nhân viên",
        img: emp.anhDaiDien
          ? `http://localhost:8080/uploads/${emp.anhDaiDien}`
          : "https://placehold.co/100x100?text=Staff",
      }));
      setEmployees(formattedData);
      setTotalPages(response?.totalPages || 0);
      setTotalElements(response?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi tải danh sách nhân viên:", error);
      alert("Không thể tải dữ liệu nhân viên.");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Side Effects (Xử lý Tác vụ Phụ) ---

  // Tải lại danh sách nhân viên mỗi khi trang, từ khóa tìm kiếm hoặc bộ lọc thay đổi.
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchTerm, filterPosition]);

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

  // --- 4. Event Handlers (Hàm Xử lý Sự kiện) ---

  // Mở modal xác nhận xóa
  const handleDeleteClick = (id) => {
    setEmployeeToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  // Thực hiện xóa sau khi xác nhận
  const confirmDelete = async () => {
    if (!employeeToDeleteId) return;
    try {
      await userService.deleteStaff(employeeToDeleteId);
      alert("Xóa thành công!");
      fetchEmployees(); // Tải lại danh sách
    } catch (error) {
      console.error(error);
      alert(
        "Xóa thất bại! Có thể nhân viên đang phụ trách lịch hẹn hoặc đơn hàng."
      );
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setEmployeeToDeleteId(null);
    }
  };

  // Mở modal và tải chi tiết nhân viên để xem
  const handleViewDetail = async (id) => {
    try {
      const data = await userService.getStaffById(id);
      setSelectedEmployee(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi tải chi tiết nhân viên:", error);
      alert("Không thể tải chi tiết nhân viên.");
    }
  };

  // Mở modal chỉnh sửa và điền dữ liệu của nhân viên được chọn
  const handleEditClick = (emp) => {
    setEditingEmployee({ ...emp });
    setAvatarFile(null);
    setIsEditModalOpen(true);
  };

  // Lưu thay đổi sau khi chỉnh sửa nhân viên
  const handleSaveEmployee = async () => {
    if (!editingEmployee) return;

    const formData = new FormData();
    const employeeData = {
      hoTen: editingEmployee.hoTen,
      chucVu: editingEmployee.chucVu,
      soDienThoai: editingEmployee.soDienThoai,
      email: editingEmployee.email,
      chuyenKhoa: editingEmployee.chuyenKhoa,
      kinhNghiem: editingEmployee.kinhNghiem,
      userId: editingEmployee.userId,
    };

    // Gửi dữ liệu nhân viên dưới dạng Blob với Content-Type application/json
    const jsonBlob = new Blob([JSON.stringify(employeeData)], {
      type: "application/json",
    });
    formData.append("nhanVien", jsonBlob);

    // Append file if it exists
    if (avatarFile) {
      formData.append("anhDaiDien", avatarFile);
    }

    try {
      await userService.updateStaff(editingEmployee.nhanVienId, formData);
      fetchEmployees();
      setIsEditModalOpen(false);
      setAvatarFile(null);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại.");
    }
  };

  // Mở modal để thêm nhân viên mới
  const handleOpenCreateModal = () => {
    setNewEmployeeData({
      hoTen: "",
      email: "",
      password: "",
      soDienThoai: "",
      diaChi: "",
      chucVu: "",
      chuyenKhoa: "",
      kinhNghiem: "",
      role: "STAFF",
    });
    setAvatarFile(null);
    setIsAddModalOpen(true);
  };

  // Gửi dữ liệu để tạo nhân viên mới
  const handleCreateEmployee = async () => {
    // Validation
    if (
      !newEmployeeData.hoTen ||
      !newEmployeeData.email ||
      !newEmployeeData.password
    ) {
      alert("Vui lòng điền các trường bắt buộc: Họ tên, Email, Mật khẩu.");
      return;
    }

    const formData = new FormData();
    // Gửi dữ liệu nhân viên dưới dạng Blob với Content-Type application/json
    // Key là 'nguoiDung' theo yêu cầu API tạo mới unified
    const jsonBlob = new Blob([JSON.stringify(newEmployeeData)], {
      type: "application/json",
    });
    formData.append("nguoiDung", jsonBlob);

    // Gửi file ảnh (nếu có) với key 'anhDaiDien'
    if (avatarFile) {
      formData.append("anhDaiDien", avatarFile);
    }

    try {
      // Sử dụng endpoint chung để tạo user và nhân viên
      await userService.createUnifiedUser(formData);
      alert("Tạo mới nhân viên thành công!");
      setIsAddModalOpen(false);
      setAvatarFile(null);
      fetchEmployees(); // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi tạo nhân viên:", error);
      alert(
        "Tạo mới thất bại. Email có thể đã tồn tại hoặc dữ liệu không hợp lệ."
      );
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // --- 5. Derived Data & Calculations (Dữ liệu & Tính toán) ---

  // Tính toán các chỉ số thống kê (chỉ dựa trên dữ liệu của trang hiện tại)
  const totalStaff = totalElements;
  const countVets = employees.filter(
    (e) =>
      e.chucVu && (e.chucVu.includes("Bác sĩ") || e.chucVu.includes("Doctor"))
  ).length;
  const countGroomers = employees.filter(
    (e) =>
      e.chucVu &&
      (e.chucVu.toLowerCase().includes("spa") ||
        e.chucVu.toLowerCase().includes("grooming") ||
        e.chucVu.toLowerCase().includes("chăm sóc"))
  ).length;

  // Tính toán index của item đầu tiên trên trang
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  const stats = [
    {
      title: "Tổng nhân viên",
      value: totalStaff,
      icon: "badge",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    {
      title: "Bác sĩ thú y",
      value: countVets,
      icon: "medical_services",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
    {
      title: "Bộ phận Spa/Grooming",
      value: countGroomers,
      icon: "content_cut",
      color: "text-pink-600",
      bg: "bg-pink-100",
      border: "border-pink-500",
    },
  ];

  // --- 6. UI Rendering (Kết xuất Giao diện) ---

  // Hiển thị màn hình tải dữ liệu
  return (
    <>
      {/* Tiêu đề trang */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Nhân viên
        </p>
      </div>

      {/* Lưới thống kê */}
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

      {/* Bộ lọc và Hành động */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <div className="flex-1 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            {/* Ô tìm kiếm */}
            <div className="relative rounded-md shadow-sm max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400">
                  search
                </span>
              </div>
              <input
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
                placeholder="Tìm tên, email, sđt..."
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            {/* Lọc theo chức vụ */}
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                value={filterPosition}
                onChange={(e) => {
                  setFilterPosition(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả chức vụ</option>
                <option value="Bác sĩ thú y">Bác sĩ thú y</option>
                <option value="Groomer">Groomer (Spa)</option>
                <option value="Huấn luyện viên">Huấn luyện viên</option>
                <option value="Quản lý">Quản lý</option>
              </select>
            </div>
          </div>
          {/* Các nút hành động */}
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
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none"
              type="button"
              onClick={handleOpenCreateModal}
            >
              <span className="material-symbols-outlined text-sm mr-2">
                person_add
              </span>
              Thêm Nhân viên
            </button>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhân Viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên Hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chức Vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chuyên Khoa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kinh Nghiệm
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
              ) : employees.length > 0 ? (
                employees.map((emp, index) => (
                  <tr
                    key={emp.nhanVienId || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{emp.nhanVienId}
                    </td>

                    {/* Thông tin nhân viên (Avatar, Tên, Email) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                            src={emp.img}
                            alt={emp.hoTen}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/40?text=NV";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {emp.hoTen}
                          </div>
                          <div className="text-xs text-gray-500">
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Số điện thoại */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {emp.soDienThoai}
                    </td>

                    {/* Chức vụ (dạng badge) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getPositionBadge(
                          emp.chucVu
                        )}`}
                      >
                        {emp.chucVu}
                      </span>
                    </td>

                    {/* Chuyên khoa */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.chuyenKhoa}
                    </td>

                    {/* Kinh nghiệm (cắt ngắn) */}
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate"
                      title={emp.kinhNghiem}
                    >
                      {emp.kinhNghiem}
                    </td>

                    {/* Các nút hành động */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="text-gray-400 hover:text-primary transition-colors"
                          title="Xem chi tiết"
                          onClick={() => handleViewDetail(emp.nhanVienId)}
                        >
                          <span className="material-symbols-outlined text-base">
                            visibility
                          </span>
                        </button>
                        <button
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                          title="Chỉnh sửa"
                          onClick={() => handleEditClick(emp)}
                        >
                          <span className="material-symbols-outlined text-base">
                            edit_note
                          </span>
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Xóa"
                          onClick={() => handleDeleteClick(emp.nhanVienId)}
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
                    Không tìm thấy nhân viên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {totalElements > 0 ? indexOfFirstItem + 1 : 0}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {indexOfFirstItem + employees.length}
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

      {/* --- Modals --- */}

      {/* Modal: Chi tiết Nhân viên */}
      <AnimatePresence>
        {isDetailModalOpen && selectedEmployee && (
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
                      visibility
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                      Chi tiết Nhân viên #{selectedEmployee.nhanVienId}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Xem thông tin hồ sơ nhân viên
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
                <div className="space-y-8 max-w-4xl mx-auto">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <img
                      src={
                        selectedEmployee.anhDaiDien
                          ? `http://localhost:8080/uploads/${selectedEmployee.anhDaiDien}`
                          : "https://placehold.co/128x128?text=Staff"
                      }
                      alt={selectedEmployee.hoTen}
                      className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 shadow-sm flex-shrink-0"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/128?text=NV";
                      }}
                    />
                    <div className="text-center sm:text-left">
                      <h2 className="text-2xl font-bold text-text-heading">
                        {selectedEmployee.hoTen}
                      </h2>
                      <span
                        className={`mt-2 inline-block px-3 py-1 text-sm font-medium rounded-full border ${getPositionBadge(
                          selectedEmployee.chucVu
                        )}`}
                      >
                        {selectedEmployee.chucVu}
                      </span>
                      <div className="mt-4 flex items-center justify-center sm:justify-start gap-6 text-sm text-text-body">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-gray-400">
                            mail
                          </span>
                          {selectedEmployee.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-gray-400">
                            phone
                          </span>
                          {selectedEmployee.soDienThoai}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border-light pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      <div className="input-group">
                        <label className="form-label block text-sm font-medium text-text-heading mb-2">
                          Chuyên khoa
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                          {selectedEmployee.chuyenKhoa || "Chưa cập nhật"}
                        </div>
                      </div>
                      <div className="input-group">
                        <label className="form-label block text-sm font-medium text-text-heading mb-2">
                          Kinh nghiệm
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                          {selectedEmployee.kinhNghiem || "Chưa cập nhật"}
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

      {/* Modal: Chỉnh sửa Nhân viên */}
      <AnimatePresence>
        {isEditModalOpen && editingEmployee && (
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
                      Chỉnh sửa Nhân viên #{editingEmployee.nhanVienId}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Cập nhật thông tin hồ sơ nhân viên
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
                <div className="space-y-8">
                  <div className="input-group">
                    <label className="form-label">Họ và tên</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingEmployee.hoTen || ""}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          hoTen: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <label className="form-label">Ảnh đại diện</label>
                    <div className="mt-2 flex items-center space-x-4">
                      <img
                        src={
                          avatarFile
                            ? URL.createObjectURL(avatarFile)
                            : editingEmployee.img
                        }
                        alt="Avatar"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        onChange={(e) => setAvatarFile(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="input-group">
                      <label className="form-label">Chức vụ</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingEmployee.chucVu || ""}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            chucVu: e.target.value,
                          })
                        }
                        placeholder="VD: Bác sĩ thú y, Groomer..."
                      />
                    </div>
                    <div className="input-group">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingEmployee.soDienThoai || ""}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            soDienThoai: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editingEmployee.email || ""}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <label className="form-label">Chuyên khoa</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingEmployee.chuyenKhoa || ""}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          chuyenKhoa: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <label className="form-label">Kinh nghiệm</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={editingEmployee.kinhNghiem || ""}
                      onChange={(e) =>
                        setEditingEmployee({
                          ...editingEmployee,
                          kinhNghiem: e.target.value,
                        })
                      }
                    />
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
                  onClick={handleSaveEmployee}
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

      {/* Modal: Thêm mới Nhân viên */}
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
              className="w-full max-w-3xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden font-body mx-auto my-8"
            >
              {/* Header */}
              <div className="px-10 py-6 border-b border-border-light/50 flex justify-between items-center bg-white sticky top-0 z-20 backdrop-blur-sm bg-white/95">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-surface border border-border-light flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">
                      person_add
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                      Thêm mới Nhân viên
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Tạo tài khoản và hồ sơ cho nhân viên mới
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
              <div className="flex-1 p-8 md:p-10 bg-white overflow-y-auto">
                <div className="space-y-10 max-w-4xl mx-auto">
                  {/* Section 1: Account Info */}
                  <div>
                    <div className="section-header flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-blue-500 font-light text-2xl">
                        account_circle
                      </span>
                      <h2 className="text-lg font-semibold text-text-heading">
                        Thông tin Tài khoản
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="input-group">
                        <label className="form-label">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={newEmployeeData.hoTen}
                          onChange={(e) =>
                            setNewEmployeeData({
                              ...newEmployeeData,
                              hoTen: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="input-group">
                        <label className="form-label">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={newEmployeeData.email}
                          onChange={(e) =>
                            setNewEmployeeData({
                              ...newEmployeeData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="input-group">
                        <label className="form-label">
                          Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          value={newEmployeeData.password}
                          onChange={(e) =>
                            setNewEmployeeData({
                              ...newEmployeeData,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="input-group">
                        <label className="form-label">Số điện thoại</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newEmployeeData.soDienThoai}
                          onChange={(e) =>
                            setNewEmployeeData({
                              ...newEmployeeData,
                              soDienThoai: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Profile Info */}
                  <div>
                    <div className="section-header flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-primary font-light text-2xl">
                        badge
                      </span>
                      <h2 className="text-lg font-semibold text-text-heading">
                        Thông tin Hồ sơ
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="input-group">
                        <label className="form-label">
                          Vai trò (Role) <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="form-control"
                          value={newEmployeeData.role}
                          onChange={(e) =>
                            setNewEmployeeData({
                              ...newEmployeeData,
                              role: e.target.value,
                            })
                          }
                        >
                          <option value="STAFF">Nhân viên (STAFF)</option>
                          <option value="DOCTOR">Bác sĩ (DOCTOR)</option>
                          <option value="SPA">Spa (SPA)</option>
                          <option value="ADMIN">Quản trị (ADMIN)</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label className="form-label">Chức vụ</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newEmployeeData.chucVu}
                          onChange={(e) =>
                            setNewEmployeeData({
                              ...newEmployeeData,
                              chucVu: e.target.value,
                            })
                          }
                          placeholder="VD: Bác sĩ thú y, Groomer..."
                        />
                      </div>
                      <div className="input-group md:col-span-2">
                        <label className="form-label">Kinh nghiệm</label>
                        <textarea
                          rows={2}
                          className="form-control"
                          value={newEmployeeData.kinhNghiem}
                          onChange={(e) =>
                            setNewEmployeeData({
                              ...newEmployeeData,
                              kinhNghiem: e.target.value,
                            })
                          }
                          placeholder="VD: 3 năm kinh nghiệm tại bệnh viện X..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCreateEmployee}
                  className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 tracking-wide"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  Tạo Nhân viên
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
                    Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này
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

export default AdminEmployees;
