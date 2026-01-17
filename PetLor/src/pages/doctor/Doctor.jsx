import React, { useState, useEffect } from "react";
import DoctorSidebar from "./components/DoctorSidebar";
import bookingService from "../../services/bookingService";
import petService from "../../services/petService";

const Doctor = () => {
  // --- STATE ---
  const [appointments, setAppointments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("DA_XAC_NHAN");
  const [petDetail, setPetDetail] = useState(null);
  const [combinedHistory, setCombinedHistory] = useState([]);

  const [loadingAppts, setLoadingAppts] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // --- 1. FETCH APPOINTMENTS ---
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await bookingService.getDoctorAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Lỗi tải lịch hẹn:", error);
      } finally {
        setLoadingAppts(false);
      }
    };
    fetchAppointments();
  }, []);

  const selectedAppointment = appointments.find(
    (p) => p.lichHenId === selectedId
  );

  // --- 2. FETCH PET DETAIL & HISTORY ---
  useEffect(() => {
    const fetchRecord = async () => {
      if (!selectedAppointment?.thuCungId) return;

      setLoadingDetail(true);
      try {
        const data = await petService.getPetMedicalRecord(
          selectedAppointment.thuCungId
        );
        setPetDetail(data);

        const vaccines = (data.lichSuTiemChung || []).map((v) => ({
          type: "VACCINE",
          date: v.ngayTiem,
          title: `Tiêm phòng: ${v.tenVacXin}`,
          note: `${v.ghiChu || ""}. BS: ${v.bacSiThucHien}.`,
        }));

        const exams = (data.lichSuKham || []).map((e) => ({
          type: "EXAM",
          date: e.ngayKham,
          title: e.chanDoan || "Khám bệnh",
          note: `BS: ${e.bacSiKham}. ${e.ghiChu || ""}`,
        }));

        const merged = [...vaccines, ...exams].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setCombinedHistory(merged);
      } catch (err) {
        console.error("Lỗi tải hồ sơ:", err);
        setPetDetail(null);
        setCombinedHistory([]);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchRecord();
  }, [selectedId]);

  // --- HANDLER ---
  const handleCardClick = (id) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  };

  // --- HELPERS ---
  const formatTime = (isoString) =>
    isoString
      ? new Date(isoString).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";
  const formatDate = (isoString) =>
    isoString
      ? new Date(isoString).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const years = Math.abs(
      new Date(Date.now() - birthDate.getTime()).getUTCFullYear() - 1970
    );
    return years < 1 ? "Dưới 1 tuổi" : `${years} tuổi`;
  };

  // Helper lấy Badge Style theo trạng thái/loại
  const getBadgeStyle = (type) => {
    if (type?.includes("Khẩn") || type === "KHAN_CAP") {
      return "bg-[#ef5350]/10 text-[#ef5350]"; // Màu đỏ accent
    } else if (type?.includes("Tái khám")) {
      return "bg-amber-100 text-amber-700";
    }
    return "bg-primary/10 text-primary"; // Màu xanh primary
  };

  // Filter List Logic
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
    (a) => a.trangThaiLichHen === "CHO_XAC_NHAN"
  ).length;
  const countConfirmed = appointments.filter(
    (a) => a.trangThaiLichHen === "DA_XAC_NHAN"
  ).length;
  const countUrgent = appointments.filter((a) =>
    a.loaiLichHen?.includes("Khẩn")
  ).length;

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] font-sans text-[#1A1C1E] overflow-hidden">
      <DoctorSidebar />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* HEADER */}
        <header className="h-24 flex items-center justify-between px-10 bg-white border-b border-gray-50 shrink-0">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0c1d1d] tracking-tight">
              Duyệt lịch hẹn
            </h2>
            <p className="text-sm font-medium text-gray-400 mt-0.5">
              Xin chào Bác sĩ, bạn có{" "}
              <span className="text-primary font-bold">
                {countConfirmed} ca
              </span>{" "}
              đang chờ khám.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">
                search
              </span>
              <input
                className="pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 w-72 placeholder:text-gray-400 outline-none"
                placeholder="Tìm kiếm..."
                type="text"
              />
            </div>
            <button className="flex items-center gap-2 p-3 bg-white border border-gray-100 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* --- CỘT 2: DANH SÁCH --- */}
          <section className="w-[450px] border-r border-gray-100 flex flex-col bg-[#F9FAFB] shrink-0">
            {/* TABS */}
            <div className="flex bg-white px-4 pt-2 shrink-0 border-b border-gray-100 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("CHO_DUYET")}
                className={`flex-1 min-w-[90px] py-5 text-[10px] font-extrabold tracking-wider border-b-4 transition-colors ${
                  activeTab === "CHO_DUYET"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                CHỜ DUYỆT ({countPending})
              </button>
              <button
                onClick={() => setActiveTab("DA_XAC_NHAN")}
                className={`flex-1 min-w-[90px] py-5 text-[10px] font-extrabold tracking-wider border-b-4 transition-colors ${
                  activeTab === "DA_XAC_NHAN"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                ĐÃ XÁC NHẬN ({countConfirmed})
              </button>
              <button
                onClick={() => setActiveTab("KHAN_CAP")}
                className={`flex-1 min-w-[90px] py-5 text-[10px] font-extrabold tracking-wider border-b-4 transition-colors ${
                  activeTab === "KHAN_CAP"
                    ? "border-[#ef5350] text-[#ef5350]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                KHẨN CẤP ({countUrgent})
              </button>
              <button
                onClick={() => setActiveTab("DA_XONG")}
                className={`flex-1 min-w-[90px] py-5 text-[10px] font-extrabold tracking-wider border-b-4 transition-colors ${
                  activeTab === "DA_XONG"
                    ? "border-gray-500 text-gray-500"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                LỊCH SỬ
              </button>
            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
              {loadingAppts ? (
                <div className="text-center py-10 text-gray-400">
                  Đang tải...
                </div>
              ) : displayedList.length === 0 ? (
                <div className="text-center py-10 text-gray-400">Trống</div>
              ) : (
                displayedList.map((apt) => {
                  const isSelected = selectedId === apt.lichHenId;

                  // Xử lý CSS Class cho thẻ (Selected vs Unselected)
                  // Giữ nguyên css gốc bạn yêu cầu: bg-white p-6 rounded-3xl border border-gray-50 hover:border-primary/20 hover:premium-shadow cursor-pointer transition-all group
                  // Chỉ thay đổi border khi Selected
                  const containerClass = isSelected
                    ? "bg-white p-6 rounded-3xl border border-primary ring-1 ring-primary/20 cursor-pointer transition-all group shadow-lg shadow-primary/5"
                    : "bg-white p-6 rounded-3xl border border-gray-50 hover:border-primary/20 hover:shadow-lg cursor-pointer transition-all group";

                  return (
                    <div
                      key={apt.lichHenId}
                      onClick={() => handleCardClick(apt.lichHenId)}
                      className={containerClass}
                    >
                      {/* Badge + Time */}
                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${getBadgeStyle(
                            apt.loaiLichHen
                          )}`}
                        >
                          {apt.loaiLichHen || "Thường lệ"}
                        </span>
                        <span className="text-[12px] font-bold text-gray-400">
                          {formatTime(apt.thoiGianBatDau)}
                        </span>
                      </div>

                      {/* Pet Name */}
                      <h3 className="font-extrabold text-lg text-gray-900">
                        {apt.tenThuCung}{" "}
                        <span className="font-normal text-gray-400 text-sm">
                          ({apt.tenDichVu})
                        </span>
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-500 mb-5 leading-relaxed line-clamp-2">
                        {apt.ghiChuKhachHang || "Chưa có ghi chú chi tiết."}
                      </p>

                      {/* Footer: Owner + ID */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-lg">
                            person
                          </span>
                          <span className="text-xs font-semibold text-gray-700">
                            {apt.tenKhachHang}
                          </span>
                        </div>
                        <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 uppercase">
                          LH #{apt.lichHenId}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* --- CỘT 3: CHI TIẾT BỆNH NHÂN --- */}
          {selectedAppointment ? (
            <section className="flex-1 bg-white flex flex-col overflow-hidden min-w-0">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
                <div className="max-w-4xl mx-auto space-y-12">
                  {/* Header Info */}
                  <div className="flex items-center gap-10">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-primary/10 rounded-[50px] rotate-6 group-hover:rotate-3 transition-transform"></div>
                      <div className="asymmetrical-frame w-48 h-48 bg-white p-2 relative overflow-hidden border border-gray-100 shadow-xl z-10 rounded-[40px_12px_40px_12px]">
                        <img
                          alt="Pet profile"
                          className="w-full h-full object-cover rounded-[inherit]"
                          src={`https://ui-avatars.com/api/?name=${selectedAppointment.tenThuCung}&background=random&size=200`}
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-lg z-20 flex items-center justify-center">
                        <span className="material-symbols-outlined">pets</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                              {selectedAppointment.tenThuCung}
                            </h2>
                            {petDetail && (
                              <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                Giống: {petDetail.giongLoai}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-6 text-sm font-semibold text-gray-500">
                            {petDetail ? (
                              <>
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-base">
                                    cake
                                  </span>{" "}
                                  {calculateAge(petDetail.ngaySinh)}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-base">
                                    scale
                                  </span>{" "}
                                  {petDetail.canNang} kg
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-base">
                                    fingerprint
                                  </span>{" "}
                                  ID: PET-{petDetail.thuCungId}
                                </div>
                              </>
                            ) : (
                              <span className="text-gray-400 italic">
                                Đang tải thông tin chi tiết...
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Thông tin chủ nuôi
                          </p>
                          <p className="text-base font-bold text-gray-900">
                            {selectedAppointment.tenKhachHang}
                          </p>
                          <p className="text-sm font-medium text-primary mt-1">
                            {selectedAppointment.soDienThoaiKhachHang}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 flex gap-3 flex-wrap">
                        <div className="px-4 py-2 bg-accent/5 border border-accent/10 text-accent text-xs font-bold rounded-2xl">
                          {selectedAppointment.tenDichVu}
                        </div>
                        {selectedAppointment.ghiChuKhachHang && (
                          <div className="px-4 py-2 bg-gray-50 border border-gray-100 text-gray-500 text-xs font-bold rounded-2xl">
                            KH: "{selectedAppointment.ghiChuKhachHang}"
                          </div>
                        )}
                        {petDetail?.ghiChuSucKhoe && (
                          <div className="px-4 py-2 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold rounded-2xl">
                            {petDetail.ghiChuSucKhoe}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#cdeaea]" />

                  {/* History Timeline */}
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-extrabold flex items-center gap-3 text-gray-900">
                        <span className="material-symbols-outlined text-primary">
                          history
                        </span>{" "}
                        Lịch sử điều trị
                      </h3>
                      <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                        XEM TOÀN BỘ
                      </button>
                    </div>
                    <div className="space-y-0">
                      {loadingDetail ? (
                        <p className="text-gray-400 italic">
                          Đang tải hồ sơ...
                        </p>
                      ) : combinedHistory.length > 0 ? (
                        combinedHistory.map((rec, i) => (
                          <div key={i} className="flex gap-8 group">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-3 h-3 rounded-full border-2 bg-white z-10 ${
                                  rec.type === "VACCINE"
                                    ? "border-primary"
                                    : "border-primary/40"
                                }`}
                              ></div>
                              <div className="w-0.5 h-full bg-gray-100 group-last:hidden"></div>
                            </div>
                            <div className="pb-10 flex-1">
                              <div className="flex justify-between items-baseline mb-3">
                                <h4 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
                                  {rec.title}
                                </h4>
                                <span className="text-xs font-bold text-gray-400">
                                  {formatDate(rec.date)}
                                </span>
                              </div>
                              <div className="p-5 bg-[#F9FAFB] rounded-[20px] border border-gray-100/50">
                                <p className="text-sm text-gray-500 leading-relaxed">
                                  {rec.note}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          Chưa có lịch sử điều trị.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Doctor Notes */}
                  <div className="bg-primary/5 rounded-4xl p-8 border border-primary/10">
                    <h3 className="text-lg font-extrabold mb-6 flex items-center gap-3 text-gray-900">
                      <span className="material-symbols-outlined text-primary">
                        edit_square
                      </span>{" "}
                      Ghi chú sơ bộ từ Bác sĩ
                    </h3>
                    <textarea
                      className="w-full bg-white border-none rounded-3xl p-6 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 shadow-sm outline-none resize-none"
                      placeholder="Viết chẩn đoán dự kiến hoặc lưu ý quan trọng tại đây..."
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="h-28 flex items-center justify-between px-12 bg-white border-t border-gray-50 shrink-0">
                <div className="flex gap-4">
                  {selectedAppointment.trangThaiLichHen === "CHO_XAC_NHAN" && (
                    <button className="px-10 h-14 bg-primary text-white rounded-full font-extrabold text-sm tracking-wide shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                      CHẤP NHẬN LỊCH
                    </button>
                  )}
                  {selectedAppointment.trangThaiLichHen === "DA_XAC_NHAN" && (
                    <button className="px-10 h-14 bg-green-600 text-white rounded-full font-extrabold text-sm tracking-wide shadow-xl shadow-green-600/20 hover:scale-[1.02] active:scale-95 transition-all">
                      HOÀN THÀNH KHÁM
                    </button>
                  )}
                  <button className="px-8 h-14 border border-gray-200 text-gray-600 rounded-full font-bold text-sm hover:bg-gray-50 transition-all">
                    THÊM THÔNG TIN
                  </button>
                </div>
                <button className="px-8 h-14 text-gray-400 hover:text-[#ef5350] rounded-full font-bold text-sm flex items-center gap-2 transition-all">
                  <span className="material-symbols-outlined">redo</span> CHUYỂN
                  KHOA
                </button>
              </div>
            </section>
          ) : (
            // --- EMPTY STATE ---
            <section className="flex-1 bg-[#F9FAFB] flex items-center justify-center p-12">
              <div className="text-center max-w-md">
                <div className="mb-8 relative flex justify-center">
                  <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] relative z-10">
                    <div className="w-48 h-48 bg-primary/5 rounded-full flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-primary/20"
                        style={{ fontSize: "100px" }}
                      >
                        clinical_notes
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                      <span className="material-symbols-outlined text-3xl">
                        pets
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-0 -left-4 w-12 h-12 bg-teal-100 rounded-full blur-xl opacity-60"></div>
                  <div className="absolute bottom-0 -right-4 w-16 h-16 bg-primary/20 rounded-full blur-xl opacity-60"></div>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0c1d1d] mb-3 tracking-tight">
                  Sẵn sàng để tư vấn
                </h3>
                <p className="text-gray-400 font-medium leading-relaxed">
                  Chọn một lịch hẹn để xem chi tiết hồ sơ bệnh án và lịch sử
                  điều trị của thú cưng.
                </p>
                <div className="mt-8">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-primary shadow-sm">
                    <span className="material-symbols-outlined text-lg">
                      arrow_back
                    </span>
                    Chọn từ danh sách bên trái
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Doctor;
