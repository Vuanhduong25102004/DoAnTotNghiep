import React, { useState, useEffect } from "react";
import axios from "axios";
import authService from "../../../services/authService";

// URL ảnh đại diện mặc định
const DEFAULT_AVATAR_URL = "https://placehold.co/40x40?text=A";

const AdminHeader = ({ user, title }) => {
  // State để lưu trữ URL của ảnh đại diện
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_URL);

  // useEffect để tải ảnh đại diện của người dùng khi component được mount hoặc khi `user` thay đổi
  useEffect(() => {
    // Biến để lưu trữ object URL, cần được truy cập trong cả hàm fetch và hàm cleanup
    let objectUrl = null;

    // Hàm bất đồng bộ để tải ảnh đại diện
    const fetchAvatar = async () => {
      // Kiểm tra xem người dùng có thông tin ảnh đại diện không
      if (user?.anhDaiDien) {
        try {
          // Xây dựng URL đầy đủ để lấy ảnh từ server
          // Lưu ý: Chúng ta không gọi API mà là một endpoint phục vụ file tĩnh, nhưng cần xác thực
          const imageUrl = `http://localhost:8080/uploads/${user.anhDaiDien}`;

          // Sử dụng axios để gửi yêu cầu GET với header xác thực
          // responseType: "blob" để nhận dữ liệu dưới dạng file nhị phân (ảnh)
          const response = await axios.get(imageUrl, {
            headers: authService.getAuthHeader(), // Thêm token xác thực
            responseType: "blob",
          });

          // Tạo một URL tạm thời từ dữ liệu blob nhận được
          objectUrl = URL.createObjectURL(response.data);
          setAvatarUrl(objectUrl);
        } catch (error) {
          // Nếu có lỗi, log ra console và sử dụng ảnh mặc định
          console.error("Không thể tải ảnh đại diện:", error);
          setAvatarUrl(DEFAULT_AVATAR_URL);
        }
      } else {
        // Nếu người dùng không có ảnh đại diện, sử dụng ảnh mặc định
        setAvatarUrl(DEFAULT_AVATAR_URL);
      }
    };

    fetchAvatar();

    // Hàm cleanup: sẽ được gọi khi component bị unmount hoặc trước khi effect chạy lại
    // Mục đích là để giải phóng bộ nhớ bằng cách thu hồi object URL đã tạo
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user]); // Dependency array: effect sẽ chạy lại nếu `user` thay đổi

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-gray-200 bg-white px-6 py-3">
      {/* Phần tiêu đề */}
      <div className="flex items-center gap-8">
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900">
          {title || "Pet Lor Dashboard"}
        </h2>
      </div>
      {/* Phần các nút chức năng bên phải */}
      <div className="flex items-center gap-4">
        {/* Thanh tìm kiếm */}
        <label className="!h-10 flex min-w-40 max-w-64 flex-col">
          <div className="flex h-full w-full flex-1 items-stretch rounded-lg">
            <div className="flex items-center justify-center rounded-l-lg border-r-0 border-none bg-gray-100 pl-4 text-gray-500">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="flex h-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-l-none border-l-0 border-none bg-gray-100 px-4 pl-2 text-base font-normal leading-normal text-gray-900 placeholder:text-gray-500 focus:border-none focus:outline-0 focus:ring-0"
              placeholder="Tìm kiếm..."
            />
          </div>
        </label>
        {/* Nút thông báo */}
        <button className="flex h-10 w-10 max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-gray-100 text-sm font-bold leading-normal tracking-[0.015em] text-gray-900 transition-colors hover:bg-gray-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        {/* Thông tin người dùng và ảnh đại diện */}
        <div className="flex items-center">
          <img
            alt="Admin Avatar"
            className="h-8 w-8 rounded-full border border-gray-200 object-cover"
            src={avatarUrl}
            // Xử lý lỗi nếu không tải được ảnh, sẽ thay bằng ảnh mặc định
            onError={(e) => {
              e.target.onerror = null; // Ngăn vòng lặp vô hạn nếu ảnh mặc định cũng lỗi
              e.target.src = DEFAULT_AVATAR_URL;
            }}
          />
          <span className="ml-2 hidden text-sm font-medium text-gray-700 md:block">
            {user?.hoTen || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
