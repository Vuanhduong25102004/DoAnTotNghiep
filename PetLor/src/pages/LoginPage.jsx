import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import loginImageUrl from "../assets/cat.gif";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authService.login(credentials);

      if (
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken")
      ) {
        navigate("/");
      } else {
        setError("Lỗi: Không lưu được phiên đăng nhập.");
      }
    } catch (err) {
      setError("Email hoặc mật khẩu không chính xác.");
    }
  };

  return (
    <div className="w-full h-screen font-display bg-white text-text-main antialiased overflow-hidden">
      <div className="flex w-full h-full">
        {/* LEFT SIDE - IMAGE & BRANDING */}
        <div className="hidden lg:flex w-1/2 h-full relative bg-gray-100">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${loginImageUrl})`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Logo on Image */}
          <div className="absolute top-8 left-8 z-10">
            <div className="flex items-center gap-3 text-white">
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-[28px]">
                  pets
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">PetLor</span>
            </div>
          </div>

          {/* Quote */}
          <div className="absolute bottom-12 left-12 right-12 z-10 text-white">
            <h3 className="text-3xl font-bold mb-3 leading-snug">
              Chăm sóc yêu thương,
              <br /> trọn vẹn từng khoảnh khắc.
            </h3>
            <p className="text-lg opacity-90 max-w-md">
              Chúng tôi cung cấp dịch vụ tốt nhất để thú cưng của bạn luôn vui
              khỏe và hạnh phúc mỗi ngày.
            </p>
            <div className="flex gap-2 mt-6">
              <div className="w-12 h-1 bg-white rounded-full"></div>
              <div className="w-2 h-1 bg-white/40 rounded-full"></div>
              <div className="w-2 h-1 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 xl:p-24 overflow-y-auto bg-white">
          {/* Mobile Logo */}
          <div className="lg:hidden w-full flex items-center gap-2 mb-8">
            <div className="size-8 text-primary">
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-text-main text-lg font-bold">PetLor</h2>
          </div>

          <div className="w-full max-w-[480px] flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-text-main text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                Chào mừng trở lại!
              </h1>
              <h2 className="text-text-secondary text-base md:text-lg font-normal leading-normal">
                Hãy đăng nhập để chăm sóc người bạn nhỏ của mình.
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email Input */}
              <label className="flex flex-col w-full group">
                <p className="text-text-main text-sm font-bold leading-normal pb-2">
                  Email hoặc Tên đăng nhập
                </p>
                <div className="flex w-full items-center rounded-lg border border-border-color bg-background-light group-focus-within:border-primary group-focus-within:ring-1 group-focus-within:ring-primary transition-all overflow-hidden h-12">
                  <div className="pl-4 flex items-center justify-center text-text-secondary">
                    <span className="material-symbols-outlined text-[20px]">
                      person
                    </span>
                  </div>
                  <input
                    className="flex-1 w-full h-full border-none bg-transparent px-3 text-text-main placeholder:text-text-secondary focus:ring-0 text-sm md:text-base outline-none"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="nhap_email@example.com"
                    type="email"
                    required
                  />
                </div>
              </label>

              {/* Password Input */}
              <label className="flex flex-col w-full group">
                <div className="flex justify-between items-center pb-2">
                  <p className="text-text-main text-sm font-bold leading-normal">
                    Mật khẩu
                  </p>
                </div>
                <div className="flex w-full items-center rounded-lg border border-border-color bg-background-light group-focus-within:border-primary group-focus-within:ring-1 group-focus-within:ring-primary transition-all overflow-hidden h-12">
                  <div className="pl-4 flex items-center justify-center text-text-secondary">
                    <span className="material-symbols-outlined text-[20px]">
                      lock
                    </span>
                  </div>
                  <input
                    className="flex-1 w-full h-full border-none bg-transparent px-3 text-text-main placeholder:text-text-secondary focus:ring-0 text-sm md:text-base outline-none"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="•••••••••••"
                    type="password"
                    required
                  />
                  <button
                    className="pr-4 flex items-center justify-center text-text-secondary hover:text-text-main transition-colors focus:outline-none"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility_off
                    </span>
                  </button>
                </div>
              </label>

              <div className="flex justify-end -mt-1">
                <a
                  className="text-primary hover:text-primary-hover text-sm font-semibold transition-colors"
                  href="#"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-primary-hover text-text-main text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-sm hover:shadow-md mt-1"
              >
                <span className="truncate">Đăng nhập</span>
              </button>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border-color"></div>
                <span className="flex-shrink-0 mx-4 text-text-secondary text-xs font-medium">
                  Hoặc đăng nhập bằng
                </span>
                <div className="flex-grow border-t border-border-color"></div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 h-11 rounded-lg border border-border-color bg-background-light hover:bg-gray-100 transition-colors">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                      fill="#FFC107"
                    ></path>
                    <path
                      d="M3.15295 7.3455L6.4385 9.755C7.3275 7.554 9.4805 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.159 2 4.828 4.1685 3.15295 7.3455Z"
                      fill="#FF3D00"
                    ></path>
                    <path
                      d="M12 22C14.5955 22 16.9565 20.9775 18.733 19.3135L15.6015 16.652C14.582 17.5165 13.344 18 12 18C9.362 18 7.128 16.297 6.307 13.936L3.0645 16.425C4.733 19.7435 8.113 22 12 22Z"
                      fill="#4CAF50"
                    ></path>
                    <path
                      d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.6015 16.652L18.733 19.3135C18.2588 19.7417 17.7551 20.1388 17.225 20.5015C20.1465 18.3975 22 15.4215 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                      fill="#1976D2"
                    ></path>
                  </svg>
                  <span className="text-sm font-bold text-text-main">
                    Google
                  </span>
                </button>
                <button className="flex items-center justify-center gap-2 h-11 rounded-lg border border-border-color bg-background-light hover:bg-gray-100 transition-colors">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-[#1877F2]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      clipRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-sm font-bold text-text-main">
                    Facebook
                  </span>
                </button>
              </div>

              <p className="text-center text-sm text-text-secondary mt-4">
                Chưa có tài khoản?
                <a
                  className="text-primary hover:text-primary-hover font-bold hover:underline ml-1"
                  href="/register"
                >
                  Đăng ký ngay
                </a>
              </p>
            </form>

            {/* Footer Links */}
            <div className="mt-auto pt-8 flex justify-center gap-6 text-xs text-text-secondary">
              <a className="hover:text-text-main transition-colors" href="#">
                Điều khoản
              </a>
              <a className="hover:text-text-main transition-colors" href="#">
                Quyền riêng tư
              </a>
              <a className="hover:text-text-main transition-colors" href="#">
                Trợ giúp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
