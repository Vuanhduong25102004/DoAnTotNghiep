import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import productService from "../services/productService";
import searchService from "../services/searchService";
import { useCart } from "../context/CartContext";

// Helper format giá
const formatPrice = (price) => {
  if (price === null || price === undefined) return "";
  if (typeof price === "number") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }
  return price;
};

const ProductsPage = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE LỌC & TÌM KIẾM & PHÂN TRANG ---
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [sortOrder, setSortOrder] = useState("");

  // State phân trang mới
  const [currentPage, setCurrentPage] = useState(0); // API Spring Boot thường bắt đầu từ 0
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 20; // 20 sản phẩm / trang

  const { addToCart } = useCart();

  // --- HÀM XỬ LÝ THÊM GIỎ HÀNG ---
  const handleAddToCart = (product) => {
    addToCart(product, 1);

    const Msg = () => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) =>
              (e.target.src = "https://placehold.co/100?text=Pet")
            }
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 text-sm">Đã thêm vào giỏ!</h4>
          <p className="text-xs text-gray-500 truncate">{product.name}</p>
        </div>
      </div>
    );

    toast.success(<Msg />, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
      className: "rounded-xl shadow-xl border border-gray-100 font-display",
    });
  };

  // --- 1. LẤY DANH MỤC SẢN PHẨM TỪ API ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getAllCategories();
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response?.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (response?.content && Array.isArray(response.content)) {
          data = response.content;
        }
        setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục sản phẩm:", error);
      }
    };
    fetchCategories();
  }, []);

  // --- 2. HÀM TẢI SẢN PHẨM (CẬP NHẬT PHÂN TRANG) ---
  const fetchProducts = async (
    page = 0, // Mặc định trang 0
    searchQuery = "",
    catId = null,
    sortValue = "",
  ) => {
    setLoading(true);
    try {
      let response;

      // Cấu hình params gửi lên API
      const params = {
        page: page,
        size: pageSize,
      };

      if (sortValue) {
        params.sort = sortValue;
      }

      // Gọi API Search hoặc GetAll
      if (searchQuery.trim() || catId !== null) {
        // Lưu ý: searchService cần hỗ trợ truyền params page/size
        response = await searchService.searchProducts(
          searchQuery,
          catId,
          params,
        );
      } else {
        response = await productService.getAllProducts(params);
      }

      // Xử lý dữ liệu trả về từ Spring Boot Pageable
      let data = [];
      let total = 0;

      // Kiểm tra cấu trúc response để lấy content và totalPages
      if (response?.content && Array.isArray(response.content)) {
        // Trường hợp trả về trực tiếp Page object
        data = response.content;
        total = response.totalPages;
      } else if (
        response?.data?.content &&
        Array.isArray(response.data.content)
      ) {
        // Trường hợp bọc trong axios data
        data = response.data.content;
        total = response.data.totalPages;
      } else if (Array.isArray(response)) {
        // Trường hợp trả về List thuần (không phân trang)
        data = response;
        total = 1;
      }

      setTotalPages(total);

      const mappedProducts = data.map((product) => ({
        ...product,
        id: product.sanPhamId || product.id,
        name: product.tenSanPham || product.name,
        price: product.gia || product.price,
        image: product.hinhAnh
          ? `http://localhost:8080/uploads/${product.hinhAnh}`
          : product.image,
        category: product.tenDanhMuc || product.category || "Sản phẩm",
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  };

  // Gọi API khi thay đổi page, keyword, category, sort
  useEffect(() => {
    fetchProducts(currentPage, keyword, selectedCategoryId, sortOrder);
  }, [currentPage, selectedCategoryId, sortOrder]); // Keyword thường xử lý riêng ở nút search

  // --- HANDLERS ---
  const handleSearch = () => {
    setCurrentPage(0); // Reset về trang đầu khi tìm kiếm
    fetchProducts(0, keyword, selectedCategoryId, sortOrder);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategoryId(catId);
    setCurrentPage(0); // Reset về trang đầu khi lọc danh mục
    // useEffect sẽ tự gọi fetchProducts
  };

  const handleReset = () => {
    setKeyword("");
    setSelectedCategoryId(null);
    setSortOrder("");
    setCurrentPage(0);
    // useEffect sẽ tự gọi fetchProducts
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    setCurrentPage(0); // Reset về trang đầu khi sort
  };

  // Hàm chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
  }, []);

  const heroPatternStyle = {
    backgroundImage: "radial-gradient(#0FB478 0.5px, transparent 0.5px)",
    backgroundSize: "24px 24px",
    opacity: 0.1,
  };

  return (
    <div className="w-full min-h-screen font-display bg-gray-50 text-gray-900 overflow-x-hidden transition-colors duration-300">
      <ToastContainer style={{ marginTop: "50px", zIndex: 9999 }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* --- HERO SECTION --- */}
        <section
          className="relative min-h-[480px] lg:h-[520px] rounded-3xl overflow-hidden mb-12 bg-white border border-gray-100 flex flex-col lg:flex-row"
          data-aos="fade-up"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={heroPatternStyle}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>

          <div className="relative z-10 w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold w-fit mb-6">
              <span className="material-symbols-outlined text-lg">stars</span>
              BST Mới Nhất 2026
            </div>
            <h1 className="text-gray-900 text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Sản phẩm của <br />
              <span className="text-primary">chúng tôi</span>
            </h1>
            <p className="text-gray-600 text-lg lg:text-xl max-w-lg font-medium leading-relaxed mb-8">
              Khám phá bộ sưu tập đầy đủ các loại thực phẩm, đồ chơi và phụ kiện
              cao cấp nhất dành riêng cho người bạn nhỏ của bạn.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all">
                Mua sắm ngay
              </button>
              <button className="bg-gray-100 text-gray-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-200 transition-all">
                Xem ưu đãi
              </button>
            </div>
          </div>

          <div className="relative w-full lg:w-1/2 h-64 lg:h-auto overflow-hidden">
            <img
              alt="Happy pets"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsKA4bJQUp5mRHcMG9sYxHfPgEanH1R4WKbtETtGYSeII2bdl1KnUKZS5jLhumrTVcYaoFA9g30YR9WSoI0eEuJKFEwIYrHKPgP_PIsd-BjRV3taTMu40R5eaMe23-aseCmnOH32d-vjQ0Z350lTKAWKUWZmxxAUctnJZYBeUQrVDK-kGFZjT84yoJCczSy_UgCqUbbwcBPtia6SWvX-kHTZtlC3h36Vl5otzc9NJJuWDDoZOcoWqRzPTNsIHhcVcARru4tZYf9fw"
            />
            {/* Badge floating */}
            <div
              className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-white/20"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden p-1">
                <img
                  alt="Product"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2mBWz25RdlG1JpVfULSsFNZsUYKSzflIAjwLvHSVf4isUMQg8fPMckeFI8cu_3OjuDM6EdDSdrwH9UHS0KuuVUN70GcVBAZgdR03PcsAyrJZ2rliR03Sga3T0cVhKi2sBRbuTAYrST-Mv5nmfjB08Ij9NJSjiQyahKSbiLXRG4RT5Gj2VsNpFNOV-E2jNDQt1CXNDg-VH6BfR4WAqkOvytwfJNT10slsOCcp1CPpSNa7rNZejsC9vc0IdmVH5Q8fHAb015f-M6Ts"
                />
              </div>
              <div>
                <div className="text-xs text-primary font-bold">
                  Bán chạy nhất
                </div>
                <div className="text-sm font-bold text-gray-900">
                  Royal Canin
                </div>
              </div>
            </div>
            <div
              className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-white/20"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined">redeem</span>
              </div>
              <div>
                <div className="text-xs text-gray-500">Giảm giá lên đến</div>
                <div className="text-sm font-bold text-orange-500">
                  30% Toàn bộ cửa hàng
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FILTER & SEARCH SECTION --- */}
        <section className="mb-12" data-aos="fade-up">
          <div className="bg-white p-4 rounded-full border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-primary transition-colors"
                onClick={handleSearch}
              >
                search
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-primary outline-none text-sm"
                placeholder="Tìm kiếm sản phẩm..."
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
              <button
                onClick={handleReset}
                className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategoryId === null
                    ? "bg-primary text-white shadow-primary/20"
                    : "bg-gray-50 text-gray-600 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                Tất cả
              </button>

              {categories.map((cat) => {
                const catId = cat.danhMucId || cat.id;
                const catName = cat.tenDanhMuc || cat.name;

                return (
                  <button
                    key={catId}
                    onClick={() => handleCategoryClick(catId)}
                    className={`px-6 py-2.5 rounded-full font-bold transition-all whitespace-nowrap ${
                      selectedCategoryId === catId
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "bg-gray-50 text-gray-600 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {catName}
                  </button>
                );
              })}
            </div>

            <div className="w-full lg:w-48">
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="w-full py-3 px-4 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-primary outline-none text-sm font-medium cursor-pointer"
              >
                <option value="">Mới nhất</option>
                <option value="gia,asc">Giá thấp đến cao</option>
                <option value="gia,desc">Giá cao đến thấp</option>
              </select>
            </div>
          </div>
        </section>

        {/* --- PRODUCTS GRID --- */}
        <section className="mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <p className="col-span-full text-center py-10 text-gray-500">
                Đang tải sản phẩm...
              </p>
            ) : products.length > 0 ? (
              products.map((product, index) => {
                const isOutOfStock = product.soLuongTonKho <= 0;

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col"
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                  >
                    <div className="relative h-72 overflow-hidden bg-gray-50">
                      <Link
                        to={`/products/${product.id}`}
                        className="block h-full w-full"
                      >
                        <img
                          alt={product.name}
                          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                            isOutOfStock ? "grayscale opacity-80" : ""
                          }`}
                          src={product.image}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/400x400?text=No+Image";
                          }}
                        />
                      </Link>

                      {!isOutOfStock && (
                        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                          NEW
                        </div>
                      )}

                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-wider shadow-lg transform -rotate-12 border-2 border-white">
                            Hết hàng
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="text-primary font-extrabold text-xl mb-4">
                        {formatPrice(product.price)}
                      </div>

                      <button
                        disabled={isOutOfStock}
                        onClick={() =>
                          !isOutOfStock && handleAddToCart(product)
                        }
                        className={`mt-auto w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all ${
                          isOutOfStock
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 hover:bg-primary hover:text-white text-gray-700 active:scale-95"
                        }`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {isOutOfStock ? "block" : "shopping_cart"}
                        </span>
                        {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                  search_off
                </span>
                <p className="text-gray-500 text-lg mb-4">
                  Không tìm thấy sản phẩm nào phù hợp.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 transition-all"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            )}
          </div>

          {/* --- PAGINATION SECTION (DYNAMIC) --- */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center gap-2" data-aos="fade-up">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 transition-all ${
                  currentPage === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:border-primary hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {/* Render danh sách các trang */}
              {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all ${
                    currentPage === page
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                  }`}
                >
                  {page + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 transition-all ${
                  currentPage === totalPages - 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:border-primary hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </section>

        {/* --- NEWSLETTER SECTION --- */}
        <section
          className="mt-20 py-16 bg-primary rounded-3xl text-center px-4 relative overflow-hidden mb-20"
          data-aos="zoom-in"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Đăng ký nhận tin khuyến mãi
            </h2>
            <p className="text-white/80 mb-8">
              Đừng bỏ lỡ các đợt giảm giá sâu và quà tặng độc quyền cho boss của
              bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className="flex-grow px-6 py-4 rounded-3xl border-none focus:ring-2 focus:ring-white outline-none text-gray-900 bg-white"
                placeholder="Địa chỉ email của bạn"
                type="email"
              />
              <button className="bg-gray-900 text-white font-bold px-8 py-4 rounded-3xl hover:bg-black transition-colors">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductsPage;
