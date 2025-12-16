import React, { useEffect, useState } from "react";
import petService from "../../services/petService"; // Đảm bảo đường dẫn đúng

// Helper: Tính tuổi từ ngày sinh
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

// Helper: Format ngày sinh
const formatDate = (dateString) => {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const AdminPets = () => {
  // 1. State
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecies, setFilterSpecies] = useState(""); // Chủng loại: Chó/Mèo
  const [filterGender, setFilterGender] = useState("");

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 5;

  // 2. Fetch Data
  const fetchPets = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1;
      const params = {
        page,
        size: ITEMS_PER_PAGE,
        search: searchTerm,
        species: filterSpecies,
        gender: filterGender,
      };
      if (!params.search) delete params.search;
      if (!params.species) delete params.species;
      if (!params.gender) delete params.gender;

      const response = await petService.getAllPets(params);
      const petsData = response?.content || [];

      // Map dữ liệu từ API sang format của UI
      const formattedData = petsData.map((pet) => ({
        ...pet,
        thuCungId: pet.thuCungId,
        ownerName: pet.tenChu || "Chưa rõ",
        ownerId: pet.userId,
        // Ảnh: Nếu null thì dùng ảnh mặc định
        img: pet.hinhAnh
          ? `http://localhost:8080/uploads/${pet.hinhAnh}`
          : "https://placehold.co/100x100?text=Pet",
        // Các trường khác map thẳng
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
      alert("Không thể tải dữ liệu thú cưng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [currentPage, searchTerm, filterSpecies, filterGender]);

  const handleViewDetail = (pet) => {
    setSelectedPet(pet);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (pet) => {
    let formattedDate = "";
    if (pet.ngaySinh) {
      const d = new Date(pet.ngaySinh);
      if (!isNaN(d)) {
        formattedDate = d.toISOString().split("T")[0];
      }
    }
    setEditingPet({ ...pet, ngaySinh: formattedDate });
    setPetImageFile(null);
    setIsEditModalOpen(true);
  };

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
    formData.append("thuCung", JSON.stringify(petData));

    // Gửi file ảnh (nếu có) với key 'hinhAnh' để khớp với yêu cầu của backend
    if (petImageFile) {
      formData.append("hinhAnh", petImageFile);
    }

    try {
      await petService.updatePet(editingPet.thuCungId, formData);
      fetchPets(); // Refresh list
      setIsEditModalOpen(false);
      setPetImageFile(null);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại.");
    }
  };

  const handleCreatePet = async () => {
    if (
      !newPet.tenThuCung ||
      !newPet.tenChuSoHuu ||
      !newPet.soDienThoaiChuSoHuu
    ) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc (*)");
      return;
    }

    const formData = new FormData();
    // Gửi dữ liệu pet dưới dạng một chuỗi JSON với key 'thuCung'
    formData.append("thuCung", JSON.stringify(newPet));

    // Gửi file ảnh (nếu có) với key 'hinhAnh' để khớp với yêu cầu của backend
    if (petImageFile) {
      formData.append("hinhAnh", petImageFile);
    }

    try {
      await petService.createPet(formData);
      alert("Thêm mới thành công!");
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
      fetchPets();
    } catch (error) {
      console.error("Lỗi thêm mới:", error);
      alert("Thêm mới thất bại.");
    }
  };

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

  // 3. Handle Actions (Xóa)
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hồ sơ thú cưng này?"))
      return;

    try {
      await petService.deletePet(id);
      alert("Xóa thành công!");
      if (pets.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchPets();
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert(
        "Xóa thất bại! Có thể thú cưng đang có lịch hẹn hoặc dữ liệu liên quan."
      );
    }
  };

  // Logic Phân trang
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  // 5. Stats Calculation (Động)
  const totalPets = totalElements;
  // These stats are now based on the current page's data.
  // For global stats, a dedicated API endpoint would be better.
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

  if (loading)
    return <div className="p-10 text-center">Đang tải hồ sơ thú cưng...</div>;

  return (
    <>
      {/* Page Heading */}
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
                placeholder="Tìm tên thú cưng, chủ nuôi..."
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Select Species */}
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

            {/* Select Gender */}
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

      {/* Data Table */}
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
              {pets.length > 0 ? (
                pets.map((pet, index) => (
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
                          onClick={() => handleDelete(pet.thuCungId)}
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
                    Không tìm thấy thú cưng nào.
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

      {/* Modal Chi tiết Pet */}
      {isDetailModalOpen && selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chi tiết Thú cưng #{selectedPet.thuCungId}
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
                  src={selectedPet.img}
                  alt={selectedPet.tenThuCung}
                  className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=Pet";
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tên thú cưng</p>
                  <p className="font-medium text-gray-900">
                    {selectedPet.tenThuCung}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chủ nuôi</p>
                  <p className="font-medium text-gray-900">
                    {selectedPet.ownerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: #{selectedPet.ownerId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chủng loại</p>
                  <p className="font-medium text-gray-900">
                    {selectedPet.chungLoai}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giống</p>
                  <p className="font-medium text-gray-900">
                    {selectedPet.giongLoai}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giới tính</p>
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
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh / Tuổi</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedPet.ngaySinh)} (
                    {calculateAge(selectedPet.ngaySinh)})
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Ghi chú sức khỏe</p>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-700 border border-gray-100">
                    {selectedPet.ghiChuSucKhoe}
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

      {/* Modal Chỉnh sửa Pet */}
      {isEditModalOpen && editingPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chỉnh sửa Thú cưng #{editingPet.thuCungId}
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
                  Tên thú cưng
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingPet.tenThuCung || ""}
                  onChange={(e) =>
                    setEditingPet({ ...editingPet, tenThuCung: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hình ảnh
                </label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Chủng loại
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giới tính
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={editingPet.gioiTinh || "Chưa rõ"}
                    onChange={(e) =>
                      setEditingPet({ ...editingPet, gioiTinh: e.target.value })
                    }
                  >
                    <option value="Đực">Đực</option>
                    <option value="Cái">Cái</option>
                    <option value="Chưa rõ">Chưa rõ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giống loài
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingPet.giongLoai || ""}
                  onChange={(e) =>
                    setEditingPet({ ...editingPet, giongLoai: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingPet.ngaySinh || ""}
                  onChange={(e) =>
                    setEditingPet({ ...editingPet, ngaySinh: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú sức khỏe
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSavePet}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 font-medium"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm mới Pet */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Thêm Thú cưng mới
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên thú cưng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newPet.tenThuCung}
                  onChange={(e) =>
                    setNewPet({ ...newPet, tenThuCung: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hình ảnh
                </label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Chủng loại
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giới tính
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giống loài
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newPet.giongLoai}
                  onChange={(e) =>
                    setNewPet({ ...newPet, giongLoai: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newPet.ngaySinh}
                  onChange={(e) =>
                    setNewPet({ ...newPet, ngaySinh: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên chủ sở hữu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={newPet.tenChuSoHuu}
                    onChange={(e) =>
                      setNewPet({ ...newPet, tenChuSoHuu: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SĐT chủ sở hữu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú sức khỏe
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newPet.ghiChuSucKhoe}
                  onChange={(e) =>
                    setNewPet({ ...newPet, ghiChuSucKhoe: e.target.value })
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
                onClick={handleCreatePet}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 font-medium"
              >
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPets;
