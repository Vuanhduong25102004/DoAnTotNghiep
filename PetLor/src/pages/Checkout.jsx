import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

// --- 1. IMPORT TOASTIFY ---
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { formatCurrency } from "../utils/formatters";
import { SERVER_URL } from "../services/apiClient";
import orderService from "../services/orderService";
import userService from "../services/userService";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  // 1. Nhận dữ liệu từ giỏ hàng
  const { selectedItems, totalAmount, appliedVoucher } = location.state || {};

  // State User
  const [currentUser, setCurrentUser] = useState(null);

  // State Form
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    tinhThanh: "",
    quanHuyen: "",
    phuongXa: "",
    diaChi: "",
    note: "",
    voucherCode: appliedVoucher || "",
  });

  // State API Địa lý
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // State ID Địa lý
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  // --- [NEW] STATE CHO MODAL QR CODE ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null); // Lưu ID đơn hàng vừa tạo để hiển thị nội dung CK

  // Tính toán tiền
  const SHIPPING_FEE = 30000;
  const DISCOUNT = 0;
  const FINAL_TOTAL = (totalAmount || 0) + SHIPPING_FEE - DISCOUNT;

  // Validate form
  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.phone.trim() !== "" &&
    (!currentUser ? formData.email.trim() !== "" : true) &&
    formData.tinhThanh !== "" &&
    formData.quanHuyen !== "" &&
    formData.phuongXa !== "" &&
    formData.diaChi.trim() !== "";

  // Helper hiển thị ảnh
  const getImageUrl = (imageName) => {
    if (!imageName) return "https://placehold.co/100x100?text=No+Image";
    if (imageName.startsWith("http")) return imageName;
    return `${SERVER_URL}/uploads/${imageName}`;
  };

  // Check cart items
  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      // --- THAY ALERT ---
      toast.warn("Vui lòng chọn sản phẩm từ giỏ hàng trước!", {
        position: "top-center",
      });
      navigate("/cart");
    }
  }, [selectedItems, navigate]);

  // Auto fill user
  useEffect(() => {
    const fillUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await userService.getMe();
          const userData = res.data ? res.data : res;
          if (userData) {
            setCurrentUser(userData);
            setFormData((prev) => ({
              ...prev,
              fullName: userData.hoTen || "",
              phone: userData.soDienThoai || "",
              email: userData.email || "",
              diaChi: userData.diaChi || "",
            }));
            // Nếu là User đăng nhập thành công, có thể cho phép chọn lại COD (nếu muốn chắc chắn)
            // setPaymentMethod("COD");
          }
        } catch (error) {
          console.error("Lỗi lấy thông tin user:", error);
          setCurrentUser(null);
          // Token lỗi -> Coi như Guest -> Chuyển về MOMO
          setPaymentMethod("MOMO");
        }
      } else {
        // Không có token -> Guest -> Chuyển về MOMO
        setPaymentMethod("MOMO");
      }
    };
    fillUserData();
  }, []);

  // --- LOGIC API ĐỊA LÝ ---
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
        if (res.data.error === 0) setProvinces(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvinceId) {
      const fetchDistricts = async () => {
        try {
          const res = await axios.get(
            `https://esgoo.net/api-tinhthanh/2/${selectedProvinceId}.htm`,
          );
          if (res.data.error === 0) {
            setDistricts(res.data.data);
            setWards([]);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchDistricts();
    }
  }, [selectedProvinceId]);

  useEffect(() => {
    if (selectedDistrictId) {
      const fetchWards = async () => {
        try {
          const res = await axios.get(
            `https://esgoo.net/api-tinhthanh/3/${selectedDistrictId}.htm`,
          );
          if (res.data.error === 0) setWards(res.data.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchWards();
    }
  }, [selectedDistrictId]);

  // --- OPTIONS FOR REACT-SELECT ---
  const provinceOptions = provinces.map((p) => ({
    value: p.id,
    label: p.full_name,
  }));
  const districtOptions = districts.map((d) => ({
    value: d.id,
    label: d.full_name,
  }));
  const wardOptions = wards.map((w) => ({ value: w.id, label: w.full_name }));

  // --- HANDLERS FOR REACT-SELECT ---
  const handleSelectProvince = (option) => {
    setSelectedProvinceId(option?.value || "");
    setSelectedDistrictId("");
    setFormData({
      ...formData,
      tinhThanh: option?.label || "",
      quanHuyen: "",
      phuongXa: "",
    });
  };
  const handleSelectDistrict = (option) => {
    setSelectedDistrictId(option?.value || "");
    setFormData({ ...formData, quanHuyen: option?.label || "", phuongXa: "" });
  };
  const handleSelectWard = (option) => {
    setFormData({ ...formData, phuongXa: option?.label || "" });
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SUBMIT ---
  const handlePlaceOrder = async () => {
    // Log kiểm tra form có hợp lệ không
    if (!isFormValid) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    setLoading(true);
    console.log("🚀 --- BẮT ĐẦU QUÁ TRÌNH ĐẶT HÀNG ---");

    try {
      const itemsPayload = selectedItems.map((item) => ({
        sanPhamId: item.sanPhamId || item.id,
        soLuong: item.soLuong,
      })); // Chuẩn bị payload chung

      const basePayload = {
        hoTenNguoiNhan: formData.fullName,
        soDienThoaiNhan: formData.phone,
        diaChiGiaoHang: formData.diaChi,
        tinhThanh: formData.tinhThanh,
        quanHuyen: formData.quanHuyen,
        phuongXa: formData.phuongXa,
        phuongThucThanhToan: paymentMethod,
        maKhuyenMai: formData.voucherCode,
        chiTietDonHangs: itemsPayload,
        ghiChu: formData.note,
      };

      let orderResponse; // Lưu kết quả trả về từ API tạo đơn

      if (!currentUser) {
        // --- GUEST ---
        if (paymentMethod === "COD") {
          // --- THAY ALERT ---
          toast.warn(
            "Khách vãng lai vui lòng chọn thanh toán Online (VNPAY/MOMO)!",
            {
              icon: "💳",
            },
          );
          setLoading(false);
          return;
        }

        const guestPayload = { ...basePayload, email: formData.email };
        const res = await orderService.createOrder(guestPayload, true);
        orderResponse = res.data || res;
      } else {
        // --- USER ---
        const userPayload = {
          ...basePayload,
          userId: currentUser.userId,
          hoTen: formData.fullName,
        };
        const res = await orderService.createOrder(userPayload, false);
        orderResponse = res.data || res;
      }

      // --- XỬ LÝ SAU KHI TẠO ĐƠN ---
      if (paymentMethod === "COD") {
        finishOrderProcess();
      } else {
        const newOrderId = orderResponse?.id || "MDH" + Date.now();
        setCreatedOrderId(newOrderId);
        setShowPaymentModal(true);
        setLoading(false);
        toast.info("Đơn hàng đã tạo! Vui lòng quét mã QR để thanh toán.");
      }
    } catch (error) {
      console.error("❌ LỖI KHI GỌI API:", error);
      const errorMsg =
        error.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại!";
      // --- THAY ALERT ---
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  // Hàm dọn dẹp và chuyển trang
  const finishOrderProcess = async () => {
    localStorage.removeItem("cart");
    await fetchCart();

    // --- THAY ALERT ---
    toast.success(
      <div>
        <div className="font-bold">Đặt hàng thành công!</div>
        <div className="text-xs">Cảm ơn bạn đã mua sắm tại PetLor.</div>
      </div>,
      {
        autoClose: 2500,
        onClose: () => navigate("/"), // Chuyển trang sau khi toast đóng hoặc hết giờ
      },
    );

    // Fallback chuyển trang nếu user không tương tác toast
    setTimeout(() => {
      navigate("/");
    }, 2800);
  };

  // --- STYLE REACT-SELECT ---
  const selectClassNames = {
    control: ({ isFocused, isDisabled }) =>
      `w-full bg-white rounded-lg border h-12 px-4 flex items-center justify-between transition-all
       ${isDisabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
       ${
         isFocused
           ? "ring-1 ring-primary border-primary"
           : "border-gray-300 hover:border-primary"
       }`,
    menu: () =>
      "mt-1 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50 absolute w-full",
    option: ({ isSelected, isFocused }) =>
      `px-4 py-2 cursor-pointer text-sm
       ${isSelected ? "bg-primary text-white" : ""}
       ${
         isFocused && !isSelected
           ? "bg-gray-100 text-gray-800"
           : "text-gray-800"
       }`,
    input: () => "text-sm text-gray-800",
    placeholder: () => "text-gray-500 text-sm",
    singleValue: () => "text-gray-800 text-sm",
    noOptionsMessage: () => "text-gray-500 text-sm p-2",
    valueContainer: () => "flex gap-1",
  };

  if (!selectedItems) return null;

  return (
    <main className="max-w-screen-xl mx-auto mt-16 px-4 pb-10 relative">
      {/* --- 2. THÊM TOAST CONTAINER --- */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
        style={{ zIndex: 99999, marginTop: "60px" }}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        <Link className="text-gray-500 hover:text-primary" to="/cart">
          Giỏ hàng
        </Link>
        <span className="material-symbols-outlined text-sm text-gray-400">
          chevron_right
        </span>
        <span className="font-semibold text-primary">Thông tin thanh toán</span>
        <span className="material-symbols-outlined text-sm text-gray-400">
          chevron_right
        </span>
        <span className="text-gray-400">Hoàn tất</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* --- CỘT TRÁI: FORM --- */}
        <div className="lg:col-span-7 space-y-10">
          <section>
            <div className="mb-10">
              <h1 className="text-4xl font-black tracking-tight mb-2 text-gray-900">
                Thanh toán
              </h1>
              <p className="text-gray-500">
                {currentUser
                  ? `Xin chào, ${currentUser.hoTen}.`
                  : "Vui lòng kiểm tra lại thông tin."}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">
                local_shipping
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                Thông tin giao hàng
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input w-full bg-white rounded-lg border border-gray-300 h-12 px-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input w-full bg-white rounded-lg border border-gray-300 h-12 px-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    placeholder="0901 234 567"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email{" "}
                  {!currentUser && <span className="text-red-500">*</span>}
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input w-full bg-white rounded-lg border border-gray-300 h-12 px-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  placeholder="email@example.com"
                />
              </div>

              {/* React Select */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Tỉnh / Thành <span className="text-red-500">*</span>
                  </label>
                  <Select
                    unstyled
                    options={provinceOptions}
                    value={
                      provinceOptions.find(
                        (opt) => opt.value === selectedProvinceId,
                      ) || null
                    }
                    onChange={handleSelectProvince}
                    placeholder="Chọn Tỉnh/Thành"
                    isSearchable
                    isClearable
                    classNames={selectClassNames}
                    noOptionsMessage={() => "Không tìm thấy kết quả"}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Quận / Huyện <span className="text-red-500">*</span>
                  </label>
                  <Select
                    unstyled
                    options={districtOptions}
                    value={
                      districtOptions.find(
                        (opt) => opt.value === selectedDistrictId,
                      ) || null
                    }
                    onChange={handleSelectDistrict}
                    placeholder="Chọn Quận/Huyện"
                    isSearchable
                    isClearable
                    isDisabled={!selectedProvinceId}
                    classNames={selectClassNames}
                    noOptionsMessage={() => "Không tìm thấy kết quả"}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Phường / Xã <span className="text-red-500">*</span>
                  </label>
                  <Select
                    unstyled
                    options={wardOptions}
                    value={
                      wardOptions.find(
                        (opt) => opt.label === formData.phuongXa,
                      ) || null
                    }
                    onChange={handleSelectWard}
                    placeholder="Chọn Phường/Xã"
                    isSearchable
                    isClearable
                    isDisabled={!selectedDistrictId}
                    classNames={selectClassNames}
                    noOptionsMessage={() => "Không tìm thấy kết quả"}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Địa chỉ cụ thể <span className="text-red-500">*</span>
                </label>
                <input
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleInputChange}
                  className="form-input w-full bg-white rounded-lg border border-gray-300 h-12 px-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Số nhà, tên đường, tòa nhà..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Ghi chú (Tùy chọn)
                </label>
                <input
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="form-input w-full bg-white rounded-lg border border-gray-300 h-12 px-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Ghi chú cho shipper..."
                />
              </div>
            </div>
          </section>

          {/* Payment Methods */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">
                account_balance_wallet
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                Phương thức thanh toán
              </h2>
            </div>
            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer group transition-all ${
                  paymentMethod === "COD"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                } ${
                  !currentUser
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    className="text-primary focus:ring-primary h-5 w-5 accent-primary"
                    name="payment"
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={!currentUser}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="text-xs text-gray-500">
                      {!currentUser
                        ? "Chỉ dành cho thành viên"
                        : "Thanh toán tiền mặt cho shipper"}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">
                  local_shipping
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer group transition-all ${
                  paymentMethod === "MOMO"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    className="text-primary focus:ring-primary h-5 w-5 accent-primary"
                    name="payment"
                    type="radio"
                    value="MOMO"
                    checked={paymentMethod === "MOMO"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">
                      Ví điện tử MoMo
                    </span>
                    <span className="text-xs text-gray-500">
                      Quét mã QR MoMo
                    </span>
                  </div>
                </div>
                <div className="size-8 bg-[#A50064] rounded flex items-center justify-center text-white text-[10px] font-bold">
                  MOMO
                </div>
              </label>

              <label
                className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer group transition-all ${
                  paymentMethod === "VNPAY"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    className="text-primary focus:ring-primary h-5 w-5 accent-primary"
                    name="payment"
                    type="radio"
                    value="VNPAY"
                    checked={paymentMethod === "VNPAY"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">
                      VNPAY / Ngân hàng
                    </span>
                    <span className="text-xs text-gray-500">
                      Quét mã QR ngân hàng (MB, VCB...)
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">
                  qr_code_scanner
                </span>
              </label>
            </div>
          </section>

          <div className="flex items-center justify-center gap-6 py-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <span className="material-symbols-outlined text-sm">lock</span>
              Thanh toán an toàn 256-bit SSL
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <span className="material-symbols-outlined text-sm">
                verified_user
              </span>
              Bảo mật thông tin khách hàng
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: SUMMARY --- */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              Đơn hàng của bạn ({selectedItems.length})
            </h2>
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto scrollbar-thin pr-2">
              {selectedItems.map((item) => (
                <div key={item.sanPhamId || item.id} className="flex gap-4">
                  <div className="size-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    <img
                      src={getImageUrl(item.hinhAnh)}
                      alt={item.tenSanPham}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm leading-tight mb-1 text-gray-800 line-clamp-2">
                      {item.tenSanPham}
                    </p>
                    <p className="text-xs text-gray-500">
                      Số lượng: {item.soLuong}
                    </p>
                    <p className="font-bold text-primary mt-1">
                      {formatCurrency(item.donGia * item.soLuong)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                Mã giảm giá
              </label>
              <div className="flex gap-2">
                <input
                  name="voucherCode"
                  value={formData.voucherCode}
                  onChange={handleInputChange}
                  className="form-input flex-1 bg-white rounded-lg border border-gray-300 h-10 px-3 focus:ring-1 focus:ring-primary focus:border-primary text-sm outline-none"
                  placeholder="Nhập mã..."
                />
                <button
                  type="button"
                  // --- THAY ALERT ---
                  onClick={() =>
                    toast.info("Tính năng đang phát triển", { autoClose: 1500 })
                  }
                  className="bg-primary/10 hover:bg-primary/20 text-primary font-bold px-4 rounded-lg text-sm transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-6 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>{formatCurrency(SHIPPING_FEE)}</span>
              </div>
              {DISCOUNT > 0 && (
                <div className="flex justify-between text-primary font-medium italic">
                  <span>Giảm giá</span>
                  <span>-{formatCurrency(DISCOUNT)}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-4 border-t border-dashed border-gray-200 mt-4">
                <span className="text-lg font-bold text-gray-900">
                  Tổng cộng
                </span>
                <div className="text-right">
                  <span className="block text-2xl font-black text-primary leading-none">
                    {formatCurrency(FINAL_TOTAL)}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    (Đã bao gồm VAT)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !isFormValid}
              className={`w-full font-extrabold py-4 rounded-xl text-lg transition-all flex items-center justify-center gap-2 ${
                loading || !isFormValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-primary text-white hover:brightness-105 active:scale-[0.98] shadow-lg shadow-primary/20"
              }`}
            >
              {loading ? (
                <span>ĐANG XỬ LÝ...</span>
              ) : (
                <>
                  <span>ĐẶT HÀNG NGAY</span>
                  <span className="material-symbols-outlined font-bold">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-gray-400 mt-4 px-4">
              Bằng việc nhấn "Đặt hàng", bạn đồng ý với Điều khoản dịch vụ &
              Chính sách bảo mật của PetLor.
            </p>
          </div>
        </div>
      </div>

      {/* --- [NEW] MODAL QUÉT QR CODE --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-primary p-6 text-center">
              <h3 className="text-white text-xl font-bold uppercase tracking-wide">
                Thanh toán {paymentMethod}
              </h3>
              <p className="text-white/80 text-sm mt-1">
                Vui lòng quét mã bên dưới để thanh toán
              </p>
            </div>

            {/* QR Image */}
            <div className="p-8 flex flex-col items-center justify-center space-y-4">
              <div className="relative group">
                {/* QR Code */}
                <img
                  src={`https://img.vietqr.io/image/MB-0969696969-compact2.png?amount=${FINAL_TOTAL}&addInfo=${paymentMethod}%20${
                    createdOrderId || "DONHANG"
                  }`}
                  alt="QR Code Payment"
                  className="w-64 h-64 object-contain border-2 border-dashed border-gray-300 rounded-lg p-2"
                />
                <div className="absolute -bottom-6 left-0 w-full text-center">
                  <span className="bg-white px-2 text-xs font-bold text-gray-500">
                    Tự động điền số tiền & nội dung
                  </span>
                </div>
              </div>

              <div className="text-center space-y-1 pt-4">
                <p className="text-gray-500 text-sm">Tổng tiền thanh toán</p>
                <p className="text-3xl font-black text-primary">
                  {formatCurrency(FINAL_TOTAL)}
                </p>
              </div>

              <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg w-full text-center">
                <span className="font-bold">Lưu ý:</span> Vui lòng không sửa nội
                dung chuyển khoản để hệ thống tự động xác nhận.
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              >
                Đóng / Hủy
              </button>
              <button
                onClick={finishOrderProcess}
                className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">
                  check_circle
                </span>
                Đã thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;
