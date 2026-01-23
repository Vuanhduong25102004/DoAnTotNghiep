import React from "react";

// Skeleton Loading (Giữ nguyên)
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

const CategoryTable = ({
  data, // Đổi tên props từ 'categories' thành 'data' cho tổng quát
  loading,
  onViewDetail, // (Optional) Nếu bạn chưa cần xem chi tiết thì có thể bỏ qua
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
            ) : data && data.length > 0 ? (
              data.map((cat, index) => (
                <tr
                  key={cat.id || index} // Sử dụng ID đã chuẩn hóa
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{cat.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cat.name} {/* Sử dụng Name đã chuẩn hóa */}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[400px] truncate"
                    title={cat.description}
                  >
                    {cat.description || "---"}{" "}
                    {/* Sử dụng Description đã chuẩn hóa */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Nút Xem chi tiết (Tạm ẩn nếu chưa cần thiết) */}
                      {/* <button onClick={() => onViewDetail(cat)} ... ><span ...>visibility</span></button> */}

                      <button
                        title="Chỉnh sửa"
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        onClick={() => onEdit(cat)}
                      >
                        <span className="material-symbols-outlined text-base">
                          edit_note
                        </span>
                      </button>

                      <button
                        title="Xóa"
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => onDelete(cat.id)}
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
                  colSpan="4"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">
                      inbox
                    </span>
                    <p>Chưa có danh mục nào.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
