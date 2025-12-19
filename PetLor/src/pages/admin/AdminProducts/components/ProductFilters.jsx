import React, { useState, useEffect } from "react";

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterStock,
  setFilterStock,
  categories,
  setCurrentPage,
  onOpenAddModal,
  placeholder,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");

  // Đồng bộ local state khi prop thay đổi (ví dụ: khi reset filter từ bên ngoài)
  useEffect(() => {
    setLocalSearchTerm(searchTerm || "");
  }, [searchTerm]);

  // Debounce: Chỉ cập nhật searchTerm (và gọi API ở cha) sau khi ngừng gõ 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        console.log(
          "ProductFilters: Gửi từ khóa tìm kiếm lên cha ->",
          localSearchTerm
        );
        setSearchTerm(localSearchTerm);
        if (setCurrentPage) setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearchTerm, searchTerm, setSearchTerm, setCurrentPage]);

  return (
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
              placeholder={placeholder || "Tìm tên SP, mã SP..."}
              type="text"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>

          {/* Lọc theo danh mục */}
          <div className="relative inline-block text-left">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option
                  key={cat.id || cat.danhMucId}
                  value={cat.id || cat.danhMucId}
                >
                  {cat.tenDanhMuc}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo trạng thái kho */}
          <div className="relative inline-block text-left">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
              value={filterStock}
              onChange={(e) => {
                setFilterStock(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Tất cả trạng thái kho</option>
              <option value="instock">Còn hàng (&ge;10)</option>
              <option value="lowstock">Sắp hết (&lt;10)</option>
              <option value="outstock">Hết hàng (0)</option>
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
            onClick={onOpenAddModal}
          >
            <span className="material-symbols-outlined text-sm mr-2">add</span>
            Thêm Sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
