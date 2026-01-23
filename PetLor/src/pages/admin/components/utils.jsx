import React, { useState, useEffect } from "react";
import axios from "axios";
// Hãy đảm bảo đường dẫn này đúng với cấu trúc dự án của bạn
import authService from "../../../services/authService";

// ============================================================================
// PHẦN 1: CẤU HÌNH & HẰNG SỐ (CONSTANTS)
// ============================================================================

export const API_BASE_URL = "http://localhost:8080";
const DEFAULT_AVATAR_URL = "https://placehold.co/40x40?text=A";

// --- Trạng thái Đơn hàng (Order) ---
export const ORDER_STATUSES = [
  "Chờ xử lý",
  "Đã xác nhận",
  "Đang giao",
  "Đã giao",
  "Đã hủy",
];

// --- Trạng thái Thanh toán (Payment) ---
export const PAYMENT_STATUS_MAP = {
  CHUA_THANH_TOAN: "Chưa thanh toán",
  CHO_THANH_TOAN: "Chờ thanh toán",
  DA_THANH_TOAN: "Đã thanh toán",
  THAT_BAI: "Thất bại",
  HOAN_TIEN: "Hoàn tiền",
};
export const PAYMENT_STATUSES = Object.keys(PAYMENT_STATUS_MAP);

// --- Trạng thái Bài viết (Post) ---
export const POST_STATUS_MAP = {
  CONG_KHAI: "Công khai",
  NHAP: "Bản nháp",
  AN: "Đã ẩn",
};
export const POST_STATUSES = Object.keys(POST_STATUS_MAP);

// --- Trạng thái Lịch hẹn (Appointment) ---
export const APPOINTMENT_STATUS_MAP = {
  CHO_XAC_NHAN: "Chờ xác nhận",
  DA_XAC_NHAN: "Đã xác nhận",
  DA_HOAN_THANH: "Hoàn thành",
  DA_HUY: "Đã hủy",
};
export const APPOINTMENT_STATUSES = Object.keys(APPOINTMENT_STATUS_MAP);

// ============================================================================
// PHẦN 2: CÁC HÀM FORMAT DỮ LIỆU (FORMATTERS)
// ============================================================================

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "---";
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    return new Date(dateString).toLocaleString("vi-VN", options);
  }
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};

export const formatAppointmentTime = (startTime, endTime) => {
  if (!startTime) return "N/A";
  const start = new Date(startTime);
  const datePart = start.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const startTimePart = start.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (!endTime) return `${datePart}, ${startTimePart}`;
  const end = new Date(endTime);
  const endTimePart = end.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}, ${startTimePart} - ${endTimePart}`;
};

export const formatTimeRange = (start, end) => {
  if (!start) return "---";

  const startTime = new Date(start).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Tái sử dụng hàm formatDate đã có trong file này
  const date = formatDate(start);

  if (!end) return `${startTime} | ${date}`;

  const endTime = new Date(end).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${startTime} - ${endTime} | ${date}`;
};

export const calculateAge = (dateString) => {
  if (!dateString) return "Chưa rõ";
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? `${age} tuổi` : "Dưới 1 tuổi";
};

// ============================================================================
// PHẦN 3: HÀM HỖ TRỢ LOGIC (HELPERS)
// ============================================================================

// --- 1. Tạo Slug từ Tiêu đề (MỚI THÊM) ---
export const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Chuyển đổi ký tự có dấu thành không dấu
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w-]+/g, "") // Xóa ký tự đặc biệt
    .replace(/--+/g, "-") // Xóa gạch ngang kép
    .replace(/^-+/, "") // Xóa gạch ngang đầu
    .replace(/-+$/, ""); // Xóa gạch ngang cuối
};

// --- 2. Lấy URL ảnh ---
export const getImageUrl = (imagePath, fallbackText = "Image") => {
  if (!imagePath) return `https://placehold.co/100x100?text=${fallbackText}`;
  if (imagePath.startsWith("http") || imagePath.startsWith("blob:"))
    return imagePath;
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  // Tránh việc nối trùng /uploads/uploads
  if (cleanPath.startsWith("/uploads/")) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  return `${API_BASE_URL}/uploads${cleanPath}`;
};

// --- 3. Tạo FormData cho Bài viết (ĐÃ SỬA CHO KHỚP BACKEND) ---
// --- 3. Tạo FormData cho Bài viết (ĐÃ SỬA CHUẨN KEY BACKEND) ---
export const createPostFormData = (data, imageFile) => {
  const formData = new FormData();

  const postData = {
    tieuDe: data.tieuDe,
    slug: data.slug || generateSlug(data.tieuDe),
    noiDung: data.noiDung,
    userId: Number(data.userId),
    danhMucBvId: Number(data.danhMucBvId), // Đổi tên trường tại đây
    trangThai: data.trangThai || "CONG_KHAI",
  };

  const jsonBlob = new Blob([JSON.stringify(postData)], {
    type: "application/json",
  });

  formData.append("data", jsonBlob);

  if (imageFile) {
    formData.append("anhBia", imageFile);
  }

  return formData;
};

