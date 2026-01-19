import React, { useState, useEffect } from "react";
import bookingService from "../../../services/bookingService";
import petService from "../../../services/petService";

// Tái sử dụng component hiển thị (hoặc tạo bản sao mới nếu giao diện Spa khác biệt quá nhiều)
import AppointmentList from "../doctor/components/AppointmentList";
import PatientDetail from "../doctor/components/PatientDetail";

const SpaSchedule = () => {
  // --- State quản lý dữ liệu ---
  const [appointments, setAppointments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("DA_XAC_NHAN");

  // --- State chi tiết thú cưng ---
  const [petDetail, setPetDetail] = useState(null);
  const [combinedHistory, setCombinedHistory] = useState([]);

  // --- State loading ---
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 1. Fetch danh sách lịch hẹn SPA khi vào trang
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoadingAppts(true);
      try {
        // THAY ĐỔI: Gọi API lấy lịch Spa thay vì lịch khám
        const data = await bookingService.getSpaAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Lỗi tải lịch Spa:", error);
      } finally {
        setLoadingAppts(false);
      }
    };
    fetchAppointments();
  }, []);

  // Tìm object lịch hẹn hiện tại
  const selectedAppointment = appointments.find(
    (p) => p.lichHenId === selectedId,
  );

  // 2. Fetch chi tiết và lịch sử làm đẹp
  useEffect(() => {
    const fetchRecord = async () => {
      if (!selectedAppointment?.thuCungId) {
        setPetDetail(null);
        setCombinedHistory([]);
        return;
      }

      setLoadingDetail(true);
      try {
        // Vẫn lấy thông tin thú cưng để xem dị ứng, tính cách...
        const data = await petService.getPetMedicalRecord(
          selectedAppointment.thuCungId,
        );
        setPetDetail(data);

        // THAY ĐỔI: Xử lý lịch sử dành cho Spa
        // Nhân viên Spa quan tâm: Kiểu cắt lông cũ, loại dầu gội đã dùng, phản ứng da...
        // Giả sử API trả về mảng 'lichSuSuDungDichVu' (Service Usage History)

        const spaHistory = (data.lichSuSuDungDichVu || [])
          .filter((s) => s.loaiDichVu === "SPA" || s.loaiDichVu === "GROOMING") // Lọc chỉ lấy dịch vụ Spa
          .map((s) => ({
            type: "SPA",
            date: s.ngaySuDung,
            title: `Dịch vụ: ${s.tenDichVu}`,
            // Hiển thị người thực hiện và ghi chú (vd: cắt ngắn 2cm, khách khó tính...)
            note: `${s.ghiChu || ""} - NV: ${s.nhanVienThucHien}`,
          }));

        // Có thể vẫn cần hiển thị lưu ý Y tế quan trọng (Ví dụ: Dị ứng thuốc/dầu gội)
        const alerts = (data.luuYYTe || []).map((a) => ({
          type: "ALERT",
          date: a.ngayTao,
          title: "CẢNH BÁO SỨC KHỎE",
          note: a.noiDung, // VD: Dị ứng xà phòng, da nhạy cảm
        }));

        // Sắp xếp theo thời gian mới nhất
        const sortedHistory = [...spaHistory, ...alerts].sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );

        setCombinedHistory(sortedHistory);
      } catch (err) {
        console.error("Lỗi tải thông tin thú cưng:", err);
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
      {/* Cột trái: Danh sách lịch Spa */}
      <AppointmentList
        title="Lịch Spa & Grooming" // Có thể truyền props title để đổi tên header
        appointments={appointments}
        selectedId={selectedId}
        onSelect={handleSelect}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        loading={loadingAppts}
        type="SPA" // Truyền type để AppointmentList render icon/màu sắc phù hợp
      />

      {/* Cột phải: Chi tiết & Lịch sử làm đẹp */}
      <PatientDetail
        appointment={selectedAppointment}
        petDetail={petDetail}
        history={combinedHistory}
        loadingDetail={loadingDetail}
        titleHistory="Lịch sử làm đẹp" // Đổi tiêu đề phần lịch sử
      />
    </div>
  );
};

export default SpaSchedule;
