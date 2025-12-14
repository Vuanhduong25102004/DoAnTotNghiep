import React, { useEffect, useState } from "react";
import userService from "../../services/userService"; // Sử dụng service đã có

// Helper: Chọn màu badge cho Chức vụ
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

const AdminEmployees = () => {
  // 1. State
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
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

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("");

  // 2. Fetch Data
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllStaff();

      // Map dữ liệu từ API
      const formattedData = Array.isArray(response)
        ? response.map((emp) => ({
            ...emp,
            nhanVienId: emp.id || emp.nhanVienId || emp.maNhanVien,
            hoTen: emp.hoTen || emp.tenNhanVien,
            email: emp.email || "---",
            soDienThoai: emp.soDienThoai || "---",
            chucVu: emp.chucVu || emp.vaiTro || "Nhân viên",
            chuyenKhoa: emp.chuyenKhoa || "---",
            kinhNghiem: emp.kinhNghiem || "---",
            // Ảnh đại diện
            img:
              emp.hinhAnhUrl &&
              emp.hinhAnhUrl !== "null" &&
              emp.hinhAnhUrl !== "undefined"
                ? emp.hinhAnhUrl
                : "https://placehold.co/100x100?text=Staff",
            userId: emp.userId || (emp.user ? emp.user.id : null),
          }))
        : [];

      setEmployees(formattedData);
    } catch (error) {
      console.error("Lỗi tải danh sách nhân viên:", error);
      alert("Không thể tải dữ liệu nhân viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 3. Actions
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hồ sơ nhân viên này?"))
      return;
    try {
      await userService.deleteStaff(id);
      setEmployees((prev) => prev.filter((e) => e.nhanVienId !== id));
      alert("Xóa thành công!");
    } catch (error) {
      console.error(error);
      alert(
        "Xóa thất bại! Có thể nhân viên đang phụ trách lịch hẹn hoặc đơn hàng."
      );
    }
  };

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

  const handleEditClick = (emp) => {
    setEditingEmployee({ ...emp });
    setIsEditModalOpen(true);
  };

  const handleSaveEmployee = async () => {
    if (!editingEmployee) return;
    try {
      const payload = {
        hoTen: editingEmployee.hoTen,
        chucVu: editingEmployee.chucVu,
        soDienThoai: editingEmployee.soDienThoai,
        email: editingEmployee.email,
        chuyenKhoa: editingEmployee.chuyenKhoa,
        kinhNghiem: editingEmployee.kinhNghiem,
        userId: editingEmployee.userId,
      };

      await userService.updateStaff(editingEmployee.nhanVienId, payload);

      setEmployees((prev) =>
        prev.map((e) =>
          e.nhanVienId === editingEmployee.nhanVienId ? { ...e, ...payload } : e
        )
      );
      setIsEditModalOpen(false);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại.");
    }
  };

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
    setIsAddModalOpen(true);
  };

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

    try {
      // Sử dụng endpoint chung để tạo user và nhân viên
      await userService.createUnifiedUser(newEmployeeData);
      alert("Tạo mới nhân viên thành công!");
      setIsAddModalOpen(false);
      fetchEmployees(); // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi tạo nhân viên:", error);
      alert(
        "Tạo mới thất bại. Email có thể đã tồn tại hoặc dữ liệu không hợp lệ."
      );
    }
  };

  // 4. Filter Logic
  const filteredEmployees = employees.filter((emp) => {
    // Tìm kiếm: Tên, Email hoặc SĐT
    const matchSearch =
      emp.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.soDienThoai.includes(searchTerm);

    // Lọc theo chức vụ
    const matchPosition = filterPosition ? emp.chucVu === filterPosition : true;

    return matchSearch && matchPosition;
  });

  // 5. Stats Calculation
  const totalStaff = employees.length;
  // Đếm số lượng bác sĩ (tìm theo từ khóa 'Bác sĩ' hoặc 'Doctor')
  const countVets = employees.filter(
    (e) =>
      e.chucVu && (e.chucVu.includes("Bác sĩ") || e.chucVu.includes("Doctor"))
  ).length;
  // Đếm số lượng Groomer
  const countGroomers = employees.filter(
    (e) =>
      e.chucVu &&
      (e.chucVu.toLowerCase().includes("spa") ||
        e.chucVu.toLowerCase().includes("grooming") ||
        e.chucVu.toLowerCase().includes("chăm sóc"))
  ).length;

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Reset trang về 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPosition]);

  // Logic Phân trang
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  if (loading)
    return (
      <div className="p-10 text-center">Đang tải danh sách nhân viên...</div>
    );

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Nhân viên
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
                placeholder="Tìm tên, email, sđt..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Select Position */}
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
              >
                <option value="">Tất cả chức vụ</option>
                <option value="Bác sĩ thú y">Bác sĩ thú y</option>
                <option value="Groomer">Groomer (Spa)</option>
                <option value="Huấn luyện viên">Huấn luyện viên</option>
                <option value="Quản lý">Quản lý</option>
              </select>
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
              {currentItems.length > 0 ? (
                currentItems.map((emp, index) => (
                  <tr
                    key={emp.nhanVienId || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{emp.nhanVienId}
                    </td>

                    {/* Nhân Viên (Avatar + Tên + Email) */}
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

                    {/* Liên Hệ (SĐT) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {emp.soDienThoai}
                    </td>

                    {/* Chức Vụ (Badge) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getPositionBadge(
                          emp.chucVu
                        )}`}
                      >
                        {emp.chucVu}
                      </span>
                    </td>

                    {/* Chuyên Khoa */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.chuyenKhoa}
                    </td>

                    {/* Kinh Nghiệm (Truncate) */}
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate"
                      title={emp.kinhNghiem}
                    >
                      {emp.kinhNghiem}
                    </td>

                    {/* Actions */}
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
                          onClick={() => handleDelete(emp.nhanVienId)}
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

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {filteredEmployees.length > 0 ? indexOfFirstItem + 1 : 0}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredEmployees.length)}
                </span>{" "}
                trong số{" "}
                <span className="font-medium">{filteredEmployees.length}</span>{" "}
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

      {/* Modal Chi tiết Nhân viên */}
      {isDetailModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chi tiết Nhân viên #{selectedEmployee.nhanVienId}
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <img
                  src={
                    selectedEmployee.hinhAnhUrl ||
                    "https://placehold.co/100x100?text=Staff"
                  }
                  alt={selectedEmployee.hoTen}
                  className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=NV";
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Họ và tên</p>
                  <p className="font-medium text-gray-900 text-lg">
                    {selectedEmployee.hoTen}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chức vụ</p>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getPositionBadge(
                      selectedEmployee.chucVu
                    )}`}
                  >
                    {selectedEmployee.chucVu}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium text-gray-900">
                    {selectedEmployee.soDienThoai}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {selectedEmployee.email}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Chuyên khoa</p>
                  <p className="font-medium text-gray-900">
                    {selectedEmployee.chuyenKhoa}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Kinh nghiệm</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100 text-sm">
                    {selectedEmployee.kinhNghiem}
                  </p>
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

      {/* Modal Chỉnh sửa Nhân viên */}
      {isEditModalOpen && editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chỉnh sửa Nhân viên #{editingEmployee.nhanVienId}
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
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingEmployee.hoTen || ""}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      hoTen: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chức vụ
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={editingEmployee.soDienThoai || ""}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        soDienThoai: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={editingEmployee.email || ""}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chuyên khoa
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingEmployee.chuyenKhoa || ""}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      chuyenKhoa: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kinh nghiệm
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEmployee}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 font-medium"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm mới Nhân viên */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Thêm mới Nhân viên
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* User Account Info */}
              <div className="p-4 border rounded-lg bg-gray-50/50">
                <h4 className="font-semibold text-gray-800 mb-3">
                  1. Thông tin Tài khoản
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={newEmployeeData.hoTen}
                      onChange={(e) =>
                        setNewEmployeeData({
                          ...newEmployeeData,
                          hoTen: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={newEmployeeData.email}
                      onChange={(e) =>
                        setNewEmployeeData({
                          ...newEmployeeData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={newEmployeeData.password}
                      onChange={(e) =>
                        setNewEmployeeData({
                          ...newEmployeeData,
                          password: e.target.value,
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
                      value={newEmployeeData.soDienThoai}
                      onChange={(e) =>
                        setNewEmployeeData({
                          ...newEmployeeData,
                          soDienThoai: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={newEmployeeData.diaChi}
                      onChange={(e) =>
                        setNewEmployeeData({
                          ...newEmployeeData,
                          diaChi: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Employee Profile Info */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">
                  2. Thông tin Hồ sơ Nhân viên
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chức vụ
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vai trò (Role) <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Chuyên khoa
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={newEmployeeData.chuyenKhoa}
                      onChange={(e) =>
                        setNewEmployeeData({
                          ...newEmployeeData,
                          chuyenKhoa: e.target.value,
                        })
                      }
                      placeholder="VD: Nội khoa, Chẩn đoán hình ảnh"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Kinh nghiệm
                    </label>
                    <textarea
                      rows={2}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateEmployee}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 font-medium"
              >
                Tạo mới
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminEmployees;
