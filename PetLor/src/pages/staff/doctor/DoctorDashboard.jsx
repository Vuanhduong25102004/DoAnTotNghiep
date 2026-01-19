import React, { useEffect, useState } from "react";
import doctorService from "../../../services/doctorService";

const DoctorDashboard = ({ user }) => {
  // State lưu dữ liệu thống kê từ API
  const [stats, setStats] = useState({
    lichKhamHomNay: 0,
    soCaKhanCap: 0,
    benhNhanDaTiepNhan: 0,
  });
  const [loading, setLoading] = useState(true);

  // Gọi API lấy dữ liệu khi component được load
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");

      // Nếu không có userId (chưa đăng nhập), dừng lại
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Gọi service lấy data (Giả sử bạn đã cấu hình doctorService như các bước trước)
        const data = await doctorService.getDashboardStats(userId);

        console.log("Dữ liệu thống kê từ API:", data);

        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error("Lỗi khi tải thống kê Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full bg-gray-50 font-sans text-slate-600 pb-12">
      {/* Container chính */}
      <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8">
        {/* ====================================================================================
            PHẦN 1: THỐNG KÊ TỔNG QUAN (ĐÃ MAP DỮ LIỆU TỪ API)
           ==================================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Lịch làm việc/Khám */}
          <div className="bg-gradient-to-br from-teal-500 to-emerald-700 p-8 rounded-[36px] text-white relative overflow-hidden group shadow-lg cursor-pointer transition-all hover:shadow-emerald-500/30">
            <div className="absolute -right-6 -bottom-6 opacity-60 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <span className="material-symbols-outlined text-[160px] leading-none select-none">
                calendar_today
              </span>
            </div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2 relative z-10">
              {user?.role === "RECEPTIONIST"
                ? "Lịch đặt hôm nay"
                : "Lịch khám hôm nay"}
            </p>
            {/* Hiển thị số lượng từ API */}
            <h3 className="text-5xl font-extrabold mb-4 relative z-10">
              {loading ? "..." : stats.lichKhamHomNay}
            </h3>
            <div className="flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1.5 rounded-full font-bold relative z-10">
              <span className="material-symbols-outlined text-sm">
                trending_up
              </span>
              <span>+12% so với hôm qua</span>
            </div>
          </div>

          {/* Card 2: Trạng thái Khẩn cấp / Chờ xử lý */}
          <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-xl shadow-gray-200/50 group hover:border-red-100 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="size-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">
                  emergency
                </span>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
              Số ca khẩn cấp
            </p>
            {/* Hiển thị số lượng từ API, thêm số 0 ở trước nếu < 10 */}
            <h3 className="text-5xl font-extrabold text-slate-800 mb-4">
              {loading ? "..." : String(stats.soCaKhanCap).padStart(1, "0")}
            </h3>
            <p className="text-xs text-red-500 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                priority_high
              </span>
              Đang đợi tiếp nhận
            </p>
          </div>

          {/* Card 3: Tổng quan Bệnh nhân */}
          <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                Bệnh nhân đã tiếp nhận
              </p>
              {/* Hiển thị số lượng từ API */}
              <h3 className="text-5xl font-extrabold text-teal-600 tracking-tighter">
                {loading ? "..." : stats.benhNhanDaTiepNhan.toLocaleString()}
              </h3>
            </div>
            {/* Chart mini */}
            <div className="flex items-end gap-1.5 h-12 mt-4">
              <div className="w-2 bg-teal-600/10 h-[40%] rounded-full"></div>
              <div className="w-2 bg-teal-600/10 h-[60%] rounded-full"></div>
              <div className="w-2 bg-teal-600/20 h-[50%] rounded-full"></div>
              <div className="w-2 bg-teal-600/40 h-[80%] rounded-full"></div>
              <div className="w-2 bg-teal-600/60 h-[70%] rounded-full"></div>
              <div className="w-2 bg-teal-600/80 h-[90%] rounded-full"></div>
              <div className="w-2 bg-teal-600 h-full rounded-full"></div>
            </div>
          </div>
        </div>

        {/* ====================================================================================
            PHẦN 2: CHI TIẾT CÔNG VIỆC
           ==================================================================================== */}
        <div className="grid grid-cols-12 gap-8">
          {/* --- CỘT TRÁI (Lịch trình & Biểu đồ) --- */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* 1. Danh sách công việc / Lịch trình */}
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                  <span className="material-symbols-outlined text-teal-600 text-3xl">
                    schedule
                  </span>
                  Lịch trình hôm nay
                </h3>
                <button className="text-sm font-bold text-teal-600 hover:underline">
                  XEM TẤT CẢ
                </button>
              </div>

              <div className="space-y-4">
                {/* Item 1 */}
                <div className="flex items-center gap-6 p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-teal-600/10 hover:bg-white transition-all group cursor-pointer">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs font-black text-teal-600">09:15</p>
                    <p className="text-[10px] font-bold text-gray-400">AM</p>
                  </div>
                  <div className="size-14 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                    <img
                      alt="Lu"
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
                      Khám tổng quát & Tiêm phòng
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black rounded-full uppercase tracking-widest">
                      Khẩn cấp
                    </span>
                    <button className="text-teal-600 hover:text-teal-600/70">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-6 p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-teal-600/10 hover:bg-white transition-all group cursor-pointer">
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
                      Kiểm tra định kỳ quý 3
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-500 text-[10px] font-black rounded-full uppercase tracking-widest">
                      Thường lệ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Biểu đồ Mức độ công việc */}
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800">
                    Mức độ công việc
                  </h3>
                  <p className="text-sm font-medium text-gray-400">
                    Số lượng khách tiếp nhận trong tuần
                  </p>
                </div>
                <select className="bg-gray-50 border-none rounded-2xl text-xs font-bold text-gray-500 px-6 py-3 focus:ring-0 cursor-pointer outline-none">
                  <option>Tuần này</option>
                  <option>Tuần trước</option>
                </select>
              </div>

              <div className="flex items-end justify-between h-48 px-4">
                {/* Cột biểu đồ */}
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 group-hover:bg-teal-600 transition-colors h-[40%] rounded-xl relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-400 hidden group-hover:block">
                      12
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">
                    Thứ 2
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 group-hover:bg-teal-600 transition-colors h-[65%] rounded-xl relative"></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    Thứ 3
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 group-hover:bg-teal-600 transition-colors h-[85%] rounded-xl relative"></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    Thứ 4
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600 h-[95%] rounded-xl relative shadow-lg shadow-teal-600/20">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-teal-600">
                      28
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-teal-600">
                    Thứ 5
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 group-hover:bg-teal-600 transition-colors h-[60%] rounded-xl relative"></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    Thứ 6
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 group-hover:bg-teal-600 transition-colors h-[30%] rounded-xl relative"></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    Thứ 7
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 group-hover:bg-teal-600 transition-colors h-[15%] rounded-xl relative"></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    CN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI (Thông báo & Cảnh báo) --- */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* 1. Thông báo mới */}
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">
                    notifications_active
                  </span>
                  Thông báo mới
                </h4>
                <span className="size-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md shadow-red-500/20">
                  4
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border-l-4 border-teal-600 bg-teal-50/20">
                  <div className="size-10 rounded-xl bg-teal-600/10 text-teal-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">
                      assignment
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      Kết quả xét nghiệm máu cho Ben đã có
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      10 phút trước
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
                  <div className="size-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      Chủ nuôi Milo gửi tin nhắn
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      1 giờ trước
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
                  <div className="size-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-snug">
                      Thiết bị siêu âm phòng số 2 cần bảo trì
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">Hôm nay</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-3 border-t border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-teal-600 transition-colors">
                Tất cả thông báo
              </button>
            </div>

            {/* 2. Cần theo dõi (Quan trọng với Bác sĩ & Spa) */}
            <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500">
                    monitoring
                  </span>
                  Cần theo dõi
                </h4>
              </div>

              <div className="space-y-6">
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
                        KHẨN CẤP
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-red-500 h-full w-[85%] rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      Nhịp tim không ổn định
                    </p>
                  </div>
                </div>

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
                        TÁI KHÁM
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-500 h-full w-[40%] rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      Hậu phẫu ngày thứ 2
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
