import React, { useState, useEffect } from "react";
import {
  formatDate,
  PostStatusBadge,
  getImageUrl,
} from "../../components/utils";

// --- COMPONENT CON: Xử lý hiển thị ảnh an toàn ---
const PostImage = ({ src, alt }) => {
  // Dùng hàm getFullImageUrl đã import
  const [imgSrc, setImgSrc] = useState(getImageUrl(src));
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setImgSrc(getImageUrl(src));
    setIsError(false);
  }, [src]);

  const handleError = () => {
    if (!isError) {
      setIsError(true);
      setImgSrc("https://via.placeholder.com/150?text=No+Image");
    }
  };

  return (
    <img
      className="h-10 w-10 rounded-md object-cover border border-gray-200"
      src={
        isError || !imgSrc
          ? "https://via.placeholder.com/150?text=No+Image"
          : imgSrc
      }
      alt={alt}
      onError={handleError}
    />
  );
};

// --- COMPONENT CHÍNH ---
const PostTable = ({
  loading,
  posts,
  totalElements,
  totalPages,
  currentPage,
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Bài viết
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tác giả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày đăng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Đang tải...
                </td>
              </tr>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <tr
                  key={post.baiVietId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{post.baiVietId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {/* Sử dụng Component ảnh đã tách */}
                        <PostImage src={post.anhBia} alt={post.tieuDe} />
                      </div>
                      <div className="ml-4 max-w-xs">
                        <div
                          className="text-sm font-medium text-gray-900 truncate"
                          title={post.tieuDe}
                        >
                          {post.tieuDe}
                        </div>
                        <div
                          className="text-sm text-gray-500 truncate"
                          title={post.slug}
                        >
                          /{post.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-500">
                      {post.tenDanhMuc || "Chưa phân loại"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.tenTacGia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(post.ngayDang).split(",")[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <PostStatusBadge status={post.trangThai} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewDetail(post)}
                        className="text-gray-400 hover:text-green-600"
                      >
                        <span className="material-symbols-outlined text-base">
                          visibility
                        </span>
                      </button>
                      <button
                        onClick={() => onEdit(post)}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <span className="material-symbols-outlined text-base">
                          edit_note
                        </span>
                      </button>
                      <button
                        onClick={() => onDelete(post.baiVietId)}
                        className="text-gray-400 hover:text-red-500"
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
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Không có bài viết nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination giữ nguyên */}
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
                {indexOfFirstItem + posts.length}
              </span>{" "}
              trong số <span className="font-medium">{totalElements}</span> kết
              quả
            </p>
          </div>
          {totalPages > 1 && (
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => onPageChange(num)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === num
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostTable;
