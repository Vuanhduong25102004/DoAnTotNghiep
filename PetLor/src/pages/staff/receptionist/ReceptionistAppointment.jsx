import React, { useState, useEffect, useCallback } from "react";
import bookingService from "../../../services/bookingService"; // Đảm bảo đúng đường dẫn import
import { renderReceptionistStatusBadge } from "../../../utils/formatters"; // Import hàm badge bạn đã có

const ReceptionistAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [stats, setStats] = useState({ pending: 0, waiting: 0, completed: 0 });

  // 1. Thứ tự ưu tiên trạng thái
  const statusPriority = {
    CHO_XAC_NHAN: 1,
    DA_XAC_NHAN: 2,
    DA_HOAN_THANH: 3,
    DA_HUY: 4,
  };

  // 2. Tải và sắp xếp dữ liệu
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookingService.getTodayAppointments();
      const data = response?.data || response || [];

      if (Array.isArray(data)) {
        // Sắp xếp: Trạng thái ưu tiên trước, cùng trạng thái thì thời gian bắt đầu muộn nhất lên đầu
        const sortedData = [...data].sort((a, b) => {
          const priorityA = statusPriority[a.trangThaiLichHen] || 99;
          const priorityB = statusPriority[b.trangThaiLichHen] || 99;

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          return new Date(b.thoiGianBatDau) - new Date(a.thoiGianBatDau);
        });

        setAppointments(sortedData);

        setStats({
          pending: sortedData.filter(
            (a) => a.trangThaiLichHen === "DA_XAC_NHAN",
          ).length,
          waiting: sortedData.filter(
            (a) => a.trangThaiLichHen === "CHO_XAC_NHAN",
          ).length,
          completed: sortedData.filter(
            (a) => a.trangThaiLichHen === "DA_HOAN_THANH",
          ).length,
        });

        applyFilter(activeFilter, sortedData);
      }
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 3. Logic lọc
  const applyFilter = (label, dataSrc) => {
    if (label === "Tất cả") {
      setFilteredData(dataSrc);
    } else if (label === "Đã xác nhận") {
      setFilteredData(
        dataSrc.filter((a) => a.trangThaiLichHen === "DA_XAC_NHAN"),
      );
    } else if (label === "Chờ xác nhận") {
      setFilteredData(
        dataSrc.filter((a) => a.trangThaiLichHen === "CHO_XAC_NHAN"),
      );
    }
  };

  const handleFilter = (label) => {
    setActiveFilter(label);
    applyFilter(label, appointments);
  };

  // 4. Xử lý Check-in (Cập nhật sang hoàn thành hoặc bước tiếp theo tùy quy trình)
  const handleCheckIn = async (id) => {
    if (!window.confirm("Xác nhận khách đã đến và thực hiện check-in?")) return;
    try {
      await bookingService.updateAppointment(id, {
        trangThaiLichHen: "DA_HOAN_THANH",
      });
      alert("Check-in thành công!");
      loadData();
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-[#2a9d90]">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <main className="w-full bg-[#fbfcfc] font-sans text-[#101918] min-h-screen p-8 lg:p-12">
      <div className="max-w-[1600px] mx-auto space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 flex items-center gap-6">
            <div className="size-16 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-orange-500 text-[36px]">
                pending_actions
              </span>
            </div>
            <div>
              <p className="text-[#588d87] text-sm font-bold uppercase tracking-widest">
                Lịch đã xác nhận
              </p>
              <h3 className="text-4xl font-extrabold mt-1 text-[#101918]">
                {stats.pending.toString().padStart(2, "0")}
              </h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 flex items-center gap-6">
            <div className="size-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-blue-500 text-[36px]">
                notification_important
              </span>
            </div>
            <div>
              <p className="text-[#588d87] text-sm font-bold uppercase tracking-widest">
                Chờ xác nhận
              </p>
              <h3 className="text-4xl font-extrabold mt-1 text-[#101918]">
                {stats.waiting.toString().padStart(2, "0")}
              </h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 flex items-center gap-6">
            <div className="size-16 bg-[#2a9d90]/10 rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#2a9d90] text-[36px]">
                check_circle
              </span>
            </div>
            <div>
              <p className="text-[#588d87] text-sm font-bold uppercase tracking-widest">
                Lịch đã hoàn thành
              </p>
              <h3 className="text-4xl font-extrabold mt-1 text-[#101918]">
                {stats.completed.toString().padStart(2, "0")}
              </h3>
            </div>
          </div>
        </section>

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-2xl font-extrabold text-[#101918] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2a9d90] text-[32px]">
                calendar_month
              </span>
              Lịch hẹn hôm nay
            </h3>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-3 bg-white p-1.5 rounded-2xl border border-[#e9f1f0] shadow-sm">
                {["Tất cả", "Đã xác nhận", "Chờ xác nhận"].map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFilter(f)}
                    className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
                      activeFilter === f
                        ? "bg-[#2a9d90] text-white shadow-md shadow-[#2a9d90]/20"
                        : "text-[#588d87] hover:bg-[#f9fbfb]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button className="bg-[#2a9d90] text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#2a9d90]/20 hover:bg-[#23857a] transition-all">
                <span className="material-symbols-outlined text-[20px]">
                  add_circle
                </span>
                Thêm mới
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredData.map((item) => {
              const timeStr = new Date(item.thoiGianBatDau).toLocaleTimeString(
                "vi-VN",
                { hour: "2-digit", minute: "2-digit" },
              );

              return (
                <div
                  key={item.lichHenId}
                  className="bg-white rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#2a9d90]/10 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between border-b border-[#e9f1f0] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#2a9d90] text-[24px]">
                        schedule
                      </span>
                      <span className="text-xl font-black text-[#2a9d90]">
                        {timeStr}
                      </span>
                    </div>
                    <span className="text-xs text-[#588d87] font-bold uppercase tracking-wide bg-[#f9fbfb] px-3 py-1 rounded-full">
                      Hôm nay
                    </span>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="size-20 rounded-2xl bg-[#f9fbfb] flex items-center justify-center overflow-hidden">
                      {item.anhThuCung ? (
                        <img
                          src={`http://localhost:8080/uploads/${item.anhThuCung}`}
                          alt="pet"
                          className="object-cover size-full"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-gray-400 text-3xl">
                          pets
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="text-lg font-extrabold truncate text-[#101918]">
                        {item.tenThuCung}
                      </h4>
                      <p className="text-sm text-[#588d87] font-medium mb-1.5">
                        {item.giongLoai}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-[#588d87] font-bold truncate">
                        <span className="material-symbols-outlined text-[16px]">
                          person
                        </span>
                        {item.tenKhachHang} • {item.soDienThoaiKhachHang}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f9fbfb] rounded-2xl p-4 space-y-3 border border-[#e9f1f0]/50">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-white rounded-full flex items-center justify-center border border-[#e9f1f0] text-[#2a9d90]">
                        <span className="material-symbols-outlined text-[18px]">
                          medical_information
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#588d87] font-bold uppercase">
                          Dịch vụ
                        </p>
                        <span className="text-sm font-bold text-[#101918]">
                          {item.tenDichVu}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full flex items-center justify-center text-[10px] font-black border border-white bg-blue-100 text-blue-600">
                        {item.tenNhanVien
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[10px] text-[#588d87] font-bold uppercase">
                          Phụ trách
                        </p>
                        <span className="text-sm font-bold text-[#101918]">
                          {item.tenNhanVien}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    {renderReceptionistStatusBadge(item.trangThaiLichHen)}
                    <div className="flex gap-3">
                      <button className="size-10 flex items-center justify-center text-[#588d87] hover:bg-[#f9fbfb] rounded-xl transition-colors border border-transparent hover:border-[#e9f1f0]">
                        <span className="material-symbols-outlined text-[20px]">
                          edit
                        </span>
                      </button>
                      {item.trangThaiLichHen === "DA_XAC_NHAN" ? (
                        <button
                          onClick={() => handleCheckIn(item.lichHenId)}
                          className="px-6 py-2 bg-[#2a9d90] text-white text-xs font-bold rounded-xl shadow-lg hover:bg-[#23857a] transition-all"
                        >
                          Check-in
                        </button>
                      ) : (
                        <button className="px-6 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed border border-gray-200">
                          Check-in
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-[#e9f1f0]">
            <p className="text-sm font-medium text-[#588d87]">
              Hiển thị{" "}
              <span className="font-bold text-[#101918]">
                {filteredData.length}
              </span>{" "}
              trong số{" "}
              <span className="font-bold text-[#101918]">
                {appointments.length}
              </span>{" "}
              lịch hẹn
            </p>
            <div className="flex gap-2">
              <button className="size-10 flex items-center justify-center rounded-xl border border-[#e9f1f0] bg-white text-[#588d87]">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="size-10 flex items-center justify-center rounded-xl bg-[#2a9d90] text-white text-sm font-bold shadow-md shadow-[#2a9d90]/20">
                1
              </button>
              <button className="size-10 flex items-center justify-center rounded-xl border border-[#e9f1f0] bg-white text-sm font-bold text-[#588d87]">
                2
              </button>
              <button className="size-10 flex items-center justify-center rounded-xl border border-[#e9f1f0] bg-white text-[#588d87]">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// StatCard Component
const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    orange: "bg-orange-50 text-orange-500",
    blue: "bg-blue-50 text-blue-500",
    teal: "bg-[#2a9d90]/10 text-[#2a9d90]",
  };
  return (
    <div className="bg-white p-8 rounded-[32px] border border-[#e9f1f0] shadow-xl flex items-center gap-6">
      <div
        className={`size-16 rounded-2xl flex items-center justify-center shrink-0 ${colors[color]}`}
      >
        <span className="material-symbols-outlined text-[36px]">{icon}</span>
      </div>
      <div>
        <p className="text-[#588d87] text-sm font-bold uppercase tracking-widest">
          {label}
        </p>
        <h3 className="text-4xl font-extrabold mt-1 text-[#101918]">
          {value.toString().padStart(2, "0")}
        </h3>
      </div>
    </div>
  );
};

export default ReceptionistAppointment;
