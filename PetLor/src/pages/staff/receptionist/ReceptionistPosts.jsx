import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import postService from "../../../services/postService";
import { getImageUrl, formatDate } from "../../admin/components/utils";

const ReceptionistPosts = () => {
  // --- STATE ---
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // Stats Data
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    views: "24.5K", // Demo
  });

  // --- FETCH DATA ---
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // === QUAN TRỌNG: Spring Boot trang bắt đầu từ 0 ===
      const params = {
        page: currentPage - 1,
        limit: ITEMS_PER_PAGE,
      };

      const response = await postService.getAllPosts(params);

      // Xử lý dữ liệu trả về từ Spring Boot Page<T>
      const content = response.content || [];
      setPosts(content);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);

      // Cập nhật thống kê (Tạm tính trên client hoặc lấy từ API khác)
      setStats((prev) => ({
        ...prev,
        total: response.totalElements || 0,
        published: response.totalElements, // Demo: Giả sử đang hiển thị hết
      }));
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      // toast.error("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  // --- HANDLERS ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        await postService.deletePost(id);
        toast.success("Đã xóa bài viết");
        fetchPosts();
      } catch (error) {
        toast.error("Xóa thất bại");
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // UI Stats Configuration
  const statsUI = [
    {
      label: "Tổng bài viết",
      value: stats.total,
      icon: "article",
      colorClass: "bg-[#2a9d90]/10 text-[#2a9d90]",
    },
    {
      label: "Đang hiển thị",
      value: stats.published,
      icon: "visibility",
      colorClass: "bg-green-50 text-green-500",
    },
    {
      label: "Lượt xem tháng này",
      value: stats.views,
      icon: "trending_up",
      colorClass: "bg-blue-50 text-blue-500",
    },
  ];

  return (
    <main className="w-full bg-[#fbfcfc] font-sans text-[#101918] min-h-screen p-8 lg:p-12">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* --- STATS --- */}
        <div className="flex flex-col gap-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsUI.map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 flex items-center gap-6 transition-transform hover:-translate-y-1 duration-300"
              >
                <div
                  className={`size-16 rounded-2xl flex items-center justify-center shrink-0 ${item.colorClass}`}
                >
                  <span className="material-symbols-outlined text-[32px]">
                    {item.icon}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#588d87] uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <h3 className="text-4xl font-extrabold text-[#101918]">
                    {item.value}
                  </h3>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* --- TABLE --- */}
        <section className="bg-white rounded-[40px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-[#e9f1f0] flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-extrabold text-[#101918] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2a9d90]">
                list_alt
              </span>
              Danh sách bài đăng
            </h3>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#f9fbfb] hover:bg-[#e9f1f0] text-[#588d87] text-sm font-bold rounded-xl transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  filter_list
                </span>
                Bộ lọc
              </button>
              <Link to="/staff/receptionist/posts/create">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#2a9d90] text-white text-sm font-bold rounded-xl hover:bg-[#2a9d90]/90 transition-colors shadow-lg shadow-[#2a9d90]/20">
                  <span className="material-symbols-outlined text-[20px]">
                    add
                  </span>
                  Viết bài mới
                </button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fbfb] border-b border-[#e9f1f0]">
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest">
                    Bài viết
                  </th>
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest">
                    Chuyên mục
                  </th>
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest">
                    Tác giả
                  </th>
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest">
                    Ngày đăng
                  </th>
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest">
                    Trạng thái
                  </th>
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9f1f0]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      Chưa có bài viết nào.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr
                      key={post.baiVietId || post.id}
                      className="hover:bg-[#f9fbfb] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          {/* Ảnh Thumbnail */}
                          {post.anhBia ? (
                            <img
                              alt="Thumbnail"
                              className="w-20 h-14 rounded-xl object-cover border border-[#e9f1f0] shadow-sm"
                              src={getImageUrl(post.anhBia)}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/150?text=Err";
                              }}
                            />
                          ) : (
                            <div className="w-20 h-14 rounded-xl bg-gray-100 flex items-center justify-center border border-[#e9f1f0] text-gray-400">
                              <span className="material-symbols-outlined text-[24px]">
                                image
                              </span>
                            </div>
                          )}
                          <div className="max-w-[280px]">
                            <p className="text-base font-bold text-[#101918] truncate group-hover:text-[#2a9d90] transition-colors">
                              {post.tieuDe}
                            </p>
                            <p className="text-xs text-[#588d87] font-medium mt-1">
                              ID: #{post.baiVietId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1.5 text-[11px] font-black uppercase rounded-lg tracking-wide bg-blue-50 text-blue-600">
                          {post.tenDanhMuc || "Tổng hợp"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#588d87] text-[18px]">
                            person
                          </span>
                          <span className="text-sm font-bold text-[#101918]">
                            {post.tenTacGia || "Admin"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-[#588d87]">
                        {formatDate(post.ngayDang).split(",")[0]}
                      </td>
                      <td className="px-8 py-6">
                        <div
                          className={`flex items-center gap-2 ${post.trangThai === "CONG_KHAI" ? "text-[#2a9d90]" : "text-gray-400"}`}
                        >
                          <span
                            className={`size-2.5 rounded-full ${post.trangThai === "CONG_KHAI" ? "bg-[#2a9d90] animate-pulse" : "bg-gray-300"}`}
                          ></span>
                          <span className="text-sm font-bold">
                            {post.trangThai === "CONG_KHAI"
                              ? "Công khai"
                              : "Nháp"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-3">
                          <button className="px-4 py-2 bg-[#f9fbfb] border border-[#e9f1f0] text-xs font-bold rounded-xl hover:bg-white hover:border-[#2a9d90] hover:text-[#2a9d90] transition-all shadow-sm">
                            Xem
                          </button>
                          <button
                            className="size-9 flex items-center justify-center text-[#2a9d90] bg-[#2a9d90]/5 hover:bg-[#2a9d90]/10 rounded-xl transition-colors"
                            title="Chỉnh sửa"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit
                            </span>
                          </button>
                          <button
                            className="size-9 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                            title="Xóa"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="px-8 py-6 bg-[#f9fbfb] border-t border-[#e9f1f0] flex items-center justify-between">
            <p className="text-sm text-[#588d87] font-medium">
              Hiển thị{" "}
              <span className="font-bold text-[#101918]">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, totalElements)}
              </span>{" "}
              trên{" "}
              <span className="font-bold text-[#101918]">{totalElements}</span>{" "}
              bài viết
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="size-10 rounded-xl border border-[#e9f1f0] bg-white text-[#588d87] hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>

              <button className="size-10 rounded-xl bg-[#2a9d90] text-white text-sm font-bold shadow-md shadow-[#2a9d90]/20">
                {currentPage}
              </button>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="size-10 rounded-xl border border-[#e9f1f0] bg-white text-[#588d87] hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ReceptionistPosts;