export const getReviewTargetInfo = (review) => {
  if (review.sanPham) {
    return {
      type: "Sản phẩm",
      name: review.sanPham.tenSanPham,
      image: getImageUrl(review.sanPham.hinhAnh, "Product"),
      badgeColor: "bg-blue-100 text-blue-800",
    };
  } else if (review.dichVu) {
    return {
      type: "Dịch vụ",
      name: review.dichVu.tenDichVu,
      image: getImageUrl(review.dichVu.hinhAnh, "Service"),
      badgeColor: "bg-purple-100 text-purple-800",
    };
  }
  return {
    type: "Khác",
    name: "Không xác định",
    image: null,
    badgeColor: "bg-gray-100 text-gray-800",
  };
};

export const getStockInfo = (quantity) => {
  if (quantity <= 0)
    return {
      label: "Hết hàng",
      color: "bg-red-100 text-red-800 border-red-200",
    };
  if (quantity < 10)
    return {
      label: "Sắp hết",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
  return {
    label: "Còn hàng",
    color: "bg-green-100 text-green-800 border-green-200",
  };
};

// ============================================================================
// PHẦN 4: UI COMPONENTS (BADGES, LABELS, AVATAR)
// ============================================================================

// 1. Badge Trạng thái Lịch hẹn
export const AppointmentStatusBadge = ({ status }) => {
  const safeStatus = status ? status.trim() : "DEFAULT";
  const statusMap = {
    CHO_XAC_NHAN: {
      text: "Chờ xác nhận",
      styles: "bg-amber-100 text-amber-800",
    },
    DA_XAC_NHAN: { text: "Đã xác nhận", styles: "bg-cyan-100 text-cyan-800" },
    DA_HOAN_THANH: {
      text: "Hoàn thành",
      styles: "bg-green-100 text-green-800",
    },
    DA_HUY: { text: "Đã hủy", styles: "bg-rose-100 text-rose-800" },
    DEFAULT: { text: "Không rõ", styles: "bg-gray-100 text-gray-800" },
  };
  const info = statusMap[safeStatus] || statusMap.DEFAULT;
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${info.styles}`}
    >
      {info.text}
    </span>
  );
};

// 2. Badge Trạng thái Đơn hàng
export const OrderStatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.toLowerCase() : "";
  let style = "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (
    normalizedStatus.includes("hoàn thành") ||
    normalizedStatus.includes("đã giao")
  )
    style = "bg-green-100 text-green-800 border-green-200";
  else if (
    normalizedStatus.includes("đang giao") ||
    normalizedStatus.includes("shipping")
  )
    style = "bg-blue-100 text-blue-800 border-blue-200";
  else if (
    normalizedStatus.includes("đã hủy") ||
    normalizedStatus.includes("cancelled")
  )
    style = "bg-red-100 text-red-800 border-red-200";
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${style}`}
    >
      {status || "---"}
    </span>
  );
};

// 3. Badge Trạng thái Thanh toán
export const PaymentStatusBadge = ({ status }) => {
  const safeStatus = status ? status.trim() : "DEFAULT";

  const statusMap = {
    CHUA_THANH_TOAN: {
      text: "Chưa thanh toán",
      styles: "bg-orange-100 text-orange-700 border-orange-200",
    },
    CHO_THANH_TOAN: {
      text: "Chờ thanh toán",
      styles: "bg-amber-100 text-amber-700 border-amber-200",
    },
    DA_THANH_TOAN: {
      text: "Đã thanh toán",
      styles: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    THAT_BAI: {
      text: "Thất bại",
      styles: "bg-red-100 text-red-700 border-red-200",
    },
    HOAN_TIEN: {
      text: "Hoàn tiền",
      styles: "bg-purple-100 text-purple-700 border-purple-200",
    },
    DEFAULT: {
      text: status,
      styles: "bg-gray-100 text-gray-800 border-gray-200",
    },
  };

  const info = statusMap[safeStatus] || statusMap.DEFAULT;

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${info.styles}`}
    >
      {info.text}
    </span>
  );
};

// 4. Badge Vai trò (Role)
export const RoleBadge = ({ role }) => {
  const styles = {
    ADMIN: "bg-purple-100 text-purple-800",
    STAFF: "bg-blue-100 text-blue-800",
    DOCTOR: "bg-cyan-100 text-cyan-800",
    SPA: "bg-pink-100 text-pink-800",
    USER: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        styles[role] || "bg-gray-100 text-gray-800"
      }`}
    >
      {role}
    </span>
  );
};

