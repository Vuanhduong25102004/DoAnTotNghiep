import React from "react";
import useEscapeKey from "../../../../hooks/useEscapeKey";
import {
  formatCurrency,
  StockBadge,
  getImageUrl,
} from "../../components/utils";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100 last:border-0">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
    <td className="px-6 py-4 flex items-center gap-3">
      <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-3 bg-gray-100 rounded w-20"></div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div>
    </td>
  </tr>
);

const ProductTable = ({
  loading,
  products,
  totalElements,
  totalPages,
  currentPage,
  ITEMS_PER_PAGE,
  indexOfFirstItem,
  onPageChange,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông tin Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá bán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
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
            {loading
              ? Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                  <SkeletonRow key={idx} />
                ))
              : products.length > 0
              ? products.map((product, index) => {
                  const stockStatus = StockBadge(product.soLuongTonKho);
                  return (
                    <tr
                      key={product.sanPhamId || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{product.sanPhamId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover border border-gray-200"
                              src={getImageUrl(product.hinhAnh)}
                              alt={product.tenSanPham}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/40?text=Pet";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div
                              className="text-sm font-medium text-gray-900 max-w-[200px] truncate"
                              title={product.tenSanPham}
                            >
                              {product.tenSanPham}
                            </div>
                            <div className="text-xs text-gray-500">
                              Danh mục:{" "}
                              <span className="font-semibold">
                                {product.categoryName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(product.gia)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 font-medium">
                            {product.soLuongTonKho}
                          </span>

                          <StockBadge quantity={product.soLuongTonKho} />
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate"
                        title={product.moTaChiTiet}
                      >
                        {product.moTaChiTiet || "Chưa có mô tả"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            title="Xem chi tiết"
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            onClick={() => onViewDetail(product.sanPhamId)}
                          >
                            <span className="material-symbols-outlined text-base">
                              visibility
                            </span>
                          </button>
                          <button
                            title="Chỉnh sửa"
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            onClick={() => onEdit(product)}
                          >
                            <span className="material-symbols-outlined text-base">
                              edit_note
                            </span>
                          </button>
                          <button
                            title="Xóa"
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => onDelete(product.sanPhamId)}
                          >
                            <span className="material-symbols-outlined text-base">
                              cancel
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              : !loading && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Không tìm thấy sản phẩm nào phù hợp.
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
                {indexOfFirstItem + products.length}
              </span>{" "}
              trong số <span className="font-medium">{totalElements}</span> kết
              quả
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => onPageChange(currentPage - 1)}
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
                    onClick={() => onPageChange(number)}
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
                onClick={() => onPageChange(currentPage + 1)}
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
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
