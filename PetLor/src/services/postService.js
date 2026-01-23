import apiClient from './apiClient';

const postService = {

  getAllPosts: (params) => apiClient.get('/bai-viet', { params }),

  getPostById: (id) => apiClient.get(`/bai-viet/${id}`),

  getPostBySlug: (slug) => apiClient.get(`/bai-viet/slug/${slug}`),

  createPost: (data) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return apiClient.post('/bai-viet', data, { headers });
  },

  updatePost: (id, data) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return apiClient.put(`/bai-viet/${id}`, data, { headers });
  },

  deletePost: (id) => apiClient.delete(`/bai-viet/${id}`),

  getAllPostCategories: (params) => apiClient.get('/bai-viet/danh-muc', { params }),

  getPostCategoryById: (id) => apiClient.get(`/bai-viet/danh-muc/${id}`),

  createPostCategory: (data) => apiClient.post('/bai-viet/danh-muc', data),

  updatePostCategory: (id, data) => apiClient.put(`/bai-viet/danh-muc/${id}`, data),

  deletePostCategory: (id) => apiClient.delete(`/bai-viet/danh-muc/${id}`),
};

export default postService;
