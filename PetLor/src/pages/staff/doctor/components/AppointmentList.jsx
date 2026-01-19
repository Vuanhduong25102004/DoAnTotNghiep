import React from "react";

const AppointmentList = ({
  appointments = [],
  selectedId,
  onSelect,
  activeTab,
  onTabChange,
  loading,
}) => {
  // --- HELPERS ---
  const formatTime = (isoString) =>
    isoString
      ? new Date(isoString).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";

  const getBadgeStyle = (type) => {
    const t = type?.toUpperCase() || "";
    if (t.includes("KHẨN") || t === "KHAN_CAP") {
      return "bg-[#ef5350]/10 text-[#ef5350]";
    }
    if (t.includes("TÁI") || t === "TAI_KHAM") {
      return "bg-amber-100 text-amber-700";
    }
    return "bg-[#007A7A]/10 text-[#007A7A]";
  };

  // --- FILTER ---
  const displayedList = appointments.filter((apt) => {
    if (activeTab === "CHO_DUYET")
      return apt.trangThaiLichHen === "CHO_XAC_NHAN";
    if (activeTab === "DA_XAC_NHAN")
      return apt.trangThaiLichHen === "DA_XAC_NHAN";
    if (activeTab === "KHAN_CAP") return apt.loaiLichHen?.includes("Khẩn");
    if (activeTab === "DA_XONG")
      return ["DA_HOAN_THANH", "DA_HUY"].includes(apt.trangThaiLichHen);
    return true;
  });

  const countPending = appointments.filter(
    (a) => a.trangThaiLichHen === "CHO_XAC_NHAN",
  ).length;

  const countConfirmed = appointments.filter(
    (a) => a.trangThaiLichHen === "DA_XAC_NHAN",
  ).length;

  const countUrgent = appointments.filter((a) =>
    a.loaiLichHen?.includes("Khẩn"),
  ).length;

  return (
    <section className="w-[600px] border-r border-gray-100 flex flex-col bg-[#F9FAFB] shrink-0 font-sans h-full">
      {/* TABS */}
      <div className="flex bg-white px-4 pt-2 shrink-0 border-b border-gray-100 overflow-x-auto no-scrollbar">
        <TabButton
          label="CHỜ DUYỆT"
          count={countPending}
          isActive={activeTab === "CHO_DUYET"}
          onClick={() => onTabChange("CHO_DUYET")}
        />
        <TabButton
          label="ĐÃ DUYỆT"
          count={countConfirmed}
          isActive={activeTab === "DA_XAC_NHAN"}
          onClick={() => onTabChange("DA_XAC_NHAN")}
        />
        <TabButton
          label="KHẨN CẤP"
          count={countUrgent}
          isActive={activeTab === "KHAN_CAP"}
          onClick={() => onTabChange("KHAN_CAP")}
        />
        <TabButton
          label="LỊCH SỬ"
          isActive={activeTab === "DA_XONG"}
          onClick={() => onTabChange("DA_XONG")}
        />
      </div>

      {/* LIST ITEMS */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></span>
            Đang tải dữ liệu...
          </div>
        ) : displayedList.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-gray-300">
              inbox
            </span>
            <span>Không có lịch hẹn nào</span>
          </div>
        ) : (
          displayedList.map((apt) => {
            const isSelected = selectedId === apt.lichHenId;
            const containerClass = isSelected
              ? "bg-white p-6 rounded-3xl border border-[#007A7A] ring-1 ring-[#007A7A]/20 premium-shadow cursor-pointer transition-all group"
              : "bg-white p-6 rounded-3xl border border-gray-50 hover:border-[#007A7A]/20 hover:premium-shadow cursor-pointer transition-all group";

            return (
              <div
                key={apt.lichHenId}
                onClick={() => onSelect(apt.lichHenId)}
                className={containerClass}
              >
                {/* Header: Badge + Time */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${getBadgeStyle(
                      apt.loaiLichHen,
                    )}`}
                  >
                    {apt.loaiLichHen || "THƯỜNG LỆ"}
                  </span>
                  <span className="text-[12px] font-bold text-gray-400">
                    {formatTime(apt.thoiGianBatDau)}
                  </span>
                </div>

                {/* Title: Tên + Giống loài */}
                <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-[#007A7A] transition-colors mb-2">
                  {apt.tenThuCung}{" "}
                  {apt.giongLoai && (
                    <span className="font-medium text-gray-400 text-base ml-1">
                      ({apt.giongLoai})
                    </span>
                  )}
                </h3>

                {/* Description: Dịch vụ + Ghi chú */}
                <div className="mb-5">
                  <p className="text-sm font-bold text-gray-700 mb-1">
                    {apt.tenDichVu}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {apt.ghiChuKhachHang || "Không có ghi chú thêm."}
                  </p>
                </div>

                {/* Footer: Owner + Code */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-300 text-lg">
                      person
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {apt.tenKhachHang}
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 uppercase">
                    HS #{apt.lichHenId}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

const TabButton = ({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 min-w-[80px] py-4 text-[10px] font-extrabold tracking-[0.1em] border-b-[3px] transition-colors ${
      isActive
        ? "border-[#007A7A] text-[#007A7A]"
        : "border-transparent text-gray-400 hover:text-gray-600"
    }`}
  >
    {label} {count !== undefined && `(${count})`}
  </button>
);

export default AppointmentList;
