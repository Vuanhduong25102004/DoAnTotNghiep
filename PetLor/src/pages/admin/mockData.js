// Dữ liệu Thống kê (Stats) - Dữ liệu mẫu để hiển thị trên dashboard
export const statsData = [
  { title: "Tổng người dùng", value: "1,204", change: "+5%", isPositive: true },
  { title: "Tổng thú cưng", value: "1,530", change: "+8%", isPositive: true },
  {
    title: "Đơn hàng tháng này",
    value: "256",
    change: "+12%",
    isPositive: true,
  },
  { title: "Lịch hẹn tuần này", value: "88", change: "+3%", isPositive: true },
  { title: "Nhân viên", value: "15", change: "-", isPositive: false },
  {
    title: "Doanh thu tháng",
    value: "150tr",
    change: "+15%",
    isPositive: true,
  },
];

// Dữ liệu Đơn hàng gần đây - Dữ liệu mẫu
export const recentOrders = [
  {
    id: "#12056",
    customer: "Nguyễn Văn A",
    date: "15/07/2024",
    total: "550.000 đ",
    status: "Hoàn thành",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: "#12055",
    customer: "Trần Thị B",
    date: "15/07/2024",
    total: "300.000 đ",
    status: "Đang xử lý",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "#12054",
    customer: "Lê Văn C",
    date: "14/07/2024",
    total: "1.200.000 đ",
    status: "Hoàn thành",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: "#12053",
    customer: "Phạm Thị D",
    date: "14/07/2024",
    total: "250.000 đ",
    status: "Đã hủy",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    id: "#12052",
    customer: "Võ Văn E",
    date: "13/07/2024",
    total: "780.000 đ",
    status: "Hoàn thành",
    statusColor: "bg-green-100 text-green-800",
  },
];

// Dữ liệu Lịch hẹn sắp tới - Dữ liệu mẫu
export const upcomingAppointments = [
  {
    id: "appt-1", // Thêm ID để làm key trong React
    time: "09:00",
    period: "AM",
    title: "Grooming cho 'Milo'",
    customer: "Trần Thị B",
    staff: "An",
    type: "primary",
  },
  {
    id: "appt-2",
    time: "11:30",
    period: "AM",
    title: "Khám sức khỏe cho 'Ki'",
    customer: "Lê Văn C",
    staff: "BS. Dũng",
    type: "yellow",
  },
  {
    id: "appt-3",
    time: "02:00",
    period: "PM",
    title: "Spa thư giãn cho 'Luna'",
    customer: "Nguyễn Văn A",
    staff: "Chi",
    type: "primary",
  },
];