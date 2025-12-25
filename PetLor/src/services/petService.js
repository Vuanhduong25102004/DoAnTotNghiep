import apiClient from './apiClient';

const petService = {
  searchGlobal: (keyword) => {
    return apiClient.get('/search', { 
      params: { keyword } 
    });
  },
  // --- THÚ CƯNG --- // Updated for pagination
  getAllPets: (params) => apiClient.get('/thu-cung', { params }),

  getMyPets: () => apiClient.get('/thu-cung/me'),

  createMyPet: (data) => {
    const config = {};
    if (data instanceof FormData) {
      config.headers = {'Content-Type': undefined };
    }
    return apiClient.post('/thu-cung/me', data, config);
  },
  
  getPetById: (id) => apiClient.get(`/thu-cung/${id}`),
  
  createPet: (data) => {
    const config = {};
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': undefined };
    }
    return apiClient.post('/thu-cung', data, config);
  },
  
  updatePet: (id, data) => {
    const config = {};
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': undefined };
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
      config.headers = { 'Content-Type': undefined };
    }
    return apiClient.post('/dich-vu', data, config);
  },
  
  updateService: (id, data) => {
    const config = {};
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': undefined };
    }
    return apiClient.put(`/dich-vu/${id}`, data, config);
  },
  
  deleteService: (id) => apiClient.delete(`/dich-vu/${id}`),

  // --- LỊCH HẸN ---
  getAllAppointments: (params) => apiClient.get('/lich-hen', { params }),
  
  getAppointmentById: (id) => apiClient.get(`/lich-hen/${id}`),
  
  createAppointment: (data) => apiClient.post('/lich-hen', data),
  
  updateAppointment: (id, data) => apiClient.put(`/lich-hen/${id}`, data),
  
  deleteAppointment: (id) => apiClient.delete(`/lich-hen/${id}`),
};

export default petService;
