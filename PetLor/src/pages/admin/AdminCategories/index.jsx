import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Services
import categoryService from "../../../services/categoryService";

// Components
import CategoryStats from "./components/CategoryStats";
import CategoryTable from "./components/CategoryTable";
import CategoryDetailModal from "./components/modals/CategoryDetailModal";
import CategoryFormModal from "./components/modals/CategoryFormModal";

const AdminCategories = () => {
  const { type } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Config
  const config = {
    products: {
      title: "Danh mục Sản phẩm",
      apiType: "PRODUCT",
      placeholder: "Ví dụ: Thức ăn, Phụ kiện...",
    },
    services: {
      title: "Danh mục Dịch vụ",
      apiType: "SERVICE",
      placeholder: "Ví dụ: Spa, Khám bệnh...",
    },
    posts: {
      title: "Danh mục Bài viết",
      apiType: "POST",
      placeholder: "Ví dụ: Tin tức, Kiến thức...",
    },
  };

  const currentConfig = config[type] || config.products;

  // --- FETCH DATA (QUAN TRỌNG: ĐÃ THÊM LOGIC CHUẨN HÓA) ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll({
        type: currentConfig.apiType,
      });

      // LOGIC CHUẨN HÓA DỮ LIỆU QUAN TRỌNG:
      const normalizedData = Array.isArray(data)
        ? data.map((item) => ({
            ...item, // Giữ lại toàn bộ dữ liệu gốc

            // 1. Chuẩn hóa ID: Kiểm tra kỹ các trường ID của từng loại
            // Dịch vụ dùng 'danhMucDvId', Bài viết dùng 'danhMucBvId', Sản phẩm dùng 'danhMucId'
            id:
              item.danhMucDvId || item.danhMucBvId || item.danhMucId || item.id,

            // 2. Chuẩn hóa Tên: Dịch vụ dùng 'tenDanhMucDv'
            name: item.tenDanhMucDv || item.tenDanhMuc || item.name,

            // 3. Chuẩn hóa Mô tả
            description: item.moTa || item.description || "",
          }))
        : [];

      setCategories(normalizedData);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
      toast.error("Không thể tải danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    setEditingCategory(null);
    setIsFormModalOpen(false);
  }, [type]);

  // --- HANDLERS ---
  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục này?`)) {
      try {
        await categoryService.delete(id, currentConfig.apiType);
        toast.success("Xóa thành công!");
        // Cập nhật state (loại bỏ item vừa xóa)
        setCategories((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Lỗi xóa:", error);
        toast.error("Xóa thất bại!");
      }
    }
  };

  const handleSaveSuccess = () => {
    fetchCategories();
    setIsFormModalOpen(false);
    toast.success(
      editingCategory ? "Cập nhật thành công!" : "Thêm mới thành công!",
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">
          {currentConfig.title}
        </h1>
        <button
          onClick={handleCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Thêm mới
        </button>
      </div>

      {/* Stats */}
      <CategoryStats
        total={categories.length}
        typeTitle={currentConfig.title}
      />

      {/* Table */}
      <CategoryTable
        data={categories} // Dữ liệu đã được chuẩn hóa (có id, name, description)
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal Form */}
      {isFormModalOpen && (
        <CategoryFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={handleSaveSuccess}
          initialData={editingCategory}
          categoryType={currentConfig.apiType}
          placeholder={currentConfig.placeholder}
        />
      )}
    </div>
  );
};

export default AdminCategories;
