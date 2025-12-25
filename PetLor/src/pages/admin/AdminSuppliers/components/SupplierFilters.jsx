import React from "react";
import useEscapeKey from "../../../../hooks/useEscapeKey";

const SupplierFilters = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  onOpenCreate,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 text-[20px]">
              search
            </span>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-text-heading placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
            placeholder="Tìm kiếm nhà cung cấp..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2.5 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-text-body bg-white hover:bg-gray-50  focus:outline-none transition-all"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">
              refresh
            </span>
            Làm mới
          </button>

          <button
            onClick={onOpenCreate}
            className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-md text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none"
          >
            <span className="material-symbols-outlined text-[20px] mr-2">
              add
            </span>
            Thêm NCC
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierFilters;
