import React from "react";

const PatientList = () => {
  // Dữ liệu giả lập (Sau này bạn sẽ lấy từ API)
  const patients = [
    {
      id: 1,
      name: "Lu",
      type: "Husky",
      age: "3 tuổi",
      owner: "Nguyễn Anh Tuấn",
      lastVisit: "12/10/2024",
      status: "Cần theo dõi",
      statusClass: "bg-red-50 text-red-500", // status-badge-watch
      avatar:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 2,
      name: "Milo",
      type: "Poodle",
      age: "1 tuổi",
      owner: "Lê Thị Mai",
      lastVisit: "10/10/2024",
      status: "Khỏe mạnh",
      statusClass: "bg-emerald-50 text-emerald-600", // status-badge-healthy
      avatar:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 3,
      name: "Bông",
      type: "Mèo Anh",
      age: "2 tuổi",
      owner: "Trần Minh Tâm",
      lastVisit: "13/10/2024",
      status: "Đang điều trị",
      statusClass: "bg-amber-50 text-amber-600", // status-badge-treating
      avatar:
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 4,
      name: "Cookie",
      type: "Corgi",
      age: "4 tuổi",
      owner: "Phạm Văn Hải",
      lastVisit: "05/10/2024",
      status: "Khỏe mạnh",
      statusClass: "bg-emerald-50 text-emerald-600",
      avatar:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=100&q=80",
    },
  ];

  return (
    <div className="w-full bg-gray-50 font-sans text-slate-600 pb-12">
      <div className="max-w-[1600px] mx-auto p-12 space-y-10">
        {/* --- 1. Stats Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex items-center gap-6 group hover:border-teal-600/20 transition-all">
            <div className="size-16 bg-teal-600/10 text-teal-600 rounded-[24px] flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                Tổng số bệnh nhân
              </p>
              <h3 className="text-4xl font-extrabold text-[#0c1d1d]">1,284</h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex items-center gap-6 group hover:border-teal-600/20 transition-all">
            <div className="size-16 bg-amber-50 text-amber-600 rounded-[24px] flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                medical_services
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                Đang điều trị
              </p>
              <h3 className="text-4xl font-extrabold text-[#0c1d1d]">42</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex items-center gap-6 group hover:border-teal-600/20 transition-all">
            <div className="size-16 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                event_repeat
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                Lịch tái khám hôm nay
              </p>
              <h3 className="text-4xl font-extrabold text-[#0c1d1d]">08</h3>
            </div>
          </div>
        </div>

        {/* --- 2. Table Section --- */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          {/* Header Table */}
          <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-[#0c1d1d]">
              Danh sách chi tiết
            </h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                Lọc theo loài
              </button>
              <button className="px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                Sắp xếp: Mới nhất
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] bg-gray-50/50">
                  <th className="px-10 py-5">Bệnh nhân</th>
                  <th className="px-6 py-5">Chủ nuôi</th>
                  <th className="px-6 py-5">Lần khám cuối</th>
                  <th className="px-6 py-5">Trạng thái</th>
                  <th className="px-10 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {/* Cột Bệnh nhân */}
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                          <img
                            alt={patient.name}
                            className="w-full h-full object-cover"
                            src={patient.avatar}
                          />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-gray-900">
                            {patient.name}
                          </h4>
                          <p className="text-xs font-medium text-gray-400">
                            {patient.type} • {patient.age}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Cột Chủ nuôi */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-gray-400">
                            person
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-700">
                          {patient.owner}
                        </p>
                      </div>
                    </td>

                    {/* Cột Lần khám cuối */}
                    <td className="px-6 py-6 text-sm font-medium text-gray-500">
                      {patient.lastVisit}
                    </td>

                    {/* Cột Trạng thái */}
                    <td className="px-6 py-6">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${patient.statusClass}`}
                      >
                        {patient.status}
                      </span>
                    </td>

                    {/* Cột Thao tác */}
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="px-4 py-2 bg-gray-50 text-teal-600 text-xs font-bold rounded-xl hover:bg-teal-600 hover:text-white transition-all">
                          Hồ sơ bệnh án
                        </button>
                        <button className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-teal-600 transition-all">
                          <span className="material-symbols-outlined text-lg">
                            calendar_add_on
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-10 py-6 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hiển thị 4 trên 1,284 bệnh nhân
            </p>
            <div className="flex items-center gap-1">
              <button className="size-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              <button className="size-10 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-600/20">
                1
              </button>
              <button className="size-10 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="size-10 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                3
              </button>
              <button className="size-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
