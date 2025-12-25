import React, { useState, useEffect } from "react";
import useEscapeKey from "../../../hooks/useEscapeKey";
import { toast } from "react-toastify";
import supplierService from "../../../services/supplierService";

// Components
import SupplierTable from "./components/SupplierTable";
import SupplierFilters from "./components/SupplierFilters"; // Giả sử bạn có component này hoặc dùng chung khung
import SupplierFormModal from "./components/modals/SupplierFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const AdminSuppliers = () => {
  // Data States
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 20;

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDeleteId, setSupplierToDeleteId] = useState(null);

  // --- Fetch Data ---
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
        keyword: searchTerm,
      };

      const response = await supplierService.getAllSuppliers(params);

      // Xử lý response tùy theo cấu trúc trả về của API
      const content = response.content || response || [];
      setSuppliers(content);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      toast.error("Không thể tải danh sách nhà cung cấp.");
    } finally {
      setLoading(false);
    }
  };

  // This single useEffect handles all data fetching.
  // It runs on initial mount, when currentPage changes, and when searchTerm changes.
  useEffect(() => {
    // Debounce the request to avoid making too many API calls when typing quickly.
    const timer = setTimeout(() => {
      fetchSuppliers();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]); // Re-fetch when page or search term changes.

  // --- Handlers ---
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleCreateClick = () => {
    setEditingSupplier(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (supplier) => {
    setEditingSupplier(supplier);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingSupplier) {
        await supplierService.updateSupplier(editingSupplier.nccId, formData);
        toast.success("Cập nhật nhà cung cấp thành công!");
      } else {
        await supplierService.createSupplier(formData);
        toast.success("Thêm mới nhà cung cấp thành công!");
      }
      setIsFormModalOpen(false);
      fetchSuppliers();
    } catch (error) {
      console.error("Lỗi submit:", error);
      toast.error("Thao tác thất bại. Vui lòng thử lại.");
    }
  };

  const handleDeleteClick = (id) => {
    setSupplierToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!supplierToDeleteId) return;
    try {
      await supplierService.deleteSupplier(supplierToDeleteId);
      toast.success("Đã xóa nhà cung cấp.");
      fetchSuppliers();
    } catch (error) {
      console.error("Lỗi xóa:", error);
      toast.error(
        "Không thể xóa nhà cung cấp này (có thể đang có dữ liệu ràng buộc)."
      );
    } finally {
      setIsDeleteModalOpen(false);
      setSupplierToDeleteId(null);
    }
  };

  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] font-display">
            Quản lý Nhà Cung Cấp
          </p>
        </div>
      </div>

      {/* Stats Cards (Nếu Supplier không có stats thì bỏ qua hoặc thêm placeholder) */}
      {/* <SupplierStats ... /> */}

      {/* Filters - Tái sử dụng style của ImportFilters */}
      <SupplierFilters
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          // Reset to page 1 when user types a new search query
          setCurrentPage(1);
        }}
        onRefresh={fetchSuppliers}
        onOpenCreate={handleCreateClick}
      />

      {/* Table */}
      <SupplierTable
        loading={loading}
        suppliers={suppliers}
        totalElements={totalElements}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        indexOfFirstItem={indexOfFirstItem}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Modals */}
      <SupplierFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={editingSupplier}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa Nhà Cung Cấp"
        message="Bạn có chắc chắn muốn xóa đối tác này? Mọi phiếu nhập liên quan có thể bị ảnh hưởng."
        confirmText="Xóa NCC"
        cancelText="Quay lại"
      />
    </>
  );
};

export default AdminSuppliers;
