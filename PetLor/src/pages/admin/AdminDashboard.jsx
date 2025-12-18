import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Import dữ liệu mẫu. Trong ứng dụng thực tế, dữ liệu này sẽ được fetch từ API.
import { statsData, recentOrders, upcomingAppointments } from "./mockData.js";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra vai trò của người dùng khi component được render.
    // Nếu người dùng có vai trò là 'DOCTOR', chuyển hướng họ đến trang quản lý lịch hẹn.
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "DOCTOR") {
      navigate("/admin/appointments");
    }
  }, [navigate]);

  return (
    <>
      {/* Tiêu đề trang */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Tổng quan Dashboard
        </p>
      </div>

      {/* Lưới hiển thị các thẻ thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statsData.map((stat) => (
          <div
            key={stat.title} // Sử dụng `title` làm key vì nó là duy nhất trong dữ liệu mẫu
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

      {/* Lưới chính chứa các phần Đơn hàng gần đây và Lịch hẹn sắp tới */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phần: Đơn hàng gần đây */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">
              Đơn hàng gần đây
            </h2>
            <Link
              to="/admin/orders"
              className="text-sm font-medium text-primary hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto">
            {/* Bảng hiển thị các đơn hàng */}
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-semibold">ID Đơn</th>

                  <th className="px-6 py-3 font-semibold">Khách hàng</th>

                  <th className="px-6 py-3 font-semibold">Ngày</th>

                  <th className="px-6 py-3 font-semibold">Tổng tiền</th>

                  <th className="px-6 py-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id} // Sử dụng `id` của đơn hàng làm key để tối ưu việc render
                    className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.id}
                    </td>

                    <td className="px-6 py-4">{order.customer}</td>

                    <td className="px-6 py-4">{order.date}</td>

                    <td className="px-6 py-4 font-medium">{order.total}</td>

                    <td className="px-6 py-4">
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

        {/* Phần: Lịch hẹn sắp tới */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">
              Lịch hẹn sắp tới
            </h2>
            <Link
              to="/admin/appointments"
              className="text-sm font-medium text-primary hover:underline"
            >
              Xem lịch
            </Link>
          </div>
          {/* Danh sách các lịch hẹn */}
          <div className="space-y-4">
            {upcomingAppointments.map((app) => (
              <div
                key={app.id} // Sử dụng `id` của lịch hẹn làm key
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
