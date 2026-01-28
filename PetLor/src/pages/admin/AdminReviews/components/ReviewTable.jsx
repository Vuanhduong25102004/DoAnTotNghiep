import React from "react";
import { formatDate, StarRating, getImageUrl } from "../../components/utils";

const getSafeTargetInfo = (review) => {
  if (review.sanPham) {
    return {
      image: getImageUrl(review.sanPham.hinhAnh),
      name: review.sanPham.tenSanPham,
      type: "Sản phẩm",
      badgeColor: "bg-blue-100 text-blue-800",
    };
  }
  if (review.dichVu) {
    return {
      image: getImageUrl(review.dichVu.hinhAnh),
      name: review.dichVu.tenDichVu,
      type: "Dịch vụ",
      badgeColor: "bg-purple-100 text-purple-800",
    };
  }
  return {
    image: null,
    name: "Không xác định",
    type: "Hệ thống",
    badgeColor: "bg-gray-100 text-gray-800",
  };
};

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100 last:border-0">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-40"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div>
    </td>
  </tr>
);

const ReviewTable = ({
  loading,
  reviews,
  totalElements,
  totalPages,
  currentPage,
  ITEMS_PER_PAGE,
  indexOfFirstItem,
  onPageChange,
  onViewDetail,
  onToggleStatus,
  onDelete,
}) => {
  // Logic hiển thị nút phân trang thông minh (Rút gọn nếu có quá nhiều trang)
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Chỉ hiển thị tối đa 5 nút số

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiện trang 1
      pages.push(1);

      // Tính toán khoảng giữa
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Luôn hiện trang cuối
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={`dots-${index}`} className="px-2 py-2 text-gray-400">
            ...
          </span>
        );
      }
      return (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            currentPage === page
              ? "z-10 bg-primary border-primary text-white"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      );
    });
  };

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
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mục tiêu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nội dung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                <SkeletonRow key={idx} />
              ))
            ) : reviews.length > 0 ? (
              reviews.map((review) => {
                const target = getSafeTargetInfo(review);
                const avatarUrl = getImageUrl(review.nguoiDung?.anhDaiDien);

                return (
                  <tr
                    key={review.danhGiaId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{review.danhGiaId}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300 relative shrink-0">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt=""
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-xs text-gray-500 font-bold">
                              {review.nguoiDung?.hoTen?.charAt(0) || "?"}
                            </span>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {review.nguoiDung?.hoTen || "Ẩn danh"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {review.nguoiDung?.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {target.image ? (
                          <img
                            src={target.image}
                            alt=""
                            className="w-10 h-10 rounded-md object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                            <span className="material-symbols-outlined text-gray-400 text-sm">
                              image_not_supported
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span
                            className={`self-start inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${target.badgeColor} mb-1`}
                          >
                            {target.type}
                          </span>
                          <div
                            className="text-sm text-gray-900 font-medium truncate max-w-[150px]"
                            title={target.name}
                          >
                            {target.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 min-w-[250px]">
                      <div className="mb-1">{StarRating(review.soSao)}</div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {review.noiDung}
                      </p>
                      {review.phanHoi && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1 rounded w-fit">
                          <span className="material-symbols-outlined text-[14px]">
                            reply
                          </span>
                          <span>Đã phản hồi</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(review.ngayTao)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleStatus(review)}
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border transition-colors ${
                          review.trangThai
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {review.trangThai ? "Hiển thị" : "Đang ẩn"}
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => onViewDetail(review)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            rate_review
                          </span>
                        </button>
                        <button
                          onClick={() => onDelete(review.danhGiaId)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <p>Không tìm thấy đánh giá nào phù hợp.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
                {Math.min(indexOfFirstItem + reviews.length, totalElements)}
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

                {/* Render danh sách số trang thông minh */}
                {renderPageNumbers()}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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

export default ReviewTable;
