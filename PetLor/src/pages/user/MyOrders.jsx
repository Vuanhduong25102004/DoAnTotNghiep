import React, { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import OrderDetailModal from "./modals/OrderDetailModal";
import ReviewModal from "./modals/ReviewModal";
import orderService from "../../services/orderService";
import reviewService from "../../services/reviewService";
import { toast } from "react-toastify"; // 1. Import toast
import {
  formatCurrency,
  formatJustDate,
  getOrderStatusConfig,
} from "../../utils/formatters";
import AOS from "aos";

const MyOrders = () => {
  const [user] = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Chờ xử lý");
  const tabs = ["Chờ xử lý", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"];

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // State Modals
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [orderToReview, setOrderToReview] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // --- FETCH DATA ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders();
      const data = res.data || res;
      let list = Array.isArray(data) ? data : [];
      list.sort((a, b) => new Date(b.ngayDatHang) - new Date(a.ngayDatHang));
      setOrders(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCancelReasons = async () => {
    try {
      const res = await orderService.getCancelReasons();
      const data = res.data || res;
      setCancelReasons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCancelReasons();
    AOS.init({ duration: 800 });
  }, []);

  // --- HANDLERS ---
  const handleOpenDetail = async (id) => {
    setShowDetailModal(true);
    setLoadingDetail(true);
    try {
      const res = await orderService.getOrderById(id);
      setOrderDetail(res.data || res);
    } catch (error) {
      setShowDetailModal(false);
      toast.error("Không thể tải chi tiết đơn hàng."); // Thêm toast
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenReview = (order) => {
    setOrderToReview(order);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (payload) => {
    setIsSubmittingReview(true);
    try {
      await reviewService.createBulkReviews(payload);
      setShowReviewModal(false);
      // 2. Thay alert bằng toast
      toast.success("Cảm ơn bạn đã đánh giá!");
      fetchOrders();
    } catch (error) {
      // 3. Thay alert bằng toast
      toast.error(error.response?.data?.message || "Lỗi khi gửi đánh giá");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleOpenCancelModal = (order) => {
    setOrderToCancel(order);
    setSelectedReason("");
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    try {
      await orderService.cancelMyOrder(orderToCancel.donHangId, {
        lyDoHuy: selectedReason,
      });
      setShowCancelModal(false);
      fetchOrders();
      // 4. Thay alert bằng toast
      toast.success("Hủy đơn hàng thành công!");
    } catch (error) {
      // 5. Thay alert bằng toast
      toast.error(error.response?.data?.message || "Lỗi khi hủy đơn hàng");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) => order.trangThai === activeTab,
  );

  return (
    <main className="flex-1 space-y-6 animate-fade-in pb-20">
      {/* HEADER */}
      <div
        className="bg-white rounded-3xl p-8 shadow-sm relative overflow-hidden border border-gray-100 isolate"
        data-aos="fade-down"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#10B981]/10 to-transparent"></div>
        <span className="material-symbols-outlined absolute -right-6 -bottom-8 text-9xl text-[#10B981]/5 rotate-12 select-none">
          receipt_long
        </span>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Lịch sử <span className="text-[#10B981]">đơn hàng</span>
            </h1>
            <p className="text-gray-500 text-lg">
              Theo dõi hành trình đơn hàng của bạn.
            </p>
          </div>
          <Link
            to="/products"
            className="bg-[#10B981] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2"
          >
            <span className="material-icons-outlined">shopping_bag</span> Tiếp
            tục mua sắm
          </Link>
        </div>
      </div>

      {/* TABS */}
      <div
        className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 inline-flex flex-wrap gap-1"
        data-aos="fade-up"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab
                ? "bg-[#2a9d8f] text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* DANH SÁCH ĐƠN HÀNG */}
      <div className="space-y-8" data-aos="fade-up">
        {loading ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#10B981] mb-4"></div>
            <p className="font-medium">Đang tải đơn hàng...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const ui = getOrderStatusConfig(order.trangThai);
            const firstItem = order.chiTietDonHangs?.[0];
            const totalQuantity =
              order.chiTietDonHangs?.reduce(
                (sum, item) => sum + item.soLuong,
                0,
              ) || 0;

            const hasUnratedItems = order.chiTietDonHangs?.some(
              (item) => !item.daDanhGia,
            );

            return (
              <div
                key={order.donHangId}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 group"
              >
                <div className={`h-1.5 w-full ${ui.topBarColor}`}></div>
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${ui.bgColor} ${ui.textColor} ${ui.borderColor}`}
                      >
                        <span className="material-icons-outlined">
                          {ui.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
                          Đặt ngày {formatJustDate(order.ngayDatHang)}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 truncate max-w-[250px] md:max-w-[400px]">
                          {order.trangThai === "Đã hủy" ? (
                            <span className="text-red-500">
                              Lý do hủy: {order.lyDoHuy || "Khách hàng yêu cầu"}
                            </span>
                          ) : (
                            <span>
                              {firstItem?.tenSanPham || "Sản phẩm PetCare"}
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${ui.bgColor} ${ui.borderColor}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${ui.topBarColor} ${
                          order.trangThai !== "Đã giao" &&
                          order.trangThai !== "Đã hủy"
                            ? "animate-pulse"
                            : ""
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-bold uppercase tracking-wide ${ui.textColor}`}
                      >
                        {order.trangThai}
                      </span>
                    </div>
                  </div>

                  {/* STEPPER */}
                  {order.trangThai !== "Đã hủy" && (
                    <div className="hidden sm:flex items-center justify-between relative mb-12 px-10">
                      <div className="absolute left-0 top-4 w-full h-1.5 bg-gray-100 rounded-full"></div>
                      <div
                        className="absolute left-0 top-4 h-1.5 bg-gradient-to-r from-[#10B981] to-[#2a9d8f] rounded-full transition-transform duration-[1500ms] ease-out origin-left z-0"
                        style={{
                          width: "100%",
                          transform: `scaleX(${ui.percent})`,
                        }}
                      ></div>
                      <StepItem
                        icon="check"
                        label="Đã đặt"
                        active={ui.step >= 1}
                      />
                      <StepItem
                        icon="thumb_up"
                        label="Xác nhận"
                        active={
                          ui.step >= 2 || order.trangThai === "Đã xác nhận"
                        }
                        current={order.trangThai === "Đã xác nhận"}
                      />
                      <StepItem
                        icon="inventory_2"
                        label="Xử lý"
                        active={ui.step >= 3}
                        current={
                          order.trangThai === "Chờ xử lý" ? false : false
                        }
                      />
                      <StepItem
                        icon="local_shipping"
                        label="Vận chuyển"
                        active={ui.step >= 4}
                        current={order.trangThai === "Đang giao"}
                      />
                      <StepItem
                        icon="home"
                        label="Thành công"
                        active={ui.step >= 5}
                        current={order.trangThai === "Đã giao"}
                      />
                    </div>
                  )}

                  {/* Product Box */}
                  <div className="bg-gray-50 rounded-2xl p-5 mb-6 flex flex-col md:flex-row gap-6 border border-gray-100">
                    <div className="flex-grow flex items-center gap-4">
                      <div className="h-20 w-20 rounded-xl bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                        {firstItem?.hinhAnh ? (
                          <img
                            src={`${API_URL}/uploads/${firstItem.hinhAnh}`}
                            className="w-full h-full object-cover"
                            alt="product"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <span className="material-icons-outlined text-3xl">
                              shopping_bag
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 text-lg truncate">
                          {firstItem?.tenSanPham || "Sản phẩm PetCare"}...
                        </h4>
                        <p className="text-sm text-gray-500">
                          {totalQuantity} sản phẩm • {order.phuongThucThanhToan}
                        </p>
                      </div>
                    </div>
                    <div className="md:border-l md:pl-8 flex flex-col justify-center md:items-end">
                      <span className="text-xs text-gray-400 font-bold uppercase mb-1">
                        Tổng tiền
                      </span>
                      <span className="text-2xl font-black text-[#2a9d8f]">
                        {formatCurrency(order.tongThanhToan)}
                      </span>
                    </div>
                  </div>

                  {/* LOGIC NÚT BẤM */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-sm bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-medium">
                      <span className="material-icons-outlined text-base">
                        {order.trangThai === "Đã hủy" ? "info" : "schedule"}
                      </span>
                      {order.trangThai === "Đã hủy"
                        ? "Đơn hàng đã bị hủy bỏ."
                        : order.trangThai === "Đã giao"
                          ? "Giao hàng thành công."
                          : order.trangThai === "Đã xác nhận"
                            ? "Đơn hàng đã được xác nhận, đang đóng gói."
                            : order.trangThai === "Đang giao"
                              ? "Đơn hàng đang trên đường đến bạn."
                              : "Dự kiến nhận hàng sau 2-3 ngày."}
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      {/* Nút Đánh giá */}
                      {order.trangThai === "Đã giao" &&
                        (hasUnratedItems ? (
                          <button
                            onClick={() => handleOpenReview(order)}
                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-400 text-white hover:bg-amber-500 shadow-lg shadow-amber-100 transition flex items-center justify-center gap-2"
                          >
                            <span className="material-icons text-sm">
                              stars
                            </span>{" "}
                            Đánh giá
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <span className="material-icons text-sm">
                              check_circle
                            </span>{" "}
                            Đã đánh giá
                          </button>
                        ))}

                      {/* Nút Mua lại */}
                      {(order.trangThai === "Đã hủy" ||
                        order.trangThai === "Đã giao") && (
                        <Link
                          to={`/products/${firstItem?.sanPhamId || ""}`}
                          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold border border-[#10B981] text-[#10B981] hover:bg-emerald-50 transition flex items-center justify-center gap-2"
                        >
                          <span className="material-icons text-sm">
                            refresh
                          </span>{" "}
                          Mua lại
                        </Link>
                      )}

                      {/* Nút Hủy */}
                      {order.trangThai === "Chờ xử lý" && (
                        <button
                          onClick={() => handleOpenCancelModal(order)}
                          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold border border-red-100 text-red-500 hover:bg-red-50 transition"
                        >
                          Hủy đơn
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenDetail(order.donHangId)}
                        className="flex-1 sm:flex-none h-11 px-8 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <span className="material-icons-outlined text-6xl text-gray-200 mb-4">
              shopping_basket
            </span>
            <p className="text-gray-400 font-medium">
              Không tìm thấy đơn hàng nào.
            </p>
          </div>
        )}
      </div>

      {/* --- MODAL HỦY --- */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-8 pb-4 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-outlined text-red-500 text-4xl">
                  report_problem
                </span>
              </div>
              <h3 className="text-2xl font-black text-gray-900">
                Hủy đơn hàng?
              </h3>
              <p className="text-gray-500 mt-2">
                Vui lòng chọn lý do để chúng tôi cải thiện dịch vụ.
              </p>
            </div>
            <div className="p-8 pt-4 space-y-3">
              {cancelReasons.map((reason, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full text-left p-4 rounded-2xl border-2 font-bold transition-all flex items-center justify-between ${
                    selectedReason === reason
                      ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                      : "border-gray-100 text-gray-600 hover:border-gray-200"
                  }`}
                >
                  {reason}{" "}
                  {selectedReason === reason && (
                    <span className="material-icons text-red-500">
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="p-8 pt-0 flex gap-3">
              <button
                disabled={isSubmitting}
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition"
              >
                Quay lại
              </button>
              <button
                disabled={isSubmitting || !selectedReason}
                onClick={handleConfirmCancel}
                className={`flex-[2] py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                  !selectedReason || isSubmitting
                    ? "bg-gray-200"
                    : "bg-red-500 hover:bg-red-600 hover:shadow-red-200"
                }`}
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- OTHER MODALS --- */}
      <OrderDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        detail={orderDetail}
        loading={loadingDetail}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        order={orderToReview}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmittingReview}
      />
    </main>
  );
};

const StepItem = ({ icon, label, active, current }) => (
  <div className="flex flex-col items-center gap-2 relative z-10">
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center ring-4 ring-white transition-all duration-700 ${
        current
          ? "bg-yellow-400 text-white shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-110"
          : active
            ? "bg-[#2a9d8f] text-white"
            : "bg-white text-gray-300 border border-gray-100"
      }`}
    >
      <span className="material-icons-outlined text-sm">{icon}</span>
    </div>
    <span
      className={`text-[10px] font-bold uppercase tracking-tighter transition-colors ${
        active ? "text-[#2a9d8f]" : "text-gray-400"
      }`}
    >
      {label}
    </span>
  </div>
);

export default MyOrders;
