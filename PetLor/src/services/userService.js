import apiClient from "./apiClient";

const userService = {
  // --- NGƯỜI DÙNG ---
  // Updated to support pagination and filtering
  getAllUsers: (params) => apiClient.get("/nguoi-dung", { params }),

  getUserById: (id) => apiClient.get(`/nguoi-dung/${id}`),

  getMe: () => apiClient.get("/nguoi-dung/me"),

  // This is a unified endpoint for creating both users and employees
  // The backend expects multipart/form-data with a JSON part 'nguoiDung' and an optional file part 'anhDaiDien'
  createUnifiedUser: (data) => {
    return apiClient.post("/nguoi-dung/register", data);
  },

  updateUser: (id, data) => {
    // Axios tự động xử lý header 'multipart/form-data' khi dữ liệu là FormData
    return apiClient.put(`/nguoi-dung/${id}`, data);
  },

  updateMe: (data) => apiClient.put("/nguoi-dung/me", data, {
    // Thêm config headers để ghi đè Content-Type mặc định.
    // Axios sẽ tự động thêm 'boundary' cần thiết cho multipart/form-data.
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

  deleteUser: (id) => apiClient.delete(`/nguoi-dung/${id}`),



  // --- NHÂN VIÊN ---
  // This endpoint is used by other pages like AdminAppointments
  // Updated to support pagination and filtering
  getAllStaff: (params) => apiClient.get("/nhan-vien", { params }),

  getStaffById: (id) => apiClient.get(`/nhan-vien/${id}`),

  createStaff: (data) => {
    return apiClient.post("/nhan-vien", data);
  },

  updateStaff: (id, data) => {
    return apiClient.put(`/nhan-vien/${id}`, data);
  },

  deleteStaff: (id) => apiClient.delete(`/nhan-vien/${id}`),
};

export default userService;