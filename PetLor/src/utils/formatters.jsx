/**
 * @file src/utils/formatters.js
 * @description Các hàm định dạng dữ liệu (Tiền tệ, Ngày tháng, Badge)
 */

import React from "react"; // Đảm bảo import React vì có trả về JSX

/**
 * 1. Định dạng tiền tệ VNĐ
 * @param {number|string} amount - Số tiền
 * @returns {string} - "50.000 ₫"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === "") return "0 ₫";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0 ₫";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

/**
 * 2. Định dạng ngày giờ đầy đủ
 * @param {string} dateString - "2025-12-21T10:30:00"
 * @returns {string} - "10:30 21/12/2025"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * 3. Chỉ lấy ngày tháng năm
 * @returns {string} - "21/12/2025"
 */
export const formatJustDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * 4. Định dạng cho input type="datetime-local" (Cần thiết cho Edit Form)
 * @returns {string} - "2025-12-21T10:30"
 */
export const formatDateTimeForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const pad = (num) => num.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * 5. Định dạng hiển thị khoảng thời gian lịch hẹn
 * @returns {string} - "21/12/2025 | 10:30 - 11:30"
 */
export const formatAppointmentTime = (startTime, endTime) => {
  if (!startTime) return "N/A";
  const startDate = new Date(startTime);
  const datePart = formatJustDate(startTime);
  const startTimePart = startDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!endTime) return `${datePart}, ${startTimePart}`;

  const endDate = new Date(endTime);
  const endTimePart = endDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart} | ${startTimePart} - ${endTimePart}`;
};

/**
 * 6. Render Badge trạng thái Lịch hẹn (Trả về JSX Component)
 * Dùng cho hiển thị đơn giản trong bảng
 * @param {string} status - "DA_HOAN_THANH", "CHO_XAC_NHAN"...
 */
export const renderStatusBadge = (status) => {
  const statusConfig = {
    DA_HOAN_THANH: {
      text: "Đã hoàn thành",
      class: "bg-green-50 text-green-700 border-green-100",
    },
    CHO_XAC_NHAN: {
      text: "Chờ xác nhận",
      class: "bg-yellow-50 text-yellow-700 border-yellow-100",
    },
    DA_XAC_NHAN: {
      text: "Đã xác nhận",
      class: "bg-blue-50 text-blue-700 border-blue-100",
    },
    DA_HUY: {
      text: "Đã hủy",
      class: "bg-red-50 text-red-700 border-red-100",
    },
  };

  const config = statusConfig[status] || {
    text: status,
    class: "bg-gray-50 text-gray-700 border-gray-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${config.class}`}
    >
      {config.text.toUpperCase()}
    </span>
  );
};

export const renderOrderStatusBadge = (status) => {
  const { color } = getOrderStatusConfig(status);

  return (
    <div
      className={`flex items-center gap-2 bg-${color}-50 px-4 py-2 rounded-xl border border-${color}-100`}
    >
      <div
        className={`h-2 w-2 rounded-full bg-${color}-500 ${
          status !== "Đã giao" && status !== "Đã hủy" ? "animate-pulse" : ""
        }`}
      ></div>
      <span
        className={`text-sm font-bold text-${color}-700 uppercase tracking-wide`}
      >
        {status}
      </span>
    </div>
  );
};

export const getOrderStatusConfig = (status) => {
  const configs = {
    "Chờ xử lý": {
      topBarColor: "bg-yellow-400",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-100",
      step: 3,
      percent: 0.5,
      label: "Đang xử lý",
      icon: "inventory_2",
    },
    "Đang giao": {
      topBarColor: "bg-blue-400",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      step: 4,
      percent: 0.75,
      label: "Vận chuyển",
      icon: "local_shipping",
    },
    "Đã giao": {
      topBarColor: "bg-emerald-400",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
      step: 5,
      percent: 1,
      label: "Thành công",
      icon: "home",
    },
    "Đã hủy": {
      topBarColor: "bg-red-400",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      borderColor: "border-red-100",
      step: 0,
      percent: 0,
      label: "Đã hủy",
      icon: "close",
    },
  };

  return (
    configs[status] || {
      topBarColor: "bg-gray-400",
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
      borderColor: "border-gray-100",
      step: 1,
      percent: 0.2,
      label: status,
      icon: "help_outline",
    }
  );
};

/**
 * 7. Lấy cấu hình Text & Color cho trạng thái (Trả về Object Data)
 * Dùng cho các component cần custom giao diện (VD: DoctorDashboard)
 * @param {string} status
 * @returns {object} { label, color }
 */
