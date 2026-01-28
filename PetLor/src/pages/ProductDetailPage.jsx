import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// --- IMPORT TOASTIFY ---
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import productService from "../services/productService";
import searchService from "../services/searchService";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatters";
import { SERVER_URL } from "../services/apiClient";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // --- STATE ---
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // State cho Đánh giá & Phân trang
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(0); // Trang hiện tại (bắt đầu từ 0)
  const [totalReviewPages, setTotalReviewPages] = useState(0); // Tổng số trang
  const [totalReviewsCount, setTotalReviewsCount] = useState(0); // Tổng số lượng đánh giá

  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  // Helper xử lý ảnh
  const getImageUrl = (imageName) => {
    if (!imageName) return "https://placehold.co/600x600?text=No+Image";
    if (imageName.startsWith("http")) return imageName;
    return `${SERVER_URL}/uploads/${imageName}`;
  };

  // Helper format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // 1. Lấy thông tin sản phẩm chính
        const data = await productService.getProductById(id);

        const mappedProduct = {
          ...data,
          id: data.sanPhamId || data.id,
          name: data.tenSanPham || data.name,
          price: data.gia || data.price,
          description: data.moTaChiTiet || "Đang cập nhật...",
          image: data.hinhAnh,
          stock: data.soLuongTonKho !== undefined ? data.soLuongTonKho : 0,
          categoryId: data.danhMucId,
        };

        setProduct(mappedProduct);
        setMainImage(getImageUrl(mappedProduct.image));

        // Reset số lượng
        if (mappedProduct.stock <= 0) setQuantity(0);
        else setQuantity(1);

        // 2. Lấy sản phẩm gợi ý
        if (mappedProduct.categoryId) {
          fetchRelatedProducts(mappedProduct.categoryId, mappedProduct.id);
        }

        // 3. Lấy đánh giá sản phẩm (Trang đầu tiên)
        // Reset về trang 0 khi load sản phẩm mới
        setReviewPage(0);
        fetchReviews(mappedProduct.id, 0);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);

    const aosInit = setTimeout(() => {
      AOS.init({ duration: 800, once: true });
    }, 100);
    return () => clearTimeout(aosInit);
  }, [id]);

  // --- API: LẤY SẢN PHẨM GỢI Ý ---
  const fetchRelatedProducts = async (categoryId, currentId) => {
    try {
      const response = await searchService.searchProducts("", categoryId);
      let data = [];
      if (Array.isArray(response)) data = response;
      else if (response?.data) data = response.data;
      else if (response?.content) data = response.content;

      const related = data
        .filter((item) => (item.sanPhamId || item.id) !== currentId)
        .slice(0, 4)
        .map((item) => ({
          id: item.sanPhamId || item.id,
          name: item.tenSanPham || item.name,
          price: item.gia || item.price,
          image: item.hinhAnh,
        }));

      setRelatedProducts(related);
    } catch (error) {
      console.error("Lỗi tải sản phẩm gợi ý:", error);
    }
  };

  // --- API: LẤY ĐÁNH GIÁ (CÓ PHÂN TRANG & SORT) ---
  const fetchReviews = async (productId, page) => {
    try {
      // Query Params:
      // page: số trang hiện tại
      // size: 2 (2 đánh giá 1 trang)
      // sort: soSao,desc (số sao giảm dần - cao nhất lên đầu)
      const url = `${SERVER_URL}/api/danh-gia/san-pham/${productId}?page=${page}&size=2&sort=soSao,desc`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data.content) {
        setReviews(data.content);
        setTotalReviewPages(data.totalPages);
        setTotalReviewsCount(data.totalElements);
      }
    } catch (error) {
      console.error("Lỗi tải đánh giá:", error);
    }
  };

  // --- XỬ LÝ CHUYỂN TRANG ĐÁNH GIÁ ---
  const handleReviewPageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalReviewPages) {
      setReviewPage(newPage);
      fetchReviews(product.id, newPage);

      // Optional: Scroll nhẹ xuống phần đánh giá nếu cần
      // const reviewSection = document.getElementById('reviews-section');
      // if(reviewSection) reviewSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuantityChange = (amount) => {
    if (!product || product.stock <= 0) return;
    setQuantity((prev) => {
      const newQty = prev + amount;
      if (newQty < 1) return 1;
      if (newQty > product.stock) return product.stock;
      return newQty;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock <= 0) {
      toast.error("Sản phẩm này đã hết hàng!");
      return;
    }

    addToCart(product, quantity);

    const Msg = () => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-800 text-sm">Đã thêm vào giỏ!</h4>
          <div className="flex justify-between text-xs text-slate-500">
            <span className="truncate max-w-[120px]">{product.name}</span>
            <span>x{quantity}</span>
          </div>
        </div>
      </div>
    );

    toast.success(<Msg />, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      theme: "light",
      transition: Slide,
      className: "rounded-xl shadow-xl border border-slate-100 font-display",
    });
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (product.stock <= 0) {
      toast.error("Sản phẩm này đã hết hàng!");
      return;
    }
    await addToCart(product, quantity);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-slate-600">
        Không tìm thấy sản phẩm!
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <main className="bg-white min-h-screen pb-20 pt-24 px-6 font-display">
      <ToastContainer style={{ marginTop: "60px", zIndex: 99999 }} />

      <div className="max-w-7xl mx-auto">
        {/* --- BREADCRUMB --- */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-10">
          <Link className="hover:text-primary transition-colors" to="/">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <Link className="hover:text-primary transition-colors" to="/products">
            Sản phẩm
          </Link>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="text-slate-900 font-semibold truncate max-w-[200px] md:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* --- MAIN PRODUCT CARD --- */}
        <div className="bg-white rounded-4xl p-6 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* LEFT: IMAGES */}
            <div className="space-y-6" data-aos="fade-right">
              <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center p-8 group relative">
                <img
                  alt={product.name}
                  className={`w-full h-full object-contain transform transition-transform duration-700 group-hover:scale-110 mix-blend-multiply ${isOutOfStock ? "grayscale opacity-60" : ""}`}
                  src={mainImage}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-10">
                    <span className="bg-slate-800 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wider shadow-xl transform -rotate-6 border-2 border-white">
                      Hết hàng
                    </span>
                  </div>
                )}
                <button className="absolute bottom-6 right-6 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">zoom_in</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[
                  product.image,
                  product.image,
                  product.image,
                  product.image,
                ].map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setMainImage(getImageUrl(img))}
                    className={`aspect-square bg-white rounded-2xl border-2 overflow-hidden p-2 cursor-pointer transition-all ${
                      mainImage === getImageUrl(img)
                        ? "border-primary shadow-md"
                        : "border-slate-100 opacity-60 hover:opacity-100 hover:border-primary"
                    }`}
                  >
                    <img
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                      src={getImageUrl(img)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: INFO */}
            <div className="flex flex-col" data-aos="fade-left">
              <div className="mb-4">
                <span className="px-4 py-1.5 bg-primary/10 text-primary text-[11px] font-extrabold rounded-full uppercase tracking-[0.1em]">
                  Best Seller
                </span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating Section (Static 5.0 for demo as backend doesn't provide avg) */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="material-symbols-outlined filled text-[20px]"
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-[14px] font-bold text-slate-900">
                    5.0
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-200"></div>
                <span className="text-sm font-medium text-slate-500">
                  Đã bán <span className="text-slate-900 font-bold">1.2k</span>
                </span>
              </div>

              <div className="bg-slate-50 p-6 lg:p-8 rounded-3xl mb-10 border border-slate-100">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-extrabold text-primary tracking-tight">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-lg text-slate-400 line-through">
                    {formatCurrency(product.price * 1.2)}
                  </span>
                  <span className="bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-lg">
                    -20%
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  Giá tốt nhất trong 30 ngày qua
                </p>
              </div>

              <div className="space-y-8 mb-10">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                    Mô tả sản phẩm
                  </h3>
                  <div className="text-slate-600 leading-relaxed text-[15px] space-y-2 line-clamp-3">
                    <p>{product.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-12">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                      Số lượng
                    </h3>
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center border border-slate-200 rounded-2xl bg-white p-1 ${isOutOfStock ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-colors text-slate-500"
                        >
                          <span className="material-symbols-outlined">
                            remove
                          </span>
                        </button>
                        <input
                          className="w-12 text-center border-none bg-transparent focus:ring-0 text-base font-bold text-slate-900"
                          type="text"
                          value={quantity}
                          readOnly
                        />
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-colors text-slate-500"
                        >
                          <span className="material-symbols-outlined">add</span>
                        </button>
                      </div>
                      <span
                        className={`text-sm font-medium ${isOutOfStock ? "text-red-500" : "text-slate-400"}`}
                      >
                        {isOutOfStock
                          ? "Hết hàng"
                          : `${product.stock} sản phẩm có sẵn`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex items-center justify-center gap-2 py-5 rounded-2xl font-bold transition-all active:scale-95 ${isOutOfStock ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-primary/10 text-primary hover:bg-primary hover:text-white"}`}
                >
                  <span className="material-symbols-outlined">
                    shopping_cart
                  </span>
                  {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex items-center justify-center gap-2 py-5 rounded-2xl font-bold transition-all active:scale-95 ${isOutOfStock ? "bg-slate-300 text-white cursor-not-allowed" : "bg-primary text-white hover:shadow-xl hover:shadow-primary/30"}`}
                >
                  {isOutOfStock ? "Tạm hết hàng" : "Mua ngay"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">
                      verified_user
                    </span>
                  </div>
                  <div className="text-[13px] font-semibold text-slate-600">
                    Hàng chính hãng 100%
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">
                      local_shipping
                    </span>
                  </div>
                  <div className="text-[13px] font-semibold text-slate-600">
                    Miễn phí vận chuyển
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-12">
            {/* Details */}
            <div data-aos="fade-up">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full"></span>Thông
                tin chi tiết
              </h2>
              <div className="bg-white rounded-3xl p-8 border border-slate-50 space-y-4 shadow-sm">
                <div className="grid grid-cols-2 py-3 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">
                    Thương hiệu
                  </span>
                  <span className="text-slate-900 font-bold">Royal Canin</span>
                </div>
                <div className="grid grid-cols-2 py-3 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Xuất xứ</span>
                  <span className="text-slate-900 font-bold">Pháp</span>
                </div>
                <div className="mt-4 pt-4 text-slate-600 leading-relaxed">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>

            {/* --- REVIEWS SECTION (PHÂN TRANG & SORT) --- */}
            <div id="reviews-section" data-aos="fade-up">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
                  <span className="w-2 h-8 bg-primary rounded-full"></span>
                  Đánh giá từ khách hàng ({totalReviewsCount})
                </h2>
                <button className="text-primary font-bold text-sm hover:underline">
                  Viết đánh giá
                </button>
              </div>

              <div className="space-y-6">
                {reviews.length > 0 ? (
                  <>
                    {/* List Reviews */}
                    {reviews.map((review) => (
                      <div
                        key={review.danhGiaId}
                        className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm animate-fade-in"
                      >
                        <div className="flex gap-4 items-start mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-100">
                            <img
                              alt={review.tenNguoiDung}
                              src={getImageUrl(review.anhDaiDien)}
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                (e.target.src =
                                  "https://ui-avatars.com/api/?background=random&name=" +
                                  review.tenNguoiDung)
                              }
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">
                              {review.tenNguoiDung}
                            </h4>
                            <div className="flex text-yellow-400 mb-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <span
                                  key={i}
                                  className={`material-symbols-outlined text-[14px] ${i <= review.soSao ? "filled" : ""}`}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                            <p className="text-[13px] text-slate-400">
                              {formatDate(review.ngayDanhGia)}
                            </p>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {review.noiDung}
                        </p>

                        {review.phanHoi && (
                          <div className="mt-4 ml-4 pl-4 border-l-2 border-slate-100 bg-slate-50 p-3 rounded-r-xl">
                            <p className="text-xs font-bold text-primary mb-1">
                              Phản hồi từ cửa hàng:
                            </p>
                            <p className="text-slate-500 text-sm">
                              {review.phanHoi}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* --- PAGINATION CONTROLS --- */}
                    {totalReviewPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                          onClick={() => handleReviewPageChange(reviewPage - 1)}
                          disabled={reviewPage === 0}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${reviewPage === 0 ? "border-slate-100 text-slate-300 cursor-not-allowed" : "border-slate-200 text-slate-500 hover:border-primary hover:text-primary"}`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            chevron_left
                          </span>
                        </button>

                        <div className="text-sm font-bold text-slate-700 mx-2">
                          Trang {reviewPage + 1} / {totalReviewPages}
                        </div>

                        <button
                          onClick={() => handleReviewPageChange(reviewPage + 1)}
                          disabled={reviewPage === totalReviewPages - 1}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${reviewPage === totalReviewPages - 1 ? "border-slate-100 text-slate-300 cursor-not-allowed" : "border-slate-200 text-slate-500 hover:border-primary hover:text-primary"}`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            chevron_right
                          </span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-sm text-center py-10">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
                      rate_review
                    </span>
                    <p className="text-slate-500 font-medium">
                      Chưa có đánh giá nào cho sản phẩm này.
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      Hãy là người đầu tiên nhận xét!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8" data-aos="fade-left">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              Gợi ý cho bạn
            </h2>
            <div className="space-y-6">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={`/products/${item.id}`}
                    className="block group"
                  >
                    <div className="bg-white p-4 rounded-3xl border border-slate-50 flex gap-4 hover:shadow-lg transition-shadow cursor-pointer group-hover:border-primary/30">
                      <div className="w-24 h-24 bg-slate-50 rounded-2xl p-2 flex-shrink-0 overflow-hidden">
                        <img
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110"
                          src={getImageUrl(item.image)}
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors line-clamp-2 text-sm">
                          {item.name}
                        </h4>
                        <p className="text-primary font-bold text-sm">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-slate-400 text-sm font-medium">
                  Chưa có sản phẩm tương tự.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
