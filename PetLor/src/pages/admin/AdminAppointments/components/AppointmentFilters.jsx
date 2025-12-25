import React from "react";
import useEscapeKey from "../../../../hooks/useEscapeKey";
import { APPOINTMENT_STATUSES } from "../../components/utils";

const AppointmentFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  setCurrentPage,
  onOpenAddModal,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative rounded-md shadow-sm max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400">
                search
              </span>
            </div>
            <input
              className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
              placeholder="Tìm khách hàng, thú cưng..."
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {/* Filter Status */}
          <div className="relative rounded-md shadow-sm max-w-xs">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md h-10"
            >
              <option value="">Tất cả trạng thái</option>
              {APPOINTMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
            <span className="material-symbols-outlined text-sm mr-2">
              calendar_month
            </span>{" "}
            Lịch biểu
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none"
            onClick={onOpenAddModal}
          >
            <span className="material-symbols-outlined text-sm mr-2">add</span>{" "}
            Tạo Lịch hẹn
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentFilters;
