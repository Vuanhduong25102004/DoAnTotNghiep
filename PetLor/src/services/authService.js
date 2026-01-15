import apiClient from './apiClient';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const authService = {
  register: (userData) => apiClient.post('/auth/register', userData),
  
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Xử lý dữ liệu trả về (hỗ trợ cả trường hợp axios bọc data và không)
    const data = response.data ? response.data : response;

    const token = data.accessToken || data.token; 

    if (token) {
      localStorage.setItem('accessToken', token); 
      localStorage.setItem('token', token); 
      
      let userId = data.userId || data.id || (data.user && data.user.id);

      if (!userId) {
        const decoded = parseJwt(token);
        if (decoded) {
          userId = decoded.userId || decoded.id || decoded.sub;
        }
      }

      if (userId) {
        localStorage.setItem('userId', userId);
      }
    } 

    return data;
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); 
  },

  getAuthHeader: () => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  
  getCurrentUserId: () => {
    return localStorage.getItem('userId');
  }
};

export default authService;