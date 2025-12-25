import React from "react";
import { POST_STATUSES, POST_STATUS_MAP } from "../../components/utils";

const PostFilters = ({
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
          <div className="relative rounded-md shadow-sm max-w-xs">
            <input
              className="focus:ring-primary focus:border-primary block w-full pl-3 sm:text-sm border-gray-300 rounded-md h-10"
              placeholder="Tìm theo tiêu đề..."
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
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
              {POST_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {POST_STATUS_MAP[status]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none"
        >
          <span className="material-symbols-outlined text-sm mr-2">add</span>{" "}
          Viết bài mới
        </button>
      </div>
    </div>
  );
};

export default PostFilters;
