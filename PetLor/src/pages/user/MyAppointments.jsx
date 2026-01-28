import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import bookingService from "../../services/bookingService";
import CancelAppointmentModal from "./modals/CancelAppointmentModal";
import AppointmentDetailModal from "./modals/AppointmentDetailModal";
import { toast } from "react-toastify"; // 1. Import toast

import { renderStatusBadge } from "../../utils/formatters";
import AOS from "aos";

const MyAppointments = () => {
  const [user] = useOutletContext();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("Sắp tới");
  const [loading, setLoading] = useState(true);

  // --- States cho hủy đơn ---
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- States cho xem chi tiết ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const statusMap = {
    "Sắp tới": "DA_XAC_NHAN",
    "Chờ xác nhận": "CHO_XAC_NHAN",
    "Đã hoàn thành": "DA_HOAN_THANH",
    "Đã hủy": "DA_HUY",
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyAppointments();
      setAppointments(res.data || res);
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    bookingService
      .getCancelReasons()
      .then((res) => setCancelReasons(res.data || res));
    AOS.init({ duration: 800 });
  }, []);

  // --- Handlers ---
  const handleOpenDetail = async (id) => {
    setShowDetailModal(true);
    setLoadingDetail(true);
    setTimeout(() => AOS.refresh(), 50);

    try {
      const res = await bookingService.getAppointmentById(id);
      setAppointmentDetail(res.data || res);
    } catch (error) {
      console.error(error);
      setShowDetailModal(false);
      toast.error("Không thể tải chi tiết lịch hẹn."); // Thêm toast lỗi
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenCancelModal = (appointment) => {
    setAppointmentToCancel(appointment);
    setSelectedReason("");
    setShowCancelModal(true);
    setTimeout(() => AOS.refresh(), 50);
  };

  const handleConfirmCancel = async () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    try {
      await bookingService.cancelMyAppointment(appointmentToCancel.lichHenId, {
        lyDoHuy: selectedReason,
      });
      setShowCancelModal(false);
      fetchData();
      // 2. Thay alert bằng toast success
      toast.success("Hủy lịch hẹn thành công!");
    } catch (error) {
      // 3. Thay alert bằng toast error
      toast.error(error.response?.data?.message || "Lỗi khi hủy lịch hẹn");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = appointments.filter(
    (a) => a.trangThaiLichHen === statusMap[activeTab],
  );

  return (
    <main className="flex-1 space-y-6 animate-fade-in pb-20">
      {/* HEADER */}
      <div
        className="bg-white rounded-3xl p-8 shadow-sm relative overflow-hidden border border-gray-100 isolate"
        data-aos="fade-down"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#2a9d8f]/10 to-transparent opacity-60"></div>
        <span className="material-symbols-outlined absolute -right-6 -bottom-8 text-9xl text-[#2a9d8f]/5 rotate-12 select-none">
          calendar_month
        </span>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Quản lý <span className="text-[#10B981]">lịch hẹn</span>
            </h1>
            <p className="text-gray-500 text-lg">
              Theo dõi hành trình chăm sóc sức khỏe cho thú cưng.
            </p>
          </div>
          <button className="bg-[#10B981] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined">add</span> Đặt lịch mới
          </button>
        </div>
      </div>

      {/* TABS */}
      <div
        className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 inline-flex flex-wrap gap-1"
        data-aos="fade-up"
      >
        {Object.keys(statusMap).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-2xl text-sm font-bold transition whitespace-nowrap ${
              activeTab === tab
                ? "bg-[#2a9d8f] text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-4" data-aos="fade-up">
        {loading ? (
          <div className="text-center py-10 animate-pulse text-gray-400">
            Đang tải...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.lichHenId}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-all"
            >
              {/* Ngày tháng */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center bg-blue-50 text-blue-600 w-20 h-20 rounded-2xl border border-blue-100 font-bold">
                <span className="text-[10px] uppercase opacity-70">
                  Tháng {new Date(item.thoiGianBatDau).getMonth() + 1}
                </span>
                <span className="text-2xl">
                  {new Date(item.thoiGianBatDau).getDate()}
                </span>
              </div>

              {/* Thông tin giữa */}
              <div className="flex-grow min-w-0 w-full">
                <h3 className="font-bold text-xl text-gray-900 mb-2 truncate">
                  {item.tenDichVu}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {renderStatusBadge(item.trangThaiLichHen)}
                  <div className="h-4 w-[1px] bg-gray-200 hidden md:block"></div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">
                      person
                    </span>
                    {item.tenNhanVien || "Đang xử lý"}
                  </p>
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-[#10B981]">
                      pets
                    </span>
                    {item.tenThuCung || "N/A"}
                  </p>
                </div>

                {activeTab === "Đã hủy" && (
                  <div className="mt-4 flex items-center gap-3 bg-red-50/60 p-3 rounded-2xl border border-red-100">
                    <span className="material-symbols-outlined text-red-500 text-[20px] flex-shrink-0">
                      info
                    </span>
                    <p className="text-sm text-red-600 font-bold leading-none flex items-center">
                      <span className="opacity-80 font-medium mr-1">
                        Lý do:
                      </span>
                      <span>{item.lyDoHuy || "Khách hàng yêu cầu hủy"}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Nút bấm */}
              <div className="flex md:flex-col gap-2 w-full md:w-32 flex-shrink-0">
                <button
                  onClick={() => handleOpenDetail(item.lichHenId)}
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  Chi tiết
                </button>
                {(item.trangThaiLichHen === "CHO_XAC_NHAN" ||
                  item.trangThaiLichHen === "DA_XAC_NHAN") && (
                  <button
                    onClick={() => handleOpenCancelModal(item)}
                    className="flex-1 px-4 py-2 rounded-xl text-sm font-bold border border-red-100 text-red-500 hover:bg-red-50 transition-all"
                  >
                    Hủy hẹn
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center text-gray-400">
            Trống.
          </div>
        )}
      </div>

      {/* MODALS */}
      <AppointmentDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        detail={appointmentDetail}
        loading={loadingDetail}
      />

      <CancelAppointmentModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        reasons={cancelReasons}
        selectedReason={selectedReason}
        onSelectReason={setSelectedReason}
        onConfirm={handleConfirmCancel}
        isSubmitting={isSubmitting}
      />
    </main>
  );
};

export default MyAppointments;
