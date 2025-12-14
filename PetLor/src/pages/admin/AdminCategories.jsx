import React, { useEffect, useState } from "react";
import productService from "../../services/productService"; // Đảm bảo bạn đã tạo file này như hướng dẫn trước

const AdminCategories = () => {
  // 1. State lưu dữ liệu và trạng thái tải
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // State cho Modal thêm mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ tenDanhMuc: "", moTa: "" });
  const [editingId, setEditingId] = useState(null);

  // 2. Hàm gọi API lấy danh sách danh mục
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllCategories();
      const formattedData = Array.isArray(response)
        ? response.map((cat) => ({
            ...cat,
            // Map ID và số lượng sản phẩm
            danhMucId: cat.id || cat.danhMucId,
            soLuongSanPham:
              cat.soLuongSanPham || (cat.sanPhams ? cat.sanPhams.length : 0),
          }))
        : [];

      setCategories(formattedData);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      alert("Không thể tải danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  };

  // 3. useEffect chạy khi load trang
  useEffect(() => {
    fetchCategories();
  }, []);

  // 4. Hàm xử lý Xóa
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa danh mục có ID: ${id}? (Lưu ý: Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng)`
      )
    ) {
      return;
    }

    try {
      await productService.deleteCategory(id);

      // Cập nhật giao diện sau khi xóa thành công
      setCategories((prev) => prev.filter((cat) => cat.danhMucId !== id));
      alert("Xóa danh mục thành công!");
    } catch (error) {
      console.error("Lỗi xóa danh mục:", error);
      alert("Xóa thất bại! Có thể danh mục này đang chứa sản phẩm.");
    }
  };

  // Hàm xử lý Lưu (Thêm mới hoặc Cập nhật)
  const handleSave = async () => {
    if (!newCategory.tenDanhMuc.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    try {
      if (editingId) {
        // Cập nhật
        await productService.updateCategory(editingId, newCategory);
        alert("Cập nhật danh mục thành công!");
      } else {
        // Thêm mới
        await productService.createCategory(newCategory);
        alert("Thêm danh mục thành công!");
      }
      setIsModalOpen(false);
      setNewCategory({ tenDanhMuc: "", moTa: "" });
      setEditingId(null);
      fetchCategories(); // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi lưu danh mục:", error);
      alert("Thao tác thất bại!");
    }
  };

  // 5. Tính toán thống kê (Stats) dựa trên dữ liệu thật
  // Tìm danh mục có nhiều sản phẩm nhất
  const maxProductCat =
    categories.length > 0
      ? categories.reduce((prev, current) =>
          prev.soLuongSanPham > current.soLuongSanPham ? prev : current
        )
      : { tenDanhMuc: "Chưa có", soLuongSanPham: 0 };

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
      title: "Đang hoạt động",
      value: categories.length,
      icon: "check_circle",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
  ];

  if (loading)
    return <div className="p-10 text-center">Đang tải dữ liệu danh mục...</div>;

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Danh mục
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

      {/* Actions */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mt-6">
        <div className="flex justify-end">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none"
            onClick={() => {
              setEditingId(null);
              setNewCategory({ tenDanhMuc: "", moTa: "" });
              setIsModalOpen(true);
            }}
          >
            <span className="material-symbols-outlined text-sm mr-2">add</span>{" "}
            Thêm Danh mục
          </button>
        </div>
      </div>

      {/* Data Table */}
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
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr
                    key={cat.danhMucId || index}
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
                      title={cat.moTa}
                    >
                      {cat.moTa || "Không có mô tả"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          title="Xem chi tiết"
                          className="text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">
                            visibility
                          </span>
                        </button>
                        <button
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                          onClick={() => {
                            setEditingId(cat.danhMucId);
                            setNewCategory({
                              tenDanhMuc: cat.tenDanhMuc,
                              moTa: cat.moTa || "",
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <span className="material-symbols-outlined text-base">
                            edit_note
                          </span>
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => handleDelete(cat.danhMucId)}
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

      {/* Modal Thêm Danh Mục */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Cập nhật Danh mục" : "Thêm Danh Mục Mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  value={newCategory.moTa}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, moTa: e.target.value })
                  }
                  placeholder="Mô tả chi tiết..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Lưu lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCategories;
