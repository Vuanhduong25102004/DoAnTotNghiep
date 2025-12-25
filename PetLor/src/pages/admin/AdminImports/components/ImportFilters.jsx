import React from "react";
import useEscapeKey from "../../../../hooks/useEscapeKey";

const ImportFilters = ({
  searchTerm,
  setSearchTerm,
  onRefresh,
  onNewImportClick,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400">
                search
              </span>
            </div>
            <input
              type="text"
              className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10 transition-shadow"
              placeholder="Tìm theo mã phiếu, NCC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
          >
            <span className="material-symbols-outlined text-sm mr-2">
              refresh
            </span>
            Làm mới
          </button>
          <button
            onClick={onNewImportClick}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">
              add_circle
            </span>
            Nhập hàng mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportFilters;
