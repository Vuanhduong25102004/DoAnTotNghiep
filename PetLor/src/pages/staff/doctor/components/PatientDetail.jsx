import React, { useState } from "react";
import bookingService from "../../../../services/bookingService";

// Thêm prop onRefresh để gọi lại dữ liệu sau khi thao tác xong
const PatientDetail = ({
  appointment,
  petDetail,
  history,
  loadingDetail,
  onRefresh,
}) => {
  const API_URL = "http://localhost:8080/uploads/";

  // State để quản lý trạng thái loading khi đang gọi API
  const [isProcessing, setIsProcessing] = useState(false);

  // Trong file PatientDetail.js

  // ...
  const handleConfirmAppointment = async () => {
    // SỬA LẠI: Đổi id -> lichHenId
    if (!appointment?.lichHenId) {
      return;
    }

    const isConfirmed = window.confirm(
      `Bác sĩ xác nhận tiếp nhận lịch hẹn #${appointment.lichHenId}?`,
    );
    if (!isConfirmed) return;

    setIsProcessing(true);
    try {
      await bookingService.confirmDoctorAppointment(appointment.lichHenId);

      alert("Đã tiếp nhận lịch hẹn thành công!");

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Lỗi xác nhận lịch hẹn:", error);
      alert("Có lỗi xảy ra khi xác nhận.");
    } finally {
      setIsProcessing(false);
    }
  };
  // Hàm xử lý lấy URL ảnh
  const getPetImage = () => {
    if (petDetail?.hinhAnh) {
      // Nếu có ảnh thật từ DB -> Ghép với domain server
      return `${API_URL}${petDetail.hinhAnh}`;
    }
    // Nếu không có -> Dùng Avatar tạo tự động theo tên
    return `https://ui-avatars.com/api/?name=${appointment.tenThuCung}&background=random&size=300`;
  };

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
    const years = Math.abs(
      new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970,
    );
    return years < 1 ? "Dưới 1 tuổi" : `${years} tuổi`;
  };

  // --- EMPTY STATE ---
  if (!appointment) {
    return (
      <section className="flex-1 bg-white flex items-center justify-center p-8 overflow-hidden text-center font-sans">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-56 h-56 bg-gray-50 rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[#2a9d8f]/5 rounded-full scale-110 -z-10 animate-pulse"></div>
              <div className="w-40 h-40 bg-white rounded-full shadow-sm flex items-center justify-center relative">
                <span
                  className="material-symbols-outlined text-gray-200"
                  style={{ fontSize: "5rem" }}
                >
                  content_paste
                </span>
                <div className="absolute bottom-1 right-1 bg-[#2a9d8f] p-3 rounded-2xl shadow-lg border-4 border-white">
                  <span className="material-symbols-outlined text-white text-2xl">
                    pets
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Sẵn sàng để tư vấn
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 px-4 font-medium">
            Chọn một lịch hẹn để xem chi tiết hồ sơ bệnh án và lịch sử điều trị.
          </p>
          <div className="group flex items-center gap-2 px-6 h-12 bg-white border border-gray-300 rounded-full text-gray-600 font-bold text-sm hover:bg-[#2a9d8f] hover:text-white hover:border-[#007A7A] transition-all premium-shadow cursor-default">
            <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">
              west
            </span>
            Chọn từ danh sách bên trái
          </div>
        </div>
      </section>
    );
  }

  // --- DETAIL VIEW ---
  return (
    <section className="flex-1 bg-white flex flex-col overflow-hidden min-w-0 font-sans">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto p-8 py-10 space-y-8">
          {/* 1. HEADER INFO */}
          <div className="flex items-start gap-8">
            <div className="relative shrink-0">
              <div className="absolute -inset-4 bg-[#007A7A]/5 rounded-[40px] rotate-6"></div>
              <div className="asymmetrical-frame w-40 h-40 bg-white p-2 relative overflow-hidden border border-gray-100 shadow-xl z-10 rounded-[30px_10px_30px_10px]">
                <img
                  alt="Pet profile"
                  className="w-full h-full object-cover rounded-[inherit]"
                  src={getPetImage()}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${appointment.tenThuCung}&background=random&size=300`;
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#2a9d8f] text-white p-3 rounded-2xl shadow-xl z-20 border-4 border-white flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">pets</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-extrabold text-[#0c1d1d] tracking-tight">
                      {appointment.tenThuCung}
                    </h2>
                    {petDetail && (
                      <span className="px-3 py-1 bg-[#007A7A]/10 text-[#007A7A] text-[10px] font-black rounded-full tracking-wider uppercase">
                        Giống: {petDetail.giongLoai}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-xs font-bold text-gray-400 mt-3">
                    {petDetail ? (
                      <>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#007A7A] text-base">
                            cake
                          </span>{" "}
                          {calculateAge(petDetail.ngaySinh)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#007A7A] text-base">
                            scale
                          </span>{" "}
                          {petDetail.canNang} kg
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#007A7A] text-base">
                            fingerprint
                          </span>{" "}
                          ID: {petDetail.thuCungId}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Đang tải...</span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50/80 p-4 px-6 rounded-2xl border border-gray-100 text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    CHỦ NUÔI
                  </p>
                  <p className="text-base font-extrabold text-gray-900">
                    {appointment.tenKhachHang}
                  </p>
                  <p className="text-xs font-bold text-[#007A7A] mt-0.5">
                    {appointment.soDienThoaiKhachHang}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-2 flex-wrap">
                <div className="px-4 py-2 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-3xl border border-gray-100">
                  Dịch vụ: {appointment.tenDichVu}
                </div>
                {appointment.ghiChuKhachHang && (
                  <div className="px-4 py-2 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-3xl border border-amber-100/50">
                    KH: "{appointment.ghiChuKhachHang}"
                  </div>
                )}
                {petDetail?.ghiChuSucKhoe && (
                  <div className="px-4 py-2 bg-red-50 text-red-600 text-[11px] font-bold rounded-3xl border border-red-100/50">
                    {petDetail.ghiChuSucKhoe}
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 2. HISTORY TIMELINE */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold flex items-center gap-2 text-[#0c1d1d]">
                <span className="material-symbols-outlined text-[#007A7A] text-2xl">
                  history
                </span>{" "}
                Lịch sử điều trị
              </h3>
              <button className="text-[10px] font-bold text-[#007A7A] hover:underline tracking-widest">
                XEM TOÀN BỘ
              </button>
            </div>
            <div className="space-y-0 px-1">
              {loadingDetail ? (
                <p className="text-gray-400 italic text-sm">
                  Đang tải hồ sơ...
                </p>
              ) : history.length > 0 ? (
                history.map((rec, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div
                        className={`size-3 rounded-full border-[2px] bg-white z-10 shadow-sm ${
                          rec.type === "VACCINE"
                            ? "border-[#007A7A]"
                            : "border-gray-300"
                        }`}
                      ></div>
                      <div className="w-[1px] h-full bg-gray-100 group-last:hidden"></div>
                    </div>
                    <div className="pb-8 flex-1">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                          {rec.title}
                        </h4>
                        <span className="text-[11px] font-bold text-gray-400">
                          {formatDate(rec.date)}
                        </span>
                      </div>
                      <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                          {rec.note}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Chưa có lịch sử điều trị.
                </p>
              )}
            </div>
          </div>

          {/* 3. DOCTOR NOTES */}
          <div className="bg-[#007A7A]/[0.03] rounded-3xl p-6 border border-[#007A7A]/5">
            <h3 className="text-base font-extrabold mb-4 flex items-center gap-2 text-[#0c1d1d]">
              <span className="material-symbols-outlined text-[#007A7A] text-xl">
                edit_square
              </span>{" "}
              Ghi chú sơ bộ từ Bác sĩ
            </h3>
            <textarea
              className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-[#007A7A]/5 focus:border-[#007A7A]/20 placeholder:text-gray-300 shadow-sm transition-all outline-none resize-none"
              placeholder="Viết chẩn đoán dự kiến hoặc lưu ý quan trọng tại đây..."
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>

      {/* 4. FOOTER ACTIONS */}
      <div className="h-20 flex items-center justify-between px-8 bg-white border-t border-gray-100 shrink-0">
        <div className="flex gap-3">
          {appointment.trangThaiLichHen === "CHO_XAC_NHAN" && (
            <button
              onClick={handleConfirmAppointment}
              disabled={isProcessing}
              className={`px-6 h-11 bg-[#2a9d8f] text-white rounded-full font-bold text-xs tracking-wider shadow-lg shadow-[#007A7A]/20 hover:bg-[#007A7A]/90 hover:scale-[1.02] active:scale-95 transition-all ${isProcessing ? "opacity-70 cursor-wait" : ""}`}
            >
              {isProcessing ? "ĐANG XỬ LÝ..." : "CHẤP NHẬN"}
            </button>
          )}
          {appointment.trangThaiLichHen === "DA_XAC_NHAN" && (
            <button className="px-6 h-11 bg-[#2a9d8f] text-white rounded-full font-bold text-xs tracking-wider shadow-lg shadow-green-600/20 hover:scale-[1.02] active:scale-95 transition-all">
              HOÀN THÀNH
            </button>
          )}
          <button className="px-5 h-11 border border-gray-200 text-gray-500 rounded-full font-bold text-xs tracking-wide hover:bg-gray-50 transition-all">
            THÊM TT
          </button>
        </div>
        <button className="px-5 h-11 text-gray-400 hover:text-[#ef5350] rounded-full font-bold text-xs flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined text-lg">redo</span> CHUYỂN
          KHOA
        </button>
      </div>
    </section>
  );
};

export default PatientDetail;
