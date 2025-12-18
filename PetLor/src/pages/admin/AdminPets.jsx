/**
 * @file AdminPets.jsx
 * @description Trang quản lý hồ sơ thú cưng của khách hàng.
 * Cho phép xem, tìm kiếm, lọc, tạo, cập nhật và xóa thông tin thú cưng.
 */
import React, { useEffect, useState } from "react";
import petService from "../../services/petService"; // Đảm bảo đường dẫn đúng
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// --- Helpers (Hàm hỗ trợ) ---

/**
 * Tính tuổi của thú cưng dựa trên ngày sinh.
 * @param {string} dateString - Chuỗi ngày sinh (ISO 8601).
 * @returns {string} - Chuỗi biểu thị tuổi (ví dụ: "3 tuổi", "Dưới 1 tuổi").
 */
const calculateAge = (dateString) => {
  if (!dateString) return "Chưa rõ";
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? `${age} tuổi` : "Dưới 1 tuổi";
};

/**
 * Định dạng chuỗi ngày sang định dạng dd/MM/yyyy.
 * @param {string} dateString - Chuỗi ngày (ISO 8601).
 * @returns {string} - Chuỗi ngày đã định dạng hoặc "---" nếu không có.
 */
const formatDate = (dateString) => {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

// Component Skeleton Loading cho Table
const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100 last:border-0">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
    <td className="px-6 py-4 flex items-center gap-3">
      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
      <div className="h-3 bg-gray-100 rounded w-16"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-200 rounded w-12"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
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
 * Component chính cho trang quản lý thú cưng.
 */
const AdminPets = () => {
  // --- 1. State Management (Quản lý Trạng thái) ---

  // State lưu trữ dữ liệu chính và trạng thái tải
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho các bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecies, setFilterSpecies] = useState(""); // Chủng loại: Chó/Mèo
  const [filterGender, setFilterGender] = useState("");

  // State quản lý hiển thị Modals
  const [selectedPet, setSelectedPet] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [petToDeleteId, setPetToDeleteId] = useState(null);

  // State cho các form (Thêm/Sửa)
  const [petImageFile, setPetImageFile] = useState(null);
  const [newPet, setNewPet] = useState({
    tenThuCung: "",
    chungLoai: "Chó",
    giongLoai: "",
    ngaySinh: "",
    gioiTinh: "Đực",
    ghiChuSucKhoe: "",
    tenChuSoHuu: "",
    soDienThoaiChuSoHuu: "",
  });

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 5;

  // --- 2. Data Fetching (Lấy Dữ liệu từ API) ---

  /**
   * Lấy danh sách thú cưng từ API dựa trên các tham số phân trang và lọc.
   */
  const fetchPets = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1; // API sử dụng trang bắt đầu từ 0
      const params = {
        page,
        size: ITEMS_PER_PAGE,
        search: searchTerm,
        species: filterSpecies,
        gender: filterGender,
      };
      // Xóa các tham số rỗng để không gửi lên server
      if (!params.search) delete params.search;
      if (!params.species) delete params.species;
      if (!params.gender) delete params.gender;

      const response = await petService.getAllPets(params);
      const petsData = response?.content || [];

      // Map dữ liệu từ API sang định dạng nhất quán cho UI
      const formattedData = petsData.map((pet) => ({
        ...pet,
        thuCungId: pet.thuCungId,
        ownerName: pet.tenChu || "Chưa rõ",
        ownerId: pet.userId,
        // Ảnh: Nếu null thì dùng ảnh mặc định
        img: pet.hinhAnh
          ? `http://localhost:8080/uploads/${pet.hinhAnh}`
          : "https://placehold.co/100x100?text=Pet",
        // Các trường khác map thẳng, có giá trị mặc định để tránh lỗi
        tenThuCung: pet.tenThuCung || "Chưa đặt tên",
        chungLoai: pet.chungLoai || "Khác",
        giongLoai: pet.giongLoai || "---",
        ngaySinh: pet.ngaySinh,
        gioiTinh: pet.gioiTinh || "Chưa rõ",
        ghiChuSucKhoe: pet.ghiChuSucKhoe || "Bình thường",
      }));

      setPets(formattedData);
      setTotalPages(response?.totalPages || 0);
      setTotalElements(response?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi tải danh sách thú cưng:", error);
      toast.error("Không thể tải dữ liệu thú cưng.");
    } finally {
      setLoading(false);
    }
  };

  // Effect: Tải lại danh sách thú cưng mỗi khi trang hoặc bộ lọc thay đổi.
  useEffect(() => {
    fetchPets();
  }, [currentPage, searchTerm, filterSpecies, filterGender]);

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
  // --- 3. Event Handlers (Hàm Xử lý Sự kiện) ---

  /**
   * Mở modal để thêm thú cưng mới và reset form.
   */
  const handleOpenAddModal = () => {
    setNewPet({
      tenThuCung: "",
      chungLoai: "Chó",
      giongLoai: "",
      ngaySinh: "",
      gioiTinh: "Đực",
      ghiChuSucKhoe: "",
      tenChuSoHuu: "",
      soDienThoaiChuSoHuu: "",
    });
    setPetImageFile(null);
    setIsAddModalOpen(true);
  };

  /**
   * Mở modal để xem chi tiết một thú cưng.
   * @param {object} pet - Đối tượng thú cưng được chọn.
   */
  const handleViewDetail = (pet) => {
    setSelectedPet(pet);
    setIsDetailModalOpen(true);
  };

  /**
   * Mở modal để chỉnh sửa một thú cưng đã có.
   * @param {object} pet - Đối tượng thú cưng được chọn.
   */
  const handleEditClick = (pet) => {
    let formattedDate = "";
    // Định dạng lại ngày sinh để input type="date" có thể hiển thị
    if (pet.ngaySinh) {
      const d = new Date(pet.ngaySinh);
      if (!isNaN(d)) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
      }
    }
    setEditingPet({ ...pet, ngaySinh: formattedDate });
    setPetImageFile(null);
    setIsEditModalOpen(true);
  };

  /**
   * Gửi yêu cầu tạo thú cưng mới lên server.
   */
  const handleCreatePet = async () => {
    if (
      !newPet.tenThuCung ||
      !newPet.tenChuSoHuu ||
      !newPet.soDienThoaiChuSoHuu
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin bắt buộc (*)");
      return;
    }

    const formData = new FormData();
    // Gửi dữ liệu pet dưới dạng một chuỗi JSON với key 'thuCung'
    formData.append(
      "thuCung",
      new Blob([JSON.stringify(newPet)], {
        type: "application/json",
      })
    );

    // Gửi file ảnh (nếu có) với key 'hinhAnh' để khớp với yêu cầu của backend
    if (petImageFile) {
      formData.append("hinhAnh", petImageFile);
    }

    try {
      await petService.createPet(formData);
      toast.success("Thêm mới thành công!");
      setIsAddModalOpen(false);
      setNewPet({
        tenThuCung: "",
        chungLoai: "Chó",
        giongLoai: "",
        ngaySinh: "",
        gioiTinh: "Đực",
        ghiChuSucKhoe: "",
        tenChuSoHuu: "",
        soDienThoaiChuSoHuu: "",
      });
      setPetImageFile(null);
      fetchPets(); // Tải lại danh sách để hiển thị thú cưng mới
    } catch (error) {
      console.error("Lỗi thêm mới:", error);
      toast.error("Thêm mới thất bại.");
    }
  };

  /**
   * Gửi yêu cầu cập nhật thông tin thú cưng lên server.
   */
  const handleSavePet = async () => {
    if (!editingPet) return;

    const formData = new FormData();
    const petData = {
      tenThuCung: editingPet.tenThuCung,
      chungLoai: editingPet.chungLoai,
      giongLoai: editingPet.giongLoai,
      ngaySinh: editingPet.ngaySinh,
      gioiTinh: editingPet.gioiTinh,
      ghiChuSucKhoe: editingPet.ghiChuSucKhoe,
    };

    // Gửi dữ liệu pet dưới dạng một chuỗi JSON với key 'thuCung'
    formData.append(
      "thuCung",
      new Blob([JSON.stringify(petData)], {
        type: "application/json",
      })
    );

    // Gửi file ảnh (nếu có) với key 'hinhAnh' để khớp với yêu cầu của backend
    if (petImageFile) {
      formData.append("hinhAnh", petImageFile);
    }

    try {
      await petService.updatePet(editingPet.thuCungId, formData);
      toast.success("Cập nhật thành công!");
      setIsEditModalOpen(false);
      setPetImageFile(null);
      fetchPets(); // Tải lại danh sách để hiển thị thay đổi
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Cập nhật thất bại.");
    }
  };

  /**
   * Xử lý sự kiện xóa một thú cưng.
   * @param {number} id - ID của thú cưng cần xóa.
   */
  const handleDeleteClick = (id) => {
    setPetToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!petToDeleteId) return;
    try {
      await petService.deletePet(petToDeleteId);
      toast.success("Xóa thành công!");
      // Nếu xóa item cuối cùng của trang, lùi về trang trước
      if (pets.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchPets(); // Tải lại trang hiện tại
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
      toast.error(
        "Xóa thất bại! Có thể thú cưng đang có lịch hẹn hoặc dữ liệu liên quan."
      );
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setPetToDeleteId(null);
    }
  };

  /**
   * Xử lý thay đổi trang.
   * @param {number} pageNumber - Số trang muốn chuyển đến.
   */
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // --- 4. Derived Data & Calculations (Dữ liệu & Tính toán) ---

  // Tính toán index của item đầu tiên trên trang để hiển thị thông tin phân trang
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  // Lưu ý: Các chỉ số thống kê bên dưới chỉ được tính cho các thú cưng trên trang hiện tại.
  // Để có số liệu toàn bộ, backend cần cung cấp API riêng cho thống kê.
  const totalPets = totalElements;
  const countDogs = pets.filter(
    (p) => p.chungLoai && p.chungLoai.toLowerCase() === "chó"
  ).length;
  const countCats = pets.filter(
    (p) => p.chungLoai && p.chungLoai.toLowerCase() === "mèo"
  ).length;

  const stats = [
    {
      title: "Tổng thú cưng",
      value: totalPets,
      icon: "pets",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    {
      title: "Chó",
      value: countDogs,
      icon: "sound_detection_dog_barking",
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-500",
    },
    {
      title: "Mèo",
      value: countCats,
      icon: "cruelty_free",
      color: "text-pink-600",
      bg: "bg-pink-100",
      border: "border-pink-500",
    },
  ];

  // --- 5. UI Rendering (Kết xuất Giao diện) ---

  // Hiển thị trạng thái tải lần đầu tiên
  return (
    <>
      {/* Tiêu đề trang */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Thú cưng
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

      {/* Bộ lọc & Hành động */}
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
                placeholder="Tìm tên thú cưng, chủ nuôi..."
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Lọc theo chủng loại */}
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                value={filterSpecies}
                onChange={(e) => {
                  setFilterSpecies(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả chủng loại</option>
                <option value="Chó">Chó</option>
                <option value="Mèo">Mèo</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Lọc theo giới tính */}
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                value={filterGender}
                onChange={(e) => {
                  setFilterGender(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả giới tính</option>
                <option value="Đực">Đực</option>
                <option value="Cái">Cái</option>
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
              onClick={handleOpenAddModal}
            >
              <span className="material-symbols-outlined text-sm mr-2">
                add
              </span>
              Thêm Thú cưng
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
                  Thú Cưng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Chủ Nuôi
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Loài / Giống
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Giới Tính
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tuổi / Ngày sinh
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ghi chú sức khỏe
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                    <SkeletonRow key={idx} />
                  ))
                : pets.length > 0
                ? pets.map((pet, index) => (
                    <tr
                      key={pet.thuCungId || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{pet.thuCungId}
                      </td>

                      {/* Tên Thú Cưng + Avatar */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover border border-gray-200"
                              src={pet.img}
                              alt={pet.tenThuCung}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/40?text=Pet";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {pet.tenThuCung}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Chủ Nuôi */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pet.ownerName}
                        </div>
                        <div className="text-xs text-gray-500">
                          User ID: #{pet.ownerId || "?"}
                        </div>
                      </td>

                      {/* Loài / Giống */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pet.chungLoai}
                        </div>
                        <div className="text-xs text-gray-500">
                          {pet.giongLoai}
                        </div>
                      </td>

                      {/* Giới Tính */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            pet.gioiTinh === "Đực"
                              ? "bg-blue-100 text-blue-800"
                              : pet.gioiTinh === "Cái"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {pet.gioiTinh}
                        </span>
                      </td>

                      {/* Tuổi / Ngày sinh */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {calculateAge(pet.ngaySinh)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(pet.ngaySinh)}
                        </div>
                      </td>

                      {/* Ghi chú */}
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate"
                        title={pet.ghiChuSucKhoe}
                      >
                        {pet.ghiChuSucKhoe}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            title="Xem chi tiết"
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            onClick={() => handleViewDetail(pet)}
                          >
                            <span className="material-symbols-outlined text-base">
                              visibility
                            </span>
                          </button>
                          <button
                            title="Chỉnh sửa"
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            onClick={() => handleEditClick(pet)}
                          >
                            <span className="material-symbols-outlined text-base">
                              edit_note
                            </span>
                          </button>
                          <button
                            title="Xóa"
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => handleDeleteClick(pet.thuCungId)}
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
                        Không tìm thấy thú cưng nào.
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
                  {indexOfFirstItem + pets.length}
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

      {/* Modal Chi tiết Thú cưng */}
      <AnimatePresence>
        {isDetailModalOpen && selectedPet && (
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
                      Chi tiết Thú cưng #{selectedPet.thuCungId}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Xem thông tin chi tiết hồ sơ
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
                <div className="space-y-8">
                  <div className="flex justify-center mb-8">
                    <img
                      src={selectedPet.img}
                      alt={selectedPet.tenThuCung}
                      className="h-40 w-40 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150?text=Pet";
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Tên thú cưng
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body font-medium">
                        {selectedPet.tenThuCung}
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Chủ nuôi
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                        {selectedPet.ownerName}
                        <span className="text-xs text-gray-500 ml-2">
                          (ID: #{selectedPet.ownerId})
                        </span>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Chủng loại
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                        {selectedPet.chungLoai}
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Giống
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                        {selectedPet.giongLoai}
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Giới tính
                      </label>
                      <div className="mt-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            selectedPet.gioiTinh === "Đực"
                              ? "bg-blue-100 text-blue-800"
                              : selectedPet.gioiTinh === "Cái"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedPet.gioiTinh}
                        </span>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Ngày sinh / Tuổi
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                        {formatDate(selectedPet.ngaySinh)} (
                        {calculateAge(selectedPet.ngaySinh)})
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Ghi chú sức khỏe
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body min-h-[80px]">
                        {selectedPet.ghiChuSucKhoe}
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

      {/* Modal Chỉnh sửa Thú cưng */}
      <AnimatePresence>
        {isEditModalOpen && editingPet && (
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
                      Chỉnh sửa Thú cưng #{editingPet.thuCungId}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Cập nhật thông tin hồ sơ thú cưng
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
                    <label className="form-label">Tên thú cưng</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingPet.tenThuCung || ""}
                      onChange={(e) =>
                        setEditingPet({
                          ...editingPet,
                          tenThuCung: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="input-group">
                    <label className="form-label">Hình ảnh</label>
                    <div className="mt-2 flex items-center space-x-4">
                      <img
                        src={
                          petImageFile
                            ? URL.createObjectURL(petImageFile)
                            : editingPet.img // 'img' is already the full URL
                        }
                        alt="Pet Avatar"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        onChange={(e) => setPetImageFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="input-group">
                      <label className="form-label">Chủng loại</label>
                      <select
                        className="form-control"
                        value={editingPet.chungLoai || "Khác"}
                        onChange={(e) =>
                          setEditingPet({
                            ...editingPet,
                            chungLoai: e.target.value,
                          })
                        }
                      >
                        <option value="Chó">Chó</option>
                        <option value="Mèo">Mèo</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="form-label">Giới tính</label>
                      <select
                        className="form-control"
                        value={editingPet.gioiTinh || "Chưa rõ"}
                        onChange={(e) =>
                          setEditingPet({
                            ...editingPet,
                            gioiTinh: e.target.value,
                          })
                        }
                      >
                        <option value="Đực">Đực</option>
                        <option value="Cái">Cái</option>
                        <option value="Chưa rõ">Chưa rõ</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="form-label">Giống loài</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingPet.giongLoai || ""}
                      onChange={(e) =>
                        setEditingPet({
                          ...editingPet,
                          giongLoai: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="input-group">
                    <label className="form-label">Ngày sinh</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editingPet.ngaySinh || ""}
                      onChange={(e) =>
                        setEditingPet({
                          ...editingPet,
                          ngaySinh: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="input-group">
                    <label className="form-label">Ghi chú sức khỏe</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={editingPet.ghiChuSucKhoe || ""}
                      onChange={(e) =>
                        setEditingPet({
                          ...editingPet,
                          ghiChuSucKhoe: e.target.value,
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
                  onClick={handleSavePet}
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

      {/* Modal Thêm mới Thú cưng */}
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
                      add_circle
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                      Thêm Thú cưng mới
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Tạo hồ sơ thú cưng mới
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
                <div className="space-y-8">
                  <div className="input-group">
                    <label className="form-label">
                      Tên thú cưng <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={newPet.tenThuCung}
                      onChange={(e) =>
                        setNewPet({ ...newPet, tenThuCung: e.target.value })
                      }
                    />
                  </div>

                  <div className="input-group">
                    <label className="form-label">Hình ảnh</label>
                    <div className="mt-2 flex items-center space-x-4">
                      <img
                        src={
                          petImageFile
                            ? URL.createObjectURL(petImageFile)
                            : "https://placehold.co/100x100?text=Pet"
                        }
                        alt="Pet Preview"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        onChange={(e) => setPetImageFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="input-group">
                      <label className="form-label">Chủng loại</label>
                      <select
                        className="form-control"
                        value={newPet.chungLoai}
                        onChange={(e) =>
                          setNewPet({ ...newPet, chungLoai: e.target.value })
                        }
                      >
                        <option value="Chó">Chó</option>
                        <option value="Mèo">Mèo</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="form-label">Giới tính</label>
                      <select
                        className="form-control"
                        value={newPet.gioiTinh}
                        onChange={(e) =>
                          setNewPet({ ...newPet, gioiTinh: e.target.value })
                        }
                      >
                        <option value="Đực">Đực</option>
                        <option value="Cái">Cái</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="form-label">Giống loài</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newPet.giongLoai}
                      onChange={(e) =>
                        setNewPet({ ...newPet, giongLoai: e.target.value })
                      }
                    />
                  </div>

                  <div className="input-group">
                    <label className="form-label">Ngày sinh</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newPet.ngaySinh}
                      onChange={(e) =>
                        setNewPet({ ...newPet, ngaySinh: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="input-group">
                      <label className="form-label">
                        Tên chủ sở hữu <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newPet.tenChuSoHuu}
                        onChange={(e) =>
                          setNewPet({ ...newPet, tenChuSoHuu: e.target.value })
                        }
                      />
                    </div>
                    <div className="input-group">
                      <label className="form-label">
                        SĐT chủ sở hữu <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newPet.soDienThoaiChuSoHuu}
                        onChange={(e) =>
                          setNewPet({
                            ...newPet,
                            soDienThoaiChuSoHuu: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="form-label">Ghi chú sức khỏe</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={newPet.ghiChuSucKhoe}
                      onChange={(e) =>
                        setNewPet({ ...newPet, ghiChuSucKhoe: e.target.value })
                      }
                    />
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
                  onClick={handleCreatePet}
                  className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 tracking-wide"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  Tạo Thú Cưng
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
                  Bạn có chắc chắn muốn xóa hồ sơ thú cưng này? Hành động này
                  không thể hoàn tác và có thể ảnh hưởng đến dữ liệu liên quan.
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
    </>
  );
};

export default AdminPets;
