/**
 * @file index.jsx
 * @description Trang quản lý thú cưng (Container).
 */
import React, { useEffect, useState } from "react";
import petService from "../../../services/petService";
import { toast } from "react-toastify";

// Components
import PetStats from "./components/PetStats";
import PetFilters from "./components/PetFilters";
import PetTable from "./components/PetTable";
import PetDetailModal from "./components/modals/PetDetailModal";
import PetFormModal from "./components/modals/PetFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const AdminPets = () => {
  // --- 1. State Management ---
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 5;

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // Modal Gộp
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  // Data Selection
  const [selectedPet, setSelectedPet] = useState(null);
  const [editingPet, setEditingPet] = useState(null); // null = Create Mode
  const [petToDeleteId, setPetToDeleteId] = useState(null);

  // --- 2. Data Fetching ---
  const fetchPets = async () => {
    setLoading(true);
    try {
      let petsData = [];
      let totalP = 0;
      let totalE = 0;

      const term = searchTerm ? searchTerm.trim() : "";

      if (term) {
        const data = await petService.searchGlobal(term);
        const allSearchResults = data.thuCungs || [];
        
        totalE = allSearchResults.length;
        totalP = Math.ceil(totalE / ITEMS_PER_PAGE);

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        petsData = allSearchResults.slice(
          startIndex,
          startIndex + ITEMS_PER_PAGE
        );
      } else {
        const page = currentPage - 1;
        const params = {
          page,
          size: ITEMS_PER_PAGE,
          species: filterSpecies,
          gender: filterGender,
        };
        if (!params.species) delete params.species;
        if (!params.gender) delete params.gender;

        const response = await petService.getAllPets(params);
        petsData = response?.content || [];
        totalP = response?.totalPages || 0;
        totalE = response?.totalElements || 0;
      }

      // Map Data
      const formattedData = petsData.map((pet) => ({
        ...pet,
        thuCungId: pet.thuCungId,
        ownerName: pet.tenChu || "Chưa rõ",
        ownerId: pet.userId,
        img: pet.hinhAnh
          ? `http://localhost:8080/uploads/${pet.hinhAnh}`
          : "https://placehold.co/100x100?text=Pet",
        tenThuCung: pet.tenThuCung || "Chưa đặt tên",
        chungLoai: pet.chungLoai || "Khác",
        giongLoai: pet.giongLoai || "---",
        ngaySinh: pet.ngaySinh,
        gioiTinh: pet.gioiTinh || "Chưa rõ",
        ghiChuSucKhoe: pet.ghiChuSucKhoe || "Bình thường",
      }));

      setPets(formattedData);
      setTotalPages(totalP);
      setTotalElements(totalE);
    } catch (error) {
      console.error("Lỗi tải danh sách thú cưng:", error);
      toast.error("Không thể tải dữ liệu thú cưng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [currentPage, searchTerm, filterSpecies, filterGender]);

  // Handle ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsDetailModalOpen(false);
        setIsFormModalOpen(false);
        setIsConfirmDeleteModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  // --- 3. Handlers ---

  // Xóa
  const handleDeleteClick = (id) => {
    setPetToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!petToDeleteId) return;
    try {
      await petService.deletePet(petToDeleteId);
      toast.success("Xóa thành công!");
      if (pets.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchPets();
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
      toast.error("Xóa thất bại! Có thể thú cưng đang có lịch hẹn.");
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setPetToDeleteId(null);
    }
  };

  // Xem chi tiết
  const handleViewDetail = (pet) => {
    setSelectedPet(pet);
    setIsDetailModalOpen(true);
  };

  // Form (Create / Edit)
  const handleOpenCreateModal = () => {
    setEditingPet(null); // Create mode
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (pet) => {
    setEditingPet(pet); // Edit mode
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData, imageFile) => {
    // Validate
    if (
      !formData.tenThuCung ||
      !formData.tenChuSoHuu ||
      !formData.soDienThoaiChuSoHuu
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin bắt buộc (*)");
      return;
    }

    const payload = new FormData();
    const petData = {
      tenThuCung: formData.tenThuCung,
      chungLoai: formData.chungLoai,
      giongLoai: formData.giongLoai,
      ngaySinh: formData.ngaySinh,
      gioiTinh: formData.gioiTinh,
      ghiChuSucKhoe: formData.ghiChuSucKhoe,
      // Các trường này có thể chỉ cần cho Create, nhưng gửi khi Update cũng ko sao nếu backend ignore
      tenChuSoHuu: formData.tenChuSoHuu,
      soDienThoaiChuSoHuu: formData.soDienThoaiChuSoHuu,
    };

    payload.append(
      "thuCung",
      new Blob([JSON.stringify(petData)], { type: "application/json" })
    );
    if (imageFile) {
      payload.append("hinhAnh", imageFile);
    }

    try {
      if (editingPet) {
        // Update
        await petService.updatePet(editingPet.thuCungId, payload);
        toast.success("Cập nhật thành công!");
      } else {
        // Create
        await petService.createPet(payload);
        toast.success("Thêm mới thành công!");
      }
      setIsFormModalOpen(false);
      fetchPets();
    } catch (error) {
      console.error("Lỗi thao tác:", error);
      toast.error("Thao tác thất bại.");
    }
  };

  // Pagination
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  // --- 4. Render ---
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Thú cưng
        </p>
      </div>

      <PetStats pets={pets} totalPets={totalElements} />

      <PetFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterSpecies={filterSpecies}
        setFilterSpecies={setFilterSpecies}
        filterGender={filterGender}
        setFilterGender={setFilterGender}
        setCurrentPage={setCurrentPage}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <PetTable
        loading={loading}
        pets={pets}
        totalElements={totalElements}
        totalPages={totalPages}
        currentPage={currentPage}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        indexOfFirstItem={indexOfFirstItem}
        onPageChange={handlePageChange}
        onViewDetail={handleViewDetail}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteClick}
      />

      <PetDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        pet={selectedPet}
      />

      <PetFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={editingPet}
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

export default AdminPets;
