import React, { useState, useEffect } from "react";
import bookingService from "../../../services/bookingService";
import petService from "../../../services/petService";

import AppointmentList from "../doctor/components/AppointmentList";
import PatientDetail from "../doctor/components/PatientDetail";

const SpaSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("DA_XAC_NHAN");

  const [petDetail, setPetDetail] = useState(null);
  const [combinedHistory, setCombinedHistory] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // --- 1. HÀM FETCH DỮ LIỆU ---
  const fetchAppointments = async () => {
    setLoadingAppts(true);
    try {
      // Dùng endpoint chính xác cho Bác sĩ/Spa
      const data = await bookingService.getDoctorAppointments();
      setAppointments(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Lỗi tải lịch Spa:", error);
    } finally {
      setLoadingAppts(false);
    }
  };

  // --- 2. HÀM XỬ LÝ KHI UPDATE THÀNH CÔNG ---
  // Hàm này được truyền xuống PatientDetail
  const handleRefreshAfterAction = async (newTab) => {
    // 1. Tải lại dữ liệu mới nhất
    await fetchAppointments();

    // 2. Bỏ chọn lịch hẹn hiện tại (để màn hình chi tiết reset)
    setSelectedId(null);

    // 3. Nếu có yêu cầu chuyển tab (ví dụ: Chấp nhận xong -> chuyển sang tab Đã duyệt)
    if (newTab) {
      setActiveTab(newTab);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Logic tìm appointment và fetch chi tiết thú cưng (Giữ nguyên như cũ)
  const selectedAppointment = appointments.find(
    (p) => p.lichHenId === selectedId,
  );

  useEffect(() => {
    const fetchRecord = async () => {
      if (!selectedAppointment?.thuCungId) {
        setPetDetail(null);
        setCombinedHistory([]);
        return;
      }
      setLoadingDetail(true);
      try {
        const data = await petService.getPetMedicalRecord(
          selectedAppointment.thuCungId,
        );
        setPetDetail(data);

        // Logic xử lý lịch sử (Rút gọn cho dễ nhìn)
        const spaHistory = (data.lichSuSuDungDichVu || [])
          .filter((s) => ["SPA", "GROOMING"].includes(s.loaiDichVu))
          .map((s) => ({
            type: "SPA",
            date: s.ngaySuDung,
            title: s.tenDichVu,
            note: s.ghiChu,
          }));
        const alerts = (data.luuYYTe || []).map((a) => ({
          type: "ALERT",
          date: a.ngayTao,
          title: "CẢNH BÁO",
          note: a.noiDung,
        }));

        setCombinedHistory(
          [...spaHistory, ...alerts].sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          ),
        );
      } catch (err) {
        setPetDetail(null);
        setCombinedHistory([]);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchRecord();
  }, [selectedId, selectedAppointment]); // Dependencies quan trọng

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F9FAFB]">
      <AppointmentList
        title="Lịch Spa & Grooming"
        appointments={appointments}
        selectedId={selectedId}
        onSelect={setSelectedId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        loading={loadingAppts}
        type="SPA"
      />

      <PatientDetail
        appointment={selectedAppointment}
        petDetail={petDetail}
        history={combinedHistory}
        loadingDetail={loadingDetail}
        titleHistory="Lịch sử làm đẹp"
        // TRUYỀN HÀM XỬ LÝ MỚI XUỐNG
        onRefresh={handleRefreshAfterAction}
      />
    </div>
  );
};

export default SpaSchedule;
