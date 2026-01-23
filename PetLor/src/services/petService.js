import apiClient from './apiClient';

const petService = {
  // --- TÌM KIẾM CHUNG ---
  searchGlobal: (keyword) => {
    return apiClient.get('/search', { 
      params: { keyword } 
    });
  },

  // --- THÚ CƯNG ---
  getAllPets: (params) => apiClient.get('/thu-cung', { params }),

  getMyPets: () => apiClient.get('/thu-cung/me'),

  // [MỚI] Lấy hồ sơ bệnh án (Chi tiết thú cưng + Lịch sử)
  getPetMedicalRecord: (id) => apiClient.get(`/thu-cung/${id}/ho-so-benh-an`),

  // --- SỬA: Đặt Content-Type là multipart/form-data ---
  createMyPet: (data) => {
    const config = {};
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    return apiClient.post('/thu-cung/me', data, config);
  },
  
  updateMyPet: (id, data) => {
    const config = {};
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    return apiClient.put(`/thu-cung/me/${id}`, data, config);
  },
  
  getPetById: (id) => apiClient.get(`/thu-cung/${id}`),
  
  createPet: (data) => {
    const config = {};
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    return apiClient.post('/thu-cung', data, config);
  },
  
  updatePet: (id, data) => {
    const config = {};
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    return apiClient.put(`/thu-cung/${id}`, data, config);
  },
  
  deletePet: (id) => apiClient.delete(`/thu-cung/${id}`),

  // --- DỊCH VỤ (SPA, KHÁM...) ---
  getAllServices: (params) => apiClient.get('/dich-vu', { params }),
  
  getServiceById: (id) => apiClient.get(`/dich-vu/${id}`),
  
  createService: (data) => {
    const config = {};
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    return apiClient.post('/dich-vu', data, config);
  },
  
  updateService: (id, data) => {
    const config = {};
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    return apiClient.put(`/dich-vu/${id}`, data, config);
  },
  
  deleteService: (id) => apiClient.delete(`/dich-vu/${id}`),
};

export default petService;