import apiClient from './apiClient';

const productService = {
  // --- SẢN PHẨM ---
  // Sửa: Chấp nhận tham số (params) để lọc và phân trang
  getAllProducts: (params) => apiClient.get('/san-pham', { params }),
  
  getProductById: (id) => apiClient.get(`/san-pham/${id}`),
  
  createProduct: (data) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return apiClient.post('/san-pham', data, { headers });
  },
  
  updateProduct: (id, data) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return apiClient.put(`/san-pham/${id}`, data, { headers });
  },
  
  deleteProduct: (id) => apiClient.delete(`/san-pham/${id}`),

  // --- DỊCH VỤ ---
  getAllServices: (params) => apiClient.get('/dich-vu', { params }),

  getServiceById: (id) => apiClient.get(`/dich-vu/${id}`),

  createService: (data) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return apiClient.post('/dich-vu', data, { headers });
  },

  updateService: (id, data) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return apiClient.put(`/dich-vu/${id}`, data, { headers });
  },

  deleteService: (id) => apiClient.delete(`/dich-vu/${id}`),

  // --- DANH MỤC ---
  getAllCategories: () => apiClient.get('/danh-muc-san-pham'),

  getCategoryById: (id) => apiClient.get(`/danh-muc-san-pham/${id}`),

  createCategory: (data) => apiClient.post('/danh-muc-san-pham', data),

  updateCategory: (id, data) => apiClient.put(`/danh-muc-san-pham/${id}`, data),

  deleteCategory: (id) => apiClient.delete(`/danh-muc-san-pham/${id}`),

  // --- DANH MỤC DỊCH VỤ ---
  getAllServiceCategories: () => apiClient.get('/danh-muc-dich-vu'),
};

export default productService;