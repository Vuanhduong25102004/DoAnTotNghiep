/**
 * @file AdminUsers.jsx
 * @description Trang quản lý tất cả người dùng (khách hàng, nhân viên, admin) với giao diện đồng bộ AdminAppointments.
 */
import React, { useEffect, useState } from "react";
import userService from "../../services/userService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// --- Helpers (Hàm hỗ trợ) ---

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getRoleBadge = (role) => {
  const styles = {
    ADMIN: "bg-purple-100 text-purple-800",
    STAFF: "bg-blue-100 text-blue-800",
    DOCTOR: "bg-cyan-100 text-cyan-800",
    SPA: "bg-pink-100 text-pink-800",
    USER: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        styles[role] || "bg-gray-100 text-gray-800"
      }`}
    >
      {role}
    </span>
  );
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

const AdminUsers = () => {
  // --- State Management ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);

  // State Form
  const [avatarFile, setAvatarFile] = useState(null);
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

  // State Phân trang & Lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 5;

  // --- Data Fetching ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1;
      const params = {
        page,
        size: ITEMS_PER_PAGE,
        search: debouncedSearchTerm, // Dùng giá trị đã debounce
        role: filterRole,
      };
      if (!params.search) delete params.search;
      if (!params.role) delete params.role;

      const response = await userService.getAllUsers(params);
      setUsers(response?.content || []);
      setTotalPages(response?.totalPages || 0);
      setTotalElements(response?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi tải danh sách người dùng:", error);
      toast.error("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch khi điều kiện thay đổi
  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearchTerm, filterRole]);

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setAvatarFile(null);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setUserToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDeleteId) return;
    try {
      await userService.deleteUser(userToDeleteId);
      toast.success("Xóa người dùng thành công!");
      // Logic lùi trang nếu xóa hết item ở trang cuối
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchUsers();
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
      toast.error(
        "Xóa thất bại (người dùng có thể đang có dữ liệu liên quan)."
      );
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setUserToDeleteId(null);
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    const formData = new FormData();
    const userData = {
      hoTen: editingUser.hoTen,
      email: editingUser.email,
      soDienThoai: editingUser.soDienThoai,
      diaChi: editingUser.diaChi,
      role: editingUser.role,
    };
    formData.append(
      "nguoiDung",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );
    if (avatarFile) {
      formData.append("anhDaiDien", avatarFile);
    }

    try {
      await userService.updateUser(editingUser.userId, formData);
      toast.success("Cập nhật thành công!");
      setIsEditModalOpen(false);
      setAvatarFile(null);
      fetchUsers();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Cập nhật thất bại.");
    }
  };

  const handleCreateSubmit = async () => {
    if (!newUserData.hoTen || !newUserData.email || !newUserData.password) {
      toast.warning("Vui lòng điền đầy đủ thông tin bắt buộc!");
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

    formData.append(
      "nguoiDung",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );
    if (avatarFile) {
      formData.append("anhDaiDien", avatarFile);
    }

    try {
      await userService.createUnifiedUser(formData);
      toast.success("Tạo mới thành công!");
      fetchUsers();
      setIsCreateModalOpen(false);
      setAvatarFile(null);
      // Reset form
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
    } catch (error) {
      console.error("Lỗi tạo mới:", error);
      toast.error("Tạo mới thất bại. Email có thể đã tồn tại.");
    }
  };

  // --- Stats Logic (Tạm tính trên trang hiện tại hoặc cần API riêng) ---
  // Để chính xác cần API getStats, ở đây demo UI
  const staffCount = users.filter((u) =>
    ["ADMIN", "STAFF", "DOCTOR", "SPA"].includes(u.role)
  ).length;

  const stats = [
    {
      title: "Tổng người dùng (Hệ thống)",
      value: totalElements,
      icon: "group",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    {
      title: "Khách hàng mới (Tháng)",
      value: "+12", // Placeholder
      icon: "person_add",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
    {
      title: "Nhân viên & Admin (Trang này)",
      value: staffCount,
      icon: "manage_accounts",
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-500",
    },
  ];
  // Xử lý phím ESC để đóng modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsDetailModalOpen(false);
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setIsConfirmDeleteModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);
  return (
    <>
      {/* --- Header & Stats --- */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Người dùng
        </p>
      </div>

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

      {/* --- Filters & Actions --- */}
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
                placeholder="Tìm tên, email..."
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            {/* Role Filter */}
            <div className="relative rounded-md shadow-sm max-w-xs">
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md h-10"
              >
                <option value="">Tất cả vai trò</option>
                <option value="USER">Khách hàng</option>
                <option value="STAFF">Nhân viên</option>
                <option value="DOCTOR">Bác sĩ</option>
                <option value="SPA">Spa</option>
                <option value="ADMIN">Quản trị</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              <span className="material-symbols-outlined text-sm mr-2">
                file_download
              </span>
              Xuất Excel
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none"
              onClick={() => {
                setCreationType("USER");
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
                setAvatarFile(null);
                setIsCreateModalOpen(true);
              }}
            >
              <span className="material-symbols-outlined text-sm mr-2">
                person_add
              </span>
              Thêm User
            </button>
          </div>
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ và Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
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
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{user.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {user.anhDaiDien ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`http://localhost:8080/uploads/${user.anhDaiDien}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://placehold.co/40x40?text=${user.hoTen.charAt(
                                  0
                                )}`;
                              }}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {user.hoTen ? user.hoTen.charAt(0) : "U"}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.hoTen}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-500">
                        {user.soDienThoai}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[150px] truncate"
                      title={user.diaChi}
                    >
                      {user.diaChi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.ngayTao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetail(user)}
                          className="text-gray-400 hover:text-green-600"
                        >
                          <span className="material-symbols-outlined text-base">
                            visibility
                          </span>
                        </button>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <span className="material-symbols-outlined text-base">
                            edit_note
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.userId)}
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
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy người dùng nào.
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
                  {(currentPage - 1) * ITEMS_PER_PAGE + users.length}
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

      {/* --- MODAL XEM CHI TIẾT --- */}
      <AnimatePresence>
        {isDetailModalOpen && selectedUser && (
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
              className="w-full max-w-2xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[90vh] relative overflow-hidden mx-4"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined">
                      assignment_ind
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Thông tin Người dùng
                    </h1>
                    <p className="text-sm text-gray-500">
                      ID: #{selectedUser.userId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-8 overflow-y-auto">
                <div className="flex flex-col items-center mb-8">
                  <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
                    {selectedUser.anhDaiDien ? (
                      <img
                        src={`http://localhost:8080/uploads/${selectedUser.anhDaiDien}`}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                        {selectedUser.hoTen?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedUser.hoTen}
                  </h2>
                  <div className="mt-2">{getRoleBadge(selectedUser.role)}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase font-semibold">
                      Email
                    </label>
                    <p className="text-gray-900 font-medium border-b pb-2">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase font-semibold">
                      Số điện thoại
                    </label>
                    <p className="text-gray-900 font-medium border-b pb-2">
                      {selectedUser.soDienThoai}
                    </p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-gray-500 uppercase font-semibold">
                      Địa chỉ
                    </label>
                    <p className="text-gray-900 font-medium border-b pb-2">
                      {selectedUser.diaChi}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase font-semibold">
                      Ngày tạo
                    </label>
                    <p className="text-gray-900 font-medium border-b pb-2">
                      {formatDate(selectedUser.ngayTao)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
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
                <p className="mt-2 text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa người dùng này? Hành động này không
                  thể hoàn tác và có thể ảnh hưởng đến dữ liệu liên quan.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsConfirmDeleteModalOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
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

      {/* --- MODAL CHỈNH SỬA --- */}
      <AnimatePresence>
        {isEditModalOpen && editingUser && (
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
              className="w-full max-w-3xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden mx-auto my-8"
            >
              {/* Header */}
              <div className="px-10 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined text-[24px]">
                      manage_accounts
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Cập nhật Người dùng
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Chỉnh sửa thông tin chi tiết
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-10 bg-white overflow-y-auto">
                <div className="space-y-8">
                  {/* Ảnh đại diện */}
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <img
                        src={
                          avatarFile
                            ? URL.createObjectURL(avatarFile)
                            : editingUser.anhDaiDien
                            ? `http://localhost:8080/uploads/${editingUser.anhDaiDien}`
                            : "https://placehold.co/100x100?text=User"
                        }
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                      />
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-600">
                        <span className="material-symbols-outlined text-sm">
                          camera_alt
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setAvatarFile(e.target.files[0])}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Ảnh hồ sơ mới
                      </h3>
                      <p className="text-sm text-gray-500">
                        JPG, GIF hoặc PNG.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="input-group">
                      <label className="form-label">Họ và tên</label>
                      <input
                        className="form-control"
                        type="text"
                        value={editingUser.hoTen}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            hoTen: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="input-group">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="input-group">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        className="form-control"
                        type="text"
                        value={editingUser.soDienThoai}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            soDienThoai: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="input-group">
                      <label className="form-label">Vai trò</label>
                      <select
                        className="form-control"
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            role: e.target.value,
                          })
                        }
                      >
                        <option value="USER">Khách hàng</option>
                        <option value="STAFF">Nhân viên</option>
                        <option value="DOCTOR">Bác sĩ</option>
                        <option value="SPA">Spa</option>
                        <option value="ADMIN">Quản trị</option>
                      </select>
                    </div>
                    <div className="input-group md:col-span-2">
                      <label className="form-label">Địa chỉ</label>
                      <input
                        className="form-control"
                        type="text"
                        value={editingUser.diaChi}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            diaChi: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 border-t border-gray-100 flex justify-end gap-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-green-600 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
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

      {/* --- MODAL TẠO MỚI --- */}
      <AnimatePresence>
        {isCreateModalOpen && (
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
              className="w-full max-w-4xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden mx-auto my-8"
            >
              {/* Header */}
              <div className="px-10 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">
                      person_add
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Thêm mới Tài khoản
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Tạo tài khoản khách hàng hoặc nhân viên
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-10 bg-white overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-8">
                  {/* Loại tài khoản Switcher */}
                  <div className="flex bg-gray-100 p-1 rounded-lg w-full max-w-md mx-auto">
                    <button
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        creationType === "USER"
                          ? "bg-white text-primary shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => {
                        setCreationType("USER");
                        setNewUserData({ ...newUserData, role: "USER" });
                      }}
                    >
                      Khách hàng
                    </button>
                    <button
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        creationType === "EMPLOYEE"
                          ? "bg-white text-primary shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => {
                        setCreationType("EMPLOYEE");
                        setNewUserData({ ...newUserData, role: "STAFF" });
                      }}
                    >
                      Nhân viên
                    </button>
                  </div>

                  {/* Ảnh đại diện */}
                  <div className="flex justify-center">
                    <div className="relative group">
                      <img
                        src={
                          avatarFile
                            ? URL.createObjectURL(avatarFile)
                            : "https://placehold.co/100x100?text=+"
                        }
                        alt="Avatar Preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                      />
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-primary">
                        <span className="material-symbols-outlined text-sm">
                          upload
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setAvatarFile(e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="input-group">
                      <label className="form-label">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="form-control"
                        value={newUserData.hoTen}
                        onChange={(e) =>
                          setNewUserData({
                            ...newUserData,
                            hoTen: e.target.value,
                          })
                        }
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="input-group">
                      <label className="form-label">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        value={newUserData.email}
                        onChange={(e) =>
                          setNewUserData({
                            ...newUserData,
                            email: e.target.value,
                          })
                        }
                        placeholder="example@email.com"
                      />
                    </div>
                    <div className="input-group">
                      <label className="form-label">
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="password"
                        value={newUserData.password}
                        onChange={(e) =>
                          setNewUserData({
                            ...newUserData,
                            password: e.target.value,
                          })
                        }
                        placeholder="••••••"
                      />
                    </div>
                    <div className="input-group">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        className="form-control"
                        value={newUserData.soDienThoai}
                        onChange={(e) =>
                          setNewUserData({
                            ...newUserData,
                            soDienThoai: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="input-group md:col-span-2">
                      <label className="form-label">Địa chỉ</label>
                      <input
                        className="form-control"
                        value={newUserData.diaChi}
                        onChange={(e) =>
                          setNewUserData({
                            ...newUserData,
                            diaChi: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Fields riêng cho Employee */}
                    {creationType === "EMPLOYEE" && (
                      <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-200 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                          Thông tin chuyên môn
                        </div>
                        <div className="input-group">
                          <label className="form-label">Vai trò hệ thống</label>
                          <select
                            className="form-control"
                            value={newUserData.role}
                            onChange={(e) =>
                              setNewUserData({
                                ...newUserData,
                                role: e.target.value,
                              })
                            }
                          >
                            <option value="STAFF">Nhân viên</option>
                            <option value="DOCTOR">Bác sĩ</option>
                            <option value="SPA">Spa</option>
                            <option value="ADMIN">Quản trị</option>
                          </select>
                        </div>
                        <div className="input-group">
                          <label className="form-label">Chức vụ</label>
                          <input
                            className="form-control"
                            value={newUserData.chucVu}
                            onChange={(e) =>
                              setNewUserData({
                                ...newUserData,
                                chucVu: e.target.value,
                              })
                            }
                            placeholder="VD: Trưởng phòng, NV Grooming"
                          />
                        </div>
                        <div className="input-group">
                          <label className="form-label">Chuyên khoa</label>
                          <input
                            className="form-control"
                            value={newUserData.chuyenKhoa}
                            onChange={(e) =>
                              setNewUserData({
                                ...newUserData,
                                chuyenKhoa: e.target.value,
                              })
                            }
                            placeholder="VD: Nội khoa, Ngoại khoa"
                          />
                        </div>
                        <div className="input-group">
                          <label className="form-label">Kinh nghiệm</label>
                          <input
                            className="form-control"
                            value={newUserData.kinhNghiem}
                            onChange={(e) =>
                              setNewUserData({
                                ...newUserData,
                                kinhNghiem: e.target.value,
                              })
                            }
                            placeholder="VD: 5 năm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 border-t border-gray-100 flex justify-end gap-4">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCreateSubmit}
                  className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-green-600 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  Tạo tài khoản
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminUsers;
