import React, { useState, useEffect } from "react";
import bookingService from "../../../services/bookingService";
import petService from "../../../services/petService";

import AppointmentList from "./components/AppointmentList";
import PatientDetail from "./components/PatientDetail";

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("CHO_DUYET");
  const [petDetail, setPetDetail] = useState(null);
  const [combinedHistory, setCombinedHistory] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

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

  useEffect(() => {
    fetchAppointments();
  }, []);

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

        // --- CHỈ LẤY LỊCH SỬ TIÊM CHỦNG ---
        const vaccines = (data.lichSuTiemChung || []).map((v) => ({
          type: "VACCINE",
          date: v.ngayTiem,
          title: `Tiêm: ${v.tenVacXin}`,
          // Sử dụng bacSiThucHien theo đúng log dữ liệu của bạn
          note: `${v.ghiChu || ""} - BS: ${v.bacSiThucHien || "Hệ thống"}`,
        }));

        // Sắp xếp theo ngày mới nhất
        const sortedHistory = [...vaccines].sort(
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
  }, [selectedId, selectedAppointment]);

  const handleSelect = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F9FAFB]">
      <AppointmentList
        appointments={appointments}
        selectedId={selectedId}
        onSelect={handleSelect}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        loading={loadingAppts}
      />
      <PatientDetail
        appointment={selectedAppointment}
        petDetail={petDetail}
        history={combinedHistory}
        loadingDetail={loadingDetail}
        onRefresh={fetchAppointments}
      />
    </div>
  );
};

export default DoctorSchedule;
