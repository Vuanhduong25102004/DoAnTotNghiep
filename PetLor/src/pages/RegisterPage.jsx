import React from "react";
import registerImageUrl from "../assets/cat1.gif";

const RegisterPage = () => {
  return (
    <div className="bg-background-light font-display text-text-main antialiased h-screen overflow-hidden">
      <div className="flex min-h-screen w-full flex-row">
        {/* Left Side: Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white lg:w-[50%] xl:w-[45%]">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-text-main">
                Tạo tài khoản mới
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Kết nối với dịch vụ chăm sóc tốt nhất cho thú cưng của bạn.
              </p>
            </div>
            {/* Registration Form */}
            <form action="#" className="mt-8 space-y-5" method="POST">
              {/* Full Name */}
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-text-main "
                  htmlFor="name"
                >
                  Họ và tên
                </label>
                <div className="mt-2">
                  <input
                    autoComplete="name"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-text-main shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    id="name"
                    name="name"
                    placeholder="Nguyễn Văn A"
                    required
                    type="text"
                  />
                </div>
              </div>
              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-text-main"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    autoComplete="email"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-text-main shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    type="email"
                  />
                </div>
              </div>
              {/* Password */}
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-text-main"
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <div className="relative mt-2">
                  <input
                    autoComplete="new-password"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-text-main shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    id="password"
                    name="password"
                    placeholder="•••••••••••"
                    required
                    type="password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600">
                    <span className="material-symbols-outlined text-lg">
                      visibility_off
                    </span>
                  </div>
                </div>
              </div>
              {/* Confirm Password */}
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-text-main"
                  htmlFor="confirm-password"
                >
                  Nhập lại mật khẩu
                </label>
                <div className="relative mt-2">
                  <input
                    autoComplete="new-password"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-text-main shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="•••••••••••"
                    required
                    type="password"
                  />
                </div>
              </div>
              {/* Terms Checkbox */}
              <div className="flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    id="terms"
                    name="terms"
                    type="checkbox"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-normal text-gray-600" htmlFor="terms">
                    Tôi đồng ý với{" "}
                    <a
                      className="font-semibold text-primary hover:text-green-500"
                      href="#"
                    >
                      Điều khoản dịch vụ
                    </a>{" "}
                    và{" "}
                    <a
                      className="font-semibold text-primary hover:text-green-500"
                      href="#"
                    >
                      Chính sách bảo mật
                    </a>
                    .
                  </label>
                </div>
              </div>
              {/* Submit Button */}
              <div>
                <button
                  className="flex w-full justify-center rounded-lg bg-primary px-3 px-4 py-3.5 text-sm font-bold leading-6 text-[#102216] shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-opacity"
                  type="submit"
                >
                  Đăng ký ngay
                </button>
              </div>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative mb-8">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center"
                >
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-sm text-gray-400">
                    Hoặc đăng ký bằng
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-text-main shadow-sm hover:bg-gray-50 transition-colors"
                  type="button"
                >
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
                  <span className="text-sm font-semibold">Google</span>
                </button>
                <button
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-text-main shadow-sm hover:bg-gray-50 transition-colors"
                  type="button"
                >
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
                  <span className="text-sm font-semibold">Facebook</span>
                </button>
              </div>
            </div>

            {/* Footer Login Link */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Đã có tài khoản?
              <a
                className="font-bold text-primary hover:text-green-500 transition-colors ml-1"
                href="/login"
              >
                Đăng nhập
              </a>
            </p>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="relative hidden w-0 flex-1 lg:block">
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent z-10"></div>

          {/* Logo on Image (Moved from left side) */}
          <div className="absolute top-8 left-8 z-30">
            <div className="flex items-center gap-3 text-white">
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-[28px]">
                  pets
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">PetLor</h2>
            </div>
          </div>

          {/* Text on Image */}
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

          {/* Main Image */}
          <div
            className="absolute inset-0 h-full w-full object-cover bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${registerImageUrl})`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
