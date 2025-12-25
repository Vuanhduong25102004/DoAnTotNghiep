import React from "react";
import useEscapeKey from "../../../../hooks/useEscapeKey";
import { formatCurrency } from "../../components/utils";

const ServiceStats = ({ totalServices, maxPriceName, avgPrice }) => {
  const stats = [
    {
      title: "Tổng dịch vụ",
      value: totalServices,
      icon: "medical_services",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    {
      title: "Dịch vụ giá cao nhất",
      value: maxPriceName,
      icon: "star",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      border: "border-yellow-500",
    },
    {
      title: "Giá trung bình",
      value: formatCurrency(avgPrice),
      icon: "attach_money",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
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
                    <div
                      className="text-lg font-bold text-gray-900 truncate"
                      title={String(stat.value)}
                    >
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

export default ServiceStats;
