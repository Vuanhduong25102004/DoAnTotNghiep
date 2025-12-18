import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import productService from "../services/productService";

// Helper: Format tiền tệ
const formatCurrency = (amount) => {
  if (typeof amount !== "number") {
    return "Liên hệ";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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

    const fetchServices = async () => {
      try {
        const response = await productService.getAllServices();
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
        setServices(data);
      } catch (error) {
        console.error("Lỗi khi tải dịch vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    return () => clearTimeout(aosInit);
  }, []);

  return (
    <>
      <div className="w-full font-display bg-background-light text-gray-800">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20" data-aos="fade-up">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className="flex min-h-[400px] flex-col gap-6 rounded-xl bg-cover bg-center bg-no-repeat items-center justify-center p-4 text-center shadow-md"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBH7Mh6-y8FjGuuxz3DrTFbg3acOHyT-L75jZ1zdo4wH7a6qA_pegIFoEQ4dmkY_5GItSo-D1UVA7pIjqh4Yz4VqxXyfFgnTigdv-ef-zyfbULiyJplsoUuBkIoa3qzhebUoSco8XCF3NeWDfLoRHNBSYMJ0Ucr17Vj73fOn5fYJDofxH_dDqaSG9rEEeTsAC_kdvidz-CklnSWi9T1aCbKfxlq4AP1jRc0sqDnmUXQA4N88wdke6jx2837mZEnO1_yFN7E1DL7LAaf")`,
              }}
            >
              <div className="flex flex-col gap-4">
                <h1
                  className="text-white text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl lg:text-6xl drop-shadow-md"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Dịch Vụ Chăm Sóc Thú Cưng 5 Sao
                </h1>
                <p
                  className="text-white text-base font-normal leading-normal max-w-2xl sm:text-lg drop-shadow-md"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  Cam kết mang đến chất lượng và tình yêu thương tốt nhất cho
                  thú cưng của bạn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services List Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <h2
                className="text-gray-900 text-3xl font-bold leading-tight tracking-[-0.015em] px-4"
                data-aos="fade-up"
              >
                Các Dịch Vụ Của Chúng Tôi
              </h2>

              {/* Filters */}
              <div
                className="flex flex-wrap gap-3 p-3"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full bg-primary/20 px-4">
                  <p className="text-primary text-sm font-bold leading-normal">
                    Tất cả
                  </p>
                </div>
                {["Chăm sóc lông", "Trông giữ", "Huấn luyện"].map((filter) => (
                  <div
                    key={filter}
                    className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full bg-gray-200 px-4 hover:bg-gray-300 transition-colors"
                  >
                    <p className="text-gray-800 text-sm font-medium leading-normal">
                      {filter}
                    </p>
                  </div>
                ))}
              </div>

              {/* Grid Services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                {loading ? (
                  <p>Đang tải dịch vụ...</p>
                ) : (
                  services.map((service, index) => (
                    <div
                      key={service.dichVuId || index}
                      data-aos="fade-up"
                      data-aos-delay={index * 100 + 100}
                      className="h-full"
                    >
                      <div className="flex flex-col gap-4 overflow-hidden rounded-xl bg-white border border-gray-200 h-full transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-2">
                        <div
                          className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                          style={{
                            backgroundImage: `url("http://localhost:8080/uploads/${service.hinhAnh}")`,
                          }}
                        ></div>
                        <div className="flex flex-col p-4 pt-0 gap-3 flex-1">
                          <p className="text-gray-900 text-lg font-bold leading-normal">
                            {service.tenDichVu}
                          </p>
                          <p className="text-gray-600 text-sm font-normal leading-normal">
                            {service.moTa}
                          </p>
                          <p className="text-gray-700 text-sm font-semibold leading-normal mt-auto">
                            {formatCurrency(service.giaDichVu)}
                          </p>
                          <button className="relative group mt-2 w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#111813] text-sm font-bold shadow-sm transition-all duration-300 ease-out hover:scale-105">
                            <span className="absolute left-0 top-0 h-full w-0 bg-[#0dbd47] transition-all duration-300 ease-out group-hover:w-full"></span>
                            <span className="relative z-10 truncate">
                              Xem Chi Tiết
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-gray-900">
                Quy Trình Dịch Vụ
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Chúng tôi tối ưu hóa quy trình để mang lại trải nghiệm thoải mái
                nhất cho thú cưng và sự an tâm tuyệt đối cho bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>
              {[
                {
                  step: "01",
                  icon: "calendar_month",
                  title: "Đặt Lịch Hẹn",
                  desc: "Chọn dịch vụ và thời gian phù hợp qua website hoặc hotline của chúng tôi.",
                },
                {
                  step: "02",
                  icon: "pets",
                  title: "Đưa Đón & Chăm Sóc",
                  desc: "Mang thú cưng đến spa hoặc sử dụng dịch vụ đưa đón tận nơi. Các bé sẽ được chăm sóc tận tình.",
                },
                {
                  step: "03",
                  icon: "sentiment_satisfied",
                  title: "Hoàn Tất & Vui Vẻ",
                  desc: "Bạn nhận lại thú cưng trong trạng thái sạch sẽ, khỏe mạnh và vui vẻ nhất.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center group"
                  data-aos="fade-up"
                  data-aos-delay={idx * 150}
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary text-[#111813] flex items-center justify-center shadow-lg shadow-primary/30 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <span className="material-symbols-outlined text-3xl">
                        {item.icon}
                      </span>
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-gray-900">
                Bảng Giá Tham Khảo
              </h2>
              <p className="mt-4 text-gray-600">
                Chọn gói dịch vụ phù hợp nhất với nhu cầu của bé cưng nhà bạn.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Cơ Bản",
                  price: "300.000đ",
                  desc: "Dành cho việc vệ sinh định kỳ.",
                  features: [
                    "Tắm & Sấy khô",
                    "Vệ sinh tai & móng",
                    "Chải lông cơ bản",
                  ],
                  highlight: false,
                },
                {
                  name: "Tiêu Chuẩn",
                  price: "500.000đ",
                  desc: "Gói được yêu thích nhất.",
                  features: [
                    "Bao gồm gói Cơ Bản",
                    "Cắt tỉa tạo kiểu",
                    "Vệ sinh tuyến hôi",
                    "Xịt thơm cao cấp",
                  ],
                  highlight: true,
                },
                {
                  name: "Thượng Hạng",
                  price: "900.000đ",
                  desc: "Trải nghiệm Spa đẳng cấp.",
                  features: [
                    "Bao gồm gói Tiêu Chuẩn",
                    "Massage thư giãn",
                    "Ủ dưỡng lông mềm mượt",
                    "Đưa đón tận nơi (<5km)",
                  ],
                  highlight: false,
                },
              ].map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative flex flex-col p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                    plan.highlight
                      ? "bg-white border-2 border-primary shadow-xl scale-105 z-10"
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-[#111813] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      Phổ biến nhất
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-4xl font-black tracking-tight">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-sm font-semibold text-gray-500">
                      /lần
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{plan.desc}</p>
                  <ul className="mt-8 space-y-4 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start">
                        <span className="material-symbols-outlined text-primary text-xl mr-3 shrink-0">
                          check_circle
                        </span>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`mt-8 w-full py-3 px-4 rounded-lg font-bold text-sm transition-colors ${
                      plan.highlight
                        ? "bg-primary text-[#111813] hover:bg-[#0dbd47]"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    Chọn Gói Này
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center" data-aos="fade-up">
              <p className="text-sm text-gray-500 italic">
                * Giá trên chỉ mang tính chất tham khảo và có thể thay đổi tùy
                theo cân nặng và tình trạng lông của thú cưng.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20" data-aos="fade-up">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary/20 rounded-xl p-8 sm:p-12 text-center flex flex-col items-center gap-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Sẵn Sàng Chăm Sóc Bé Yêu Của Bạn?
              </h2>
              <p className="text-base sm:text-lg text-gray-700 max-w-2xl">
                Đặt lịch hẹn ngay hôm nay để nhận được sự tư vấn và dịch vụ tốt
                nhất từ đội ngũ chuyên gia của chúng tôi. Thú cưng của bạn xứng
                đáng được yêu thương và chăm sóc đặc biệt!
              </p>
              <button className="relative group flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-[#111813] text-base font-bold shadow-sm transition-all duration-300 ease-out hover:scale-105">
                <span className="absolute left-0 top-0 h-full w-0 bg-[#0dbd47] transition-all duration-300 ease-out group-hover:w-full"></span>
                <span className="relative z-10 truncate">Đặt Lịch Ngay</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;
