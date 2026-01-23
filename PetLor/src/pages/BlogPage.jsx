import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import blogService from "../services/blogService";

// Cấu hình đường dẫn ảnh (Backend Spring Boot)
const IMAGE_BASE_URL = "http://localhost:8080/uploads/";

const BlogPage = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null); // Bài nổi bật (mới nhất)
  const [recentPosts, setRecentPosts] = useState([]); // Danh sách bài bên dưới
  const [loading, setLoading] = useState(true);

  // --- HELPER 1: Format ngày tháng ---
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // --- HELPER 2: Loại bỏ thẻ HTML để lấy mô tả ngắn ---
  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // --- HELPER 3: Xử lý link ảnh ---
  const getImageUrl = (filename) => {
    if (!filename) return "https://via.placeholder.com/800x600?text=No+Image";
    return `${IMAGE_BASE_URL}${filename}`;
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await blogService.getPublicPosts();

        // Sắp xếp bài mới nhất lên đầu
        const sortedData = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.ngayDang) - new Date(a.ngayDang))
          : [];

        setPosts(sortedData);

        if (sortedData.length > 0) {
          setFeaturedPost(sortedData[0]); // Bài đầu tiên là Featured
          setRecentPosts(sortedData.slice(1)); // Các bài còn lại là Recent
        }
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- AOS ANIMATION ---
  useEffect(() => {
    window.scrollTo(0, 0);
    const aosInit = setTimeout(() => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        delay: 0,
        easing: "ease-out-cubic",
      });
      AOS.refresh();
    }, 100);
    return () => clearTimeout(aosInit);
  }, [loading]); // Refresh khi loading xong

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 text-gray-900 font-sans mt-13">
      {/* --- SECTION 1: FEATURED POST (DYNAMIC DATA) --- */}
      {featuredPost && (
        <section className="mb-16" data-aos="fade-up">
          <div className="relative group overflow-hidden rounded-[32px] bg-white shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-64 lg:h-[500px] overflow-hidden">
                <img
                  alt={featuredPost.tieuDe}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={getImageUrl(featuredPost.anhBia)}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x600?text=Error";
                  }}
                />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Mới nhất
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(featuredPost.ngayDang)}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 leading-tight group-hover:text-primary transition-colors">
                  {featuredPost.tieuDe}
                </h1>
                <p className="text-gray-600 text-lg mb-8 line-clamp-3">
                  {stripHtml(featuredPost.noiDung)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar giả lập từ tên tác giả */}
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                      {featuredPost.tenTacGia
                        ? featuredPost.tenTacGia.charAt(0)
                        : "A"}
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {featuredPost.tenTacGia}
                    </span>
                  </div>
                  <Link
                    className="flex items-center gap-2 text-primary font-bold hover:translate-x-1 transition-transform"
                    to={`/blog/${featuredPost.slug}`}
                  >
                    Đọc bài viết{" "}
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- SECTION 2: FILTERS & SEARCH (STATIC - GIỮ NGUYÊN CSS) --- */}
      <section
        className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-gray-100 pb-8"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
          <button className="px-6 py-2.5 bg-primary text-white rounded-full font-bold whitespace-nowrap shadow-md shadow-primary/20">
            Tất cả
          </button>
          {/* Bạn có thể map danh mục thật nếu muốn, hiện tại giữ nguyên danh mục cứng */}
          {[
            "Kiến thức nuôi chó",
            "Kiến thức nuôi mèo",
            "Dinh dưỡng",
            "Khuyến mãi",
          ].map((cat) => (
            <button
              key={cat}
              className="px-6 py-2.5 bg-white text-gray-600 rounded-full font-semibold border border-gray-100 hover:border-primary hover:text-primary transition-all whitespace-nowrap hover:shadow-sm"
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <input
            className="w-full bg-white border border-gray-100 rounded-3xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary/50 text-sm shadow-sm outline-none"
            placeholder="Tìm kiếm bài viết..."
            type="text"
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
        </div>
      </section>

      {/* --- SECTION 3: MAIN GRID (ARTICLES & SIDEBAR) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN: ARTICLES (DYNAMIC MAP) */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPosts.length > 0 ? (
              recentPosts.map((article, index) => (
                <article
                  key={article.baiVietId}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
                  data-aos="fade-up"
                  data-aos-delay={index * 100} // Giữ hiệu ứng AOS
                >
                  <div className="h-56 overflow-hidden relative shrink-0">
                    <img
                      alt={article.tieuDe}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={getImageUrl(article.anhBia)}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/800x600?text=Error";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-primary shadow-sm uppercase">
                        {article.tenDanhMuc}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          calendar_today
                        </span>{" "}
                        {formatDate(article.ngayDang)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          person
                        </span>{" "}
                        {article.tenTacGia}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3 leading-snug line-clamp-2 hover:underline cursor-pointer">
                      <Link to={`/blog/${article.slug}`}>{article.tieuDe}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                      {stripHtml(article.noiDung)}
                    </p>
                    <Link
                      className="text-sm font-bold flex items-center gap-2 hover:text-primary transition-colors mt-auto"
                      to={`/blog/${article.slug}`}
                    >
                      Xem chi tiết{" "}
                      <span className="material-symbols-outlined text-sm">
                        chevron_right
                      </span>
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-10">
                Chưa có bài viết nào khác.
              </div>
            )}
          </div>

          {/* Pagination (Static UI - Giữ nguyên) */}
          <div className="mt-16 flex justify-center gap-2" data-aos="fade-up">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 hover:border-primary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30">
              1
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 hover:border-primary hover:text-primary transition-colors font-bold">
              2
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 hover:border-primary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-10">
            {/* Trending Widget (LẤY DATA TẠM TỪ STATE POSTS) */}
            <div
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
              data-aos="fade-left"
            >
              <h3 className="text-2xl font-extrabold mb-8 text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Xem nhiều nhất
              </h3>
              <div className="space-y-6">
                {/* Lấy 3 bài đầu tiên làm demo cho sidebar */}
                {posts.slice(0, 3).map((post, index) => (
                  <Link
                    key={post.baiVietId || index}
                    className="group flex gap-4 cursor-pointer"
                    to={`/blog/${post.slug}`}
                  >
                    <div className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-sm">
                      <img
                        alt="Trending"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        src={getImageUrl(post.anhBia)}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2 text-sm">
                        {post.tieuDe}
                      </h4>
                      <span className="text-xs text-gray-400 mt-2">
                        {formatDate(post.ngayDang)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Consultant Widget (Static - Giữ nguyên) */}
            <div
              className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 relative overflow-hidden group"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-9xl text-emerald-500/10 -rotate-12 pointer-events-none select-none">
                medical_services
              </span>

              <div className="relative z-10">
                <h4 className="text-xl font-bold text-emerald-900 mb-2">
                  Cần tư vấn sức khỏe?
                </h4>
                <p className="text-sm text-emerald-700 mb-6 leading-relaxed">
                  Đội ngũ bác sĩ thú y của chúng tôi luôn sẵn sàng hỗ trợ bạn
                  24/7 qua Zalo.
                </p>
                <button className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    chat
                  </span>
                  Chat với bác sĩ ngay
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* --- SECTION 4: NEWSLETTER (Static - Giữ nguyên) --- */}
      <section
        className="mt-24 relative overflow-hidden rounded-[48px] p-2 bg-white shadow-2xl border border-gray-100"
        data-aos="fade-up"
      >
        <div className="absolute inset-4 border border-white/20 rounded-[40px] pointer-events-none z-20"></div>
        <div className="relative h-[600px] w-full overflow-hidden rounded-[40px]">
          <img
            alt="Happy pet owners in park"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqLPSKl-nWV_zxTXmrM7NbrCkgiS3AlNL4UXNxJT3E0rMzB7s7YD2xFkH093hIfqaJFcI-CXA-llLQpuJx_sPtrxvAPnhmv712E5cvlbJxAaxGMStrzsYVIXUn4rh7-ymxxULecrhVFIJeO910kGoy7Tnq-tIIhqmhEacY5Y1-R9PDsQefg_G1wvIFwZkYU17UHEWGGgaSpqbgPdver2A8hJwtimTxV17txHRBerIxM8k29AcyRR1v3NYpHt70xu45wfrhmSNiUNk"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold w-fit mb-8 tracking-[0.2em] uppercase">
              <span className="material-symbols-outlined text-sm">mail</span>
              <span>Exclusive Updates</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Đăng ký nhận <span className="text-primary">bản tin PetLor</span>
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl font-medium">
              Nhận ngay các mẹo chăm sóc thú cưng, tin tức mới nhất và ưu đãi
              độc quyền hàng tuần qua email của bạn.
            </p>
            <div className="w-full max-w-md mx-auto relative">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[28px] shadow-2xl">
                <div className="flex-grow flex items-center px-4 min-h-[60px]">
                  <span className="material-symbols-outlined text-white/60 mr-3">
                    alternate_email
                  </span>
                  <input
                    className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder:text-white/50 text-base outline-none"
                    placeholder="Email của bạn..."
                    type="email"
                  />
                </div>
                <button className="bg-primary hover:bg-white hover:text-primary text-white font-extrabold px-8 py-4 sm:py-0 rounded-[20px] text-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap min-h-[60px]">
                  Gửi ngay
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
              <p className="text-white/40 text-xs mt-4">
                Chúng tôi cam kết bảo mật thông tin và không gửi spam.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
