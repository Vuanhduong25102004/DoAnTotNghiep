import apiClient from "./apiClient";

const userService = {
  // --- NGƯỜI DÙNG ---
  // Updated to support pagination and filtering
  getAllUsers: (params) => apiClient.get("/nguoi-dung", { params }),

  getUserById: (id) => apiClient.get(`/nguoi-dung/${id}`),

  getMe: () => apiClient.get("/nguoi-dung/me"),

  createUnifiedUser: (formData) => {
    return apiClient.post("/nguoi-dung/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateUser: (id, formData) => {
    return apiClient.put(`/nguoi-dung/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateMe: (data) => apiClient.put("/nguoi-dung/me", data, {
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