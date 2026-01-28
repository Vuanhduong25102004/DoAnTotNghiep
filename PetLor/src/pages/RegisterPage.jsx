import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import registerImageUrl from "../assets/cat1.gif"; // Đảm bảo đường dẫn đúng
import authService from "../services/authService"; // Đảm bảo đường dẫn đúng
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms) {
      toast.warn("Vui lòng đồng ý điều khoản!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        hoTen: formData.name,
        email: formData.email,
        matkhau: formData.password,
        soDienThoai: formData.phone,
        diaChi: formData.address,
      });
      toast.success("Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Class chung cho input để dễ quản lý (Đã tăng py-2 lên py-3)
  const inputClasses =
    "block w-full rounded-lg border border-gray-300 py-3 px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm";
  // Class chung cho label (Đã tăng text-xs lên text-sm)
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="bg-white font-display text-text-main antialiased h-screen w-screen overflow-hidden flex">
      <ToastContainer style={{ zIndex: 99999 }} />

      {/* --- LEFT SIDE: FORM (Đã kéo giãn chiều dọc) --- */}
      {/* Thêm py-8 sm:py-12 để tạo khoảng trống trên dưới */}
      <div className="flex w-full lg:w-[50%] xl:w-[45%] flex-col justify-center items-center px-6 py-8 sm:px-16 sm:py-12 xl:px-24 h-full relative z-20 bg-white overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md my-auto">
          {/* Header - Tăng mb-6 lên mb-8 */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-text-main">
              Tạo tài khoản mới
            </h1>
            <p className="text-base text-gray-500 mt-2">
              Nhập thông tin để đăng ký thành viên PetLor.
            </p>
          </div>

          {/* Form - Tăng space-y-3 lên space-y-5 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Hàng 1: Họ tên + SĐT - Tăng gap-3 lên gap-4 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>
                  SĐT <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="098..."
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Hàng 2: Email */}
            <div>
              <label className={labelClasses}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Hàng 3: Địa chỉ */}
            <div>
              <label className={labelClasses}>
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                name="address"
                type="text"
                required
                placeholder="Số nhà, đường, quận/huyện..."
                value={formData.address}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            {/* Hàng 4: Mật khẩu + Nhập lại - Tăng gap-3 lên gap-4 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClasses}>
                  Nhập lại <span className="text-red-500">*</span>
                </label>
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Điều khoản - Tăng mt-2 lên mt-4 */}
            <div className="flex items-start mt-4">
              <div className="flex h-6 items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </div>
              <label
                htmlFor="terms"
                className="ml-3 text-sm text-gray-600 cursor-pointer select-none leading-6"
              >
                Tôi đồng ý với{" "}
                <a
                  href="#"
                  className="font-semibold text-primary hover:underline"
                >
                  Điều khoản dịch vụ
                </a>{" "}
                &{" "}
                <a
                  href="#"
                  className="font-semibold text-primary hover:underline"
                >
                  Chính sách bảo mật
                </a>{" "}
                của PetLor.
              </label>
            </div>

            {/* Button Đăng ký - Tăng py-2.5 lên py-3.5, mt-2 lên mt-6 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3.5 text-base font-bold text-[#102216] shadow-md hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-6 hover:shadow-lg"
            >
              {loading ? "Đang xử lý..." : "Đăng ký ngay"}
            </button>
          </form>

          {/* Social & Footer Login - Tăng mt-4 lên mt-8 */}
          <div className="mt-8">
            <div className="relative flex justify-center text-sm mb-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="bg-white px-4 text-gray-500 relative z-10">
                Hoặc đăng ký bằng
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Tăng py-2 lên py-2.5 */}
              <button className="flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="h-5 w-5"
                  alt="G"
                />{" "}
                Google
              </button>
              <button className="flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
                <img
                  src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                  className="h-5 w-5"
                  alt="F"
                />{" "}
                Facebook
              </button>
            </div>
            <p className="mt-8 text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-bold text-primary hover:underline ml-1"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: IMAGE (Giữ nguyên) --- */}
      <div className="hidden lg:block relative flex-1 bg-gray-900 h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
        <div className="absolute top-10 left-10 z-30">
          <Link
            to="/"
            className="flex items-center gap-3 text-white group hover:opacity-90 transition-all"
          >
            <div className="flex items-center justify-center size-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 shadow-lg">
              <span className="material-symbols-outlined text-[28px]">
                pets
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white drop-shadow-md">
              PetLor
            </h2>
          </Link>
        </div>
        <div className="absolute bottom-16 left-12 right-12 z-20 text-white">
          <h3 className="text-4xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            Chăm sóc yêu thương,
            <br />
            <span className="text-primary-light">
              trọn vẹn từng khoảnh khắc.
            </span>
          </h3>
          <p className="text-lg text-gray-100 max-w-xl drop-shadow-md leading-relaxed">
            Gia nhập cộng đồng PetLor ngay hôm nay để trải nghiệm dịch vụ chăm
            sóc thú cưng đẳng cấp 5 sao.
          </p>
        </div>
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${registerImageUrl})` }}
        ></div>
      </div>
    </div>
  );
};

export default RegisterPage;
