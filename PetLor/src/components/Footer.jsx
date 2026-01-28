import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#dbe6df]">
      {/* --- PHẦN FOOTER CHÍNH --- */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-[28px]">
                  pets
                </span>
              </div>
              <h2 className="text-xl font-bold">PetLor</h2>
            </div>
            <p className="text-sm text-[#61896f]">
              Chăm sóc thú cưng của bạn bằng tình yêu thương và sự chuyên
              nghiệp.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-sm text-[#61896f] hover:text-primary transition-colors"
                  href="#"
                >
                  Dịch vụ
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-[#61896f] hover:text-primary transition-colors"
                  href="#"
                >
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-[#61896f] hover:text-primary transition-colors"
                  href="#"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-[#61896f] hover:text-primary transition-colors"
                  href="#"
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Liên hệ</h3>
            <p className="text-sm text-[#61896f]">
              28A Đ. Lê Trọng Tấn, Hà Cầu, Hà Đông, Hà Nội.
            </p>
            <p className="text-sm text-[#61896f]">
              vuanhduong251020042@gmail.com
            </p>
            <p className="text-sm text-[#61896f]">(+84) 972471680</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Đăng ký nhận tin</h3>
            <p className="text-sm text-[#61896f] mb-2">
              Nhận các mẹo chăm sóc thú cưng và ưu đãi đặc biệt.
            </p>
            <form className="flex">
              <input
                className="w-full rounded-l-lg border border-gray-300 bg-background-light px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Email của bạn"
                type="email"
              />
              <button
                className="bg-primary text-[#111813] px-4 rounded-r-lg font-bold text-sm hover:bg-opacity-90 transition-opacity"
                type="submit"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- PHẦN THÔNG TIN TÁC GIẢ (UPDATED) --- */}
      <div className="border-t border-[#dbe6df] bg-[#f8faf9]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Bản quyền */}
            <p className="text-xs text-[#61896f] opacity-80">
              © {new Date().getFullYear()} PetLor. All rights reserved.
            </p>

            {/* Signature của Tác giả */}
            <div className="flex items-center gap-4 text-sm text-[#3a5a45]">
              <span className="opacity-70 font-normal">Developed by</span>

              <div className="flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  code
                </span>
                <span>Vũ Anh Dương</span>
              </div>

              <span className="text-[#dbe6df]">|</span>

              <div className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[16px] opacity-70">
                  school
                </span>
                <span>Công nghệ thông tin (IT)</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[16px] opacity-70">
                  apartment
                </span>
                <span>Đại học Nguyễn Trãi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
