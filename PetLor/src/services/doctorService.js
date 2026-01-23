import apiClient from './apiClient';

const doctorService = {
  getDashboardStats: (userId) => {
    return apiClient.get(`/nhan-vien/${userId}/dashboard-stats`);
  },

  getTodaySchedule: (userId) => {
    return apiClient.get('/lich-hen/doctor/schedule-today', {
      params: { userId: userId } 
    });
  },

};

export default doctorService;