export const getStatusBadge = (status) => {
  switch (status) {
    case "DA_XAC_NHAN":
      return { label: "Đã xác nhận", color: "bg-blue-50 text-blue-700" };
    case "DA_HOAN_THANH":
      return { label: "Hoàn thành", color: "bg-green-50 text-green-700" };
    case "DA_HUY":
      return { label: "Đã hủy", color: "bg-red-50 text-red-700" };
    case "CHO_XAC_NHAN":
    default:
      return { label: "Chờ xác nhận", color: "bg-yellow-50 text-yellow-700" };
  }
};
/**
 * 8. Format giờ cho Lịch trình (Tách giờ và AM/PM)
 * @param {string} isoString - "2024-05-20T08:30:00"
 * @returns {object} { time: "08:30", period: "AM" }
 */
export const formatTimeForSchedule = (isoString) => {
  if (!isoString) return { time: "--:--", period: "--" };
  const date = new Date(isoString);

  // Lấy chuỗi giờ dạng "08:30 AM"
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Tách ra thành mảng ["08:30", "AM"]
  const parts = timeStr.split(" ");

  // Xử lý phòng trường hợp format khác
  if (parts.length >= 2) {
    return { time: parts[0], period: parts[1] };
  }

  return { time: timeStr, period: "" };
};
/**
 * 9. Lấy cấu hình Text & Color cho LOẠI LỊCH HẸN
 * @param {string} type - "KHAN_CAP", "THUONG_LE"... hoặc Tiếng Việt
 */
export const getAppointmentTypeBadge = (type) => {
  // Chuẩn hóa input
  const normalizedType = type ? type.toUpperCase() : "";

  // Xử lý mapping dựa trên Enum key hoặc Text tiếng Việt
  switch (normalizedType) {
    // 1. KHẨN CẤP
    case "KHAN_CAP":
    case "KHẨN CẤP":
    case "KHẨN CẤP (CẤP CỨU)":
      return {
        label: "Khẩn cấp",
        color: "bg-red-50 text-red-700 border border-red-200",
      };

    // 2. THƯỜNG LỆ
    case "THUONG_LE":
    case "THƯỜNG LỆ":
      return {
        label: "Thường lệ",
        color: "bg-blue-50 text-blue-700 border border-blue-200",
      };

    // 3. TÁI KHÁM
    case "TAI_KHAM":
    case "TÁI KHÁM":
      return {
        label: "Tái khám",
        color: "bg-amber-50 text-amber-700 border border-amber-200",
      };

    // 4. TƯ VẤN
    case "TU_VAN":
    case "TƯ VẤN":
      return {
        label: "Tư vấn",
        color: "bg-purple-50 text-purple-700 border border-purple-200",
      };

    // 5. TIÊM PHÒNG
    case "TIEM_PHONG":
    case "TIÊM PHÒNG":
      return {
        label: "Tiêm phòng",
        color: "bg-teal-50 text-teal-700 border border-teal-200",
      };

    // 6. PHẪU THUẬT
    case "PHAU_THUAT":
    case "PHẪU THUẬT":
      return {
        label: "Phẫu thuật",
        color: "bg-rose-50 text-rose-700 border border-rose-200",
      };

    default:
      return {
        label: type || "Khác",
        color: "bg-gray-50 text-gray-700 border border-gray-200",
      };
  }
};

/**
 * 10. Render Badge cho LOẠI LỊCH HẸN (JSX Component)
 * Dùng nhanh trong bảng
 */
export const renderAppointmentTypeBadge = (type) => {
  const { label, color } = getAppointmentTypeBadge(type);
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider whitespace-nowrap ${color}`}
    >
      {label}
    </span>
  );
};

export const renderReceptionistStatusBadge = (status) => {
  const statusConfig = {
    DA_HOAN_THANH: {
      text: "Hoàn thành",
      style: "bg-green-50 text-green-600 border-green-100",
    },
    CHO_XAC_NHAN: {
      text: "Chờ xác nhận",
      style: "bg-blue-50 text-blue-500 border-blue-100",
    },
    DA_XAC_NHAN: {
      text: "Sắp tới",
      style: "bg-orange-50 text-orange-500 border-orange-100",
    },
    DA_HUY: {
      text: "Đã hủy",
      style: "bg-red-50 text-red-500 border-red-100",
    },
  };

  const config = statusConfig[status] || {
    text: status,
    style: "bg-gray-50 text-gray-500 border-gray-100",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border ${config.style}`}
    >
      {config.text}
    </span>
  );
};
