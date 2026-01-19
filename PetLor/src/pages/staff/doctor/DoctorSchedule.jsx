import React, { useState, useEffect } from "react";
import bookingService from "../../../services/bookingService";
import petService from "../../../services/petService";

import AppointmentList from "./components/AppointmentList";
import PatientDetail from "./components/PatientDetail";

const DoctorSchedule = () => {
  // --- State quản lý dữ liệu ---
  const [appointments, setAppointments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("CHO_DUYET");

  // --- State chi tiết bệnh án ---
  const [petDetail, setPetDetail] = useState(null);
  const [combinedHistory, setCombinedHistory] = useState([]);

  // --- State loading ---
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // --- 1. KHAI BÁO HÀM FETCH DATA RA NGOÀI (Để có thể gọi lại) ---
  const fetchAppointments = async () => {
    setLoadingAppts(true);
    try {
      const data = await bookingService.getDoctorAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
    } finally {
      setLoadingAppts(false);
    }
  };

  // --- 2. GỌI FETCH KHI VÀO TRANG ---
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Tìm object lịch hẹn hiện tại
  const selectedAppointment = appointments.find(
    (p) => p.lichHenId === selectedId,
  );

  // 3. Fetch chi tiết hồ sơ bệnh án khi selectedId thay đổi
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

        // Xử lý gộp lịch sử
        const vaccines = (data.lichSuTiemChung || []).map((v) => ({
          type: "VACCINE",
          date: v.ngayTiem,
          title: `Tiêm: ${v.tenVacXin}`,
          note: `${v.ghiChu || ""} - BS: ${v.bacSiThucHien}`,
        }));

        const exams = (data.lichSuKham || []).map((e) => ({
          type: "EXAM",
          date: e.ngayKham,
          title: e.chanDoan,
          note: `BS: ${e.bacSiKham}`,
        }));

        const sortedHistory = [...vaccines, ...exams].sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );

        setCombinedHistory(sortedHistory);
      } catch (err) {
        console.error("Lỗi tải hồ sơ bệnh án:", err);
        setPetDetail(null);
        setCombinedHistory([]);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchRecord();
  }, [selectedId, selectedAppointment]); // Lưu ý: selectedAppointment thay đổi khi fetchAppointments chạy lại

  const handleSelect = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F9FAFB]">
      {/* Cột trái */}
      <AppointmentList
        appointments={appointments}
        selectedId={selectedId}
        onSelect={handleSelect}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        loading={loadingAppts}
      />

      {/* Cột phải: QUAN TRỌNG - THÊM onRefresh */}
      <PatientDetail
        appointment={selectedAppointment}
        petDetail={petDetail}
        history={combinedHistory}
        loadingDetail={loadingDetail}
        onRefresh={fetchAppointments}
      />
      {/* ^^^ Dòng trên: Truyền hàm fetchAppointments xuống để nút Confirm gọi lại */}
    </div>
  );
};

export default DoctorSchedule;
