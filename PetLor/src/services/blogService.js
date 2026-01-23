import apiClient from "./apiClient";

const blogService = {
  // Lấy danh sách (đã có)
  getPublicPosts: () => {
    return apiClient.get("/bai-viet/cong-khai");
  },

  // Lấy chi tiết bài viết theo Slug
  // Nếu API của bạn là /bai-viet/{id} thì sửa tham số thành id
  getPostBySlug: (slug) => {
    return apiClient.get(`/bai-viet/slug/${slug}`); 
  },
  
  // (Optional) Lấy bài viết liên quan
  getRelatedPosts: () => {
    // Tạm thời gọi lại api công khai lấy 3 bài
    return apiClient.get("/bai-viet/cong-khai"); 
  }
};

export default blogService;