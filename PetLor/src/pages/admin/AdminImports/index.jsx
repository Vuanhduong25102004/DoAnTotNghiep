import React, { useState, useEffect } from "react";
import useEscapeKey from "../../../hooks/useEscapeKey";
import { toast } from "react-toastify";
import importService from "../../../services/importService";
import productService from "../../../services/productService";
import supplierService from "../../../services/supplierService";

// Components
import ImportTable from "./components/ImportTable";
import ImportFormModal from "./components/modals/ImportFormModal";
import ImportDetailModal from "./components/modals/ImportDetailModal";
import ImportStats from "./components/ImportStats";
import ImportFilters from "./components/ImportFilters";

import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const AdminImports = () => {
  const [imports, setImports] = useState([]);
  const [filteredImports, setFilteredImports] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [importToDeleteId, setImportToDeleteId] = useState(null);

  // State Phân Trang (MỚI)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 5; // Số dòng mỗi trang

  const handleDeleteClick = (id) => {
    setImportToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!importToDeleteId) return;
    try {
      await importService.deleteImport(importToDeleteId);
      toast.success("Đã xóa phiếu nhập thành công!");

      // Refresh lại dữ liệu
      fetchAllData();
    } catch (error) {
      console.error("Lỗi xóa:", error);
      toast.error("Xóa thất bại! Có thể phiếu này đã có dữ liệu ràng buộc.");
    } finally {
      // Đóng modal và reset ID
      setIsDeleteModalOpen(false);
      setImportToDeleteId(null);
    }
  };
  // Fetch Data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Gọi API với tham số phân trang
      // Lưu ý: Spring Boot Page bắt đầu từ 0, còn UI bắt đầu từ 1 -> Trừ 1
      const [importRes, supplierRes, productRes, categoryRes] =
        await Promise.all([
          importService.getAllImports({
            page: currentPage - 1,
            size: ITEMS_PER_PAGE,
          }),
          supplierService.getAllSuppliers(),
          productService.getAllProducts(),
          productService.getAllCategories(),
        ]);

      // Xử lý response từ importService
      const importContent = importRes?.content || []; // List data
      setImports(importContent);
      setFilteredImports(importContent); // Init filter

      // Cập nhật state phân trang từ API
      setTotalPages(importRes?.totalPages || 0);
      setTotalElements(importRes?.totalElements || 0);

      // ... (Set Suppliers, Products giữ nguyên)
      setSuppliers(supplierRes?.content || supplierRes || []);
      setProducts(productRes?.content || productRes || []);
      setCategories(categoryRes || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      toast.error("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [currentPage]); // <--- Thêm dependency currentPage

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Tính chỉ số item đầu tiên để hiển thị ở Footer (VD: Hiển thị 1 đến 5...)
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  // Search Logic
  useEffect(() => {
    if (!searchTerm) {
      setFilteredImports(imports);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = imports.filter(
        (item) =>
          item.phieuNhapId.toString().includes(lowerTerm) ||
          (item.tenNhaCungCap &&
            item.tenNhaCungCap.toLowerCase().includes(lowerTerm))
      );
      setFilteredImports(filtered);
    }
  }, [searchTerm, imports]);

  // Handlers
  const handleCreateImport = async (payload) => {
    try {
      await importService.createImport(payload);
      toast.success("Tạo phiếu nhập thành công!");
      setIsFormModalOpen(false);
      fetchAllData();
    } catch (error) {
      toast.error("Tạo phiếu nhập thất bại!");
    }
  };

  const handleViewDetail = (item) => {
    setSelectedImport(item);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] font-display">
            Quản lý Nhập Kho
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <ImportStats imports={imports} />

      {/* Filters */}
      <ImportFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefresh={fetchAllData}
        onNewImportClick={() => setIsFormModalOpen(true)}
      />

      {/* Table */}
      <ImportTable
        loading={loading}
        imports={filteredImports}
        totalElements={totalElements}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        indexOfFirstItem={indexOfFirstItem}
        onViewDetail={(item) => {
          setSelectedImport(item);
          setIsDetailModalOpen(true);
        }}
        onDelete={handleDeleteClick}
      />

      {/* Modals */}
      <ImportFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        suppliersList={suppliers}
        productsList={products}
        categoriesList={categories}
        onSubmit={handleCreateImport}
      />

      <ImportDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        importData={selectedImport}
      />
      {/* Delete Modal */}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa Phiếu Nhập"
        message="Bạn có chắc chắn muốn xóa phiếu nhập này? Việc này sẽ ảnh hưởng đến thống kê và tồn kho."
        confirmText="Xóa Phiếu"
        cancelText="Quay lại"
      />
    </>
  );
};

export default AdminImports;
