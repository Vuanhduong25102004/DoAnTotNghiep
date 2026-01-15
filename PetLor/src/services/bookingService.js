import apiClient from './apiClient';

const bookingService = {
  // --- ĐẶT LỊCH (GUEST & USER) ---
  
  // Đặt lịch cho User đã đăng nhập
  createBookingUser: (data) => {
    return apiClient.post('/lich-hen', data);
  },

  // Đặt lịch cho Khách vãng lai (Guest)
  createBookingGuest: (data) => {
    return apiClient.post('/lich-hen/guest', data);
  },

  // --- QUẢN LÝ LỊCH HẸN (ADMIN/STAFF) ---
  
  // Lấy tất cả lịch hẹn (có thể filter bằng params)
  getAllAppointments: (params) => apiClient.get('/lich-hen', { params }),
  
  // Lấy chi tiết lịch hẹn theo ID (Quyền Admin/Staff)
  getAppointmentById: (id) => apiClient.get(`/lich-hen/${id}`),
  
  // Cập nhật lịch hẹn (Admin/Staff)
  updateAppointment: (id, data) => apiClient.put(`/lich-hen/${id}`, data),
  
  // Xóa lịch hẹn
  deleteAppointment: (id) => apiClient.delete(`/lich-hen/${id}`),

  // --- LỊCH HẸN CÁ NHÂN (USER) ---
  
  // Lấy danh sách lịch hẹn của tôi
  getMyAppointments: () => apiClient.get('/lich-hen/me'),
  
  // Lấy chi tiết một lịch hẹn của tôi (Đã đổi tên để tránh trùng lặp)
  getMyAppointmentById: (id) => apiClient.get(`/lich-hen/me/${id}`),

  // Hủy lịch hẹn của tôi
  cancelMyAppointment: (id, data) => apiClient.put(`/lich-hen/me/${id}/cancel`, data),

  // --- TIỆN ÍCH KHÁC ---
  
  // Lấy danh sách lý do hủy
  getCancelReasons: () => apiClient.get('/lich-hen/ly-do-huy'),
};

export default bookingService;