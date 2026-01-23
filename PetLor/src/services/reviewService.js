import apiClient from './apiClient';

const reviewService = {

  getReviewsForProduct: (productId, params) => 
    apiClient.get(`/danh-gia/san-pham/${productId}`, { params }),

  getReviewsForService: (serviceId, params) => 
    apiClient.get(`/danh-gia/dich-vu/${serviceId}`, { params }),


  createReview: (reviewData) => apiClient.post('/danh-gia', reviewData),


  getAllReviewsForAdmin: (params) => apiClient.get('/danh-gia/admin', { params }),


  updateReviewStatus: (reviewId, body) => 
    apiClient.put(`/danh-gia/admin/${reviewId}/trang-thai`, body),

  replyToReview: (reviewId, body) => 
    apiClient.put(`/danh-gia/admin/${reviewId}/phan-hoi`, body),
  deleteReview: (reviewId) => apiClient.delete(`/danh-gia/admin/${reviewId}`),
};

export default reviewService;
