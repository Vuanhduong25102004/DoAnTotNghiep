import apiClient from './apiClient';

const promotionService = {
  getAllPromotions: (params) => apiClient.get('/khuyen-mai', { params }),

  getPromotionById: (id) => apiClient.get(`/khuyen-mai/${id}`),

 validateCoupon: (maCode, giaTriDonHang) => {
    const data = {
        maCode: maCode,
        giaTriDonHang: Number(giaTriDonHang) 
    };
    
    return apiClient.post('/khuyen-mai/kiem-tra', data);
  },
  createPromotion: (data) => apiClient.post('/khuyen-mai', data),

  updatePromotion: (id, data) => apiClient.put(`/khuyen-mai/${id}`, data),

  deletePromotion: (id) => apiClient.delete(`/khuyen-mai/${id}`),
};

export default promotionService;