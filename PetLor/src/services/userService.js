import apiClient from "./apiClient";

const userService = {
  // --- NGƯỜI DÙNG ---
  // Updated to support pagination and filtering
  getAllUsers: (params) => apiClient.get("/nguoi-dung", { params }),

  getUserById: (id) => apiClient.get(`/nguoi-dung/${id}`),

  // This is a unified endpoint for creating both users and employees
  // The backend expects multipart/form-data with a JSON part 'nguoiDung' and an optional file part 'anhDaiDien'
  createUnifiedUser: (data) => {
    const headers =
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    return apiClient.post("/nguoi-dung/register", data, { headers });
  },

  updateUser: (id, data) => {
    const headers =
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    return apiClient.put(`/nguoi-dung/${id}`, data, { headers });
  },

  deleteUser: (id) => apiClient.delete(`/nguoi-dung/${id}`),

  // --- NHÂN VIÊN ---
  // This endpoint is used by other pages like AdminAppointments
  // Updated to support pagination and filtering
  getAllStaff: (params) => apiClient.get("/nhan-vien", { params }),

  getStaffById: (id) => apiClient.get(`/nhan-vien/${id}`),

  updateStaff: (id, data) => {
    const headers =
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    return apiClient.put(`/nhan-vien/${id}`, data, { headers });
  },

  deleteStaff: (id) => apiClient.delete(`/nhan-vien/${id}`),
};

export default userService;