// 5. Badge Chức vụ/Vị trí
export const PositionBadge = ({ position }) => {
  const pos = position ? position.toLowerCase() : "";
  let style = "bg-gray-100 text-gray-800 border-gray-200";
  if (pos.includes("bác sĩ") || pos.includes("doctor"))
    style = "bg-green-100 text-green-800 border-green-200";
  else if (pos.match(/làm đẹp|groomer|spa|cắt tỉa|chăm sóc/))
    style = "bg-pink-100 text-pink-800 border-pink-200";
  else if (pos.match(/huấn luyện|trainer/))
    style = "bg-orange-100 text-orange-800 border-orange-200";
  else if (pos.match(/quản lý|manager/))
    style = "bg-purple-100 text-purple-800 border-purple-200";
  else if (pos.match(/lễ tân|receptionist/))
    style = "bg-blue-100 text-blue-800 border-blue-200";
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${style}`}
    >
      {position || "---"}
    </span>
  );
};

// 6. Badge Trạng thái Tiêm chủng
export const VaccinationStatusBadge = ({ reVaccinationDate }) => {
  if (!reVaccinationDate)
    return (
      <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
        Không xác định
      </span>
    );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reDate = new Date(reVaccinationDate);
  reDate.setHours(0, 0, 0, 0);
  const diffTime = reDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let label = "Chưa đến hạn",
    style = "bg-green-100 text-green-700 border border-green-200";
  if (diffDays < 0) {
    label = `Quá hạn ${Math.abs(diffDays)} ngày`;
    style = "bg-red-100 text-red-700 border border-red-200";
  } else if (diffDays <= 7) {
    label = `Sắp đến hạn (${diffDays} ngày)`;
    style = "bg-amber-100 text-amber-700 border border-amber-200";
  }
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${style}`}
    >
      {label}
    </span>
  );
};

// 7. Badge Trạng thái Bài viết
export const PostStatusBadge = ({ status }) => {
  const safeStatus = status ? status.trim() : "DEFAULT";
  const statusMap = {
    CONG_KHAI: { text: "Công khai", styles: "bg-green-100 text-green-800" },
    NHAP: { text: "Bản nháp", styles: "bg-gray-100 text-gray-800" },
    AN: { text: "Đã ẩn", styles: "bg-red-100 text-red-800" },
    DEFAULT: { text: "N/A", styles: "bg-gray-100 text-gray-800" },
  };
  const info = statusMap[safeStatus] || statusMap.DEFAULT;
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${info.styles}`}
    >
      {info.text}
    </span>
  );
};

// 8. Badge Tồn kho
export const StockBadge = ({ quantity }) => {
  const { label, color } = getStockInfo(quantity);
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${color}`}
    >
      {label}
    </span>
  );
};

// 9. Badge Khuyến mãi
export const DiscountStatusBadge = ({ isActive, endDate }) => {
  const now = new Date();
  const end = new Date(endDate);
  const isExpired = end < now;
  if (!isActive)
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
        Đang ẩn
      </span>
    );
  if (isExpired)
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
        Hết hạn
      </span>
    );
  return (
    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
      Đang hoạt động
    </span>
  );
};

export const getDiscountTypeLabel = (type) => {
  if (type === "PHAN_TRAM") return "Phần trăm (%)";
  if (type === "SO_TIEN") return "Số tiền (VND)";
  return type;
};

// 10. Star Rating
export const StarRating = ({ count }) => {
  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-[18px] fill-current"
        >
          {i < count ? "star" : "star_border"}
        </span>
      ))}
    </div>
  );
};

// 11. User Avatar (Có fetch ảnh bảo mật)
export const UserAvatar = ({ user, className = "h-8 w-8" }) => {
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_URL);

  useEffect(() => {
    let objectUrl = null;
    const fetchAvatar = async () => {
      if (user?.anhDaiDien) {
        try {
          if (user.anhDaiDien.startsWith("http")) {
            setAvatarUrl(user.anhDaiDien);
            return;
          }

          const imageUrl = `${API_BASE_URL}/uploads/${user.anhDaiDien}`;
          const response = await axios.get(imageUrl, {
            headers: authService.getAuthHeader(),
            responseType: "blob",
          });
          objectUrl = URL.createObjectURL(response.data);
          setAvatarUrl(objectUrl);
        } catch (error) {
          console.error("Lỗi tải avatar:", error);
          setAvatarUrl(DEFAULT_AVATAR_URL);
        }
      } else {
        setAvatarUrl(DEFAULT_AVATAR_URL);
      }
    };

    fetchAvatar();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [user]);

  return (
    <img
      alt="User Avatar"
      className={`rounded-full border border-gray-200 object-cover ${className}`}
      src={avatarUrl}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = DEFAULT_AVATAR_URL;
      }}
    />
  );
};

// 12. Badge Giới tính
export const GenderBadge = (gender) => {
  if (!gender) return <span className="text-gray-400 text-sm">-</span>;

  const lowerGender = gender.toLowerCase();
  let styles = "";
  let icon = "";
  let label = gender;

  if (lowerGender === "nam" || lowerGender === "male") {
    styles = "bg-blue-50 text-blue-700 border-blue-200";
    icon = "male";
    label = "Nam";
  } else if (
    lowerGender === "nữ" ||
    lowerGender === "nu" ||
    lowerGender === "female"
  ) {
    styles = "bg-pink-50 text-pink-700 border-pink-200";
    icon = "female";
    label = "Nữ";
  } else {
    styles = "bg-purple-50 text-purple-700 border-purple-200";
    icon = "transgender";
    label = "Khác";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}
    >
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      {label}
    </span>
  );
};
