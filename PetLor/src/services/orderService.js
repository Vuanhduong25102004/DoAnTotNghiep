import apiClient from './apiClient';

const orderService = {
  // --- ĐƠN HÀNG ---
  getMyOrders: () => apiClient.get('/don-hang/me'),

  getCancelReasons: () => apiClient.get('/don-hang/ly-do-huy'),

  cancelMyOrder: (id, data) => apiClient.put(`/don-hang/me/${id}/cancel`, data),

  getOrderById: (id) => apiClient.get(`/don-hang/me/${id}`),

  getAllOrders: (params) => apiClient.get('/don-hang', { params }),
  
  getOrderById: (id) => apiClient.get(`/don-hang/${id}`),
  
  createOrder: (data) => apiClient.post('/don-hang', data),
  
  updateOrder: (id, data) => apiClient.put(`/don-hang/${id}`, data),
  
  deleteOrder: (id) => apiClient.delete(`/don-hang/${id}`),

  //xử lý cho cả User và Guest dựa vào tham số isGuest
  createOrder: (data, isGuest = false) => {
    const url = isGuest ? '/don-hang/guest' : '/don-hang';
    return apiClient.post(url, data);
  },

  // --- CHI TIẾT ĐƠN HÀNG ---
  getOrderDetail: (id) => apiClient.get(`/chi-tiet-don-hang/${id}`), 

  // --- GIỎ HÀNG ---
  getCartByUser: (userId) => apiClient.get(`/gio-hang/user/${userId}`),
  
  addToCart: (data) => apiClient.post('/gio-hang', data),
  
  updateCartItem: (uid, pid, data) => apiClient.put(`/gio-hang/update/${uid}/${pid}`, data),
  
  removeFromCart: (uid, pid) => apiClient.delete(`/gio-hang/remove/${uid}/${pid}`),

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
  },
  
  // Tính phí ship
  calculateShippingFee: (data) => {
    return apiClient.post('/don-hang/tinh-phi-ship', data);
  },
};

export default orderService;