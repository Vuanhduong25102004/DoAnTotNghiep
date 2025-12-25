import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import authService from "../../services/authService";
import petService from "../../services/petService"; // Import service mới
import EditProfileModal from "./modals/EditProfileModal";
import AddPetModal from "./modals/AddPetModal";

// 1. Import AOS và CSS của nó
import AOS from "aos";
import "aos/dist/aos.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]); // State để lưu danh sách thú cưng
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const fetchMyPets = async () => {
    try {
      const response = await petService.getMyPets();
      // Giả sử API trả về mảng trực tiếp hoặc response.data
      setPets(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách thú cưng:", error);
    }
  };

  // Gọi hàm fetchMyPets khi component vừa load
  useEffect(() => {
    fetchMyPets();
  }, []);

  const handleUpdateSuccess = async () => {
    // Gọi lại API lấy thông tin mới nhất
    try {
      const response = await userService.getMe();
      setUser(response);
    } catch (error) {
      console.error(error);
    }
  };
  // Fetch User Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi song song API lấy user và thú cưng để tăng tốc độ tải trang
        const [userResponse, petsResponse] = await Promise.all([
          userService.getMe(),
          petService.getMyPets(),
        ]);
        setUser(userResponse);
        setPets(petsResponse);
      } catch (error) {
        console.error("Lỗi tải thông tin trang:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Khởi tạo Animation (Chạy khi loading = false để đảm bảo nội dung đã có)
  useEffect(() => {
    if (!loading) {
      const aosInit = setTimeout(() => {
        AOS.init({
          duration: 800, // Thời gian chạy hiệu ứng (ms)
          once: true, // Chỉ chạy 1 lần khi cuộn tới
          offset: 50, // Khoảng cách bắt đầu chạy
          delay: 0,
        });
        AOS.refresh();
      }, 100);
      return () => clearTimeout(aosInit);
    }
  }, [loading]);

  const getAvatarUrl = (user) => {
    if (user?.anhDaiDien) {
      const imageUrl = user.anhDaiDien.startsWith("http")
        ? user.anhDaiDien
        : `${API_URL}/uploads/${user.anhDaiDien}`;
      return imageUrl;
    }
    return `https://ui-avatars.com/api/?name=${
      user?.hoTen || "User"
    }&background=random`;
  };

  const getPetAvatarUrl = (pet) => {
    if (pet?.hinhAnh) {
      return pet.hinhAnh.startsWith("http")
        ? pet.hinhAnh
        : `${API_URL}/uploads/${pet.hinhAnh}`;
    }
    // Placeholder nếu thú cưng không có ảnh
    return `https://placehold.co/150/E7F3E7/4C9A4C?text=${
      pet?.tenThuCung ? pet.tenThuCung.charAt(0) : "P"
    }`;
  };

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return "?";
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age < 1) return "Dưới 1";
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8f6]">
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f8f6] font-display text-[#0d1b0d] min-h-screen flex flex-col mt-20">
      {/* Main Layout */}
      <main className="flex-grow layout-container flex justify-center py-6 px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto w-full mt-4">
        <div className="layout-content-container flex flex-col md:flex-row gap-6 w-full">
          {/* Sidebar - Animation: Trượt từ trái sang */}
          <aside
            className="w-full md:w-64 lg:w-72 flex flex-col gap-4"
            data-aos="fade-right"
            data-aos-delay="0"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e7f3e7]">
              <div className="flex gap-3 items-center mb-6">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shadow-sm border border-gray-100"
                  style={{
                    backgroundImage: `url("${getAvatarUrl(user)}")`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <h1 className="text-[#0d1b0d] text-base font-bold leading-normal">
                    {user?.hoTen || "Khách"}
                  </h1>
                  <p className="text-[#4c9a4c] text-xs font-semibold leading-normal uppercase tracking-wider">
                    Thành viên Bạc
                  </p>
                </div>
              </div>
              <nav className="flex flex-col gap-2">
                <Link
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 text-[#0d1b0d] transition-all duration-300 group"
                  to="/profile"
                >
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform icon-filled">
                    person
                  </span>
                  <p className="text-sm font-bold">Hồ sơ của tôi</p>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 group text-gray-600"
                  to="/my-pets"
                >
                  <span className="material-symbols-outlined group-hover:text-primary transition-colors">
                    pets
                  </span>
                  <p className="text-sm font-medium">Thú cưng của tôi</p>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 group text-gray-600"
                  to="/history"
                >
                  <span className="material-symbols-outlined group-hover:text-primary transition-colors">
                    calendar_month
                  </span>
                  <p className="text-sm font-medium">Lịch sử hẹn</p>
                </Link>
                <Link
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 group text-gray-600"
                  to="/"
                >
                  <span className="material-symbols-outlined group-hover:text-primary transition-colors">
                    shopping_bag
                  </span>
                  <p className="text-sm font-medium">Lịch sử đơn hàng</p>
                </Link>
                <div className="h-px bg-gray-100 my-2"></div>
                <Link
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 group text-gray-600"
                  to="/"
                >
                  <span className="material-symbols-outlined group-hover:text-primary transition-colors">
                    settings
                  </span>
                  <p className="text-sm font-medium">Cài đặt tài khoản</p>
                </Link>
                <button
                  onClick={() => {
                    authService.logout();
                    navigate("/");
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all duration-300 group text-red-500 w-full text-left"
                >
                  <span className="material-symbols-outlined">logout</span>
                  <p className="text-sm font-medium">Đăng xuất</p>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Page Header - Animation: Trượt từ trên xuống */}
            <div
              className="flex flex-wrap justify-between items-center gap-4 px-2"
              data-aos="fade-down"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-[#0d1b0d] text-3xl font-black leading-tight tracking-[-0.033em]">
                  Hồ sơ của tôi
                </h2>
                <p className="text-gray-500 text-sm font-normal">
                  Quản lý thông tin cá nhân và thú cưng của bạn
                </p>
              </div>
              <button className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all text-[#0d1b0d] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
                Thông báo
                <span className="flex size-2 rounded-full bg-red-500 ml-1"></span>
              </button>
            </div>

            {/* Profile Card Section - Animation: Trượt từ dưới lên */}
            <section
              className="bg-white rounded-xl shadow-sm border border-[#e7f3e7] overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between group">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                  <div className="relative">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-28 h-28 md:w-32 md:h-32 shadow-md border-4 border-white"
                      style={{
                        backgroundImage: `url("${getAvatarUrl(user)}")`,
                      }}
                    ></div>
                    <button
                      className="absolute bottom-1 right-1 bg-primary text-[#0d1b0d] p-2 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      title="Change Avatar"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        camera_alt
                      </span>
                    </button>
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <h3 className="text-[#0d1b0d] text-2xl font-bold leading-tight">
                      {user?.hoTen}
                    </h3>
                    <div className="flex flex-col md:flex-row gap-2 text-gray-500 text-sm">
                      <span className="flex items-center gap-1 justify-center md:justify-start">
                        <span className="material-symbols-outlined text-[16px]">
                          mail
                        </span>{" "}
                        {user?.email}
                      </span>
                      <span className="hidden md:inline text-gray-300">|</span>
                      <span className="flex items-center gap-1 justify-center md:justify-start">
                        <span className="material-symbols-outlined text-[16px]">
                          call
                        </span>{" "}
                        {user?.soDienThoai || "Chưa cập nhật"}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-2 justify-center md:justify-start">
                      <span className="px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200">
                        Gold Member
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="relative group flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-[#111813] text-sm font-bold shadow-sm transition-all duration-300 ease-out hover:scale-105"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    edit
                  </span>
                  Chỉnh sửa
                </button>
              </div>

              {/* Details Grid */}
              <div className="border-t border-gray-100 px-6 py-2 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  <div className="py-4 md:px-4 first:pl-0">
                    <p className="text-gray-400 text-xs uppercase font-semibold mb-1">
                      Địa chỉ
                    </p>
                    <p className="text-[#0d1b0d] text-sm font-medium">
                      {user?.diaChi || "Chưa cập nhật"}
                    </p>
                  </div>
                  <div className="py-4 md:px-4">
                    <p className="text-gray-400 text-xs uppercase font-semibold mb-1">
                      Ngày tạo
                    </p>
                    <p className="text-[#0d1b0d] text-sm font-medium">
                      {user?.ngayTao
                        ? new Date(user.ngayTao).toLocaleDateString("vi-VN")
                        : "..."}
                    </p>
                  </div>
                  <div className="py-4 md:px-4">
                    <p className="text-gray-400 text-xs uppercase font-semibold mb-1">
                      Vai trò
                    </p>
                    <p className="text-[#0d1b0d] text-sm font-medium">
                      {user?.role || "USER"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Two Column Layout for Pets and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* My Pets Section - Animation: Zoom in nhẹ */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div
                  className="flex items-center justify-between"
                  data-aos="fade-right"
                >
                  <h3 className="text-xl font-bold text-[#0d1b0d] flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      pets
                    </span>
                    Thú cưng của tôi
                  </h3>
                  <button
                    onClick={() => setIsAddPetModalOpen(true)}
                    className="text-sm font-bold text-primary hover:text-[#0fd60f] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      add_circle
                    </span>
                    Thêm mới
                  </button>
                </div>

                {pets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pets.map((pet, index) => (
                      <div
                        key={pet.thuCungId}
                        className="bg-white p-4 rounded-xl shadow-sm border border-[#e7f3e7] hover:shadow-md transition-shadow group flex items-start gap-4 cursor-pointer relative overflow-hidden"
                        data-aos="zoom-in"
                        data-aos-delay={200 + index * 100}
                      >
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-gray-400 hover:text-primary">
                            more_horiz
                          </span>
                        </div>
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-20 shrink-0"
                          style={{
                            backgroundImage: `url("${getPetAvatarUrl(pet)}")`,
                          }}
                        ></div>
                        <div className="flex flex-col justify-center h-full">
                          <h4 className="font-bold text-lg text-[#0d1b0d]">
                            {pet.tenThuCung}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {pet.giongLoai || "Chưa rõ giống"}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              {calculateAge(pet.ngaySinh)} tuổi
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                pet.gioiTinh === "Đực"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-pink-100 text-pink-700"
                              }`}
                            >
                              {pet.gioiTinh}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="sm:col-span-2 text-center py-10 px-4 bg-white rounded-xl border border-dashed border-gray-200"
                    data-aos="zoom-in"
                  >
                    <p className="text-gray-500">Bạn chưa có thú cưng nào.</p>
                    <button className="mt-4 text-sm font-bold text-primary hover:text-[#0fd60f] transition-colors flex items-center gap-1 cursor-pointer mx-auto">
                      <span className="material-symbols-outlined text-[20px]">
                        add_circle
                      </span>
                      Thêm thú cưng ngay
                    </button>
                  </div>
                )}
              </div>

              {/* Summary Stats - Animation: Trượt từ phải sang */}
              <div
                className="flex flex-col gap-4"
                data-aos="fade-left"
                data-aos-delay="400"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#0d1b0d]">
                    Hoạt động gần đây
                  </h3>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-[#e7f3e7] flex flex-col divide-y divide-gray-100">
                  {/* Appointment Item */}
                  <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500 text-[20px]">
                          calendar_clock
                        </span>
                        <p className="text-xs font-bold uppercase text-gray-400">
                          Lịch hẹn sắp tới
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        CONFIRMED
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#0d1b0d]">
                      Tiêm phòng định kỳ - Bé Lu
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      10:00 AM - 15/10/2023
                    </p>
                  </div>
                  {/* Order Item */}
                  <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-500 text-[20px]">
                          package_2
                        </span>
                        <p className="text-xs font-bold uppercase text-gray-400">
                          Đơn hàng mới nhất
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        DELIVERED
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#0d1b0d]">
                      Thức ăn hạt Royal Canin (x2)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      #ORD-23901 • 520.000đ
                    </p>
                  </div>
                  <a
                    className="p-3 text-center text-sm font-bold text-primary hover:bg-gray-50 transition-colors"
                    href="#"
                  >
                    Xem tất cả
                  </a>
                </div>
              </div>
            </div>

            {/* Settings Teaser Area - Animation: Fade Up chậm */}
            <div
              className="mt-2 bg-[#e7f3e7] border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full text-primary shadow-sm">
                  <span className="material-symbols-outlined icon-filled">
                    security
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-[#0d1b0d]">
                    Bảo mật tài khoản
                  </h4>
                  <p className="text-sm text-gray-600">
                    Cập nhật mật khẩu và xác thực 2 bước để bảo vệ tài khoản.
                  </p>
                </div>
              </div>
              <button className="whitespace-nowrap px-4 py-2 bg-white hover:bg-gray-50 text-[#0d1b0d] text-sm font-bold rounded-lg shadow-sm transition-colors cursor-pointer">
                Thiết lập ngay
              </button>
            </div>
          </div>
        </div>
      </main>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={user}
        onUpdateSuccess={handleUpdateSuccess}
      />
      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
        onAddSuccess={fetchMyPets} // Quan trọng: Truyền hàm load lại danh sách vào đây
      />
    </div>
  );
};

export default UserProfile;
