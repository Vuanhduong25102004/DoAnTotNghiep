import apiClient from './apiClient';

const authService = {
  register: (userData) => apiClient.post('/auth/register', userData),
  
  login: async (credentials) => {
    const data = await apiClient.post('/auth/login', credentials);
    if (data && data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
  },

  getAuthHeader: () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default authService;