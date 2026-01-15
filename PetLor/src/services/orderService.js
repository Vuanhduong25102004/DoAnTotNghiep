import apiClient from './apiClient';

const orderService = {
  // --- ĐƠN HÀNG ---
  
  // Lấy danh sách đơn hàng của tôi
  getMyOrders: () => apiClient.get('/don-hang/me'),
  
  // Lấy chi tiết đơn hàng (User)
  getMyOrderById: (id) => apiClient.get(`/don-hang/me/${id}`),

  // Hủy đơn hàng của tôi
  cancelMyOrder: (id, data) => apiClient.put(`/don-hang/me/${id}/cancel`, data),

  // Lấy lý do hủy
  getCancelReasons: () => apiClient.get('/don-hang/ly-do-huy'),

  // --- ADMIN / QUẢN LÝ ĐƠN HÀNG ---
  getAllOrders: (params) => apiClient.get('/don-hang', { params }),
  
  getOrderById: (id) => apiClient.get(`/don-hang/${id}`),
  
  updateOrder: (id, data) => apiClient.put(`/don-hang/${id}`, data),
  
  deleteOrder: (id) => apiClient.delete(`/don-hang/${id}`),

  // --- QUAN TRỌNG: API TẠO ĐƠN HÀNG (Dùng chung cho cả User và Guest) ---
  createOrder: (data, isGuest = false) => {
    const url = isGuest ? '/don-hang/guest' : '/don-hang';
    return apiClient.post(url, data);
  },

  getOrderDetail: (id) => apiClient.get(`/chi-tiet-don-hang/${id}`), 

  // --- GIỎ HÀNG (Ưu tiên dùng các API /me cho User đăng nhập) ---
  
  getCartMe: () => apiClient.get('/gio-hang/me'),

  addToCart: (data) => {
    return apiClient.post('/gio-hang/me/add', data);
  },

  updateCartItem: (sanPhamId, soLuong) => {
    return apiClient.put(`/gio-hang/me/update/${sanPhamId}`, { soLuong });
  },

  removeCartItem: (sanPhamId) => {
    return apiClient.delete(`/gio-hang/me/remove/${sanPhamId}`);
  },

  clearCart: () => {
    return apiClient.delete('/gio-hang/me/clear');
  }
};

export default orderService;