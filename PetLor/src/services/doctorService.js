import apiClient from './apiClient';

const doctorService = {
  getDashboardStats: (userId) => {
    return apiClient.get(`/nhan-vien/${userId}/dashboard-stats`);
  },

};

export default doctorService;