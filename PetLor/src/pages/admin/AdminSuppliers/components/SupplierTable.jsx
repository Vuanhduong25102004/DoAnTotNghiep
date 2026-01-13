import React from "react";
import useEscapeKey from "../../../../hooks/useEscapeKey";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100 last:border-0">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-12"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-40"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-8 bg-gray-200 rounded w-16 ml-auto"></div>
    </td>
  </tr>
);

const SupplierTable = ({
  loading,
  suppliers,
  totalElements,
  totalPages,
  currentPage,
  onPageChange,
  indexOfFirstItem,
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
                Mã NCC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên Nhà Cung Cấp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
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
            ) : suppliers.length > 0 ? (
              suppliers.map((item) => (
                <tr
                  key={item.nccId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{item.nccId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium text-gray-900">
                      {item.tenNcc}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        {/* Icon điện thoại nhỏ, màu xám */}
                        <span className="material-symbols-outlined text-[16px] text-gray-400">
                          call
                        </span>
                        <span>{item.soDienThoai}</span>
                      </div>
                      {item.email && (
                        <div className="flex items-center gap-2 text-blue-600">
                          {/* Icon mail nhỏ */}
                          <span className="material-symbols-outlined text-[16px]">
                            mail
                          </span>
                          <span>{item.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate"
                    title={item.diaChi}
                  >
                    {item.diaChi || "N/A"}
                  </td>

                  {/* Cột Hành động: Icon giống hệt ImportTable */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <span className="material-symbols-outlined text-base">
                          visibility
                        </span>
                      </button>
                      <button
                        onClick={() => onDelete(item.nccId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Xóa"
                      >
                        <span className="material-symbols-outlined text-base">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  Không tìm thấy nhà cung cấp nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination giống ImportTable */}
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
                {indexOfFirstItem + suppliers.length}
              </span>{" "}
              trong số <span className="font-medium">{totalElements}</span> kết
              quả
            </p>
          </div>

          {totalPages > 1 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierTable;
