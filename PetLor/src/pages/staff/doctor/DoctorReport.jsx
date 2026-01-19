import React from "react";

const DoctorReport = () => {
  // 1. Dữ liệu Thống kê (4 thẻ trên cùng)
  const stats = [
    {
      id: 1,
      title: "Tổng ca khám",
      value: "842",
      change: "+12.5%",
      icon: "stethoscope",
      iconColor: "text-[#007A7A]",
      iconBg: "bg-[#007A7A]/10",
    },
    {
      id: 2,
      title: "Doanh thu dịch vụ",
      value: "154.2M",
      change: "+8.2%",
      icon: "payments",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      id: 3,
      title: "Tỷ lệ hoàn thành",
      value: "94.2%",
      change: "98%",
      icon: "task_alt",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      id: 4,
      title: "Bệnh nhân mới",
      value: "126",
      change: "+14",
      icon: "person_add",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
  ];

  // 2. Dữ liệu Dịch vụ phổ biến (Bảng dưới cùng)
  const topServices = [
    {
      id: 1,
      name: "Tiêm chủng định kỳ",
      count: "342 lượt",
      revenue: "42,500,000đ",
      trend: "12%",
      progress: "75%",
      icon: "vaccines",
      colorClass: "bg-[#007A7A]",
      iconBg: "bg-[#007A7A]/5 text-[#007A7A]",
    },
    {
      id: 2,
      name: "Spa & Cắt tỉa",
      count: "215 lượt",
      revenue: "38,200,000đ",
      trend: "8%",
      progress: "55%",
      icon: "content_cut",
      colorClass: "bg-amber-400",
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      id: 3,
      name: "Xét nghiệm & Chẩn đoán",
      count: "128 lượt",
      revenue: "54,800,000đ",
      trend: "24%",
      progress: "40%",
      icon: "radiology",
      colorClass: "bg-blue-500",
      iconBg: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div className="w-full bg-gray-50 font-sans text-slate-600 pb-12">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
        <div className="max-w-[1600px] mx-auto space-y-10">
          {/* --- SECTION 1: STATS CARDS GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item) => (
              <div
                key={item.id}
                className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] group hover:border-[#007A7A]/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`size-12 ${item.iconBg} ${item.iconColor} rounded-2xl flex items-center justify-center`}
                  >
                    <span className="material-symbols-outlined">
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                    {item.change}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {item.title}
                </p>
                <h3 className="text-3xl font-extrabold text-[#0c1d1d]">
                  {item.value}
                </h3>
              </div>
            ))}
          </div>

          {/* --- SECTION 2: CHARTS AREA --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Bar Chart (Xu hướng ca khám) */}
            <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0c1d1d]">
                    Xu hướng ca khám
                  </h3>
                  <p className="text-sm font-medium text-gray-400">
                    Số lượng ca khám theo thời gian trong tháng
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-[#007A7A]"></div>
                    <span className="text-xs font-bold text-gray-500">
                      Tháng này
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-gray-200"></div>
                    <span className="text-xs font-bold text-gray-500">
                      Tháng trước
                    </span>
                  </div>
                </div>
              </div>

              {/* CSS Bar Chart Simulation */}
              <div className="h-64 flex items-end justify-between px-4 pb-4 border-b border-gray-100 relative">
                {/* Background Lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none">
                  <div className="border-t border-gray-50 w-full"></div>
                  <div className="border-t border-gray-50 w-full"></div>
                  <div className="border-t border-gray-50 w-full"></div>
                  <div className="border-t border-gray-50 w-full"></div>
                </div>

                {/* Bars */}
                <div className="flex flex-col items-center gap-2 w-12 z-10 group">
                  <div className="w-2.5 h-32 bg-[#007A7A] rounded-full group-hover:opacity-80 transition-opacity"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    W1
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 w-12 z-10 group">
                  <div className="w-2.5 h-48 bg-[#007A7A] rounded-full group-hover:opacity-80 transition-opacity"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    W2
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 w-12 z-10 group">
                  <div className="w-2.5 h-40 bg-[#007A7A] rounded-full group-hover:opacity-80 transition-opacity"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    W3
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 w-12 z-10 group">
                  <div className="w-2.5 h-56 bg-[#007A7A] rounded-full group-hover:opacity-80 transition-opacity"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    W4
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 w-12 z-10 group">
                  <div className="w-2.5 h-44 bg-[#007A7A]/40 rounded-full group-hover:bg-[#007A7A] transition-colors"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    W5
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Donut Chart (Phân loại thú cưng) */}
            <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[40px] border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
              <h3 className="text-xl font-extrabold text-[#0c1d1d] mb-1">
                Phân loại thú cưng
              </h3>
              <p className="text-sm font-medium text-gray-400 mb-10">
                Tỷ lệ các loài được thăm khám
              </p>

              <div className="relative size-48 mx-auto mb-8">
                {/* SVG Donut Chart */}
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    className="stroke-gray-100"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    strokeWidth="4"
                  ></circle>
                  <circle
                    className="stroke-[#007A7A]"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    strokeDasharray="60, 100"
                    strokeWidth="4"
                  ></circle>
                  <circle
                    className="stroke-amber-400"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-60"
                    strokeWidth="4"
                  ></circle>
                  <circle
                    className="stroke-blue-400"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-85"
                    strokeWidth="4"
                  ></circle>
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#0c1d1d]">
                    842
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Tổng ca
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-2.5 rounded-full bg-[#007A7A]"></div>
                    <span className="text-sm font-bold text-gray-600">Chó</span>
                  </div>
                  <span className="text-sm font-extrabold text-gray-900">
                    60%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-2.5 rounded-full bg-amber-400"></div>
                    <span className="text-sm font-bold text-gray-600">Mèo</span>
                  </div>
                  <span className="text-sm font-extrabold text-gray-900">
                    25%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-2.5 rounded-full bg-blue-400"></div>
                    <span className="text-sm font-bold text-gray-600">
                      Chim &amp; Khác
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-gray-900">
                    15%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- SECTION 3: TABLE --- */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[#0c1d1d]">
                  Dịch vụ phổ biến nhất
                </h3>
                <p className="text-sm font-medium text-gray-400">
                  Thống kê các dịch vụ mang lại hiệu quả cao
                </p>
              </div>
              <button className="px-5 py-2.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">
                Xem tất cả
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] bg-gray-50/50">
                    <th className="px-10 py-5">Tên dịch vụ</th>
                    <th className="px-6 py-5">Số lượt sử dụng</th>
                    <th className="px-6 py-5">Doanh thu</th>
                    <th className="px-6 py-5">Xu hướng</th>
                    <th className="px-10 py-5 text-right">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topServices.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`size-10 ${service.iconBg} rounded-xl flex items-center justify-center`}
                          >
                            <span className="material-symbols-outlined">
                              {service.icon}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {service.name}
                          </h4>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm font-bold text-gray-700">
                        {service.count}
                      </td>
                      <td className="px-6 py-6 text-sm font-bold text-gray-900">
                        {service.revenue}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-1 text-emerald-500">
                          <span className="material-symbols-outlined text-sm">
                            trending_up
                          </span>
                          <span className="text-[11px] font-bold">
                            {service.trend}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="w-full max-w-[100px] ml-auto h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${service.colorClass}`}
                            style={{ width: service.progress }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorReport;
