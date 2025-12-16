import apiClient from './apiClient';

const petService = {
  // --- THÚ CƯNG --- // Updated for pagination
  getAllPets: (params) => apiClient.get('/thu-cung', { params }),
  
  getPetById: (id) => apiClient.get(`/thu-cung/${id}`),
  
  createPet: (data) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return apiClient.post('/thu-cung', data, { headers });
  },
  
  updatePet: (id, data) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return apiClient.put(`/thu-cung/${id}`, data, { headers });
  },
  
  deletePet: (id) => apiClient.delete(`/thu-cung/${id}`),

  // --- DỊCH VỤ (SPA, KHÁM...) ---
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

  // --- LỊCH HẸN ---
  getAllAppointments: (params) => apiClient.get('/lich-hen', { params }),
  
  getAppointmentById: (id) => apiClient.get(`/lich-hen/${id}`),
  
  createAppointment: (data) => apiClient.post('/lich-hen', data),
  
  updateAppointment: (id, data) => apiClient.put(`/lich-hen/${id}`, data),
  
  deleteAppointment: (id) => apiClient.delete(`/lich-hen/${id}`),
};

export default petService;
