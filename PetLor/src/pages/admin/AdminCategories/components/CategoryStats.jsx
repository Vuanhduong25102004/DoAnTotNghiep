import React from "react";

const CategoryStats = ({ total, typeTitle }) => {
  // Vì mỗi loại danh mục có cấu trúc khác nhau, ta chỉ thống kê tổng số lượng
  // để tránh lỗi truy cập vào các trường không tồn tại (như soLuongSanPham).

  const stats = [
    {
      title: `Tổng số ${typeTitle}`,
      value: total || 0,
      icon: "category",
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-600",
    },
    // Bạn có thể thêm các thống kê khác nếu API trả về đủ dữ liệu
    // Ví dụ: Số danh mục mới tạo trong tháng, v.v.
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 border-l-4 ${stat.border}`}
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.bg} rounded-md p-3`}>
                <span
                  className={`material-symbols-outlined ${stat.color} text-2xl`}
                >
                  {stat.icon}
                </span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </dt>
                  <dd>
                    <div className="text-lg font-bold text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryStats;
