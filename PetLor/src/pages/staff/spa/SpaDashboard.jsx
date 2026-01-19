import React from "react";

const SpaDashboard = () => {
  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#fbfcfc] min-h-screen font-sans text-[#0c1d1d]">
      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
        <div className="grid grid-cols-12 gap-8 max-w-[1600px] mx-auto">
          {/* TOP STATS CARDS */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Lịch Spa Hôm nay (Gradient) */}
            <div className="bg-gradient-to-br from-[#2a9d90] to-teal-700 p-8 rounded-[36px] text-white relative overflow-hidden group shadow-lg shadow-[#2a9d90]/20">
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[160px]">
                  soap
                </span>
              </div>
              <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">
                LỊCH SPA HÔM NAY
              </p>
              <h3 className="text-5xl font-extrabold mb-4">18</h3>
              <div className="flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1.5 rounded-full font-bold backdrop-blur-sm">
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
                <span>+4 lịch mới từ sáng</span>
              </div>
            </div>

            {/* Card 2: Đang thực hiện */}
            <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-xl shadow-gray-200/50 group">
              <div className="flex items-center justify-between mb-6">
                <div className="size-14 bg-teal-50 text-[#2a9d90] rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">
                    bubble_chart
                  </span>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                ĐANG THỰC HIỆN
              </p>
              <h3 className="text-5xl font-extrabold text-[#0c1d1d] mb-4">
                04
              </h3>
              <p className="text-xs text-[#2a9d90] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  hourglass_top
                </span>
                Đang trong phòng Grooming
              </p>
            </div>

            {/* Card 3: Dịch vụ hoàn tất (Bar Chart Mini) */}
            <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                  DỊCH VỤ HOÀN TẤT
                </p>
                <h3 className="text-5xl font-extrabold text-[#2a9d90] tracking-tighter">
                  12
                </h3>
              </div>
              <div className="flex items-end gap-1.5 h-12 mt-4">
                <div className="w-2 bg-[#2a9d90]/10 h-[30%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90]/10 h-[50%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90]/20 h-[40%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90]/40 h-[70%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90]/60 h-[60%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90]/80 h-[80%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90] h-full rounded-full"></div>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN (Schedule & Performance) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Lịch trình Spa */}
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-extrabold text-[#0c1d1d] flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#2a9d90] text-3xl">
                    list_alt
                  </span>
                  Lịch trình Spa hôm nay
                </h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[11px] font-bold tracking-widest hover:bg-gray-100 transition-colors">
                    TẤT CẢ
                  </button>
                  <button className="px-4 py-2 bg-[#2a9d90]/5 text-[#2a9d90] rounded-xl text-[11px] font-bold tracking-widest">
                    HÔM NAY
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Item 1 */}
                <div className="flex items-center gap-6 p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-[#2a9d90]/10 hover:bg-white transition-all group cursor-pointer">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs font-black text-[#2a9d90]">09:15</p>
                    <p className="text-[10px] font-bold text-gray-400">AM</p>
                  </div>
                  <div className="size-14 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                    <img
                      alt="Lu"
                      className="w-full h-full object-cover"
                      src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=100&q=80"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-lg text-gray-900">
                      Lu{" "}
                      <span className="text-sm font-medium text-gray-400 ml-1">
                        (Husky)
                      </span>
                    </h4>
                    <p className="text-xs font-medium text-gray-500">
                      Tắm & Vệ sinh
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-teal-50 text-[#2a9d90] text-[10px] font-black rounded-full uppercase tracking-widest">
                      ĐANG TẮM
                    </span>
                    <button className="text-[#2a9d90] hover:text-[#2a9d90]/70">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-6 p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-[#2a9d90]/10 hover:bg-white transition-all group cursor-pointer">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs font-black text-gray-700">10:00</p>
                    <p className="text-[10px] font-bold text-gray-400">AM</p>
                  </div>
                  <div className="size-14 rounded-2xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-2xl">
                      pets
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-lg text-gray-900">
                      Milo{" "}
                      <span className="text-sm font-medium text-gray-400 ml-1">
                        (Poodle)
                      </span>
                    </h4>
                    <p className="text-xs font-medium text-gray-500">
                      Cắt tỉa tạo kiểu
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                      CHỜ PHỤC VỤ
                    </span>
                    <button className="text-[#2a9d90] hover:text-[#2a9d90]/70">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-center gap-6 p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-[#2a9d90]/10 hover:bg-white transition-all group cursor-pointer">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs font-black text-gray-700">11:30</p>
                    <p className="text-[10px] font-bold text-gray-400">AM</p>
                  </div>
                  <div className="size-14 rounded-2xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-2xl">
                      pets
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-lg text-gray-900">
                      Bông{" "}
                      <span className="text-sm font-medium text-gray-400 ml-1">
                        (Mèo Anh)
                      </span>
                    </h4>
                    <p className="text-xs font-medium text-gray-500">
                      Grooming toàn diện
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                      HOÀN TẤT
                    </span>
                    <button className="text-[#2a9d90] hover:text-[#2a9d90]/70">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hiệu suất Spa (Chart) */}
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0c1d1d]">
                    Hiệu suất Spa
                  </h3>
                  <p className="text-sm font-medium text-gray-400">
                    Số lượng thú cưng phục vụ theo ngày
                  </p>
                </div>
                <select className="bg-gray-50 border-none rounded-2xl text-xs font-bold text-gray-500 px-6 py-3 focus:ring-0 cursor-pointer focus:outline-none">
                  <option>Tuần này</option>
                  <option>Tuần trước</option>
                </select>
              </div>
              <div className="flex items-end justify-between h-48 px-4">
                {[
                  { day: "Thứ 2", h: "40%", active: false },
                  { day: "Thứ 3", h: "65%", active: false },
                  { day: "Thứ 4", h: "85%", active: false },
                  { day: "Thứ 5", h: "95%", active: true },
                  { day: "Thứ 6", h: "60%", active: false },
                  { day: "Thứ 7", h: "30%", active: false },
                  { day: "CN", h: "15%", active: false },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-4 group cursor-pointer"
                  >
                    <div
                      className={`w-10 rounded-xl relative transition-colors ${item.active ? "bg-[#2a9d90]" : "bg-[#2a9d90]/10 group-hover:bg-[#2a9d90]"}`}
                      style={{ height: item.h }}
                    ></div>
                    <span
                      className={`text-[10px] font-bold ${item.active ? "text-[#2a9d90]" : "text-gray-400"}`}
                    >
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Notifications & Alerts) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Thông báo mới */}
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-extrabold text-[#0c1d1d] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2a9d90]">
                    notifications_active
                  </span>
                  Thông báo mới
                </h4>
                <span className="size-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md shadow-red-500/20">
                  2
                </span>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border-l-4 border-[#2a9d90] bg-[#2a9d90]/[0.05]">
                  <div className="size-10 rounded-xl bg-[#2a9d90]/10 text-[#2a9d90] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      Khách đã check-in cho Lu (Husky)
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      10 phút trước
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
                  <div className="size-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      Milo (Poodle) đã hoàn thành grooming
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      1 giờ trước
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
                  <div className="size-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">feedback</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      Chủ của Bông để lại đánh giá 5 sao
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">Hôm nay</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-3 border-t border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#2a9d90] transition-colors">
                Tất cả thông báo
              </button>
            </div>

            {/* Thú cưng cần lưu ý */}
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xl font-extrabold text-[#0c1d1d] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2a9d90]">
                    priority_high
                  </span>
                  Thú cưng cần lưu ý
                </h4>
              </div>
              <div className="space-y-6">
                {/* Item 1 */}
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-[20px] bg-red-50 p-1 border border-red-100">
                    <img
                      alt="Watch Pet"
                      className="w-full h-full object-cover rounded-[16px]"
                      src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=100&q=80"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h5 className="text-sm font-extrabold text-gray-900">
                        Lu
                      </h5>
                      <span className="text-[10px] font-bold text-red-500">
                        DỊ ỨNG XÀ PHÒNG
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-red-500 h-full w-[85%] rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      Sử dụng loại sữa tắm hữu cơ số 4
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-[20px] bg-amber-50 p-1 border border-amber-100">
                    <div className="w-full h-full bg-gray-100 rounded-[16px] flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-400">
                        pets
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h5 className="text-sm font-extrabold text-gray-900">
                        Cookie
                      </h5>
                      <span className="text-[10px] font-bold text-amber-500">
                        NHÁT NGƯỜI
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-500 h-full w-[40%] rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      Thực hiện chậm, tránh tiếng ồn
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SpaDashboard;
