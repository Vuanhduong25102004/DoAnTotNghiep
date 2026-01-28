import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderService from "../../../../services/orderService";

const ReceptionistOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // State thanh toán & xử lý
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isPaymentLocked, setIsPaymentLocked] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // State loading khi bấm nút xác nhận

  const IMAGE_BASE_URL = "http://localhost:8080/uploads/";

  // --- FETCH DATA ---
  const fetchOrderDetail = async () => {
    // Không set loading=true ở đây để tránh nháy trang khi update lại data sau khi bấm nút
    try {
      const response = await orderService.getOrderById(id);
      const data = response.data || response;
      setOrder(data);

      // Logic khóa phương thức thanh toán
      if (data.phuongThucThanhToan) {
        setIsPaymentLocked(true);
        if (data.phuongThucThanhToan === "COD") setPaymentMethod("cash");
        else if (
          ["VNPAY", "MOMO", "ZALOPAY"].includes(data.phuongThucThanhToan)
        )
          setPaymentMethod("wallet");
        else setPaymentMethod("pos");
      } else {
        setIsPaymentLocked(false);
        setPaymentMethod("cash");
      }
    } catch (error) {
      console.error("Lỗi lấy chi tiết đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetail();
  }, [id]);

  // --- XỬ LÝ CẬP NHẬT TRẠNG THÁI (API MỚI) ---
  const handleUpdateStatus = async (newStatus) => {
    if (
      !window.confirm(`Bạn có chắc muốn chuyển trạng thái sang "${newStatus}"?`)
    )
      return;

    setIsUpdating(true);
    try {
      // Gọi API PUT /api/don-hang/{id}
      await orderService.updateOrder(id, {
        trangThai: newStatus,
      });

      alert("Cập nhật trạng thái thành công!");
      fetchOrderDetail(); // Load lại dữ liệu mới nhất
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- HELPERS ---
  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const getPetInitials = (name) =>
    name ? name.substring(0, 2).toUpperCase() : "??";
  const calculatePoints = (total) =>
    Math.floor((total || 0) / 1000).toLocaleString();

  const getPaymentOptionClass = (methodName) => {
    const isSelected = paymentMethod === methodName;
    let classes =
      "relative flex items-center gap-4 p-4 border-2 rounded-2xl transition-all ";
    if (isSelected) classes += "border-[#2a9d90] bg-[#2a9d90]/5 shadow-sm";
    else if (isPaymentLocked)
      classes += "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed";
    else
      classes +=
        "border-[#e9f1f0] hover:border-[#d1dada] hover:bg-gray-50 cursor-pointer";
    return classes;
  };

  // Helper xác định nút bấm dựa trên trạng thái hiện tại
  const renderActionButtons = () => {
    if (!order) return null;

    // Logic hiển thị nút theo quy trình
    switch (order.trangThai) {
      case "Chờ xử lý":
      case "CHO_XU_LY":
        return (
          <button
            onClick={() => handleUpdateStatus("DA_XAC_NHAN")}
            disabled={isUpdating}
            className="w-full h-14 bg-[#2a9d90] text-white rounded-2xl text-lg font-bold shadow-lg shadow-[#2a9d90]/30 hover:bg-[#258a7e] transition-all flex items-center justify-center gap-3 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              "Đang xử lý..."
            ) : (
              <>
                <span className="material-symbols-outlined">check_circle</span>{" "}
                Xác nhận đơn hàng
              </>
            )}
          </button>
        );
      case "Đã xác nhận":
      case "DA_XAC_NHAN":
        return (
          <button
            onClick={() => handleUpdateStatus("DANG_GIAO")}
            disabled={isUpdating}
            className="w-full h-14 bg-blue-500 text-white rounded-2xl text-lg font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 disabled:opacity-70"
          >
            {isUpdating ? (
              "Đang xử lý..."
            ) : (
              <>
                <span className="material-symbols-outlined">
                  local_shipping
                </span>{" "}
                Giao cho vận chuyển
              </>
            )}
          </button>
        );
      case "Đang giao":
      case "DANG_GIAO":
        return (
          <button
            onClick={() => handleUpdateStatus("DA_GIAO")}
            disabled={isUpdating}
            className="w-full h-14 bg-green-500 text-white rounded-2xl text-lg font-bold shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 disabled:opacity-70"
          >
            {isUpdating ? (
              "Đang xử lý..."
            ) : (
              <>
                <span className="material-symbols-outlined">task_alt</span> Hoàn
                thành đơn
              </>
            )}
          </button>
        );
      case "Đã giao":
      case "DA_GIAO":
        return (
          <button
            disabled
            className="w-full h-14 bg-gray-100 text-green-600 border border-green-200 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 cursor-default"
          >
            <span className="material-symbols-outlined">verified</span> Đơn hàng
            hoàn tất
          </button>
        );
      case "Đã hủy":
      case "DA_HUY":
        return (
          <button
            disabled
            className="w-full h-14 bg-red-50 text-red-500 border border-red-100 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 cursor-default"
          >
            <span className="material-symbols-outlined">cancel</span> Đơn hàng
            đã hủy
          </button>
        );
      default:
        return (
          <button className="w-full h-14 bg-gray-200 text-gray-500 rounded-2xl text-lg font-bold cursor-not-allowed">
            Trạng thái không xác định
          </button>
        );
    }
  };

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#fbfcfc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2a9d90]"></div>
      </div>
    );
  if (!order) return null;

  return (
    <main className="w-full bg-[#fbfcfc] font-sans text-[#101918] min-h-screen p-8 lg:p-12 relative">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="size-12 rounded-[20px] bg-white border border-[#e9f1f0] flex items-center justify-center text-[#588d87] hover:border-[#2a9d90] hover:text-[#2a9d90] shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-2xl">
              arrow_back
            </span>
          </button>
          <div>
            <h2 className="text-3xl font-extrabold text-[#101918]">
              Đơn hàng{" "}
              <span className="text-[#2a9d90]">#{order.donHangId}</span>
            </h2>
            <p className="text-[#588d87] font-medium mt-1">
              Trạng thái:{" "}
              <span className="font-bold text-[#2a9d90] uppercase">
                {order.trangThai}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="xl:col-span-8 space-y-8">
            {/* Product List */}
            <section className="bg-white rounded-[40px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="p-8 border-b border-[#e9f1f0] flex justify-between items-center bg-[#f9fbfb]">
                <h3 className="text-xl font-extrabold text-[#101918] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2a9d90]">
                    shopping_bag
                  </span>{" "}
                  Sản phẩm & Dịch vụ
                </h3>
                <span className="text-xs font-bold text-[#2a9d90] bg-[#2a9d90]/10 px-4 py-2 rounded-xl">
                  {order.chiTietDonHangs?.length || 0} sản phẩm
                </span>
              </div>
              <div className="divide-y divide-[#e9f1f0]">
                {order.chiTietDonHangs?.map((item) => (
                  <div
                    key={item.id}
                    className="p-8 flex items-center gap-6 hover:bg-[#f9fbfb] transition-colors group"
                  >
                    <div className="size-20 rounded-2xl overflow-hidden shrink-0 border border-[#e9f1f0] shadow-sm group-hover:shadow-md transition-all flex items-center justify-center bg-gray-50">
                      {item.hinhAnh ? (
                        <img
                          alt={item.tenSanPham}
                          className="w-full h-full object-cover"
                          src={`${IMAGE_BASE_URL}${item.hinhAnh}`}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex items-center justify-center text-gray-300"
                        style={{ display: item.hinhAnh ? "none" : "flex" }}
                      >
                        <span className="material-symbols-outlined text-3xl">
                          inventory_2
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg text-[#101918]">
                        {item.tenSanPham}
                      </h4>
                      <p className="text-sm font-medium text-[#588d87] mt-1">
                        {item.tenDanhMuc || "Sản phẩm"}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-10">
                      <div className="text-sm">
                        <span className="text-[#588d87] font-medium block text-xs uppercase tracking-wider mb-1">
                          Số lượng
                        </span>
                        <span className="font-extrabold text-lg text-[#101918] bg-gray-50 px-3 py-1 rounded-lg border border-[#e9f1f0]">
                          {item.soLuong}
                        </span>
                      </div>
                      <div className="w-32">
                        <span className="text-[#588d87] font-medium block text-xs uppercase tracking-wider mb-1">
                          Thành tiền
                        </span>
                        <p className="font-black text-lg text-[#2a9d90]">
                          {formatMoney(item.donGia * item.soLuong)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Customer Info */}
            <section className="bg-white rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  {order.anhNguoiNhan ? (
                    <img
                      alt="Customer"
                      className="size-16 rounded-full border-[3px] border-white shadow-md object-cover"
                      src={`${IMAGE_BASE_URL}${order.anhNguoiNhan}`}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="size-16 rounded-full border-[3px] border-white shadow-md bg-[#2a9d90] text-white flex items-center justify-center font-bold text-xl"
                    style={{ display: order.anhNguoiNhan ? "none" : "flex" }}
                  >
                    {getPetInitials(order.tenNguoiNhan)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#2a9d90] text-white rounded-full p-1 border-2 border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm block">
                      person
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2a9d90] uppercase tracking-widest mb-1">
                    Thông tin khách hàng
                  </p>
                  <h4 className="font-extrabold text-xl text-[#101918]">
                    {order.tenNguoiNhan}
                  </h4>
                  <p className="text-sm font-medium text-[#588d87] mt-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      call
                    </span>{" "}
                    {order.soDienThoaiNhan}
                  </p>
                  <p className="text-xs text-[#588d87] mt-1 ml-6 truncate max-w-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>{" "}
                    {order.diaChiGiaoHang}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="xl:col-span-4 space-y-8">
            <div className="bg-white rounded-[40px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 p-8 space-y-8">
              <h3 className="text-xl font-extrabold text-[#101918] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2a9d90]">
                  receipt_long
                </span>{" "}
                Thanh toán
              </h3>

              {/* Bill Details */}
              <div className="space-y-4 p-6 bg-[#f9fbfb] rounded-[24px] border border-[#e9f1f0]">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-[#588d87]">Tạm tính</span>
                  <span className="font-bold text-[#101918]">
                    {formatMoney(order.tongTienHang)}
                  </span>
                </div>
                {order.soTienGiam > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-[#2a9d90] font-bold">
                      <span className="material-symbols-outlined text-[18px]">
                        sell
                      </span>{" "}
                      Giảm giá
                    </span>
                    <span className="font-bold text-[#2a9d90]">
                      - {formatMoney(order.soTienGiam)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-[#588d87]">
                    Phí vận chuyển
                  </span>
                  <span className="font-bold text-[#101918]">
                    {order.phiVanChuyen
                      ? formatMoney(order.phiVanChuyen)
                      : "Miễn phí"}
                  </span>
                </div>
                <div className="pt-4 border-t border-dashed border-[#d1dada] flex justify-between items-center">
                  <span className="text-base font-extrabold text-[#101918]">
                    Tổng thanh toán
                  </span>
                  <span className="text-3xl font-black text-[#2a9d90]">
                    {formatMoney(order.tongThanhToan)}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#588d87] ml-1">
                    Phương thức thanh toán
                  </p>
                  {isPaymentLocked && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-bold border border-gray-200">
                      Đã chốt
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {/* TIỀN MẶT */}
                  <label className={getPaymentOptionClass("cash")}>
                    <input
                      type="radio"
                      name="payment"
                      className="text-[#2a9d90] focus:ring-[#2a9d90] size-5"
                      checked={paymentMethod === "cash"}
                      onChange={() =>
                        !isPaymentLocked && setPaymentMethod("cash")
                      }
                      disabled={isPaymentLocked}
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center ${paymentMethod === "cash" || !isPaymentLocked ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                      >
                        <span className="material-symbols-outlined">
                          payments
                        </span>
                      </div>
                      <span
                        className={`font-bold ${paymentMethod === "cash" ? "text-[#101918]" : "text-gray-500"}`}
                      >
                        Tiền mặt (COD)
                      </span>
                    </div>
                  </label>
                  {/* THẺ TÍN DỤNG */}
                  <label className={getPaymentOptionClass("pos")}>
                    <input
                      type="radio"
                      name="payment"
                      className="text-[#2a9d90] focus:ring-[#2a9d90] size-5"
                      checked={paymentMethod === "pos"}
                      onChange={() =>
                        !isPaymentLocked && setPaymentMethod("pos")
                      }
                      disabled={isPaymentLocked}
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center ${paymentMethod === "pos" || !isPaymentLocked ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                      >
                        <span className="material-symbols-outlined">
                          credit_card
                        </span>
                      </div>
                      <span
                        className={`font-bold ${paymentMethod === "pos" ? "text-[#101918]" : "text-gray-500"}`}
                      >
                        Thẻ tín dụng (POS)
                      </span>
                    </div>
                  </label>
                  {/* VÍ ĐIỆN TỬ */}
                  <label className={getPaymentOptionClass("wallet")}>
                    <input
                      type="radio"
                      name="payment"
                      className="text-[#2a9d90] focus:ring-[#2a9d90] size-5"
                      checked={paymentMethod === "wallet"}
                      onChange={() =>
                        !isPaymentLocked && setPaymentMethod("wallet")
                      }
                      disabled={isPaymentLocked}
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center ${paymentMethod === "wallet" || !isPaymentLocked ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-400"}`}
                      >
                        <span className="material-symbols-outlined">
                          account_balance_wallet
                        </span>
                      </div>
                      <span
                        className={`font-bold ${paymentMethod === "wallet" ? "text-[#101918]" : "text-gray-500"}`}
                      >
                        Chuyển khoản / Ví
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons - CHỖ NÀY ĐÃ ĐƯỢC CẬP NHẬT */}
              <div className="space-y-4 pt-2">
                {renderActionButtons()}

                {/* Nút in hóa đơn - Luôn hiện nhưng có thể disable nếu chưa thanh toán/hoàn tất */}
                <button className="w-full h-12 text-[#588d87] font-bold hover:text-[#101918] transition-colors flex items-center justify-center gap-2 hover:bg-[#f9fbfb] rounded-2xl border border-transparent hover:border-[#e9f1f0]">
                  <span className="material-symbols-outlined">print</span> In
                  phiếu giao hàng
                </button>
              </div>
            </div>

            {/* Loyalty */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-[24px] border border-yellow-100 p-6 flex items-center gap-4 shadow-sm">
              <div className="size-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-yellow-500 border border-yellow-100">
                <span className="material-symbols-outlined text-3xl">
                  stars
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide">
                  Tích lũy sau đơn này
                </p>
                <p className="text-2xl font-black text-[#101918]">
                  +{calculatePoints(order.tongThanhToan)}{" "}
                  <span className="text-sm font-bold text-[#588d87]">điểm</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReceptionistOrderDetail;
