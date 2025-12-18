import React, { useEffect, useState, useLayoutEffect } from "react";
import productService from "../../services/productService"; // Đảm bảo bạn đã tạo file này như hướng dẫn trước
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// Component Skeleton Loading cho Table
const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100 last:border-0">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-48"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div>
    </td>
  </tr>
);

const AdminCategories = () => {
  // 1. State lưu dữ liệu và trạng thái tải
  const [categories, setCategories] = useState([]); // Danh sách các danh mục
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  // State cho Modal thêm mới/chỉnh sửa
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái hiển thị modal thêm/sửa
  const [newCategory, setNewCategory] = useState({ tenDanhMuc: "", moTa: "" }); // Dữ liệu của form trong modal
  const [editingId, setEditingId] = useState(null); // ID của danh mục đang chỉnh sửa, null nếu là thêm mới
  // State cho Modal xem chi tiết
  const [selectedCategory, setSelectedCategory] = useState(null); // Danh mục được chọn để xem chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Trạng thái hiển thị modal chi tiết
  // State cho Modal xác nhận xóa
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);

  // 2. Hàm gọi API lấy danh sách danh mục
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllCategories();
      // Chuẩn hóa dữ liệu trả về từ API để đảm bảo tính nhất quán
      const formattedData = Array.isArray(response)
        ? response.map((cat) => ({
            ...cat,
            // Đảm bảo luôn có `danhMucId` và `soLuongSanPham`
            danhMucId: cat.id || cat.danhMucId,
            soLuongSanPham:
              cat.soLuongSanPham || (cat.sanPhams ? cat.sanPhams.length : 0),
          }))
        : [];

      setCategories(formattedData);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      toast.error("Không thể tải danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  };
  // Xử lý phím ESC để đóng modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setIsDetailModalOpen(false);
        setIsConfirmDeleteModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  // Thay useEffect bằng useLayoutEffect để chặn render trước khi cuộn hiện ra
  useLayoutEffect(() => {
    const isAnyModalOpen =
      isModalOpen || isDetailModalOpen || isConfirmDeleteModalOpen;
    const contentArea = document.getElementById("admin-content-area");

    if (contentArea) {
      if (isAnyModalOpen) {
        contentArea.style.overflow = "hidden";
      } else {
        contentArea.style.overflow = "auto";
      }
    }

    // Cleanup
    return () => {
      if (contentArea) {
        contentArea.style.overflow = "auto";
      }
    };
  }, [isModalOpen, isDetailModalOpen, isConfirmDeleteModalOpen]);

  // 3. useEffect chạy một lần khi component được mount để tải dữ liệu
  useEffect(() => {
    fetchCategories();
  }, []);

  // 4. Các hàm xử lý sự kiện CRUD (Create, Read, Update, Delete)

  // Hàm xử lý Lưu (Thêm mới hoặc Cập nhật)
  const handleSave = async () => {
    if (!newCategory.tenDanhMuc.trim()) {
      toast.warning("Vui lòng nhập tên danh mục!");
      return;
    }

    setLoading(true); // Hiển thị loading trong khi chờ API
    try {
      if (editingId) {
        // Cập nhật danh mục đã có
        await productService.updateCategory(editingId, newCategory);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        // Thêm danh mục mới
        await productService.createCategory(newCategory);
        toast.success("Thêm danh mục thành công!");
      }
      // Đóng modal và reset form sau khi lưu thành công
      handleCloseModals();
      await fetchCategories(); // Tải lại danh sách danh mục để cập nhật UI
    } catch (error) {
      console.error("Lỗi lưu danh mục:", error);
      toast.error("Thao tác thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false); // Ẩn loading
    }
  };

  // Hàm mở modal xác nhận xóa
  const handleDeleteClick = (id) => {
    setCategoryToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  // Hàm thực hiện xóa sau khi xác nhận
  const confirmDelete = async () => {
    if (!categoryToDeleteId) return;
    try {
      await productService.deleteCategory(categoryToDeleteId);
      setCategories((prev) =>
        prev.filter((cat) => cat.danhMucId !== categoryToDeleteId)
      );
      toast.success("Xóa danh mục thành công!");
    } catch (error) {
      console.error("Lỗi xóa danh mục:", error);
      toast.error("Xóa thất bại! Có thể danh mục này đang chứa sản phẩm.");
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setCategoryToDeleteId(null);
    }
  };

  // 5. Các hàm xử lý hiển thị Modal

  // Mở modal để thêm danh mục mới
  const handleOpenAddModal = () => {
    setEditingId(null);
    setNewCategory({ tenDanhMuc: "", moTa: "" });
    setIsModalOpen(true);
  };

  // Mở modal để chỉnh sửa danh mục
  const handleOpenEditModal = (category) => {
    setEditingId(category.danhMucId);
    setNewCategory({
      tenDanhMuc: category.tenDanhMuc,
      moTa: category.moTa || "",
    });
    setIsModalOpen(true);
  };

  // Mở modal để xem chi tiết danh mục
  const handleViewDetail = (category) => {
    setSelectedCategory(category);
    setIsDetailModalOpen(true);
  };

  // Đóng tất cả các modal và reset state
  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
    setEditingId(null);
    setSelectedCategory(null);
    setNewCategory({ tenDanhMuc: "", moTa: "" });
    setIsConfirmDeleteModalOpen(false);
    setCategoryToDeleteId(null);
  };

  // 6. Tính toán dữ liệu thống kê
  // Tìm danh mục có nhiều sản phẩm nhất
  const maxProductCat =
    categories.length > 0
      ? categories.reduce((prev, current) =>
          prev.soLuongSanPham > current.soLuongSanPham ? prev : current
        )
      : { tenDanhMuc: "N/A", soLuongSanPham: 0 }; // Giá trị mặc định khi không có danh mục

  // Dữ liệu cho các thẻ thống kê
  const stats = [
    {
      title: "Tổng danh mục",
      value: categories.length,
      icon: "category",
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-600",
    },
    {
      title: "Nhiều SP nhất",
      value: `${maxProductCat.tenDanhMuc} (${maxProductCat.soLuongSanPham})`,
      icon: "trending_up",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
    {
      title: "Đang hoạt động", // Giả định tất cả đều đang hoạt động
      value: categories.length,
      icon: "check_circle",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
  ];

  // 7. Render giao diện
  return (
    <>
      {/* Tiêu đề trang */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Danh mục
        </p>
      </div>
      {/* Lưới hiển thị các thẻ thống kê */}
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

      {/* Khu vực chứa các nút hành động, ví dụ: nút Thêm mới */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mt-6">
        <div className="flex justify-end">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none"
            onClick={handleOpenAddModal}
          >
            <span className="material-symbols-outlined text-sm mr-2">add</span>{" "}
            Thêm Danh mục
          </button>
        </div>
      </div>
      {/* Bảng hiển thị dữ liệu danh mục */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <SkeletonRow key={idx} />
                ))
              ) : categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr
                    key={cat.danhMucId || index} // Sử dụng ID làm key, fallback về index nếu ID không có
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{cat.danhMucId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cat.tenDanhMuc}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[400px] truncate"
                      title={cat.moTa} // Hiển thị đầy đủ mô tả khi hover
                    >
                      {cat.moTa || "Không có mô tả"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Nút xem chi tiết */}
                        <button
                          title="Xem chi tiết"
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          onClick={() => handleViewDetail(cat)}
                        >
                          <span className="material-symbols-outlined text-base">
                            visibility
                          </span>
                        </button>
                        {/* Nút chỉnh sửa */}
                        <button
                          title="Chỉnh sửa"
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                          onClick={() => handleOpenEditModal(cat)}
                        >
                          <span className="material-symbols-outlined text-base">
                            edit_note
                          </span>
                        </button>
                        {/* Nút xóa */}
                        <button
                          title="Xóa"
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => handleDeleteClick(cat.danhMucId)}
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
                // Hiển thị khi không có dữ liệu
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa Danh Mục */}
      <AnimatePresence>
        {isModalOpen && (
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
                      {editingId ? "edit_note" : "add_circle"}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                      {editingId ? "Cập nhật Danh mục" : "Thêm Danh Mục Mới"}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      {editingId
                        ? "Chỉnh sửa thông tin danh mục"
                        : "Điền thông tin danh mục mới"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModals}
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
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Tên danh mục <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newCategory.tenDanhMuc}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          tenDanhMuc: e.target.value,
                        })
                      }
                      placeholder="Ví dụ: Thức ăn cho mèo"
                    />
                  </div>
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Mô tả
                    </label>
                    <textarea
                      className="form-control w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows="4"
                      value={newCategory.moTa}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, moTa: e.target.value })
                      }
                      placeholder="Mô tả chi tiết..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
                <button
                  onClick={handleCloseModals}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 tracking-wide"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    save
                  </span>
                  {editingId ? "Lưu thay đổi" : "Tạo danh mục"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Chi tiết Danh mục */}
      <AnimatePresence>
        {isDetailModalOpen && selectedCategory && (
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
                      Chi tiết Danh mục #{selectedCategory.danhMucId}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Xem thông tin chi tiết
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModals}
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
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Tên danh mục
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body font-medium text-lg">
                      {selectedCategory.tenDanhMuc}
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Số lượng sản phẩm
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                      {selectedCategory.soLuongSanPham}
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Mô tả
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body min-h-[80px]">
                      {selectedCategory.moTa || "Không có mô tả"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
                <button
                  onClick={handleCloseModals}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Xác nhận Xóa */}
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
              transition={{ duration: 0.3, ease: "easeOut" }}
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
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Bạn có chắc chắn muốn xóa danh mục này không? (Lưu ý: Các
                    sản phẩm thuộc danh mục này có thể bị ảnh hưởng)
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmDeleteModalOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
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

export default AdminCategories;
