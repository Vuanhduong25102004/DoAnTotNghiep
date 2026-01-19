import React from "react";

const ReceptionistDashboard = () => {
  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#f9fbfb] min-h-screen font-sans text-[#0c1d1d]">
      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
        <div className="grid grid-cols-12 gap-8 max-w-[1600px] mx-auto">
          {/* TOP STATS CARDS */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Khách đang chờ (Gradient) */}
            <div className="bg-gradient-to-br from-[#2a9d90] to-teal-700 p-8 rounded-[36px] text-white relative overflow-hidden group shadow-lg shadow-[#2a9d90]/20">
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[160px]">
                  person_search
                </span>
              </div>
              <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">
                KHÁCH ĐANG CHỜ
              </p>
              <h3 className="text-5xl font-extrabold mb-4">08</h3>
              <div className="flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1.5 rounded-full font-bold backdrop-blur-sm">
                <span className="material-symbols-outlined text-sm">
                  hourglass_empty
                </span>
                <span>Thời gian chờ TB: 15p</span>
              </div>
            </div>

            {/* Card 2: Sản phẩm đã bán */}
            <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-xl shadow-gray-200/50 group">
              <div className="flex items-center justify-between mb-6">
                <div className="size-14 bg-blue-50 text-[#2a9d90] rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">
                    shopping_cart
                  </span>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                SẢN PHẨM ĐÃ BÁN
              </p>
              <h3 className="text-5xl font-extrabold text-[#0c1d1d] mb-4">
                42
              </h3>
              <p className="text-xs text-[#2a9d90] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
                +15% so với mục tiêu
              </p>
            </div>

            {/* Card 3: Doanh thu (Bar Chart Mini) */}
            <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                  DOANH THU HÔM NAY
                </p>
                <h3 className="text-5xl font-extrabold text-[#2a9d90] tracking-tighter">
                  15.2M
                </h3>
              </div>
              <div className="flex items-end gap-1.5 h-12 mt-4">
                <div className="w-2 bg-[#2a9d90]/10 h-[40%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90]/10 h-[60%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90]/20 h-[50%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90]/40 h-[80%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90]/60 h-[70%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90]/80 h-[90%] rounded-full"></div>
                <div className="w-2 bg-[#2a9d90] h-full rounded-full"></div>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN (Schedule & Density) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Lịch tiếp đón */}
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-extrabold text-[#0c1d1d] flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#2a9d90] text-3xl">
                    meeting_room
                  </span>
                  Lịch tiếp đón hôm nay
                </h3>
                <button className="text-sm font-bold text-[#2a9d90] hover:underline uppercase tracking-wide">
                  XEM TẤT CẢ
                </button>
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
                      alt="Pet"
                      className="w-full h-full object-cover"
                      src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=100&q=80"
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
                      Dịch vụ: Tắm & Cắt tỉa (Spa)
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-[#2a9d90]/10 text-[#2a9d90] text-[10px] font-black rounded-full uppercase tracking-widest">
                      ĐÃ ĐẾN
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
                    <p className="text-xs font-black text-gray-700">10:30</p>
                    <p className="text-[10px] font-bold text-gray-400">AM</p>
                  </div>
                  <div className="size-14 rounded-2xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-2xl">
                      hotel
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
                      Dịch vụ: Khách sạn (3 ngày)
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                      CHƯA ĐẾN
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
                    <p className="text-xs font-black text-gray-700">11:00</p>
                    <p className="text-[10px] font-bold text-gray-400">AM</p>
                  </div>
                  <div className="size-14 rounded-2xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-2xl">
                      content_cut
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
                      Dịch vụ: Grooming cao cấp
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-[#2a9d90]/10 text-[#2a9d90] text-[10px] font-black rounded-full uppercase tracking-widest">
                      ĐÃ ĐẾN
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

            {/* Mật độ khách hàng (Chart) */}
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0c1d1d]">
                    Mật độ khách hàng
                  </h3>
                  <p className="text-sm font-medium text-gray-400">
                    Số lượng khách tiếp đón trong tuần
                  </p>
                </div>
                <select className="bg-gray-50 border-none rounded-2xl text-xs font-bold text-gray-500 px-6 py-3 focus:ring-0 cursor-pointer focus:outline-none">
                  <option>Tuần này</option>
                  <option>Tuần trước</option>
                </select>
              </div>
              <div className="flex items-end justify-between h-48 px-4">
                {/* Cột biểu đồ */}
                {[
                  { day: "Thứ 2", val: 12, h: "40%", active: false },
                  { day: "Thứ 3", val: 18, h: "65%", active: false },
                  { day: "Thứ 4", val: 25, h: "85%", active: false },
                  { day: "Thứ 5", val: 28, h: "95%", active: true },
                  { day: "Thứ 6", val: 15, h: "60%", active: false },
                  { day: "Thứ 7", val: 8, h: "30%", active: false },
                  { day: "CN", val: 4, h: "15%", active: false },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-4 group cursor-pointer"
                  >
                    <div
                      className={`w-10 ${item.active ? "bg-[#2a9d90]" : "bg-[#2a9d90]/10 group-hover:bg-[#2a9d90]"} transition-colors rounded-xl relative`}
                      style={{ height: item.h }}
                    >
                      <div
                        className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black ${item.active ? "text-[#2a9d90]" : "text-gray-400 hidden group-hover:block"}`}
                      >
                        {item.val}
                      </div>
                    </div>
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

          {/* RIGHT COLUMN (Notifications & Services) */}
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
                  4
                </span>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer border-l-4 border-[#2a9d90] bg-[#2a9d90]/[0.05]">
                  <div className="size-10 rounded-xl bg-[#2a9d90]/10 text-[#2a9d90] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">
                      receipt_long
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      Đơn hàng mới #PET9921 cần xác nhận
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      5 phút trước
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer">
                  <div className="size-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">
                      calendar_add_on
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      Yêu cầu đặt lịch mới cho Lu (Spa)
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      45 phút trước
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer">
                  <div className="size-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">
                      inventory_2
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      Sản phẩm 'Pate Cá Hồi' sắp hết hàng
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">Hôm nay</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-3 border-t border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#2a9d90] transition-colors">
                Tất cả thông báo
              </button>
            </div>

            {/* Trạng thái dịch vụ */}
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xl font-extrabold text-[#0c1d1d] flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500">
                    room_service
                  </span>
                  Trạng thái dịch vụ
                </h4>
              </div>
              <div className="space-y-6">
                {/* Item 1 */}
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-[20px] bg-red-50 p-1 border border-red-100">
                    <img
                      alt="Service Pet"
                      className="w-full h-full object-cover rounded-[16px]"
                      src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=100&q=80"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h5 className="text-sm font-extrabold text-gray-900">
                        Lu
                      </h5>
                      <span className="text-[10px] font-bold text-orange-500">
                        ĐANG TẮM
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-orange-500 h-full w-[65%] rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      Dự kiến hoàn tất sau 20p
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-[20px] bg-amber-50 p-1 border border-amber-100">
                    <div className="w-full h-full bg-gray-100 rounded-[16px] flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-400">
                        hotel
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h5 className="text-sm font-extrabold text-gray-900">
                        Cookie
                      </h5>
                      <span className="text-[10px] font-bold text-amber-500">
                        CHỜ CHECK-IN
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-500 h-full w-[20%] rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      Phòng VIP 02 đã sẵn sàng
                    </p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-center gap-4 opacity-60">
                  <div className="size-14 rounded-[20px] bg-gray-50 p-1 border border-gray-100">
                    <div className="w-full h-full bg-gray-100 rounded-[16px] flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-300">
                        pets
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h5 className="text-sm font-extrabold text-gray-900">
                        Bin
                      </h5>
                      <span className="text-[10px] font-bold text-gray-400">
                        HOÀN TẤT
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#2a9d90] h-full w-[100%] rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      Đã thanh toán & ra về
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

export default ReceptionistDashboard;
