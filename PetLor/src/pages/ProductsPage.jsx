import React, { useEffect, useState } from "react";
// 1. Import AOS
import AOS from "aos";
import "aos/dist/aos.css";
import productService from "../services/productService";

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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const aosInit = setTimeout(() => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        delay: 0,
      });

      AOS.refresh();
    }, 100);
    return () => clearTimeout(aosInit);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();

        // Xử lý dữ liệu trả về từ API (hỗ trợ cả dạng mảng và dạng phân trang)
        let data = [];
        if (Array.isArray(response)) data = response;
        else if (response?.data && Array.isArray(response.data))
          data = response.data;
        else if (response?.content && Array.isArray(response.content))
          data = response.content;
        else if (
          response?.data?.content &&
          Array.isArray(response.data.content)
        )
          data = response.data.content;

        // Map dữ liệu API sang format hiển thị
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
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [products]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-display text-text-main overflow-x-hidden">
      <main className="flex-1">
        {/* BANNER SECTION - ĐÃ CẬP NHẬT THEO STYLE SERVICES PAGE */}
        <section className="py-12 sm:py-16 lg:py-20" data-aos="fade-up">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className="flex min-h-[400px] flex-col gap-6 rounded-xl bg-cover bg-center bg-no-repeat items-center justify-center p-6 text-center shadow-md relative overflow-hidden"
              style={{
                // Sử dụng gradient nhẹ nhàng hơn giống Services Page (0.2 -> 0.5)
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBH7Mh6-y8FjGuuxz3DrTFbg3acOHyT-L75jZ1zdo4wH7a6qA_pegIFoEQ4dmkY_5GItSo-D1UVA7pIjqh4Yz4VqxXyfFgnTigdv-ef-zyfbULiyJplsoUuBkIoa3qzhebUoSco8XCF3NeWDfLoRHNBSYMJ0Ucr17Vj73fOn5fYJDofxH_dDqaSG9rEEeTsAC_kdvidz-CklnSWi9T1aCbKfxlq4AP1jRc0sqDnmUXQA4N88wdke6jx2837mZEnO1_yFN7E1DL7LAaf")`,
              }}
            >
              <div className="flex flex-col gap-4 relative z-10">
                <h1
                  className="text-white text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl lg:text-6xl uppercase drop-shadow-md"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Siêu Sale Mùa Đ <br />
                  <span className="text-primary">Giảm tới 50%</span>
                </h1>
                <p
                  className="text-white text-base font-normal leading-normal max-w-2xl mx-auto sm:text-lg drop-shadow-md"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  Dành tặng những điều tốt đẹp nhất cho thú cưng của bạn. Thức
                  ăn, đồ chơi và phụ kiện chính hãng.
                </p>

                {/* Nút Mua Ngay - Thêm delay 300 để xuất hiện sau chữ */}
                <div className="mt-4" data-aos="fade-up" data-aos-delay="300">
                  <button className="relative group inline-flex items-center justify-center overflow-hidden rounded-lg bg-primary px-8 py-3 text-sm font-bold text-[#111813] shadow-lg transition-all duration-300 ease-out hover:scale-105 ">
                    <span className="absolute left-0 top-0 h-full w-0 bg-[#0dbd47] transition-all duration-300 ease-out group-hover:w-full"></span>
                    <span className="relative z-10">Mua Ngay Hôm Nay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FILTER SECTION */}
        <section className="py-4 pb-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border-gray-200"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-text-main text-2xl font-bold leading-tight">
                  Sản Phẩm Của Chúng Tôi
                </h2>
                <p className="text-text-gray-500 text-sm">
                  Hơn 500+ sản phẩm chất lượng cao
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-gray-500">
                    <span className="material-symbols-outlined text-[20px]">
                      search
                    </span>
                  </span>
                  <input
                    className="w-full rounded-lg border-border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary shadow-sm outline-none border transition-colors"
                    placeholder="Tìm kiếm thức ăn, đồ chơi..."
                    type="text"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-text-gray-500 hover:bg-surface shadow-sm transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    tune
                  </span>
                  <span>Bộ lọc</span>
                </button>
              </div>
            </div>

            {/* Category Buttons */}
            <div
              className="flex flex-wrap gap-3 py-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <button className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full bg-primary text-text-main px-5 text-sm font-bold shadow-sm transition-all hover:scale-105 hover:opacity-90">
                Tất cả
              </button>
              {["Thức ăn", "Đồ chơi", "Phụ kiện", "Vệ sinh & Chăm sóc"].map(
                (item) => (
                  <button
                    key={item}
                    className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full bg-white border border-border-gray-200 px-5 hover:border-primary hover:text-primary transition-all shadow-sm hover:scale-105"
                  >
                    <span className="text-text-main text-sm font-medium hover:text-primary">
                      {item}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section className="pb-12 sm:pb-16 lg:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.map((product, index) => (
                // --- KỸ THUẬT WRAPPER ĐỂ FIX LỖI XUNG ĐỘT AOS & HOVER ---
                // 1. Div Ngoài: Chịu trách nhiệm AOS (Xuất hiện)
                <div
                  key={product.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 50 + 100} // Stagger delay: Hiện lần lượt
                >
                  {/* 2. Div Trong: Chịu trách nhiệm Hover (Bay lên) */}
                  <div className="group flex flex-col gap-4 overflow-hidden rounded-xl bg-white border border-border-gray-200 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 h-full">
                    <div className="relative w-full aspect-square overflow-hidden bg-surface">
                      <div
                        className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url("${product.image}")` }}
                      ></div>

                      {/* Tag */}
                      {product.tag && (
                        <div
                          className={`absolute top-3 left-3 ${
                            product.tagColor || "bg-red-500 text-white"
                          } text-xs font-bold px-2 py-1 rounded`}
                        >
                          {product.tag}
                        </div>
                      )}

                      <button className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md text-text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                        <span className="material-symbols-outlined text-[20px]">
                          favorite
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-col p-4 pt-0 gap-2 flex-1">
                      <p className="text-text-gray-500 text-xs font-medium uppercase tracking-wider">
                        {product.category}
                      </p>
                      <a
                        className="text-text-main text-base font-bold leading-normal line-clamp-2 hover:text-primary transition-colors"
                        href="#"
                      >
                        {product.name}
                      </a>
                      <div className="flex items-baseline gap-2 mt-auto">
                        {" "}
                        {/* mt-auto để đẩy giá xuống nếu tên ngắn */}
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-text-gray-500 line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                      </div>

                      {/* Nút Thêm vào giỏ - Animation Swipe Right */}
                      <button className="relative group mt-3 w-full flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-surface text-text-main text-sm font-bold shadow-sm transition-all duration-300 ease-out hover:scale-105">
                        <span className="absolute left-0 top-0 h-full w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
                        <span className="relative z-10 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">
                            add_shopping_cart
                          </span>
                          <span>Thêm vào giỏ</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div
              className="mt-12 flex items-center justify-center gap-2"
              data-aos="fade-up"
            >
              <button className="flex size-10 items-center justify-center rounded-lg border border-border-gray-200 bg-white text-text-gray-500 hover:border-primary hover:text-primary transition-colors hover:scale-105">
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>
              <button className="flex size-10 items-center justify-center rounded-lg bg-primary text-text-main font-bold shadow-md hover:scale-105 transition-transform">
                1
              </button>
              <button className="flex size-10 items-center justify-center rounded-lg border border-border-gray-200 bg-white text-text-main hover:border-primary hover:text-primary transition-colors hover:scale-105">
                2
              </button>
              <button className="flex size-10 items-center justify-center rounded-lg border border-border-gray-200 bg-white text-text-main hover:border-primary hover:text-primary transition-colors hover:scale-105">
                3
              </button>
              <button className="flex size-10 items-center justify-center rounded-lg border border-border-gray-200 bg-white text-text-gray-500 hover:border-primary hover:text-primary transition-colors hover:scale-105">
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ADVICE SECTION */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className="bg-primary/20 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 border border-primary/20"
              data-aos="fade-up"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-text-main">
                Bạn Cần Tư Vấn Chọn Sản Phẩm?
              </h2>
              <p className="text-base sm:text-lg text-text-secondary max-w-2xl">
                Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn tìm
                kiếm thức ăn, đồ chơi phù hợp nhất cho thú cưng của mình.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                {/* Nút Chat - Animation Swipe */}
                <button className="relative group flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-text-main text-base font-bold leading-normal shadow-md transition-all duration-300 ease-out hover:scale-105">
                  <span className="absolute left-0 top-0 h-full w-0 bg-[#0dbd47] transition-all duration-300 ease-out group-hover:w-full"></span>
                  <span className="relative z-10">Chat Với Chúng Tôi</span>
                </button>

                {/* Nút Hotline - Animation Scale + Bg Hover */}
                <button className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white border border-border-gray-200 text-text-main text-base font-bold leading-normal transition-all duration-300 ease-out hover:bg-surface hover:scale-105 hover:border-primary">
                  Gọi Hotline 1900 1234
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductsPage;
