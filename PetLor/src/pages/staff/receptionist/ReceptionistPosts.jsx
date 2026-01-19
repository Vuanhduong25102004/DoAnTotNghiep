import React from "react";
import { Link } from "react-router-dom";

const ReceptionistPosts = () => {
  // Dữ liệu thống kê
  const stats = [
    {
      label: "Tổng bài viết",
      value: "156",
      icon: "article",
      colorClass: "bg-[#2a9d90]/10 text-[#2a9d90]",
    },
    {
      label: "Đang hiển thị",
      value: "142",
      icon: "visibility",
      colorClass: "bg-green-50 text-green-500",
    },
    {
      label: "Lượt xem tháng này",
      value: "24.5K",
      icon: "trending_up",
      colorClass: "bg-blue-50 text-blue-500",
    },
  ];

  // Dữ liệu bài viết
  const posts = [
    {
      id: "POST-1284",
      title: "Cách chăm sóc mèo con mới về nhà",
      image:
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=100&q=80",
      category: "Blog",
      categoryStyle: "bg-blue-50 text-blue-600",
      author: "Bác sĩ Tú Anh",
      date: "24/10/2023",
      status: "Công khai",
      isPublished: true,
    },
    {
      id: "POST-1285",
      title: "Lưu ý khi tiêm phòng cho chó",
      image: null, // Không có ảnh -> dùng icon placeholder
      category: "Tin tức",
      categoryStyle: "bg-orange-50 text-orange-600",
      author: "Lễ tân Minh Anh",
      date: "--/--/----",
      status: "Nháp",
      isPublished: false,
    },
    {
      id: "POST-1286",
      title: "Chương trình ưu đãi tháng 11",
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=100&q=80",
      category: "Ưu đãi",
      categoryStyle: "bg-purple-50 text-purple-600",
      author: "Lễ tân Minh Anh",
      date: "20/10/2023",
      status: "Công khai",
      isPublished: true,
    },
    {
      id: "POST-1287",
      title: "Lựa chọn thức ăn phù hợp cho Poodle",
      image: null,
      category: "Blog",
      categoryStyle: "bg-blue-50 text-blue-600",
      author: "Bác sĩ Nam",
      date: "15/10/2023",
      status: "Công khai",
      isPublished: true,
    },
  ];

  return (
    <main className="w-full bg-[#fbfcfc] font-sans text-[#101918] min-h-screen p-8 lg:p-12">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* ====================================================================================
            PHẦN 1: HEADER & STATS
           ==================================================================================== */}
        <div className="flex flex-col gap-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((item, index) => (
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

        {/* ====================================================================================
            PHẦN 2: BẢNG DANH SÁCH BÀI VIẾT
           ==================================================================================== */}
        <section className="bg-white rounded-[40px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 overflow-hidden">
          {/* Toolbar (Optional visual enhancement) */}
          <div className="p-8 border-b border-[#e9f1f0] flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-extrabold text-[#101918] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2a9d90]">
                list_alt
              </span>
              Danh sách bài đăng
            </h3>
            <div className="flex gap-3">
              {/* Button Bộ lọc: Giữ nguyên là button thường để xử lý onClick mở filter */}
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#f9fbfb] hover:bg-[#e9f1f0] text-[#588d87] text-sm font-bold rounded-xl transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  filter_list
                </span>
                Bộ lọc
              </button>

              {/* Button Viết bài mới: Bọc trong Link để chuyển trang */}
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
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-[#f9fbfb] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        {post.image ? (
                          <img
                            alt="Thumbnail"
                            className="w-20 h-14 rounded-xl object-cover border border-[#e9f1f0] shadow-sm"
                            src={post.image}
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
                            {post.title}
                          </p>
                          <p className="text-xs text-[#588d87] font-medium mt-1">
                            ID: #{post.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1.5 text-[11px] font-black uppercase rounded-lg tracking-wide ${post.categoryStyle}`}
                      >
                        {post.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#588d87] text-[18px]">
                          person
                        </span>
                        <span className="text-sm font-bold text-[#101918]">
                          {post.author}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-[#588d87]">
                      {post.date}
                    </td>
                    <td className="px-8 py-6">
                      <div
                        className={`flex items-center gap-2 ${
                          post.isPublished ? "text-[#2a9d90]" : "text-gray-400"
                        }`}
                      >
                        <span
                          className={`size-2.5 rounded-full ${
                            post.isPublished
                              ? "bg-[#2a9d90] animate-pulse"
                              : "bg-gray-300"
                          }`}
                        ></span>
                        <span className="text-sm font-bold">{post.status}</span>
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="px-8 py-6 bg-[#f9fbfb] border-t border-[#e9f1f0] flex items-center justify-between">
            <p className="text-sm text-[#588d87] font-medium">
              Hiển thị <span className="font-bold text-[#101918]">1 - 4</span>{" "}
              trên <span className="font-bold text-[#101918]">156</span> bài
              viết
            </p>
            <div className="flex gap-2">
              <button
                className="size-10 rounded-xl border border-[#e9f1f0] bg-white text-[#588d87] hover:bg-gray-50 flex items-center justify-center disabled:opacity-50"
                disabled
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>
              <button className="size-10 rounded-xl bg-[#2a9d90] text-white text-sm font-bold shadow-md shadow-[#2a9d90]/20">
                1
              </button>
              <button className="size-10 rounded-xl border border-[#e9f1f0] bg-white text-[#588d87] text-sm font-bold hover:bg-gray-50 hover:text-[#2a9d90] transition-colors">
                2
              </button>
              <button className="size-10 rounded-xl border border-[#e9f1f0] bg-white text-[#588d87] text-sm font-bold hover:bg-gray-50 hover:text-[#2a9d90] transition-colors">
                3
              </button>
              <button className="size-10 rounded-xl border border-[#e9f1f0] bg-white text-[#588d87] hover:bg-gray-50 hover:text-[#2a9d90] transition-colors flex items-center justify-center">
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
