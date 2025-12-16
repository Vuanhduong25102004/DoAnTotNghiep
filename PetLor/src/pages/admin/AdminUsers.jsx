import React, { useEffect, useState } from "react";
import userService from "../../services/userService";

// Helper: Format ngày tháng từ chuỗi ISO
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper: Chọn màu badge cho Role
const getRoleStyle = (role) => {
  switch (role) {
    case "ADMIN":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "STAFF":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "DOCTOR":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "SPA":
      return "bg-pink-100 text-pink-800 border-pink-200";
    default: // USER
      return "bg-green-100 text-green-800 border-green-200";
  }
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null); // State for avatar file

  // State cho Modal Tạo mới (Unified)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creationType, setCreationType] = useState("USER"); // 'USER' | 'EMPLOYEE'
  const [newUserData, setNewUserData] = useState({
    hoTen: "",
    email: "",
    password: "",
    soDienThoai: "",
    diaChi: "",
    role: "USER",
    chucVu: "",
    chuyenKhoa: "",
    kinhNghiem: "",
  });

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1; // API is 0-indexed
      const params = {
        page,
        size: ITEMS_PER_PAGE,
        search: searchTerm,
        role: filterRole,
      };
      // Remove empty params to keep URL clean
      if (!params.search) delete params.search;
      if (!params.role) delete params.role;

      const response = await userService.getAllUsers(params);
      setUsers(response?.content || []);
      setTotalPages(response?.totalPages || 0);
      setTotalElements(response?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      alert("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filterRole]);

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setAvatarFile(null); // Reset file input on new edit
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    const formData = new FormData();
    // Chuẩn bị đối tượng JSON chứa dữ liệu người dùng
    const userData = {
      hoTen: editingUser.hoTen,
      email: editingUser.email,
      soDienThoai: editingUser.soDienThoai,
      diaChi: editingUser.diaChi,
      role: editingUser.role,
    };

    // Gửi dữ liệu người dùng dưới dạng Blob với Content-Type application/json
    const jsonBlob = new Blob([JSON.stringify(userData)], {
      type: "application/json",
    });
    formData.append("nguoiDung", jsonBlob);

    // Thêm file ảnh mới (nếu có) với key là 'anhDaiDien'
    if (avatarFile) {
      formData.append("anhDaiDien", avatarFile);
    }

    try {
      // Assuming updateUser can handle FormData
      await userService.updateUser(editingUser.userId, formData);
      fetchUsers();
      setIsEditModalOpen(false);
      setAvatarFile(null); // Reset file state
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại.");
    }
  };

  const handleCreateClick = () => {
    setNewUserData({
      hoTen: "",
      email: "",
      password: "",
      soDienThoai: "",
      diaChi: "",
      role: "USER",
      chucVu: "",
      chuyenKhoa: "",
      kinhNghiem: "",
    });
    setCreationType("USER");
    setAvatarFile(null); // Reset avatar file
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async () => {
    if (!newUserData.hoTen || !newUserData.email || !newUserData.password) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    const formData = new FormData();
    const userData = { ...newUserData };

    if (creationType === "USER") {
      userData.role = "USER";
      delete userData.chucVu;
      delete userData.chuyenKhoa;
      delete userData.kinhNghiem;
    }

    // Gửi dữ liệu người dùng dưới dạng Blob với Content-Type application/json
    const jsonBlob = new Blob([JSON.stringify(userData)], {
      type: "application/json",
    });
    formData.append("nguoiDung", jsonBlob);

    // Gửi file ảnh (nếu có) với key 'anhDaiDien'
    if (avatarFile) {
      formData.append("anhDaiDien", avatarFile);
    }

    try {
      await userService.createUnifiedUser(formData);

      fetchUsers(); // Refresh the user list
      setIsCreateModalOpen(false);
      setAvatarFile(null); // Reset file state
      alert("Tạo mới thành công!");
    } catch (error) {
      console.error("Lỗi tạo mới:", error);
      alert("Tạo mới thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa người dùng ID: ${userId}? Thao tác này không thể hoàn tác.`
      )
    )
      return;

    try {
      await userService.deleteUser(userId);
      alert("Xóa người dùng thành công!");
      // After deletion, if the current page becomes empty, go to the previous page.
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchUsers(); // Otherwise, just refresh the current page.
      }
    } catch (error) {
      console.error("Lỗi xóa người dùng:", error);
      alert(
        "Xóa thất bại. Người dùng có thể có dữ liệu liên quan (lịch hẹn, đơn hàng, thú cưng)."
      );
    }
  };

  // Pagination Logic
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  // Stats Calculation
  const totalUsers = totalElements;
  // Note: The following stats are calculated based on the data of the current page only.
  // For accurate global stats, dedicated backend APIs are needed.
  const newUsersCount = users.filter((u) => {
    if (!u.ngayTao) return false;
    const d = new Date(u.ngayTao);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;
  const staffCount = users.filter((u) =>
    ["ADMIN", "STAFF", "DOCTOR", "SPA"].includes(u.role)
  ).length;

  const stats = [
    {
      title: "Tổng người dùng",
      value: totalUsers,
      icon: "group",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    {
      title: "Người dùng mới (Tháng)",
      value: `+${newUsersCount}`,
      icon: "person_add",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
    {
      title: "Nhân viên & Admin",
      value: staffCount,
      icon: "manage_accounts",
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-500",
    },
  ];

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Người dùng
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            {/* Select Role */}
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả vai trò</option>
                <option value="USER">Khách hàng</option>
                <option value="STAFF">Nhân viên</option>
                <option value="ADMIN">Quản trị</option>
                <option value="DOCTOR">Bác sĩ</option>
                <option value="SPA">Spa</option>
              </select>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              type="button"
            >
              <span className="material-symbols-outlined text-sm mr-2">
                file_download
              </span>
              Xuất Excel
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              type="button"
              onClick={handleCreateClick}
            >
              <span className="material-symbols-outlined text-sm mr-2">
                person_add
              </span>
              Thêm User
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Họ và Tên
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thông tin liên hệ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Địa chỉ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Vai trò (Role)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày tạo
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user.userId || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{user.userId}
                    </td>

                    {/* Họ Tên + Avatar giả lập */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {user.anhDaiDien ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`http://localhost:8080/uploads/${user.anhDaiDien}`}
                              alt={user.hoTen}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                              {user.hoTen
                                ? user.hoTen.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                          )}
                        </div>{" "}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.hoTen}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Liên hệ (Email & SĐT) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-500">
                        {user.soDienThoai}
                      </div>
                    </td>

                    {/* Địa chỉ (Truncate nếu dài) */}
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate"
                      title={user.diaChi}
                    >
                      {user.diaChi}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Ngày tạo */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.ngayTao)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          title="Xem chi tiết"
                          className="text-gray-400 hover:text-primary transition-colors"
                          onClick={() => handleViewDetail(user)}
                        >
                          <span className="material-symbols-outlined text-base">
                            visibility
                          </span>
                        </button>
                        <button
                          title="Chỉnh sửa"
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                          onClick={() => handleEditClick(user)}
                        >
                          <span className="material-symbols-outlined text-base">
                            edit_note
                          </span>
                        </button>
                        <button
                          title="Xóa/Khóa"
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => handleDeleteUser(user.userId)}
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
                  <td colSpan="7" className="px-6 py-4 text-center">
                    Không có dữ liệu
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
                  {totalElements > 0 ? indexOfFirstItem + 1 : 0}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {indexOfFirstItem + users.length}
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

      {/* Modal Chi tiết User */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chi tiết Người dùng #{selectedUser.userId}
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex justify-center mb-4">
              {selectedUser.anhDaiDien ? (
                <img
                  className="h-24 w-24 rounded-full object-cover"
                  src={`http://localhost:8080/uploads/${selectedUser.anhDaiDien}`}
                  alt={selectedUser.hoTen}
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-4xl">
                  {selectedUser.hoTen
                    ? selectedUser.hoTen.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-medium text-gray-900">
                  {selectedUser.hoTen}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vai trò</p>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleStyle(
                    selectedUser.role
                  )}`}
                >
                  {selectedUser.role}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Email</p>
                <p
                  className="font-medium text-gray-900 truncate"
                  title={selectedUser.email}
                >
                  {selectedUser.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium text-gray-900">
                  {selectedUser.soDienThoai}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="font-medium text-gray-900">
                  {selectedUser.diaChi}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium text-gray-900">
                  {formatDate(selectedUser.ngayTao)}
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
      )}

      {/* Modal Chỉnh sửa User */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chỉnh sửa Người dùng #{editingUser.userId}
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
                  value={editingUser.hoTen || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, hoTen: e.target.value })
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
                  value={editingUser.email || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingUser.soDienThoai || ""}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      soDienThoai: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingUser.diaChi || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, diaChi: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ảnh đại diện
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  <img
                    src={
                      avatarFile
                        ? URL.createObjectURL(avatarFile)
                        : editingUser.anhDaiDien
                        ? `http://localhost:8080/uploads/${editingUser.anhDaiDien}`
                        : "https://placehold.co/100x100?text=User"
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vai trò
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingUser.role || "USER"}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="USER">Khách hàng (USER)</option>
                  <option value="STAFF">Nhân viên (STAFF)</option>
                  <option value="ADMIN">Quản trị (ADMIN)</option>
                  <option value="DOCTOR">Bác sĩ (DOCTOR)</option>
                  <option value="SPA">Spa (SPA)</option>
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
                onClick={handleSaveUser}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 font-medium"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm mới User (Unified) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Thêm mới Tài khoản
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Type Selection */}
            <div className="flex space-x-4 mb-6">
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md border ${
                  creationType === "USER"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setCreationType("USER");
                  setNewUserData({ ...newUserData, role: "USER" });
                }}
              >
                Khách hàng
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md border ${
                  creationType === "EMPLOYEE"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => {
                  setCreationType("EMPLOYEE");
                  setNewUserData({ ...newUserData, role: "STAFF" });
                }}
              >
                Nhân viên
              </button>
            </div>

            <div className="space-y-4">
              {/* Common Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newUserData.hoTen}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, hoTen: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ảnh đại diện
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  <img
                    src={
                      avatarFile
                        ? URL.createObjectURL(avatarFile)
                        : "https://placehold.co/100x100?text=User"
                    }
                    alt="Avatar Preview"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
                  }
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
                    value={newUserData.soDienThoai}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        soDienThoai: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vai trò
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={newUserData.role}
                    disabled={creationType === "USER"}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, role: e.target.value })
                    }
                  >
                    {creationType === "USER" ? (
                      <option value="USER">Khách hàng (USER)</option>
                    ) : (
                      <>
                        <option value="STAFF">Nhân viên (STAFF)</option>
                        <option value="DOCTOR">Bác sĩ (DOCTOR)</option>
                        <option value="SPA">Spa (SPA)</option>
                        <option value="ADMIN">Quản trị (ADMIN)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newUserData.diaChi}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, diaChi: e.target.value })
                  }
                />
              </div>

              {/* Employee Specific Fields */}
              {creationType === "EMPLOYEE" && (
                <div className="border-t pt-4 mt-4 space-y-4 bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900">
                    Thông tin Nhân viên
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chức vụ
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      value={newUserData.chucVu}
                      onChange={(e) =>
                        setNewUserData({
                          ...newUserData,
                          chucVu: e.target.value,
                        })
                      }
                      placeholder="VD: Bác sĩ thú y, Groomer..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chuyên khoa
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      value={newUserData.chuyenKhoa}
                      onChange={(e) =>
                        setNewUserData({
                          ...newUserData,
                          chuyenKhoa: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kinh nghiệm
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      value={newUserData.kinhNghiem}
                      onChange={(e) =>
                        setNewUserData({
                          ...newUserData,
                          kinhNghiem: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateSubmit}
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

export default AdminUsers;
