import React from "react";
import {
  formatDate,
  StarRating,
  getReviewTargetInfo,
  getImageUrl,
} from "../../components/utils";

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
                const target = getReviewTargetInfo(review);
                const avatarUrl = getImageUrl(review.nguoiDung?.anhDaiDien); // Lấy URL Avatar

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
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300 relative">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt=""
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : null}
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
                      <div className="flex items-center gap-2">
                        {/* Hiển thị ảnh nhỏ sản phẩm/dịch vụ nếu có */}
                        {target.image && (
                          <img
                            src={target.image}
                            alt=""
                            className="w-8 h-8 rounded object-cover border border-gray-200"
                          />
                        )}
                        <div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${target.badgeColor} mb-1`}
                          >
                            {target.type}
                          </span>
                          <div
                            className="text-sm text-gray-900 truncate max-w-[120px]"
                            title={target.name}
                          >
                            {target.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="mb-1">{StarRating(review.soSao)}</div>
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {review.noiDung}
                      </p>
                      {review.phanHoi && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                          <span className="material-symbols-outlined text-[14px]">
                            reply
                          </span>
                          Đã phản hồi
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
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewDetail(review)}
                          className="text-gray-400 hover:text-blue-600"
                          title="Xem & Phản hồi"
                        >
                          <span className="material-symbols-outlined text-base">
                            rate_review
                          </span>
                        </button>
                        <button
                          onClick={() => onDelete(review.danhGiaId)}
                          className="text-gray-400 hover:text-red-500"
                          title="Xóa"
                        >
                          <span className="material-symbols-outlined text-base">
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
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy đánh giá nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Giữ nguyên code phân trang) */}
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
