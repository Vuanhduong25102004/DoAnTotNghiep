import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Dữ liệu Thống kê (Stats)
const statsData = [
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

// Dữ liệu Đơn hàng gần đây
const recentOrders = [
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

// Dữ liệu Lịch hẹn sắp tới
const upcomingAppointments = [
  {
    time: "09:00",
    period: "AM",
    title: "Grooming cho 'Milo'",
    customer: "Trần Thị B",
    staff: "An",
    type: "primary",
  },
  {
    time: "11:30",
    period: "AM",
    title: "Khám sức khỏe cho 'Ki'",
    customer: "Lê Văn C",
    staff: "BS. Dũng",
    type: "yellow",
  },
  {
    time: "02:00",
    period: "PM",
    title: "Spa thư giãn cho 'Luna'",
    customer: "Nguyễn Văn A",
    staff: "Chi",
    type: "primary",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy user từ localStorage thay vì gọi service để tránh lỗi
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "DOCTOR") {
      navigate("/admin/appointments");
    }
  }, [navigate]);

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Tổng quan Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-sm"
          >
            <p className="text-gray-700 text-base font-medium leading-normal">
              {stat.title}
            </p>
            <p className="text-gray-900 tracking-light text-2xl font-bold leading-tight">
              {stat.value}
            </p>
            <p
              className={`text-sm font-medium leading-normal ${
                stat.isPositive ? "text-green-600" : "text-gray-500"
              }`}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">
              Đơn hàng gần đây
            </h2>
            <a
              className="text-sm font-medium text-primary hover:underline"
              href="#"
            >
              Xem tất cả
            </a>
          </div>
          {/* ... Table code ... */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID Đơn</th>

                  <th className="px-4 py-3 font-semibold">Khách hàng</th>

                  <th className="px-4 py-3 font-semibold">Ngày</th>

                  <th className="px-4 py-3 font-semibold">Tổng tiền</th>

                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {order.id}
                    </td>

                    <td className="px-4 py-3">{order.customer}</td>

                    <td className="px-4 py-3">{order.date}</td>

                    <td className="px-4 py-3 font-medium">{order.total}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${order.statusColor}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">
              Lịch hẹn sắp tới
            </h2>
            <a
              className="text-sm font-medium text-primary hover:underline"
              href="#"
            >
              Xem lịch
            </a>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((app, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 text-center flex-shrink-0">
                  <p className="font-bold text-lg text-gray-900">{app.time}</p>
                  <p className="text-xs text-gray-500">{app.period}</p>
                </div>
                <div
                  className={`border-l-2 pl-4 ${
                    app.type === "primary"
                      ? "border-primary"
                      : "border-yellow-400"
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-800">
                    {app.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Khách hàng: {app.customer}
                  </p>
                  <p className="text-xs text-gray-500">
                    Nhân viên: {app.staff}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
