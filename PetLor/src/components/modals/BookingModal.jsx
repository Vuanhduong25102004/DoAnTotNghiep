import React, { useState, useEffect } from "react";
import bookingService from "../../services/bookingService";
import petService from "../../services/petService";
import { toast } from "react-toastify";

const BookingModal = ({ isOpen, onClose, user }) => {
  const [services, setServices] = useState([]);
  const [myPets, setMyPets] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- State dữ liệu ---
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // State thời gian & Lịch
  const [selectedTime, setSelectedTime] = useState("");
  const [currentDateView, setCurrentDateView] = useState(new Date()); // Dùng để hiển thị lịch tháng nào
  const [selectedDateObj, setSelectedDateObj] = useState(null); // Ngày user thực sự chọn

  const [note, setNote] = useState("");
  const [guestInfo, setGuestInfo] = useState({
    tenKhachHang: "",
    soDienThoaiKhachHang: "",
    emailKhachHang: "",
    tenThuCung: "",
    chungLoai: "Chó",
  });

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "13:30",
    "14:30",
    "15:30",
    "16:30",
    "17:30",
  ];

  // --- Init Data ---
  useEffect(() => {
    if (isOpen) {
      petService
        .getAllServices()
        .then((res) => setServices(res.data || []))
        .catch(console.error);
      if (user) {
        petService
          .getMyPets()
          .then((res) => {
            setMyPets(res.data || []);
            if (res.data && res.data.length > 0)
              setSelectedPetId(res.data[0].id);
          })
          .catch(console.error);
      }
      // Reset
      setSelectedServiceId(null);
      setSelectedDateObj(null);
      setSelectedTime("");
      setNote("");
    }
  }, [isOpen, user]);

  const handleGuestChange = (e) =>
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });

  // --- Logic Lịch ---
  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => {
    // 0 = Sunday, 1 = Monday. Chỉnh lại để T2 là cột đầu tiên nếu muốn, hoặc giữ nguyên
    // Code mẫu của bạn: T2 T3 T4 T5 T6 T7 CN.
    // JS: CN=0, T2=1... => Cần shift để T2 index 0.
    let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDateView);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDateView(newDate);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(
      currentDateView.getFullYear(),
      currentDateView.getMonth(),
      day
    );
    // Cho phép chọn ngày quá khứ hay không tuỳ bạn (ở đây tạm chặn)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate < today) return;

    setSelectedDateObj(newDate);
  };

  const isSelectedDate = (day) => {
    if (!selectedDateObj) return false;
    return (
      selectedDateObj.getDate() === day &&
      selectedDateObj.getMonth() === currentDateView.getMonth() &&
      selectedDateObj.getFullYear() === currentDateView.getFullYear()
    );
  };

  // --- Submit ---
  const handleSubmit = async () => {
    if (!selectedServiceId) return toast.warning("Vui lòng chọn dịch vụ!");
    if (!selectedDateObj || !selectedTime)
      return toast.warning("Vui lòng chọn ngày và giờ!");
    if (!user && (!guestInfo.tenKhachHang || !guestInfo.soDienThoaiKhachHang))
      return toast.warning("Nhập thông tin liên hệ!");

    setLoading(true);
    try {
      // Tạo chuỗi YYYY-MM-DDTHH:mm:00
      const dateStr = selectedDateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD
      const formattedTime = `${dateStr}T${selectedTime}:00`;

      if (user) {
        const pet = myPets.find((p) => p.id === selectedPetId);
        await bookingService.createBookingUser({
          userId: user.id,
          thuCungId: selectedPetId,
          tenThuCung: pet ? pet.tenThuCung : "Mới",
          chungLoai: pet ? pet.chungLoai : "Chó",
          dichVuId: selectedServiceId,
          nhanVienId: null,
          thoiGianBatDau: formattedTime,
          ghiChuKhachHang: note,
        });
      } else {
        await bookingService.createBookingGuest({
          ...guestInfo,
          dichVuId: selectedServiceId,
          nhanVienId: null,
          thoiGianBatDau: formattedTime,
          ghiChu: note,
        });
      }
      toast.success("Đặt lịch thành công!");
      onClose();
    } catch (error) {
      toast.error("Lỗi đặt lịch!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const daysInMonth = getDaysInMonth(currentDateView);
  const firstDay = getFirstDayOfMonth(currentDateView); // Số ô trống đầu tháng

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Container chính */}
      <div className="relative w-full max-w-[720px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-[#dde3e3] max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#dde3e3] bg-white sticky top-0 z-10">
          <div className="flex flex-col">
            <h1 className="text-[#121616] text-2xl font-bold leading-tight">
              Đăng ký lịch hẹn
            </h1>
            <p className="text-[#6a8180] text-sm font-medium">
              Đặt lịch chăm sóc cho thú cưng của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f4f3] hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[#121616] group-hover:text-primary">
              close
            </span>
          </button>
        </div>

        {/* Body Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          {/* Section 1: Chọn thú cưng (Giữ nguyên UI Slider) */}
          <div className="px-6 pt-6">
            <h3 className="text-[#121616] text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                pets
              </span>
              {user ? "Chọn thú cưng" : "Thông tin khách"}
            </h3>

            {user ? (
              <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                {myPets.map((pet) => {
                  const isActive = selectedPetId === pet.id;
                  return (
                    <div
                      key={pet.id}
                      onClick={() => setSelectedPetId(pet.id)}
                      className="flex flex-col items-center gap-2 group cursor-pointer min-w-[80px]"
                    >
                      <div className="relative">
                        <div
                          className={`size-16 rounded-full border-[3px] p-1 bg-white transition-all ${
                            isActive
                              ? "border-primary"
                              : "border-transparent group-hover:border-[#dde3e3]"
                          }`}
                        >
                          <div
                            className={`w-full h-full rounded-full bg-center bg-cover transition-all ${
                              !isActive && "grayscale group-hover:grayscale-0"
                            }`}
                            style={{
                              backgroundImage: `url(${
                                pet.hinhAnh
                                  ? `${API_URL}/uploads/${pet.hinhAnh}`
                                  : "https://ui-avatars.com/api/?name=" +
                                    pet.tenThuCung
                              })`,
                            }}
                          ></div>
                        </div>
                        {isActive && (
                          <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full size-5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px]">
                              check
                            </span>
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-sm font-bold transition-colors ${
                          isActive
                            ? "text-primary"
                            : "text-[#6a8180] group-hover:text-[#121616]"
                        }`}
                      >
                        {pet.tenThuCung}
                      </p>
                    </div>
                  );
                })}
                {/* Add New Button */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer min-w-[80px]">
                  <div className="size-16 rounded-full border-2 border-dashed border-[#dde3e3] flex items-center justify-center text-[#6a8180] group-hover:text-primary group-hover:border-primary transition-all">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                  <p className="text-[#6a8180] text-sm font-bold group-hover:text-primary">
                    Thêm mới
                  </p>
                </div>
              </div>
            ) : (
              /* Guest Form - Style cho khớp theme */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="tenKhachHang"
                  onChange={handleGuestChange}
                  placeholder="Họ tên (*)"
                  className="p-3 rounded-xl border border-[#dde3e3] bg-transparent text-[#121616] focus:border-primary outline-none"
                />
                <input
                  name="soDienThoaiKhachHang"
                  onChange={handleGuestChange}
                  placeholder="SĐT (*)"
                  className="p-3 rounded-xl border border-[#dde3e3] bg-transparent text-[#121616] focus:border-primary outline-none"
                />
                <input
                  name="tenThuCung"
                  onChange={handleGuestChange}
                  placeholder="Tên thú cưng (*)"
                  className="p-3 rounded-xl border border-[#dde3e3] bg-transparent text-[#121616] focus:border-primary outline-none"
                />
                <input
                  name="chungLoai"
                  onChange={handleGuestChange}
                  placeholder="Chủng loại (Chó/Mèo)"
                  className="p-3 rounded-xl border border-[#dde3e3] bg-transparent text-[#121616] focus:border-primary outline-none"
                />
              </div>
            )}
          </div>

          {/* Section 2: Chọn dịch vụ */}
          <div className="px-6 py-6 border-t border-[#dde3e3]">
            <h3 className="text-[#121616] text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                medical_services
              </span>
              Chọn dịch vụ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {services.map((sv) => {
                const isActive = selectedServiceId === sv.id;
                return (
                  <div
                    key={sv.id}
                    onClick={() => setSelectedServiceId(sv.id)}
                    className={`flex flex-col gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                      isActive
                        ? "border-2 border-primary bg-primary/5"
                        : "border-[#dde3e3] bg-white hover:border-primary/50"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-3xl ${
                        isActive ? "text-primary" : "text-[#121616]"
                      }`}
                    >
                      spa
                    </span>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-[#121616] text-base font-bold line-clamp-1">
                        {sv.tenDichVu}
                      </h4>
                      <p className="text-[#6a8180] text-xs font-normal">
                        {sv.giaTien?.toLocaleString()} đ
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Ngày & Giờ (RESTORED CSS) */}
          <div className="px-6 py-6 border-t border-[#dde3e3] grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* --- CALENDAR UI (Đã khôi phục Grid) --- */}
            <div>
              <h3 className="text-[#121616] text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  calendar_month
                </span>
                Chọn ngày
              </h3>
              <div className="bg-[#f8fafc] rounded-lg p-4">
                {" "}
                {/* Mapped bg-background-light to bg-[#f8fafc] */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#121616] font-bold capitalize">
                    Tháng {currentDateView.getMonth() + 1},{" "}
                    {currentDateView.getFullYear()}
                  </span>
                  <div className="flex gap-2">
                    <span
                      onClick={() => changeMonth(-1)}
                      className="material-symbols-outlined cursor-pointer text-sm hover:text-primary p-1"
                    >
                      chevron_left
                    </span>
                    <span
                      onClick={() => changeMonth(1)}
                      className="material-symbols-outlined cursor-pointer text-sm hover:text-primary p-1"
                    >
                      chevron_right
                    </span>
                  </div>
                </div>
                {/* Header Thứ */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-[#6a8180]">
                  <div>T2</div>
                  <div>T3</div>
                  <div>T4</div>
                  <div>T5</div>
                  <div>T6</div>
                  <div className="text-primary font-bold">T7</div>
                  <div className="text-primary font-bold">CN</div>
                </div>
                {/* Grid Ngày */}
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {/* Render ô trống đầu tháng */}
                  {[...Array(firstDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="p-2"></div>
                  ))}
                  {/* Render Ngày */}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const active = isSelectedDate(day);
                    return (
                      <div
                        key={day}
                        onClick={() => handleDateClick(day)}
                        className={`p-2 rounded-md cursor-pointer transition-all ${
                          active
                            ? "bg-primary text-white font-bold shadow-sm"
                            : "hover:bg-white text-[#121616]"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* --- TIME UI --- */}
            <div>
              <h3 className="text-[#121616] text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  schedule
                </span>
                Chọn giờ
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => {
                  const isActive = selectedTime === time;
                  return (
                    <div
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-2 py-3 text-center border rounded-lg text-sm cursor-pointer transition-all ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-[#dde3e3] text-[#6a8180] hover:border-primary"
                      }`}
                    >
                      {time}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-[#6a8180] text-xs leading-relaxed italic">
                * Giờ hoạt động: 08:30 - 20:00 hàng ngày.
              </p>
            </div>
          </div>

          {/* Section 4: Ghi chú */}
          <div className="px-6 py-6 border-t border-[#dde3e3]">
            <h3 className="text-[#121616] text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                edit_note
              </span>
              Ghi chú thêm
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full min-h-[100px] rounded-lg border-[#dde3e3] border bg-[#f8fafc] p-3 text-[#121616] text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="VD: Bé có tiền sử dị ứng xà phòng, cần thợ tay nghề cao..."
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-[#dde3e3] bg-[#f8fafc] flex flex-col md:flex-row gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
            {!loading && (
              <span className="material-symbols-outlined text-[20px]">
                send
              </span>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-none md:w-32 bg-white border border-[#dde3e3] text-[#6a8180] font-bold py-3 px-6 rounded-lg hover:bg-[#f1f4f3] transition-all"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
