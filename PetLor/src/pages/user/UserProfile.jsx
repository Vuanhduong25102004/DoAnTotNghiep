import React, { useState, useEffect, useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import petService from "../../services/petService";
import bookingService from "../../services/bookingService";
import orderService from "../../services/orderService";
import EditProfileModal from "./modals/EditProfileModal";
import PetFormModal from "./modals/PetFormModal";
import PetDetailModal from "./modals/PetDetailModal";
import {
  renderStatusBadge,
  formatCurrency,
  getOrderStatusConfig,
} from "../../utils/formatters";
import AOS from "aos";
import "aos/dist/aos.css";

// --- 1. IMPORT TOAST ---
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const [user] = useOutletContext();
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Selection & Scroll states
  const [selectedPet, setSelectedPet] = useState(null);
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth * 0.7 : clientWidth * 0.7;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const fetchData = async () => {
    try {
      const [petRes, appRes, orderRes] = await Promise.all([
        petService.getMyPets(),
        bookingService.getMyAppointments(),
        orderService.getMyOrders(),
      ]);
      setPets(Array.isArray(petRes) ? petRes : petRes.data || []);
      setAppointments(Array.isArray(appRes) ? appRes : appRes.data || []);
      const orderData = orderRes.data || orderRes;
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      // --- 2. THÔNG BÁO LỖI ---
      toast.error("Không thể tải thông tin hồ sơ.");
    } finally {
      setLoading(false);
      setTimeout(checkScroll, 500);
    }
  };

  const fetchMyPets = async () => {
    const res = await petService.getMyPets();
    const newPets = Array.isArray(res) ? res : res.data || [];
    setPets(newPets);
    setTimeout(checkScroll, 300);
    // Có thể thêm toast nếu muốn: toast.success("Đã làm mới danh sách thú cưng");
  };

  const handleUpdateSuccess = () => {
    // Reload lại trang để update context user
    window.location.reload();
  };

  const handleViewDetail = (pet) => {
    setSelectedPet(pet);
    setIsDetailModalOpen(true);
  };

  const getAvatarUrl = (u) =>
    u?.anhDaiDien?.startsWith("http")
      ? u.anhDaiDien
      : `${API_URL}/uploads/${u?.anhDaiDien || "default-avatar.png"}`;

  useEffect(() => {
    fetchData();
    AOS.init({ duration: 800, once: true });

    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981] mr-3"></div>
        <p className="text-[#10B981] font-bold">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <main className="space-y-8 animate-fade-in pb-10">
      {/* --- 3. TOAST CONTAINER --- */}
      <ToastContainer
        style={{ marginTop: "60px", zIndex: 9999 }}
        transition={Slide}
      />

      {/* 1. THÔNG TIN CÁ NHÂN */}
      <section
        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
        data-aos="fade-up"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-400">
              badge
            </span>
            Thông tin cá nhân
          </h3>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-sm font-bold text-[#10B981] hover:bg-emerald-50 px-4 py-2 rounded-xl border border-gray-100 transition-all"
          >
            Chỉnh sửa
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          <div
            className="size-28 rounded-3xl bg-gray-100 overflow-hidden flex-shrink-0 bg-cover bg-center shadow-inner ring-4 ring-gray-50"
            style={{ backgroundImage: `url("${getAvatarUrl(user)}")` }}
          >
            {!user?.anhDaiDien && (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-icons-round text-gray-300 text-6xl">
                  person
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 w-full">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Họ và tên
              </label>
              <p className="text-lg font-bold text-gray-900">
                {user?.hoTen || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Email
              </label>
              <p className="text-lg font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Số điện thoại
              </label>
              <p className="text-lg font-medium text-gray-900">
                {user?.soDienThoai || "Chưa cập nhật"}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Địa chỉ
              </label>
              <p className="text-lg font-medium text-gray-900 line-clamp-1">
                {user?.diaChi || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THÚ CƯNG */}
      <section
        data-aos="fade-up"
        data-aos-delay="100"
        className="relative group"
      >
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="material-icons-outlined text-[#10B981]">pets</span>
            Thú cưng ({pets.length})
          </h3>
          <button
            onClick={() => setIsPetFormOpen(true)}
            className="text-sm font-bold text-[#10B981] flex items-center gap-1 hover:bg-emerald-50 px-3 py-1 rounded-lg transition-colors"
          >
            <span className="material-icons text-sm">add</span> Thêm mới
          </button>
        </div>

        <div className="relative flex items-center">
          {/* Nút Mũi tên TRÁI */}
          {pets.length > 0 && showLeftArrow && (
            <button
              onClick={() => handleScroll("left")}
              className="absolute -left-4 z-20 size-12 bg-white rounded-full shadow-xl border border-gray-100 text-[#10B981] flex items-center justify-center hover:bg-[#10B981] hover:text-white transition-all duration-300 active:scale-90"
            >
              <span className="material-icons text-3xl">chevron_left</span>
            </button>
          )}

          {/* Nút Mũi tên PHẢI */}
          {pets.length > 0 && showRightArrow && (
            <button
              onClick={() => handleScroll("right")}
              className="absolute -right-4 z-20 size-12 bg-white rounded-full shadow-xl border border-gray-100 text-[#10B981] flex items-center justify-center hover:bg-[#10B981] hover:text-white transition-all duration-300 active:scale-90"
            >
              <span className="material-icons text-3xl">chevron_right</span>
            </button>
          )}

          {/* Danh sách Thú cưng */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto gap-6 pb-6 snap-x touch-pan-x scroll-smooth w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {pets.length > 0 ? (
              pets.map((pet) => (
                <div
                  key={pet.thuCungId}
                  onClick={() => handleViewDetail(pet)}
                  className="flex-shrink-0 snap-start w-[280px] bg-white rounded-3xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer group/card"
                >
                  <div className="aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-50">
                    <img
                      alt={pet.tenThuCung}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                      src={
                        pet.hinhAnh?.startsWith("http")
                          ? pet.hinhAnh
                          : `${API_URL}/uploads/${pet.hinhAnh}`
                      }
                      onError={(e) =>
                        (e.target.src = "https://placehold.co/200?text=Pet")
                      }
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover/card:text-[#10B981]">
                        {pet.tenThuCung}
                      </h4>
                      <p className="text-xs text-gray-500">{pet.giongLoai}</p>
                    </div>
                    <span
                      className={`material-icons text-lg ${
                        pet.gioiTinh === "Đực"
                          ? "text-blue-500"
                          : "text-pink-400"
                      }`}
                    >
                      {pet.gioiTinh === "Đực" ? "male" : "female"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic px-1">
                Bạn chưa đăng ký thú cưng nào.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. LỊCH HẸN & ĐƠN HÀNG - GIỮ NGUYÊN CODE CŨ */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        {/* LỊCH HẸN */}
        <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2 text-gray-900">
              <span className="material-icons-outlined text-[#10B981]">
                event_note
              </span>{" "}
              Lịch hẹn gần đây
            </h3>
            <Link
              to="/my-appointments"
              className="text-xs font-bold text-[#10B981]"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.slice(0, 3).map((app) => (
                <div
                  key={app.lichHenId}
                  className="flex gap-4 items-center p-2 hover:bg-gray-50 rounded-2xl transition-colors"
                >
                  <div className="size-12 bg-emerald-50 rounded-xl flex flex-col items-center justify-center text-[#10B981] font-bold">
                    <span className="text-[10px] uppercase">
                      {new Date(app.thoiGianBatDau).getMonth() + 1}
                    </span>
                    <span className="text-lg">
                      {new Date(app.thoiGianBatDau).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate">
                      {app.tenDichVu}
                    </h4>
                    <p className="text-xs text-gray-500">{app.tenThuCung}</p>
                  </div>
                  {renderStatusBadge(app.trangThaiLichHen)}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center italic">
                Không có lịch hẹn sắp tới.
              </p>
            )}
          </div>
        </section>

        {/* ĐƠN HÀNG */}
        <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2 text-gray-900">
              <span className="material-icons-outlined text-[#10B981]">
                shopping_bag
              </span>{" "}
              Đơn hàng mới
            </h3>
            <Link to="/my-orders" className="text-xs font-bold text-[#10B981]">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.slice(0, 3).map((order) => {
                const ui = getOrderStatusConfig(order.trangThai);
                const firstItemName =
                  order.chiTietDonHangs?.[0]?.tenSanPham || "Kiện hàng PetCare";
                const remainingItems = (order.chiTietDonHangs?.length || 0) - 1;
                return (
                  <div
                    key={order.donHangId}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors"
                  >
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center ${ui.bgColor} ${ui.textColor}`}
                    >
                      <span className="material-icons-outlined text-xl">
                        {ui.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {firstItemName}
                        {remainingItems > 0 && (
                          <span className="text-[#10B981] text-[11px] ml-1 font-medium">
                            + {remainingItems} món khác
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(order.tongThanhToan)} •{" "}
                        {order.trangThai}
                      </p>
                    </div>
                    <Link
                      to="/my-orders"
                      className="size-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-[#10B981] hover:text-white transition-all"
                    >
                      <span className="material-icons text-sm">
                        chevron_right
                      </span>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm italic">
                Bạn chưa có đơn hàng nào.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* BẢO MẬT */}
      <section
        className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
          <span className="material-icons-outlined text-red-500 text-2xl">
            shield
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">Bảo mật tài khoản</h3>
          <p className="text-sm text-gray-500 mt-1">
            Cập nhật mật khẩu định kỳ để bảo vệ thông tin.
          </p>
        </div>
        <button className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
          Đổi mật khẩu
        </button>
      </section>

      {/* MODALS */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={user}
        onUpdateSuccess={handleUpdateSuccess}
      />
      <PetFormModal
        isOpen={isPetFormOpen}
        onClose={() => setIsPetFormOpen(false)}
        onSuccess={fetchMyPets}
      />
      <PetDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        pet={selectedPet}
      />
    </main>
  );
};

export default UserProfile;
