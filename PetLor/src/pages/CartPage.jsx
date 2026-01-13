import React, { useEffect, useState, useMemo } from "react"; // 1. Thêm useMemo
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatters";
import { SERVER_URL } from "../services/apiClient";
import ConfirmDeleteModal from "./admin/components/ConfirmDeleteModal";
import VoucherModal from "../components/VoucherModal";
import promotionService from "../services/promotionService";

const CartPage = () => {
  const {
    cartData,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    selectedItemIds,
    toggleSelectItem,
    selectAllItems,
    selectedStat,
  } = useCart();

  // State cho Modal Xóa (cũ)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const navigate = useNavigate();

  const getImageUrl = (imageName) => {
    if (!imageName) return "https://placehold.co/400x400?text=No+Image";
    if (imageName.startsWith("http")) return imageName;
    return `${SERVER_URL}/uploads/${imageName}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const aosInit = setTimeout(() => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        easing: "ease-out-cubic",
      });
      AOS.refresh();
    }, 100);

    fetchCart();

    return () => clearTimeout(aosInit);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, [cartData]);

  useEffect(() => {
    if (appliedVoucher) {
      setAppliedVoucher(null);
      setDiscountAmount(0);
    }
  }, [selectedStat.totalPrice]);

  // --- 2. LOGIC SẮP XẾP: MỚI NHẤT LÊN ĐẦU ---
  const sortedItems = useMemo(() => {
    if (!cartData?.items) return [];

    // Tạo bản sao để không ảnh hưởng dữ liệu gốc
    return [...cartData.items].sort((a, b) => {
      // So sánh ngày thêm (Giảm dần)
      const dateA = new Date(a.ngayThem);
      const dateB = new Date(b.ngayThem);
      return dateB - dateA;
    });
  }, [cartData]);

  const finalDisplayPrice = Math.max(
    0,
    selectedStat.totalPrice - discountAmount
  );

  // HÀM XỬ LÝ MÃ
  const handleApplyVoucher = async (code) => {
    if (selectedStat.totalPrice === 0) {
      alert("Vui lòng chọn sản phẩm trước khi áp mã!");
      return;
    }

    const payload = {
      maCode: code,
      giaTriDonHang: selectedStat.totalPrice,
    };

    console.log("🚀 DỮ LIỆU GỬI LÊN API:", payload);

    try {
      const response = await promotionService.validateCoupon(
        payload.maCode,
        payload.giaTriDonHang
      );

      console.log("✅ KẾT QUẢ API TRẢ VỀ:", response);

      const discount = response?.soTienGiam || response?.data?.soTienGiam || 0;

      if (discount > 0) {
        setAppliedVoucher(code);
        setDiscountAmount(discount);
        setIsVoucherModalOpen(false);
        alert(`Áp dụng thành công! Giảm ${formatCurrency(discount)}`);
      } else {
        alert("Mã hợp lệ nhưng không được giảm giá (0đ).");
        setAppliedVoucher(null);
        setDiscountAmount(0);
      }
    } catch (error) {
      console.error("❌ LỖI API:", error);
      const errorMsg =
        error.response?.data?.message || "Lỗi khi áp dụng mã khuyến mãi!";
      alert(errorMsg);
      setAppliedVoucher(null);
      setDiscountAmount(0);
    }
  };

  const handleCheckout = () => {
    if (selectedStat.countItems === 0) {
      alert("Bạn chưa chọn sản phẩm nào để thanh toán!");
      return;
    }
    // Lấy item từ danh sách đã lọc (sortedItems) hoặc gốc đều được vì ID không đổi
    const selectedItemsFullDetails = cartData.items.filter((item) =>
      selectedItemIds.includes(item.id)
    );

    navigate("/checkout", {
      state: {
        selectedItems: selectedItemsFullDetails,
        totalAmount: finalDisplayPrice,
        discountAmount: discountAmount,
        appliedVoucher: appliedVoucher,
      },
    });
  };

  const openDeleteModal = (cartDetailId, productId) => {
    setItemToDelete({ cartDetailId, productId });
    setIsModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedItemIds.length === 0) return;
    setItemToDelete(null);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsModalOpen(false);

    if (itemToDelete) {
      await removeFromCart(itemToDelete.cartDetailId, itemToDelete.productId);
      setItemToDelete(null);
    } else if (selectedItemIds.length > 0) {
      const isSelectingAll = selectedItemIds.length === cartData.items.length;
      if (isSelectingAll) {
        await clearCart();
      } else {
        const idsToDelete = [...selectedItemIds];
        for (const detailId of idsToDelete) {
          const item = cartData.items.find((i) => i.id === detailId);
          if (item) {
            await removeFromCart(item.id, item.sanPhamId);
          }
        }
        alert("Đã xóa các sản phẩm đã chọn!");
      }
    }
  };

  const handleDecreaseQuantity = (item) => {
    if (item.soLuong > 1) {
      updateQuantity(item.sanPhamId, item.soLuong - 1);
    } else {
      openDeleteModal(item.id, item.sanPhamId);
    }
  };

  const isAllSelected =
    cartData?.items?.length > 0 &&
    selectedItemIds.length === cartData.items.length;

  const gridColsClass =
    "grid grid-cols-[48px_1fr_120px_140px_120px_100px] items-center gap-2";

  return (
    <div className="w-full font-display bg-[#F5F5F5] text-gray-900 min-h-screen pt-24 pb-32">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* --- THANH TÌM KIẾM --- */}
        <div className="mb-6 hidden md:block" data-aos="fade-down">
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-primary/20 p-2 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">
                  pets
                </span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                Pet<span className="text-primary">Lor</span>
              </span>
              <div className="h-8 w-px bg-primary/30 mx-4 hidden md:block"></div>
              <span className="text-xl font-medium text-primary hidden md:block">
                Giỏ hàng
              </span>
            </div>

            <div className="flex items-center border-2 border-primary rounded-sm overflow-hidden bg-white w-full max-w-xl">
              <input
                className="flex-grow border-none outline-none focus:outline-none focus:ring-0 text-sm px-4 py-2 bg-transparent text-gray-900 placeholder-gray-400"
                placeholder="Tìm sản phẩm, thương hiệu và tên shop..."
                type="text"
              />
              <button className="bg-primary text-white px-6 py-2 flex items-center justify-center hover:bg-opacity-90 transition-all">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : !cartData?.items || cartData.items.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 bg-white rounded-sm shadow-sm border border-gray-100"
            data-aos="fade-up"
          >
            <span className="material-symbols-outlined text-6xl text-gray-200 mb-6">
              shopping_cart_off
            </span>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Giỏ hàng trống
            </h2>
            <Link
              to="/products"
              className="bg-primary text-white px-8 py-3 rounded-sm font-bold mt-4 hover:shadow-lg transition-all"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            {/* --- TABLE HEADER --- */}
            <div
              className="bg-white rounded-sm shadow-sm border border-gray-100 mb-4 px-6 py-4 hidden md:block"
              data-aos="fade-up"
            >
              <div
                className={`${gridColsClass} text-sm text-gray-500 font-medium`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300 cursor-pointer"
                    checked={isAllSelected}
                    onChange={(e) => {
                      selectAllItems(e.target.checked);
                    }}
                  />
                </div>
                <div>Sản phẩm</div>
                <div className="text-center">Đơn giá</div>
                <div className="text-center">Số lượng</div>
                <div className="text-center">Số tiền</div>
                <div className="text-center">Thao tác</div>
              </div>
            </div>

            {/* --- DANH SÁCH SẢN PHẨM --- */}
            <div
              className="bg-white rounded-sm shadow-sm border border-gray-100 mb-4 overflow-hidden"
              data-aos="fade-up"
            >
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300 cursor-pointer"
                  checked={isAllSelected}
                  onChange={(e) => selectAllItems(e.target.checked)}
                />
                <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  Yêu thích+
                </span>
                <span className="font-bold text-sm text-gray-900">
                  PetLor Official Store
                </span>
                <span className="material-symbols-outlined text-primary text-lg cursor-pointer">
                  chat
                </span>
              </div>

              {/* 3. SỬ DỤNG sortedItems THAY VÌ cartData.items */}
              {sortedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="px-6 py-6 border-b border-gray-50 last:border-0"
                >
                  {/* Desktop Layout */}
                  <div className={`hidden md:grid ${gridColsClass}`}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300 cursor-pointer"
                        checked={selectedItemIds.includes(item.id)}
                        onChange={() => {
                          toggleSelectItem(item.id);
                        }}
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-gray-50 border border-gray-100 p-1 flex-shrink-0">
                        <img
                          src={getImageUrl(item.hinhAnh)}
                          alt={item.tenSanPham}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="flex flex-col justify-center pr-4">
                        <Link
                          to={`/products/${item.sanPhamId}`}
                          className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary transition-colors"
                        >
                          {item.tenSanPham}
                        </Link>
                        <div className="flex items-center mt-1 text-xs text-green-600 border border-green-600 px-1 rounded w-fit">
                          Miễn phí đổi trả 15 ngày
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-500">
                      {formatCurrency(item.donGia)}
                    </div>
                    <div className="flex justify-center">
                      <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden">
                        <button
                          onClick={() => handleDecreaseQuantity(item)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500 border-r border-gray-200"
                        >
                          <span className="material-symbols-outlined text-sm">
                            remove
                          </span>
                        </button>
                        <input
                          className="w-10 h-8 text-center text-sm border-none focus:ring-0 bg-transparent text-gray-900"
                          type="text"
                          value={item.soLuong}
                          readOnly
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item.sanPhamId, item.soLuong + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500 border-l border-gray-200"
                        >
                          <span className="material-symbols-outlined text-sm">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="text-center text-sm font-bold text-primary">
                      {formatCurrency(item.donGia * item.soLuong)}
                    </div>
                    <div className="text-center">
                      <button
                        onClick={() => openDeleteModal(item.id, item.sanPhamId)}
                        className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="flex md:hidden gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300"
                        checked={selectedItemIds.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                      />
                    </div>
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-50 p-1 border rounded">
                      <img
                        src={getImageUrl(item.hinhAnh)}
                        className="w-full h-full object-contain mix-blend-multiply"
                        alt={item.tenSanPham}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium line-clamp-2 mb-1">
                        {item.tenSanPham}
                      </h3>
                      <div className="text-primary font-bold text-sm mb-2">
                        {formatCurrency(item.donGia)}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-gray-200 rounded-sm">
                          <button
                            onClick={() => handleDecreaseQuantity(item)}
                            className="px-2 py-1 text-gray-500"
                          >
                            -
                          </button>
                          <span className="px-2 text-sm">{item.soLuong}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.sanPhamId, item.soLuong + 1)
                            }
                            className="px-2 py-1 text-gray-500"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            openDeleteModal(item.id, item.sanPhamId)
                          }
                          className="text-xs text-red-500"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* STICKY FOOTER */}
      {cartData?.items?.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]"
          data-aos="fade-up"
          data-aos-offset="0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex justify-end items-center mb-3 pb-3 border-b border-gray-50 gap-4">
              <div className="flex items-center gap-2 text-primary">
                {appliedVoucher && (
                  <span className="ml-1 bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded border border-primary animate-pulse">
                    {appliedVoucher}
                  </span>
                )}
                <span className="material-symbols-outlined text-xl">
                  confirmation_number
                </span>
                <span className="text-sm font-medium">PetLor Voucher</span>
              </div>

              <button
                onClick={() => setIsVoucherModalOpen(true)}
                className="text-sm text-blue-500 hover:underline"
              >
                {appliedVoucher ? "Thay đổi" : "Chọn hoặc nhập mã"}
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300 cursor-pointer"
                    checked={isAllSelected}
                    onChange={(e) => selectAllItems(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Chọn tất cả ({cartData.items.length})
                  </span>
                </div>
                <button
                  onClick={handleDeleteSelected}
                  className="text-sm hover:text-primary transition-colors text-gray-500"
                >
                  Xóa
                </button>
                <button className="text-sm hover:text-primary transition-colors text-primary font-medium hidden sm:block">
                  Lưu vào mục Đã thích
                </button>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm font-medium text-gray-600">
                      Tổng thanh toán ({selectedStat.countItems} sản phẩm):
                    </span>
                    <span className="text-2xl font-bold text-primary leading-none">
                      {formatCurrency(finalDisplayPrice)}
                    </span>
                  </div>
                  {discountAmount > 0 ? (
                    <div className="text-[12px] text-green-600 font-bold mt-0.5">
                      Tiết kiệm {formatCurrency(discountAmount)}
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Tiết kiệm 0đ
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={selectedStat.countItems === 0}
                  className={`font-bold px-12 py-3 rounded-sm shadow-md transition-all text-base min-w-[200px] ${
                    selectedStat.countItems === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary hover:bg-opacity-90 text-white"
                  }`}
                >
                  Mua hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RENDER MODAL VOUCHER */}
      <VoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onApply={handleApplyVoucher}
      />

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={itemToDelete ? "Xóa sản phẩm?" : "Xóa sản phẩm đã chọn?"}
        message={
          itemToDelete
            ? "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng? Thao tác này không thể hoàn tác."
            : selectedItemIds.length === cartData.items.length
            ? "Bạn đang chọn TẤT CẢ sản phẩm. Bạn có chắc muốn làm sạch giỏ hàng không?"
            : `Bạn có chắc muốn xóa ${selectedItemIds.length} sản phẩm đang chọn khỏi giỏ hàng?`
        }
        confirmText="Xóa bỏ"
        cancelText="Hủy"
      />
    </div>
  );
};

export default CartPage;
