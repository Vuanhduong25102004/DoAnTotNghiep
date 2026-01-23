import React from "react";

const AdminDashboard = () => {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="payments"
          iconColor="text-emerald-600"
          bgColor="bg-emerald-100"
          trend="+12.5%"
          trendColor="text-emerald-600 bg-emerald-50"
          label="Doanh thu tháng"
          value="45.200.000đ"
        />
        <StatCard
          icon="shopping_cart"
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
          trend="+8.2%"
          trendColor="text-blue-600 bg-blue-50"
          label="Tổng đơn hàng"
          value="128"
        />
        <StatCard
          icon="person_add"
          iconColor="text-orange-600"
          bgColor="bg-orange-100"
          trend="+14.1%"
          trendColor="text-orange-600 bg-orange-50"
          label="Khách hàng mới"
          value="45"
        />
        <StatCard
          icon="content_cut"
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
          trend="Realtime"
          trendColor="text-slate-500 bg-slate-100"
          label="Dịch vụ đang chạy"
          value="12"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Biểu đồ tăng trưởng doanh thu
              </h3>
              <p className="text-sm text-slate-500">
                So sánh Sản phẩm vs Dịch vụ 6 tháng gần nhất
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-indigo-600"></span>
                <span className="text-xs font-medium text-slate-600">
                  Sản phẩm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                <span className="text-xs font-medium text-slate-600">
                  Dịch vụ
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex h-[300px] w-full items-end justify-between px-2">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full border-t border-slate-100"></div>
              ))}
            </div>
            <ChartBar h1="40%" h2="30%" label="T.5" />
            <ChartBar h1="55%" h2="45%" label="T.6" />
            <ChartBar h1="50%" h2="65%" label="T.7" />
            <ChartBar h1="75%" h2="55%" label="T.8" />
            <ChartBar h1="85%" h2="70%" label="T.9" />
            <ChartBar h1="95%" h2="80%" label="Hiện tại" isCurrent />
          </div>
        </div>

        {/* Column Right: Customer Distribution (Chiếm 4 phần) */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <h3 className="mb-6 text-lg font-bold text-gray-900">
            Phân bổ khách hàng
          </h3>
          <div className="relative flex flex-1 flex-col items-center justify-center">
            {/* CSS Donut Chart */}
            <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[20px] border-slate-100">
              <div
                className="absolute inset-[-20px] rounded-full border-[20px] border-indigo-600"
                style={{
                  clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)",
                }}
              ></div>
              <div
                className="absolute inset-[-20px] rounded-full border-[20px] border-blue-400"
                style={{
                  clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 0% 100%)",
                }}
              ></div>
              <div
                className="absolute inset-[-20px] rounded-full border-[20px] border-orange-400"
                style={{
                  clipPath: "polygon(50% 50%, 0% 100%, 0% 0%, 50% 0%)",
                }}
              ></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">1,248</p>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Tổng khách
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 grid w-full grid-cols-2 gap-x-8 gap-y-2">
              <LegendItem color="bg-indigo-600" label="Mới" value="45%" />
              <LegendItem color="bg-blue-400" label="Quay lại" value="35%" />
              <LegendItem color="bg-orange-400" label="VIP" value="20%" />
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 3: BOTTOM LISTS --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* List 1: Best Sellers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Sản phẩm bán chạy
            </h3>
            <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600">
              Tháng này
            </span>
          </div>
          <div className="space-y-4">
            <ProductItem
              img="https://placehold.co/100"
              name="Hạt Royal Canin Puppy"
              desc="Thức ăn khô • 2kg"
              sold="124"
            />
            <ProductItem
              img="https://placehold.co/100"
              name="Pate King's Pet Mèo"
              desc="Thức ăn ướt • 400g"
              sold="98"
            />
            <ProductItem
              img="https://placehold.co/100"
              name="Xịt khử mùi Petcare"
              desc="Vệ sinh • 500ml"
              sold="76"
            />
          </div>
          <button className="mt-6 w-full rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50">
            Xem toàn bộ kho
          </button>
        </div>

        {/* List 2: Popular Services */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-gray-900">
            Dịch vụ phổ biến
          </h3>
          <div className="space-y-6 pt-2">
            <ServiceBar
              name="Spa & Grooming"
              count="420"
              color="bg-indigo-600"
              width="85%"
            />
            <ServiceBar
              name="Clinic (Thú y)"
              count="215"
              color="bg-blue-500"
              width="45%"
            />
            <ServiceBar
              name="Pet Hotel (Lưu trú)"
              count="180"
              color="bg-orange-400"
              width="38%"
            />
          </div>
          <div className="mt-10 flex items-center gap-4 rounded-2xl bg-indigo-50 p-4">
            <span className="material-symbols-outlined text-3xl text-indigo-600">
              insights
            </span>
            <div>
              <p className="text-xs font-bold uppercase text-indigo-600">
                Xu hướng
              </p>
              <p className="text-sm font-medium text-slate-700">
                Spa tăng 15% so với tuần trước
              </p>
            </div>
          </div>
        </div>

        {/* List 3: Staff Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-gray-900">
            Trạng thái nhân sự
          </h3>
          <div className="mb-8 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div className="flex-1 border-r border-slate-200 text-center">
              <p className="text-2xl font-bold text-emerald-500">18</p>
              <p className="text-[10px] font-bold uppercase text-slate-500">
                Đang làm việc
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-slate-400">03</p>
              <p className="text-[10px] font-bold uppercase text-slate-500">
                Đang nghỉ
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <StaffItem
              initials="DH"
              name="Duy Hiển"
              role="Groomer Team"
              status="online"
            />
            <StaffItem
              initials="MT"
              name="Minh Thư"
              role="Bác sĩ Thú y"
              status="online"
            />
            <StaffItem
              initials="LN"
              name="Linh Nga"
              role="Lễ tân"
              status="offline"
            />
          </div>
          <button className="mt-6 w-full rounded-xl bg-slate-900 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            Phân ca làm việc
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- SUB COMPONENTS (Để code gọn gàng hơn) --- */

const StatCard = ({
  icon,
  iconColor,
  bgColor,
  trend,
  trendColor,
  label,
  value,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div className={`rounded-2xl p-3 ${bgColor}`}>
        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
      </div>
      <span className={`rounded-lg px-2 py-1 text-xs font-bold ${trendColor}`}>
        {trend}
      </span>
    </div>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
      {value}
    </p>
  </div>
);

const ChartBar = ({ h1, h2, label, isCurrent }) => (
  <div className="group relative flex flex-1 items-end justify-center gap-1">
    <div
      className="w-3 rounded-t-sm bg-indigo-600"
      style={{ height: h1 }}
    ></div>
    <div className="w-3 rounded-t-sm bg-blue-500" style={{ height: h2 }}></div>
    <span
      className={`absolute -bottom-6 text-[10px] font-bold ${
        isCurrent ? "uppercase text-slate-400" : "text-slate-400"
      }`}
    >
      {label}
    </span>
  </div>
);

const LegendItem = ({ color, label, value }) => (
  <div className="flex items-center gap-2">
    <span className={`h-2 w-2 rounded-full ${color}`}></span>
    <span className="text-sm font-medium text-slate-600">
      {label}: <span className="font-bold">{value}</span>
    </span>
  </div>
);

const ProductItem = ({ img, name, desc, sold }) => (
  <div className="group flex items-center gap-4">
    <img
      alt="Product"
      className="h-12 w-12 rounded-xl border border-slate-100 object-cover shadow-sm transition-transform group-hover:scale-105"
      src={img}
    />
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-800">{name}</p>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-indigo-600">{sold}</p>
      <p className="text-[10px] font-bold uppercase text-slate-400">Đã bán</p>
    </div>
  </div>
);

const ServiceBar = ({ name, count, color, width }) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-bold text-slate-800">{name}</span>
      <span className="text-xs font-bold text-slate-500">{count} lượt</span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: width }}
      ></div>
    </div>
  </div>
);

const StaffItem = ({ initials, name, role, status }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold ${
          status === "offline" ? "text-slate-400" : ""
        }`}
      >
        {initials}
      </div>
      <div className={status === "offline" ? "opacity-50" : ""}>
        <p className="text-sm font-bold leading-tight text-gray-900">{name}</p>
        <p className="text-[10px] uppercase text-slate-500">{role}</p>
      </div>
    </div>
    {status === "online" ? (
      <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
    ) : (
      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-400">
        Vắng
      </span>
    )}
  </div>
);

export default AdminDashboard;
