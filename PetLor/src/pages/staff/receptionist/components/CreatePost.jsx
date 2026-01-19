import React from "react";

const CreatePost = () => {
  return (
    <main className="flex-1 overflow-y-auto p-8 lg:p-12 pb-24 custom-scrollbar bg-[#fbfcfc] min-h-screen font-sans text-[#101918]">
      {/* Container chính */}
      <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-10">
        {/* ====================================================================================
            CỘT TRÁI: NỘI DUNG CHÍNH (EDITOR)
           ==================================================================================== */}
        <div className="flex-1 space-y-8">
          {/* Tiêu đề bài viết */}
          <div className="space-y-3">
            <label className="text-base font-extrabold text-[#101918] ml-2">
              Tiêu đề bài viết
            </label>
            <input
              className="w-full bg-white border border-[#e9f1f0] rounded-[24px] px-6 py-5 text-xl font-bold focus:ring-4 focus:ring-[#2a9d90]/10 focus:border-[#2a9d90] placeholder:text-gray-300 shadow-sm transition-all outline-none"
              placeholder="Nhập tiêu đề hấp dẫn..."
              type="text"
            />
          </div>

          {/* Trình soạn thảo (Editor) */}
          <div className="space-y-3">
            <label className="text-base font-extrabold text-[#101918] ml-2">
              Nội dung chi tiết
            </label>
            <div className="bg-white border border-[#e9f1f0] rounded-[32px] overflow-hidden min-h-[600px] flex flex-col shadow-xl shadow-gray-200/50">
              {/* Toolbar */}
              <div className="p-3 border-b border-[#e9f1f0] flex flex-wrap gap-2 bg-[#f9fbfb]">
                <div className="flex bg-white rounded-xl border border-[#e9f1f0] p-1 shadow-sm">
                  <button className="size-10 flex items-center justify-center rounded-lg hover:bg-[#2a9d90]/10 hover:text-[#2a9d90] text-gray-500 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      format_bold
                    </span>
                  </button>
                  <button className="size-10 flex items-center justify-center rounded-lg hover:bg-[#2a9d90]/10 hover:text-[#2a9d90] text-gray-500 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      format_italic
                    </span>
                  </button>
                  <button className="size-10 flex items-center justify-center rounded-lg hover:bg-[#2a9d90]/10 hover:text-[#2a9d90] text-gray-500 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      format_underlined
                    </span>
                  </button>
                </div>

                <div className="w-[1px] h-10 bg-[#e9f1f0] mx-1"></div>

                <div className="flex bg-white rounded-xl border border-[#e9f1f0] p-1 shadow-sm">
                  <button className="size-10 flex items-center justify-center rounded-lg hover:bg-[#2a9d90]/10 hover:text-[#2a9d90] text-gray-500 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      format_list_bulleted
                    </span>
                  </button>
                  <button className="size-10 flex items-center justify-center rounded-lg hover:bg-[#2a9d90]/10 hover:text-[#2a9d90] text-gray-500 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      format_list_numbered
                    </span>
                  </button>
                </div>

                <div className="w-[1px] h-10 bg-[#e9f1f0] mx-1"></div>

                <div className="flex bg-white rounded-xl border border-[#e9f1f0] p-1 shadow-sm">
                  <button className="size-10 flex items-center justify-center rounded-lg hover:bg-[#2a9d90]/10 hover:text-[#2a9d90] text-gray-500 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      link
                    </span>
                  </button>
                  <button className="size-10 flex items-center justify-center rounded-lg hover:bg-[#2a9d90]/10 hover:text-[#2a9d90] text-gray-500 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      image
                    </span>
                  </button>
                  <button className="size-10 flex items-center justify-center rounded-lg hover:bg-[#2a9d90]/10 hover:text-[#2a9d90] text-gray-500 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      format_quote
                    </span>
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <textarea
                className="flex-1 w-full p-8 text-base leading-relaxed placeholder:text-gray-300 bg-transparent resize-none focus:outline-none"
                placeholder="Bắt đầu viết câu chuyện của bạn..."
              ></textarea>
            </div>
          </div>

          {/* Thư viện ảnh (Gallery) */}
          <div className="space-y-3">
            <label className="text-base font-extrabold text-[#101918] ml-2">
              Thư viện ảnh bài viết
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {/* Nút Upload */}
              <div className="aspect-square rounded-[24px] border-2 border-dashed border-[#2a9d90]/30 bg-[#2a9d90]/5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#2a9d90]/10 transition-colors group">
                <div className="size-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#2a9d90] text-[24px]">
                    add_a_photo
                  </span>
                </div>
                <span className="text-xs font-black text-[#2a9d90] uppercase tracking-wider">
                  Tải ảnh lên
                </span>
              </div>

              {/* Ảnh đã upload */}
              <div className="relative group aspect-square rounded-[24px] overflow-hidden border border-[#e9f1f0] shadow-md">
                <img
                  alt="Uploaded asset"
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=100&q=80"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="size-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                  </button>
                  <button className="size-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#2a9d90] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">
                      visibility
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================================
            CỘT PHẢI: CÀI ĐẶT (SIDEBAR)
           ==================================================================================== */}
        <div className="w-full xl:w-[400px] space-y-8 h-fit xl:sticky xl:top-8">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 bg-white border border-[#e9f1f0] text-[#588d87] text-sm font-bold rounded-[20px] hover:bg-[#f9fbfb] hover:text-[#2a9d90] transition-colors shadow-sm">
              Xem trước
            </button>
            <button className="py-4 bg-[#2a9d90] text-white text-sm font-bold rounded-[20px] hover:bg-[#2a9d90]/90 transition-all shadow-lg shadow-[#2a9d90]/20 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                send
              </span>
              Đăng bài
            </button>
          </div>

          {/* Ảnh đại diện (Thumbnail) */}
          <div className="bg-white p-6 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 space-y-4">
            <p className="text-base font-extrabold text-[#101918]">
              Ảnh đại diện (Thumbnail)
            </p>
            <div className="aspect-video bg-[#f9fbfb] rounded-[24px] overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-[#e9f1f0] hover:border-[#2a9d90]/30 cursor-pointer group transition-all">
              <span className="material-symbols-outlined text-4xl text-[#588d87] group-hover:scale-110 transition-transform">
                image
              </span>
              <span className="text-sm font-bold text-[#588d87] mt-2">
                Chọn ảnh bìa
              </span>
            </div>
            <p className="text-[11px] text-[#588d87] font-medium leading-relaxed bg-[#f9fbfb] p-3 rounded-xl">
              <span className="font-bold">Lưu ý:</span> Định dạng JPG, PNG,
              WEBP. Tối đa 2MB. Tỉ lệ khuyến nghị 16:9.
            </p>
          </div>

          {/* Cấu hình bài viết */}
          <div className="bg-white p-6 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 space-y-6">
            {/* Chuyên mục */}
            <div className="space-y-3">
              <label className="text-xs font-black text-[#588d87] uppercase tracking-widest ml-1">
                Chuyên mục
              </label>
              <div className="relative">
                <select className="w-full appearance-none bg-[#f9fbfb] border border-[#e9f1f0] rounded-[20px] px-5 py-4 text-sm font-bold text-[#101918] focus:ring-2 focus:ring-[#2a9d90]/20 focus:border-[#2a9d90] outline-none cursor-pointer">
                  <option>Chọn chuyên mục</option>
                  <option>Sức khỏe thú cưng</option>
                  <option>Dinh dưỡng</option>
                  <option>Đào tạo & Huấn luyện</option>
                  <option>Tin tức nội bộ</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Thẻ (Tags) */}
            <div className="space-y-3">
              <label className="text-xs font-black text-[#588d87] uppercase tracking-widest ml-1">
                Thẻ (Tags)
              </label>
              <div className="relative">
                <input
                  className="w-full bg-[#f9fbfb] border border-[#e9f1f0] rounded-[20px] px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#2a9d90]/20 focus:border-[#2a9d90] outline-none pr-10"
                  placeholder="Nhập thẻ và nhấn Enter..."
                  type="text"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400">
                  sell
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#2a9d90]/10 text-[#2a9d90] text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-[#2a9d90]/20 cursor-pointer transition-colors">
                  Mèo
                  <button className="hover:text-red-500 transition-colors flex items-center">
                    <span className="material-symbols-outlined text-[14px]">
                      close
                    </span>
                  </button>
                </span>
                <span className="bg-[#2a9d90]/10 text-[#2a9d90] text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-[#2a9d90]/20 cursor-pointer transition-colors">
                  Chăm sóc
                  <button className="hover:text-red-500 transition-colors flex items-center">
                    <span className="material-symbols-outlined text-[14px]">
                      close
                    </span>
                  </button>
                </span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#e9f1f0]"></div>

            {/* Trạng thái hiển thị */}
            <div className="space-y-3">
              <label className="text-xs font-black text-[#588d87] uppercase tracking-widest ml-1">
                Trạng thái hiển thị
              </label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl border border-transparent hover:border-[#e9f1f0] hover:bg-[#f9fbfb] transition-all">
                  <div className="relative flex items-center justify-center">
                    <input
                      defaultChecked
                      className="peer appearance-none size-5 border-2 border-gray-300 rounded-full checked:border-[#2a9d90] checked:bg-[#2a9d90] transition-all"
                      name="status"
                      type="radio"
                    />
                    <span className="material-symbols-outlined text-white text-[14px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none transform scale-0 peer-checked:scale-100 transition-transform">
                      check
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#101918]">
                      Công khai (Public)
                    </span>
                    <span className="text-[11px] text-[#588d87] font-medium">
                      Hiển thị cho tất cả mọi người
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl border border-transparent hover:border-[#e9f1f0] hover:bg-[#f9fbfb] transition-all">
                  <div className="relative flex items-center justify-center">
                    <input
                      className="peer appearance-none size-5 border-2 border-gray-300 rounded-full checked:border-[#2a9d90] checked:bg-[#2a9d90] transition-all"
                      name="status"
                      type="radio"
                    />
                    <span className="material-symbols-outlined text-white text-[14px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none transform scale-0 peer-checked:scale-100 transition-transform">
                      check
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#101918]">
                      Bản nháp (Draft)
                    </span>
                    <span className="text-[11px] text-[#588d87] font-medium">
                      Chỉ hiển thị với quản trị viên
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreatePost;
