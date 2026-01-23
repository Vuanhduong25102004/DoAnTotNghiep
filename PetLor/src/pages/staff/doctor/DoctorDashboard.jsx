import React, { useEffect, useState } from "react";
import doctorService from "../../../services/doctorService";
// Import đầy đủ các hàm từ file utils
import {
  getStatusBadge,
  formatTimeForSchedule,
  getAppointmentTypeBadge, // <--- Hàm mới lấy màu cho Loại lịch hẹn
} from "../../../utils/formatters";

// --- CẤU HÌNH ĐƯỜNG DẪN SERVER ĐỂ LẤY ẢNH ---
const BACKEND_URL = "http://localhost:8080";

const DoctorDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    lichKhamHomNay: 0,
    soCaKhanCap: 0,
    benhNhanDaTiepNhan: 0,
  });
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [statsData, scheduleData] = await Promise.all([
          doctorService.getDashboardStats(userId),
          doctorService.getTodaySchedule(userId),
        ]);

        if (statsData) setStats(statsData);

        if (scheduleData) {
          const listData = Array.isArray(scheduleData)
            ? scheduleData
            : [scheduleData];
          setSchedules(listData);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full bg-gray-50 font-sans text-slate-600 pb-12">
      <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <h3 className="text-5xl font-extrabold text-slate-800 mb-4">
              {loading ? "..." : String(stats.soCaKhanCap).padStart(2, "0")}
            </h3>
            <p className="text-xs text-red-500 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                priority_high
              </span>
              Đang đợi tiếp nhận
            </p>
          </div>

          {/* Card 3: Bệnh nhân đã tiếp nhận */}
          <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                Bệnh nhân đã tiếp nhận
              </p>
              <h3 className="text-5xl font-extrabold text-teal-600 tracking-tighter">
                {loading ? "..." : stats.benhNhanDaTiepNhan.toLocaleString()}
              </h3>
            </div>
            {/* Chart mini trang trí */}
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
            {/* 1. DANH SÁCH LỊCH TRÌNH */}
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
                {/* Loading State */}
                {loading && (
                  <p className="text-center text-gray-400 py-4 italic">
                    Đang tải lịch trình...
                  </p>
                )}

                {/* Empty State */}
                {!loading && schedules.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">
                      event_busy
                    </span>
                    <p className="text-gray-400 font-medium">
                      Hôm nay chưa có lịch hẹn nào
                    </p>
                  </div>
                )}

                {/* Render List */}
                {!loading &&
                  schedules.length > 0 &&
                  schedules.map((item) => {
                    // 1. Format Giờ
                    const { time, period } = formatTimeForSchedule(
                      item.thoiGianBatDau,
                    );

                    // 2. Logic Trạng thái (Fix lỗi API trả về tên khác)
                    const rawStatus = item.trangThaiLichHen || item.trangThai;
                    const statusInfo = getStatusBadge(rawStatus);

                    // 3. Logic Loại Lịch Hẹn (Mới thêm)
                    const typeBadge = getAppointmentTypeBadge(item.loaiLichHen);

                    // 4. Logic Ảnh thú cưng
                    const imageUrl = item.anhThuCung
                      ? `${BACKEND_URL}/uploads/${item.anhThuCung}`
                      : null;

                    return (
                      <div
                        key={item.lichHenId}
                        className="flex items-center gap-6 p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-teal-600/10 hover:bg-white transition-all group cursor-pointer"
                      >
                        {/* Cột 1: Thời gian */}
                        <div className="text-center min-w-[60px]">
                          <p className="text-xs font-black text-teal-600">
                            {time}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400">
                            {period}
                          </p>
                        </div>

                        {/* Cột 2: Avatar/Icon (Dùng kỹ thuật Overlay để fix lỗi ảnh) */}
                        <div className="size-14 rounded-2xl overflow-hidden shrink-0 bg-gray-50 border-2 border-gray-100 shadow-sm flex items-center justify-center text-gray-300 relative">
                          {/* Lớp dưới: Icon mặc định */}
                          <span className="material-symbols-outlined text-2xl">
                            pets
                          </span>

                          {/* Lớp trên: Ảnh thú cưng (nếu có) */}
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={item.tenThuCung}
                              className="absolute inset-0 w-full h-full object-cover bg-white"
                              onError={(e) => {
                                // Nếu ảnh lỗi -> ẩn đi để lộ icon bên dưới
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                        </div>

                        {/* Cột 3: Thông tin chính */}
                        <div className="flex-1">
                          <h4 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
                            {item.tenThuCung}{" "}
                            <span className="text-sm font-medium text-gray-400">
                              ({item.giongLoai})
                            </span>
                            {/* --- BADGE LOẠI LỊCH HẸN (Đã dùng hàm mới) --- */}
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${typeBadge.color}`}
                            >
                              {typeBadge.label}
                            </span>
                          </h4>

                          <p className="text-xs font-medium text-gray-500 mt-1">
                            {item.tenDichVu}
                          </p>

                          {/* Tên chủ & Ghi chú */}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded">
                              Chủ: {item.tenKhachHang}
                            </span>
                            {item.ghiChu && (
                              <span className="text-[10px] text-gray-400 italic truncate max-w-[200px] flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]">
                                  sticky_note_2
                                </span>
                                {item.ghiChu}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Cột 4: Badge Trạng thái & Nút More */}
                        <div className="flex flex-col items-end gap-2">
                          {/* Badge Trạng thái (Đã xác nhận/Chờ duyệt...) */}
                          <span
                            className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>

                          {/* Cảnh báo Khẩn cấp */}
                          {item.ghiChu &&
                            item.ghiChu.toLowerCase().includes("khẩn") && (
                              <span className="text-[9px] font-bold text-red-500 flex items-center animate-pulse">
                                <span className="material-symbols-outlined text-[10px] mr-0.5">
                                  warning
                                </span>
                                KHẨN CẤP
                              </span>
                            )}

                          <button className="text-teal-600 hover:text-teal-600/70 mt-1">
                            <span className="material-symbols-outlined">
                              more_horiz
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* 2. BIỂU ĐỒ (Placeholder) */}
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

              {/* Chart tĩnh */}
              <div className="flex items-end justify-between h-48 px-4">
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 h-[40%] rounded-xl"></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    T2
                  </span>
                </div>
                {/* ... Các cột khác ... */}
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 h-[65%] rounded-xl"></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    T3
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 h-[85%] rounded-xl"></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    T4
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600 h-[95%] rounded-xl shadow-lg shadow-teal-600/20 relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-teal-600">
                      28
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-teal-600">
                    T5
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 h-[60%] rounded-xl"></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    T6
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 h-[30%] rounded-xl"></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    T7
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4 group cursor-pointer">
                  <div className="w-10 bg-teal-600/10 h-[15%] rounded-xl"></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    CN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI (Thông báo) --- */}
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
                  3
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

            {/* 2. Cần theo dõi */}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
