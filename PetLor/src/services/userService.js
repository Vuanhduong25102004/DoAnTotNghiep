import apiClient from './apiClient';

const userService = {
  // --- NGƯỜI DÙNG (KHÁCH HÀNG) ---
  getAllUsers: () => apiClient.get('/nguoi-dung'),
  
  getUserById: (id) => apiClient.get(`/nguoi-dung/${id}`),
  
  createUser: (data) => apiClient.post('/nguoi-dung', data),

  createUnifiedUser: (data) => apiClient.post('/nguoi-dung/create-unified', data),
  
  updateUser: (id, data) => apiClient.put(`/nguoi-dung/${id}`, data),
  
  deleteUser: (id) => apiClient.delete(`/nguoi-dung/${id}`),

  // --- NHÂN VIÊN (ADMIN/STAFF) ---
  getAllStaff: () => apiClient.get('/nhan-vien'),

  getStaffById: (id) => apiClient.get(`/nhan-vien/${id}`),

  createStaff: (data) => apiClient.post('/nhan-vien', data),

  updateStaff: (id, data) => apiClient.put(`/nhan-vien/${id}`, data),

  deleteStaff: (id) => apiClient.delete(`/nhan-vien/${id}`),
};

export default userService;