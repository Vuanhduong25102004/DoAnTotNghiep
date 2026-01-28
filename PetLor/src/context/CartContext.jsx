import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import orderService from "../services/orderService";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Tên key lưu trong LocalStorage
const GUEST_CART_KEY = "guest_cart_data";

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState({
    items: [],
    tongTien: 0,
    tongSoLuong: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  // --- HELPER: Tính toán lại tổng tiền/số lượng cho Guest ---
  const calculateGuestCartTotals = (items) => {
    const tongSoLuong = items.reduce((acc, item) => acc + item.soLuong, 0);
    const tongTien = items.reduce(
      (acc, item) => acc + item.donGia * item.soLuong,
      0,
    );
    return { items, tongSoLuong, tongTien };
  };

  // 1. Fetch Cart
  const fetchCart = async (showLoading = true) => {
    const userId = localStorage.getItem("userId");

    // A. NẾU LÀ GUEST
    if (!userId) {
      if (showLoading) setLoading(true);
      const savedCart = localStorage.getItem(GUEST_CART_KEY);
      if (savedCart) {
        setCartData(JSON.parse(savedCart));
      } else {
        setCartData({ items: [], tongTien: 0, tongSoLuong: 0 });
      }
      if (showLoading) setLoading(false);
      return;
    }

    // B. NẾU ĐÃ LOGIN (Logic cũ)
    try {
      if (showLoading) setLoading(true);
      const data = await orderService.getCartMe();
      if (data && data.items) {
        setCartData(data);
      } else {
        setCartData({ items: [], tongTien: 0, tongSoLuong: 0 });
      }
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart(true);
  }, []);

  // 2. Logic Chọn sản phẩm (Checkbox)
  const toggleSelectItem = (itemId) => {
    setSelectedItemIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId); // Bỏ chọn
      } else {
        return [...prev, itemId]; // Chọn thêm
      }
    });
  };

  const selectAllItems = (isChecked) => {
    if (isChecked) {
      // Chọn hết: Lấy tất cả ID trong cartData
      const allIds = cartData.items.map((item) => item.id);
      setSelectedItemIds(allIds);
    } else {
      // Bỏ chọn hết
      setSelectedItemIds([]);
    }
  };

  // 3. Logic Update Số lượng (Giữ nguyên logic Optimistic UI cũ)
  const updateQuantity = async (productId, newQuantity) => {
    const userId = localStorage.getItem("userId");

    if (newQuantity < 1) {
      const confirmDelete = window.confirm("Bạn muốn xóa sản phẩm này?");
      if (confirmDelete) {
        const item = cartData.items.find((i) => i.sanPhamId === productId);
        await removeFromCart(item?.id, productId);
      }
      return;
    }

    // Common logic for UI update (Optimistic)
    const oldCartData = { ...cartData };
    const newItems = cartData.items.map((item) =>
      item.sanPhamId === productId ? { ...item, soLuong: newQuantity } : item,
    );
    // Tạm tính tổng tiền UI
    const newTotalPrice = newItems.reduce(
      (total, item) => total + item.donGia * item.soLuong,
      0,
    );

    // A. NẾU LÀ GUEST
    if (!userId) {
      const guestCartData = calculateGuestCartTotals(newItems);
      setCartData(guestCartData);
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCartData));
      return;
    }

    // B. NẾU LÀ USER
    setCartData({ ...cartData, items: newItems, tongTien: newTotalPrice });
    try {
      await orderService.updateCartItem(productId, newQuantity);
      await fetchCart(false);
    } catch (error) {
      setCartData(oldCartData);
      // alert("Lỗi cập nhật số lượng"); // Đã tắt alert
      console.error("Lỗi cập nhật số lượng:", error);
    }
  };

  // 4. Logic Xóa
  const removeFromCart = async (cartDetailId, productId) => {
    const userId = localStorage.getItem("userId");
    const oldCartData = { ...cartData };
    const newItems = cartData.items.filter(
      (item) => item.sanPhamId !== productId,
    );

    // Xử lý UI chung (để mượt)
    const tempCartForUI = calculateGuestCartTotals(newItems);
    setCartData(tempCartForUI);
    setSelectedItemIds((prev) => prev.filter((id) => id !== cartDetailId));

    // A. NẾU LÀ GUEST
    if (!userId) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(tempCartForUI));
      return;
    }

    // B. NẾU LÀ USER
    try {
      await orderService.removeCartItem(productId);
      await fetchCart(false);
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      setCartData(oldCartData);
      // alert("Xóa thất bại!"); // Đã tắt alert
    }
  };

  // --- QUAN TRỌNG: TÍNH TOÁN TIỀN CỦA CÁC SẢN PHẨM ĐƯỢC CHỌN ---
  const selectedStat = useMemo(() => {
    // Lọc ra các item đang nằm trong mảng selectedItemIds
    const selectedItems = cartData.items.filter((item) =>
      selectedItemIds.includes(item.id),
    );

    const totalSelectedPrice = selectedItems.reduce(
      (total, item) => total + item.donGia * item.soLuong,
      0,
    );
    const totalSelectedCount = selectedItems.reduce(
      (total, item) => total + item.soLuong,
      0,
    );

    return {
      totalPrice: totalSelectedPrice,
      totalCount: totalSelectedCount,
      countItems: selectedItems.length, // Số dòng được chọn
    };
  }, [cartData, selectedItemIds]);

  const addToCart = async (productInfo, quantity = 1) => {
    const userId = localStorage.getItem("userId");

    // A. NẾU LÀ GUEST (Lưu LocalStorage)
    if (!userId) {
      const currentItems = [...cartData.items];
      const existingItemIndex = currentItems.findIndex(
        (item) => item.sanPhamId === productInfo.id,
      );

      if (existingItemIndex > -1) {
        currentItems[existingItemIndex].soLuong += quantity;
      } else {
        const newItem = {
          id: `guest_${productInfo.id}_${Date.now()}`,
          sanPhamId: productInfo.id,
          tenSanPham: productInfo.name,
          donGia: productInfo.price,
          hinhAnh: productInfo.image,
          soLuong: quantity,
        };
        currentItems.push(newItem);
      }

      const newCartData = calculateGuestCartTotals(currentItems);
      setCartData(newCartData);
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCartData));

      // --- ĐÃ TẮT ALERT GUEST ---
      // alert("Đã thêm vào giỏ hàng (Guest)!");
      return;
    }

    // B. NẾU ĐÃ LOGIN (Gọi API)
    try {
      await orderService.addToCart({
        userId: userId,
        sanPhamId: productInfo.id,
        soLuong: quantity,
      });

      // --- ĐÃ TẮT ALERT USER ---
      // alert("Đã thêm sản phẩm vào giỏ hàng!");

      await fetchCart(false);
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error);
      // alert("Thêm thất bại! Vui lòng thử lại."); // Tắt luôn alert lỗi cho gọn
    }
  };

  const clearCart = async () => {
    const userId = localStorage.getItem("userId");

    // UI Optimistic Clear
    setCartData({ items: [], tongTien: 0, tongSoLuong: 0 });
    setSelectedItemIds([]);

    // A. NẾU LÀ GUEST
    if (!userId) {
      localStorage.removeItem(GUEST_CART_KEY);
      return true;
    }

    // B. NẾU LÀ USER
    try {
      await orderService.clearCart();
      return true;
    } catch (error) {
      console.error("Lỗi dọn giỏ hàng:", error);
      // alert("Lỗi khi dọn giỏ hàng!"); // Đã tắt alert
      await fetchCart(false);
      return false;
    }
  };

  const value = {
    cartData,
    loading,
    selectedItemIds,
    selectedStat,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleSelectItem,
    selectAllItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
