import apiClient from "./apiClient";

// --- HÀM MAP URL (SỬA LẠI ĐƯỜNG DẪN Ở ĐÂY) ---
const getEndpointByType = (type) => {
  switch (type) {
    case "SERVICE":
      return "/danh-muc-dich-vu"; 
      
    case "POST":
      return "/bai-viet/danh-muc";
      
    case "PRODUCT":
    default:
      return "/danh-muc-san-pham"; 
  }
};

const categoryService = {
  // 1. Lấy danh sách
  getAll: (params) => {
    const { type, ...otherParams } = params || {};
    const endpoint = getEndpointByType(type);
    return apiClient.get(endpoint, { params: otherParams });
  },

  // 2. Lấy chi tiết
  getById: (id, type) => {
    const endpoint = getEndpointByType(type);
    return apiClient.get(`${endpoint}/${id}`);
  },

  // 3. Tạo mới
  create: (data) => {
    const endpoint = getEndpointByType(data.type);
    return apiClient.post(endpoint, data);
  },

  // 4. Cập nhật
  update: (id, data) => {
    const endpoint = getEndpointByType(data.type);
    return apiClient.put(`${endpoint}/${id}`, data);
  },

  // 5. Xóa
  delete: (id, type) => {
    const endpoint = getEndpointByType(type);
    return apiClient.delete(`${endpoint}/${id}`);
  },
};

export default categoryService;