import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import blogService from "../services/blogService";

// Cấu hình đường dẫn ảnh
const IMAGE_BASE_URL = "http://localhost:8080/uploads/";

const BlogPostDetail = () => {
  const { slug } = useParams(); // Lấy slug từ URL
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Helper: Get Image URL
  const getImageUrl = (filename) => {
    if (!filename) return "https://via.placeholder.com/800x600?text=No+Image";
    return `${IMAGE_BASE_URL}${filename}`;
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Lấy chi tiết bài viết
        const postData = await blogService.getPostBySlug(slug);
        setPost(postData);

        // 2. Lấy bài viết liên quan (Tạm thời lấy list công khai)
        const relatedData = await blogService.getPublicPosts();
        // Lọc bỏ bài hiện tại và lấy 3 bài
        const filteredRelated = Array.isArray(relatedData)
          ? relatedData.filter((p) => p.slug !== slug).slice(0, 3)
          : [];
        setRelatedPosts(filteredRelated);
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Init AOS & Scroll top
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu khi slug thay đổi
    setTimeout(() => {
      AOS.init({ duration: 800, once: true });
      AOS.refresh();
    }, 100);
  }, [slug, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700">
          Không tìm thấy bài viết
        </h2>
        <Link to="/blog" className="text-primary mt-4 hover:underline">
          Quay lại trang Blog
        </Link>
      </div>
    );
  }

  return (
    <main>
      {/* --- BREADCRUMB --- */}
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-17">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
          </li>
          {/* Thêm 'flex items-center' vào thẻ li để icon nằm giữa */}
          <li className="flex items-center">
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
          </li>
          <li>
            <Link to="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
          </li>
          {/* Thêm 'flex items-center' vào thẻ li để icon nằm giữa */}
          <li className="flex items-center">
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
          </li>
          <li className="text-primary font-medium truncate max-w-[200px] sm:max-w-xs">
            {post.tieuDe}
          </li>
        </ol>
      </nav>
      {/* --- ARTICLE CONTENT --- */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 leading-tight">
            {post.tieuDe}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-primary/20 bg-gray-100 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
                {/* Avatar giả lập từ tên tác giả */}
                {post.tenTacGia ? post.tenTacGia.charAt(0) : "A"}
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {post.tenTacGia || "Admin"}
                </p>
                <p className="text-gray-500">Tác giả</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="material-symbols-outlined text-lg">
                calendar_today
              </span>
              <span>{formatDate(post.ngayDang)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="material-symbols-outlined text-lg">folder</span>
              <span>{post.tenDanhMuc}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-[32px] overflow-hidden mb-12 shadow-2xl">
          <img
            alt={post.tieuDe}
            className="w-full aspect-[16/9] object-cover"
            src={getImageUrl(post.anhBia)}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/1200x600?text=No+Image";
            }}
          />
        </div>

        {/* Content Body */}
        <div
          className="article-content" // <--- Chỉ cần class này là đủ, CSS ở trên sẽ lo phần còn lại
          dangerouslySetInnerHTML={{ __html: post.noiDung }}
        ></div>

        {/* Footer (Share & Tags) */}
        <footer className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Chia sẻ bài viết:
            </span>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                {/* SVG Facebook */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                {/* SVG Twitter */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <span className="material-symbols-outlined text-xl">link</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase">
              #{post.tenDanhMuc}
            </span>
            <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
              #PETLOR
            </span>
          </div>
        </footer>
      </article>

      {/* --- RELATED POSTS --- */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-12 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((related, index) => (
                // === SỬA Ở ĐÂY: Bọc toàn bộ Card bằng Link ===
                <Link
                  key={related.baiVietId || index}
                  to={`/bai-viet/${related.slug}`}
                  className="group block h-full"
                >
                  <article className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all h-full flex flex-col">
                    <div className="h-48 overflow-hidden shrink-0">
                      <img
                        alt={related.tieuDe}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={getImageUrl(related.anhBia)}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {related.tieuDe}
                      </h3>
                      <div className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                        {/* Hiển thị mô tả ngắn hoặc tên danh mục */}
                        Danh mục: {related.tenDanhMuc}
                      </div>
                      <span className="text-primary font-bold text-sm flex items-center gap-1 mt-auto">
                        Đọc thêm{" "}
                        <span className="material-symbols-outlined text-sm">
                          chevron_right
                        </span>
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- NEWSLETTER SECTION (Static) --- */}
      <section className="mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="relative overflow-hidden rounded-[48px] p-2 bg-white shadow-2xl border border-gray-100">
          <div className="absolute inset-4 border border-white/20 rounded-[40px] pointer-events-none z-20"></div>
          <div className="relative h-[500px] w-full overflow-hidden rounded-[40px]">
            <img
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1769&q=80"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold w-fit mb-8 tracking-[0.2em] uppercase">
                <span className="material-symbols-outlined text-sm">mail</span>
                <span>Exclusive Updates</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Đăng ký nhận{" "}
                <span className="text-primary">bản tin PetLor</span>
              </h2>
              <p className="text-white/90 text-lg mb-10 leading-relaxed max-w-2xl font-medium">
                Nhận ngay các mẹo chăm sóc thú cưng, tin tức mới nhất và ưu đãi
                độc quyền hàng tuần qua email của bạn.
              </p>
              <div className="w-full max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[28px]">
                  <div className="flex-grow flex items-center px-4 min-h-[56px]">
                    <span className="material-symbols-outlined text-white/60 mr-3">
                      alternate_email
                    </span>
                    <input
                      className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder:text-white/50 text-base outline-none"
                      placeholder="Email của bạn..."
                      type="email"
                    />
                  </div>
                  <button className="bg-primary hover:bg-white hover:text-primary text-white font-extrabold px-8 py-4 sm:py-0 rounded-[20px] transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap">
                    Gửi ngay
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPostDetail;
