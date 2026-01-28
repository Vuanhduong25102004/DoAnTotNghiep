import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import petService from "../../services/petService";
import PetFormModal from "./modals/PetFormModal";
import PetDetailModal from "./modals/PetDetailModal";
import AOS from "aos";
import "aos/dist/aos.css";

// 1. Import Toast
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ConfirmDeleteModal from "../admin/components/ConfirmDeleteModal";

const MyPets = () => {
  const [user] = useOutletContext();
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal States cho Form & Detail
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  // --- 3. STATE CHO MODAL XÓA ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [petIdToDelete, setPetIdToDelete] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const fetchPets = async () => {
    try {
      const res = await petService.getMyPets();
      setPets(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách thú cưng:", error);
      toast.error("Không thể tải danh sách thú cưng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleViewDetail = (pet) => {
    setSelectedPet(pet);
    setIsDetailOpen(true);
  };

  const handleOpenAddPet = () => {
    setSelectedPet(null);
    setIsFormOpen(true);
  };

  const handleEditPet = (e, pet) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setIsDetailOpen(false);
    setSelectedPet(pet);
    setTimeout(() => setIsFormOpen(true), 50);
  };

  // --- 4. LOGIC MỞ MODAL XÓA (Được gọi từ nút Xóa trong DetailModal) ---
  const handleDeleteClick = (petId) => {
    setPetIdToDelete(petId);
    setIsDeleteModalOpen(true);
  };

  // --- 5. LOGIC XÁC NHẬN XÓA (Gọi API thật) ---
  const handleConfirmDelete = async () => {
    if (!petIdToDelete) return;

    try {
      await petService.deleteMyPet(petIdToDelete);

      toast.success("Đã xóa thú cưng thành công!");

      // Đóng tất cả modal liên quan
      setIsDeleteModalOpen(false);
      setIsDetailOpen(false);
      setPetIdToDelete(null);

      // Reload danh sách
      fetchPets();
    } catch (error) {
      console.error("Lỗi xóa pet:", error);
      toast.error(
        error.response?.data?.message || "Xóa thất bại. Vui lòng thử lại.",
      );
      setIsDeleteModalOpen(false); // Đóng modal xác nhận dù lỗi
    }
  };

  const handleSuccess = () => {
    fetchPets();
    toast.success("Cập nhật hồ sơ thành công!");
  };

  const filteredPets = pets.filter(
    (p) =>
      p.tenThuCung?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.giongLoai?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getPetAvatarUrl = (pet) => {
    if (pet?.hinhAnh) {
      return pet.hinhAnh.startsWith("http")
        ? pet.hinhAnh
        : `${API_URL}/uploads/${pet.hinhAnh}`;
    }
    return `https://placehold.co/150/E7F3E7/4C9A4C?text=${
      pet?.tenThuCung ? pet.tenThuCung.charAt(0) : "P"
    }`;
  };

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return "?";
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today <
      new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    ) {
      age--;
    }
    return age < 1 ? "< 1" : age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#10B981] font-bold animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <main className="space-y-8 animate-fade-in">
      <ToastContainer
        style={{ marginTop: "60px", zIndex: 99999 }}
        transition={Slide}
      />

      {/* Header Section */}
      <div
        className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-sm border border-gray-100 isolate"
        data-aos="fade-down"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#10B981]/10 to-transparent"></div>
        <span className="material-symbols-outlined absolute -right-6 -bottom-8 text-9xl text-[#10B981]/5 rotate-12 select-none">
          pets
        </span>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Thú cưng <span className="text-[#10B981]">của tôi</span>
            </h1>
            <p className="text-gray-500 mt-2 max-w-xl">
              Quản lý hồ sơ sức khỏe và lịch trình chăm sóc cho các bé cưng.
            </p>
          </div>
          <button
            onClick={handleOpenAddPet}
            className="bg-[#10B981] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span> Thêm
            thú cưng
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4" data-aos="fade-up">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400">
              search
            </span>
          </span>
          <input
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#10B981] focus:outline-none shadow-sm"
            placeholder="Tìm kiếm theo tên hoặc giống loài..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Thú Cưng */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        data-aos="fade-up"
      >
        {filteredPets.map((pet) => (
          <div
            key={pet.thuCungId}
            onClick={() => handleViewDetail(pet)}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full cursor-pointer relative"
          >
            <div className="relative h-48 overflow-hidden bg-gray-50">
              <img
                alt={pet.tenThuCung}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                src={getPetAvatarUrl(pet)}
                onError={(e) =>
                  (e.target.src = "https://placehold.co/300x200?text=Pet")
                }
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-semibold backdrop-blur-sm shadow-sm flex items-center gap-1 h-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Khỏe mạnh
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-[#10B981] transition-colors line-clamp-1">
                    {pet.tenThuCung}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {pet.giongLoai || "Chưa rõ giống"}
                  </p>
                </div>
                <span
                  className={`material-symbols-outlined text-xl ${
                    pet.gioiTinh === "Đực" ? "text-blue-500" : "text-pink-400"
                  }`}
                >
                  {pet.gioiTinh === "Đực" ? "male" : "female"}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-3 mb-5 text-sm">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-gray-600">
                  <span className="material-symbols-outlined text-base">
                    cake
                  </span>
                  {calculateAge(pet.ngaySinh)} Tuổi
                </div>
                {pet.canNang && (
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-gray-600">
                    <span className="material-symbols-outlined text-base">
                      monitor_weight
                    </span>
                    {pet.canNang} kg
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    schedule
                  </span>{" "}
                  Cập nhật: Mới đây
                </div>
                <div className="text-sm font-bold text-[#10B981] flex items-center gap-1">
                  Chi tiết{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Card Thêm Mới */}
        <div
          onClick={handleOpenAddPet}
          className="min-h-[300px] bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-[#10B981] hover:bg-white transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-[#10B981]">
              add
            </span>
          </div>
          <h3 className="font-bold text-lg text-gray-400 group-hover:text-[#10B981]">
            Thêm bé mới
          </h3>
          <p className="text-sm text-center text-gray-400 mt-2 px-4 group-hover:text-gray-600">
            Tạo hồ sơ mới để theo dõi sức khỏe và lịch trình.
          </p>
        </div>
      </div>

      {/* --- MODALS --- */}
      <PetFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedPet}
        onSuccess={handleSuccess}
      />

      <PetDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        pet={selectedPet}
        onEdit={(pet) => handleEditPet(null, pet)}
        onDelete={handleDeleteClick} // Truyền hàm xóa (kích hoạt modal confirm) xuống
      />

      {/* --- 6. CONFIRM DELETE MODAL --- */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa thú cưng?"
        message="Hành động này sẽ xóa hoàn toàn hồ sơ của bé và không thể khôi phục. Bạn chắc chắn chứ?"
        confirmText="Xóa luôn"
        cancelText="Để lại"
      />
    </main>
  );
};

export default MyPets;
