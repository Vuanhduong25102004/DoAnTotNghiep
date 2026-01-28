import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bookingService from "../services/bookingService";
import authService from "../services/authService";
import petService from "../services/petService";

// --- 1. IMPORT TOASTIFY ---
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- CONSTANTS ---
const API_BASE_URL = "http://localhost:8080";
const IMAGE_BASE_URL = "http://localhost:8080/uploads";

const Booking = () => {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Dữ liệu từ API
  const [apiData, setApiData] = useState({
    categories: [],
    services: [],
    myPets: [],
  });

  // Trạng thái Form
  const [form, setForm] = useState({
    petName: "",
    petType: "",
    serviceId: null,
    activeCategory: "ALL",
    selectedPetId: null,
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    note: "",
  });

  // Trạng thái Thời gian
  const [dateTime, setDateTime] = useState({
    date: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    time: "",
    viewDate: new Date(),
  });

  // Auth Logic
  const [currentUserId] = useState(authService.getCurrentUserId());
  const isGuest = !currentUserId;

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, serRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/danh-muc-dich-vu`),
          axios.get(`${API_BASE_URL}/api/dich-vu?size=100`),
        ]);

        let petsData = [];
        if (!isGuest) {
          try {
            const petsRes = await petService.getMyPets();
            if (Array.isArray(petsRes)) petsData = petsRes;
            else if (petsRes.data && Array.isArray(petsRes.data))
              petsData = petsRes.data;
            else if (petsRes.content) petsData = petsRes.content;
          } catch (e) {
            console.error("Lỗi lấy pet:", e);
          }
        }

        setApiData({
          categories: Array.isArray(catRes.data) ? catRes.data : [],
          services: serRes.data?.content || serRes.data || [],
          myPets: petsData,
        });
      } catch (error) {
        console.error("Init Error:", error);
        toast.error("Lỗi kết nối máy chủ!"); // Thay alert nếu có lỗi init
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [isGuest]);

  // --- LOGIC & HELPERS ---
  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectPet = (pet) => {
    if (form.selectedPetId === pet.thuCungId) {
      setForm((prev) => ({
        ...prev,
        selectedPetId: null,
        petName: "",
        petType: "Chó",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        selectedPetId: pet.thuCungId,
        petName: pet.tenThuCung,
        petType: pet.chungLoai || "Chó",
      }));
    }
  };

  const handlePetNameChange = (e) => {
    updateForm("petName", e.target.value);
    if (form.selectedPetId) updateForm("selectedPetId", null);
  };

  const filteredServices = useMemo(() => {
    if (form.activeCategory === "ALL") return apiData.services;
    return apiData.services.filter(
      (s) => s.danhMucDvId === form.activeCategory,
    );
  }, [apiData.services, form.activeCategory]);

  const selectedServiceObj = apiData.services.find(
    (s) => s.dichVuId === form.serviceId,
  );
  const finalPrice = selectedServiceObj ? selectedServiceObj.giaDichVu : 0;

  const selectedPetImg = useMemo(() => {
    const pet = apiData.myPets.find((p) => p.thuCungId === form.selectedPetId);
    return pet?.hinhAnh ? `${IMAGE_BASE_URL}/${pet.hinhAnh}` : null;
  }, [form.selectedPetId, apiData.myPets]);

  // --- CALENDAR LOGIC ---
  const viewYear = dateTime.viewDate.getFullYear();
  const viewMonth = dateTime.viewDate.getMonth();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => {
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1;
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const startDayIndex = getFirstDayOfMonth(viewYear, viewMonth);

  const handleMonthChange = (direction) => {
    setDateTime((prev) => ({
      ...prev,
      viewDate: new Date(viewYear, viewMonth + direction, 1),
    }));
  };

  const handleDateClick = (day) => {
    setDateTime((prev) => ({
      ...prev,
      date: day,
      month: viewMonth + 1,
      year: viewYear,
      time: null,
    }));
  };

  // --- TIME SLOT LOGIC ---
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 8; i <= 18; i++) {
      const h = i.toString().padStart(2, "0");
      slots.push(`${h}:00`);
      if (i < 18) slots.push(`${h}:30`);
    }
    return slots;
  }, []);

  const isTimeSlotAvailable = (slot) => {
    const targetDate = new Date(
      dateTime.year,
      dateTime.month - 1,
      dateTime.date,
    );
    const now = new Date();
    const targetZero = new Date(targetDate).setHours(0, 0, 0, 0);
    const todayZero = new Date().setHours(0, 0, 0, 0);

    if (targetZero < todayZero) return false;
    if (targetZero > todayZero) return true;

    const [h, m] = slot.split(":").map(Number);
    const slotTime = new Date().setHours(h, m, 0, 0);
    return slotTime > now.getTime();
  };

  // --- 6. SUBMIT (ĐÃ SỬA DÙNG TOAST) ---
  const handleBooking = async (e) => {
    e.preventDefault();
    // Thay alert bằng toast.warn cho validation
    if (!form.serviceId) {
      return toast.warn("Vui lòng chọn dịch vụ! 🛠️");
    }
    if (isGuest && (!form.guestName || !form.guestPhone)) {
      return toast.warn("Vui lòng nhập thông tin liên hệ! 📞");
    }
    if (!dateTime.time) {
      return toast.warn("Vui lòng chọn khung giờ! ⏰");
    }

    setLoading(true);
    try {
      const formattedDate = `${dateTime.year}-${String(dateTime.month).padStart(
        2,
        "0",
      )}-${String(dateTime.date).padStart(2, "0")}`;
      const thoiGianBatDau = `${formattedDate}T${dateTime.time}:00`;

      const commonData = {
        tenThuCung: form.petName,
        chungLoai: form.petType,
        dichVuId: form.serviceId,
        nhanVienId: null,
        thoiGianBatDau: thoiGianBatDau,
      };

      if (isGuest) {
        await bookingService.createBookingGuest({
          ...commonData,
          tenKhachHang: form.guestName,
          soDienThoaiKhachHang: form.guestPhone,
          emailKhachHang: form.guestEmail,
          ghiChuKhachHang: form.note,
        });
      } else {
        await bookingService.createBookingUser({
          ...commonData,
          userId: currentUserId,
          thuCungId: form.selectedPetId,
          ghiChuKhachHang: form.note,
        });
      }

      // Thay alert bằng toast.success
      toast.success("Đặt lịch thành công! 🐾", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/"), // Chuyển trang sau khi toast đóng
      });

      // Hoặc nếu muốn chuyển ngay:
      // navigate("/");
    } catch (error) {
      // Thay alert bằng toast.error
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  if (initialLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold bg-stone-50">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 mt-15">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Đặt lịch khám tại PetLor !
            </h1>
            <p className="text-gray-500 text-base">
              Dịch vụ chăm sóc thú cưng chuyên nghiệp.
            </p>
          </div>
          {!isGuest && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 shadow-sm">
              <span className="material-symbols-outlined text-lg">
                verified
              </span>
              <span className="text-sm font-bold">Thành viên PetLor</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-10">
          <form className="space-y-10">
            {/* ... (Phần nội dung Form giữ nguyên không đổi) ... */}

            {/* Code form quá dài nên tôi rút gọn hiển thị ở đây để tập trung vào logic thay đổi */}
            {/* Bạn hãy giữ nguyên toàn bộ nội dung JSX bên trong form như code cũ */}

            {/* SECTION 1: GUEST INFO */}
            {isGuest ? (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white font-bold text-base">
                    !
                  </span>
                  <h2 className="text-xl font-bold">Thông tin liên hệ</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Họ và tên *
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                      value={form.guestName}
                      onChange={(e) => updateForm("guestName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      SĐT *
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                      value={form.guestPhone}
                      onChange={(e) => updateForm("guestPhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Email
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                      value={form.guestEmail}
                      onChange={(e) => updateForm("guestEmail", e.target.value)}
                    />
                  </div>
                </div>
                <hr className="border-gray-100" />
              </section>
            ) : (
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex gap-3 items-center mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">
                  account_circle
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Đã đăng nhập
                  </p>
                  <p className="text-xs text-gray-500">
                    Đặt lịch với tài khoản của bạn.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 2: PET INFO */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-base">
                  1
                </span>
                <h2 className="text-xl font-bold">Thông tin thú cưng</h2>
              </div>

              {!isGuest && (
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Chọn Boss:
                  </label>
                  <div className="flex gap-4 overflow-x-auto p-2 hide-scrollbar">
                    <button
                      type="button"
                      onClick={() => updateForm("selectedPetId", null)}
                      className="flex-shrink-0 group outline-none relative hover:z-10"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center transition-colors ${
                            form.selectedPetId === null
                              ? "border-primary text-primary bg-primary/5"
                              : "border-gray-300 text-gray-400 group-hover:border-primary"
                          }`}
                        >
                          <span className="material-symbols-outlined text-2xl">
                            add
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-gray-500">
                          Thêm mới
                        </span>
                      </div>
                    </button>
                    {apiData.myPets.length > 0 ? (
                      apiData.myPets.map((pet) => {
                        const isSelected = form.selectedPetId === pet.thuCungId;
                        return (
                          <label
                            key={pet.thuCungId}
                            className="flex-shrink-0 cursor-pointer group relative hover:z-10"
                          >
                            <input
                              type="radio"
                              name="pet_select"
                              className="hidden"
                              checked={isSelected}
                              onChange={() => handleSelectPet(pet)}
                            />
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className={`relative p-0.5 rounded-full border-2 transition-all duration-300 group-hover:scale-110 ${
                                  isSelected
                                    ? "border-primary bg-white"
                                    : "border-transparent"
                                }`}
                              >
                                {pet.hinhAnh ? (
                                  <img
                                    alt={pet.tenThuCung}
                                    className={`w-14 h-14 rounded-full object-cover transition-all ${
                                      isSelected
                                        ? ""
                                        : "grayscale opacity-70 group-hover:grayscale-0"
                                    }`}
                                    src={`${IMAGE_BASE_URL}/${pet.hinhAnh}`}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center transition-all ${
                                    isSelected
                                      ? "bg-white"
                                      : "grayscale opacity-70"
                                  }`}
                                  style={{
                                    display: pet.hinhAnh ? "none" : "flex",
                                  }}
                                >
                                  <span className="material-symbols-outlined text-2xl text-gray-400">
                                    pets
                                  </span>
                                </div>
                                {isSelected && (
                                  <div className="absolute -bottom-0 -right-0 bg-primary text-white rounded-full p-0.5 border-2 border-white flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[10px] font-bold leading-none">
                                      check
                                    </span>
                                  </div>
                                )}
                              </div>
                              <span
                                className={`text-[11px] ${
                                  isSelected
                                    ? "font-bold text-primary"
                                    : "font-medium text-gray-500"
                                }`}
                              >
                                {pet.tenThuCung}
                              </span>
                            </div>
                          </label>
                        );
                      })
                    ) : (
                      <div className="flex items-center text-xs text-gray-400 italic px-2">
                        Chưa có thú cưng
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    {form.selectedPetId
                      ? "Tên Boss (Đã chọn)"
                      : "Tên Boss (Nhập mới)"}
                  </label>
                  <input
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium transition-colors ${
                      form.selectedPetId
                        ? "bg-primary/5 border-primary text-primary font-bold"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    placeholder="Nhập tên..."
                    value={form.petName}
                    onChange={handlePetNameChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Loại thú cưng
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Chó", "Mèo", "Khác"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateForm("petType", type)}
                        className={`flex flex-col items-center justify-center gap-2 p-3 border-2 rounded-xl transition-all ${
                          form.petType === type
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-100 text-gray-400 hover:border-primary/50"
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {type === "Khác" ? "help" : "pets"}
                        </span>
                        <span className="text-sm font-bold">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <hr className="border-gray-100" />

            {/* SECTION 3: SERVICES */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-base">
                  2
                </span>
                <h2 className="text-xl font-bold">Dịch vụ & Gói chăm sóc</h2>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                  type="button"
                  onClick={() => updateForm("activeCategory", "ALL")}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                    form.activeCategory === "ALL"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  Tất cả
                </button>
                {apiData.categories.map((cat) => (
                  <button
                    key={cat.danhMucDvId}
                    type="button"
                    onClick={() =>
                      updateForm("activeCategory", cat.danhMucDvId)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                      form.activeCategory === cat.danhMucDvId
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {cat.tenDanhMucDv}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredServices.map((service) => (
                  <label
                    key={service.dichVuId}
                    className={`relative flex flex-col p-4 border-2 rounded-2xl cursor-pointer hover:shadow-md ${
                      form.serviceId === service.dichVuId
                        ? "border-primary bg-primary/5"
                        : "border-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="service"
                      className="hidden"
                      checked={form.serviceId === service.dichVuId}
                      onChange={() => updateForm("serviceId", service.dichVuId)}
                    />
                    <div className="flex justify-between items-start mb-3">
                      <div
                        className={`p-1.5 rounded-lg w-12 h-12 flex items-center justify-center overflow-hidden ${
                          form.serviceId === service.dichVuId
                            ? "bg-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {service.hinhAnh ? (
                          <img
                            src={`${IMAGE_BASE_URL}/${service.hinhAnh}`}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentNode.innerHTML =
                                '<span class="material-symbols-outlined text-gray-400">pets</span>';
                            }}
                          />
                        ) : (
                          <span className="material-symbols-outlined text-gray-400">
                            pets
                          </span>
                        )}
                      </div>
                      <div
                        className={`font-bold ${
                          form.serviceId === service.dichVuId
                            ? "text-primary"
                            : "text-gray-500"
                        }`}
                      >
                        {formatMoney(service.giaDichVu)}
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 text-sm">
                      {service.tenDichVu}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {service.moTa}
                    </div>
                  </label>
                ))}
              </div>
            </section>
            <hr className="border-gray-100" />

            {/* SECTION 4: TIME & CALENDAR */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-base">
                  3
                </span>
                <h2 className="text-xl font-bold">Thời gian hẹn</h2>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* CALENDAR */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base font-bold capitalize">
                      Tháng {viewMonth + 1}, {viewYear}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleMonthChange(-1)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600"
                      >
                        <span className="material-symbols-outlined text-xl">
                          chevron_left
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMonthChange(1)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600"
                      >
                        <span className="material-symbols-outlined text-xl">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-3">
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 text-center text-sm gap-y-1 gap-x-1">
                    {Array.from({ length: startDayIndex }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-2.5"></div>
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                      (day) => {
                        const isSelected =
                          dateTime.date === day &&
                          dateTime.month === viewMonth + 1 &&
                          dateTime.year === viewYear;
                        const isPast =
                          new Date(viewYear, viewMonth, day).setHours(
                            0,
                            0,
                            0,
                            0,
                          ) < new Date().setHours(0, 0, 0, 0);
                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={isPast}
                            onClick={() => handleDateClick(day)}
                            className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-primary text-white font-bold shadow-md"
                                : isPast
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "hover:bg-white hover:shadow-sm"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* TIME SLOTS */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700">
                    Khung giờ
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {timeSlots.map((t) => {
                      const available = isTimeSlotAvailable(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={!available}
                          onClick={() =>
                            available &&
                            setDateTime((prev) => ({ ...prev, time: t }))
                          }
                          className={`py-2 px-2 rounded-xl border-2 text-sm font-bold transition-all ${
                            dateTime.time === t
                              ? "border-primary bg-primary/5 text-primary"
                              : available
                                ? "border-gray-100 text-gray-600 hover:border-primary/30"
                                : "border-gray-100 text-gray-300 bg-gray-100 cursor-not-allowed"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                  <textarea
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
                    rows="2"
                    placeholder="Ghi chú thêm..."
                    value={form.note}
                    onChange={(e) => updateForm("note", e.target.value)}
                  ></textarea>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-primary/5 p-4 rounded-xl flex gap-3 items-center">
                <span className="material-symbols-outlined text-primary">
                  verified_user
                </span>
                <span className="text-xs font-bold text-gray-700">
                  Cam kết hoàn tiền 100%
                </span>
              </div>
              <div className="bg-primary/5 p-4 rounded-xl flex gap-3 items-center">
                <span className="material-symbols-outlined text-primary">
                  support_agent
                </span>
                <span className="text-xs font-bold text-gray-700">
                  Hỗ trợ 24/7: 1900 123 456
                </span>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white pt-8 pb-28">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/20 p-1 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-lg">
                    pets
                  </span>
                </div>
                <span className="text-lg font-extrabold tracking-tight">
                  Pet<span className="text-primary">Lor</span>
                </span>
              </div>
              <p className="text-gray-500 text-[10px]">
                Thiên đường chăm sóc toàn diện cho thú cưng cao cấp.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[11px] mb-4">Dịch vụ</h4>
              <ul className="space-y-2 text-[10px] text-gray-500">
                <li>Spa & Grooming</li>
                <li>Khám thú y</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[11px] mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-[10px] text-gray-500">
                <li>Chính sách</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[11px] mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-[10px] text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">
                    phone
                  </span>{" "}
                  1900 123 456
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
            <p className="text-gray-400 text-[9px]">© 2024 PetLor Vietnam.</p>
          </div>
        </div>
      </footer>

      {/* FIXED BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  alt="Pet"
                  className="w-10 h-10 rounded-lg object-cover border-2 border-primary"
                  src={
                    selectedPetImg || "https://placehold.co/100x100?text=Pet"
                  }
                  onError={(e) =>
                    (e.target.src = "https://placehold.co/100x100?text=Pet")
                  }
                />
                <div className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                  {dateTime.date}/{dateTime.month}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-gray-900">
                    {form.petName || "Boss"}
                  </span>
                  <span className="text-[8px] font-bold text-primary uppercase bg-primary/10 px-1 py-0.5 rounded">
                    {form.petType}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500">
                  {selectedServiceObj
                    ? selectedServiceObj.tenDichVu
                    : "Chưa chọn"}{" "}
                  • {dateTime.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-right flex flex-col items-end">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                  Tổng cộng (tạm tính)
                </span>
                <span className="text-lg font-extrabold text-primary">
                  {formatMoney(finalPrice)}
                </span>
              </div>
              <button
                onClick={handleBooking}
                disabled={loading}
                className={`bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg text-xs shadow-md shadow-primary/10 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 ${
                  loading ? "opacity-70" : ""
                }`}
              >
                <span>{loading ? "Đang xử lý..." : "Đặt lịch"}</span>
                {!loading && (
                  <span className="material-symbols-outlined text-xs">
                    arrow_forward
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
