/**
 * @file index.jsx
 * @description Trang quản lý Dịch vụ (Container).
 */
import React, { useEffect, useState } from "react";
// Giữ nguyên import productService như yêu cầu gốc
import productService from "../../../services/productService";
import { toast } from "react-toastify";

// Components
import ServiceStats from "./components/ServiceStats";
import ServiceFilters from "./components/ServiceFilters";
import ServiceTable from "./components/ServiceTable";
import ServiceDetailModal from "./components/modals/ServiceDetailModal";
import ServiceFormModal from "./components/modals/ServiceFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
const AdminServices = () => {
  // --- 1. State Management ---
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceCategories, setServiceCategories] = useState([]);

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  // Data selection
  const [selectedService, setSelectedService] = useState(null);
  const [editingService, setEditingService] = useState(null); // null = Create Mode
  const [serviceToDeleteId, setServiceToDeleteId] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 5;

  // --- 2. Data Fetching ---
  const fetchServices = async () => {
    setLoading(true);
    try {
      let servicesData = [];
      let totalP = 0;
      let totalE = 0;

      const term = searchTerm ? searchTerm.trim() : "";

      if (term) {
        const data = await productService.searchGlobal(term);
        const allSearchResults = data.dichVus || [];

        totalE = allSearchResults.length;
        totalP = Math.ceil(totalE / ITEMS_PER_PAGE);

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        servicesData = allSearchResults.slice(
          startIndex,
          startIndex + ITEMS_PER_PAGE
        );
      } else {
        const page = currentPage - 1;
        const response = await productService.getAllServices({
          page,
          size: ITEMS_PER_PAGE,
        });
        servicesData = response?.content || [];
        totalP = response?.totalPages || 0;
        totalE = response?.totalElements || 0;
      }

      const formattedData = servicesData.map((svc) => ({
        ...svc,
        dichVuId: svc.id || svc.dichVuId,
        tenDichVu: svc.tenDichVu || "Chưa đặt tên",
        moTa: svc.moTa || "Không có mô tả",
        giaDichVu: svc.giaDichVu || svc.gia || 0,
        thoiLuongUocTinhPhut: svc.thoiLuongUocTinhPhut || 0,
        trangThai: svc.trangThai || "Hoạt động",
        hinhAnh: svc.hinhAnh,
      }));

      setServices(formattedData);
      setTotalPages(totalP);
      setTotalElements(totalE);
    } catch (error) {
      console.error("Lỗi tải dịch vụ:", error);
      toast.error("Không thể tải danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh mục (logic trích xuất từ 200 items đầu tiên như code gốc)
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const response = await productService.getAllServices({
          page: 0,
          size: 200,
        });
        const allServices = response?.content || [];
        const categoriesMap = new Map();

        allServices.forEach((service) => {
          if (service.danhMucDvId && service.tenDanhMucDv) {
            categoriesMap.set(service.danhMucDvId, {
              id: service.danhMucDvId,
              danhMucDvId: service.danhMucDvId,
              tenDanhMucDv: service.tenDanhMucDv,
            });
          }
        });
        setServiceCategories(Array.from(categoriesMap.values()));
      } catch (error) {
        console.error("Lỗi tải danh mục dịch vụ:", error);
        toast.warning(
          "Không thể tải danh sách danh mục. Tính năng thêm/sửa có thể bị hạn chế."
        );
      }
    };
    fetchServiceCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [currentPage, searchTerm]);

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
    setServiceToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDeleteId) return;
    try {
      await productService.deleteService(serviceToDeleteId);
      toast.success("Xóa thành công!");
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại! Có thể dịch vụ đang được sử dụng.");
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setServiceToDeleteId(null);
    }
  };

  // Chi tiết
  const handleViewDetail = async (id) => {
    try {
      const data = await productService.getServiceById(id);
      setSelectedService(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi tải chi tiết dịch vụ:", error);
      toast.error("Không thể tải chi tiết dịch vụ.");
    }
  };

  // Mở Form
  const handleOpenCreateModal = () => {
    setEditingService(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setIsFormModalOpen(true);
  };

  // Submit Form (Chung cho Create và Update)
  const handleFormSubmit = async (formData, imageFile) => {
    if (!formData.tenDichVu || !formData.giaDichVu || !formData.danhMucDvId) {
      toast.warning("Vui lòng điền Tên dịch vụ, Giá và chọn Danh mục.");
      return;
    }

    const payload = new FormData();
    const serviceData = {
      tenDichVu: formData.tenDichVu,
      moTa: formData.moTa,
      giaDichVu: Number(formData.giaDichVu),
      thoiLuongUocTinhPhut: Number(formData.thoiLuongUocTinhPhut),
      danhMucDvId: Number(formData.danhMucDvId),
    };

    payload.append(
      "dichVu",
      new Blob([JSON.stringify(serviceData)], { type: "application/json" })
    );
    if (imageFile) {
      payload.append("hinhAnh", imageFile);
    }

    try {
      if (editingService) {
        // Update logic
        await productService.updateService(editingService.dichVuId, payload);
        toast.success("Cập nhật thành công!");
      } else {
        // Create logic
        await productService.createService(payload);
        toast.success("Thêm dịch vụ thành công!");
      }
      setIsFormModalOpen(false);
      fetchServices();
    } catch (error) {
      console.error("Lỗi thao tác dịch vụ:", error);
      toast.error("Thao tác thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  // Pagination
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  // Stats Data
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Dịch vụ
        </p>
      </div>

      <ServiceStats services={services} totalServices={totalElements} />

      <ServiceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <ServiceTable
        loading={loading}
        services={services}
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

      {/* Modal Detail */}
      <ServiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        service={selectedService}
      />

      {/* Modal Form Gộp */}
      <ServiceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={editingService} // null = Create, object = Edit
        serviceCategories={serviceCategories}
        onSubmit={handleFormSubmit}
      />

      {/* Modal Confirm Delete */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default AdminServices;
