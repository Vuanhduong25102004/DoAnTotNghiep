import React from "react";
import { Link } from "react-router-dom";

const ReceptionistPrescription = () => {
  // Dữ liệu thống kê
  const stats = [
    {
      label: "Tổng đơn thuốc",
      value: "2,456",
      icon: "description",
      iconColor: "text-[#2a9d90]",
      bgColor: "bg-[#2a9d90]/10",
    },
    {
      label: "Đơn chưa thanh toán",
      value: "18",
      icon: "pending_actions",
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      label: "Đơn đã hoàn thành",
      value: "2,382",
      icon: "task_alt",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ];

  // Dữ liệu danh sách đơn thuốc
  const prescriptions = [
    {
      id: "#DT-2023-001",
      petName: "Bơ",
      petType: "Poodle",
      petAvatar: null, // Không có ảnh -> dùng Initials
      petInitials: "BƠ",
      petColor: "bg-orange-100 text-orange-600",
      owner: "Nguyễn Lan Anh",
      date: "Hôm nay, 09:15",
      doctorName: "BS. Lê Hữu",
      doctorImg:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80",
      status: "Đang chờ",
      statusStyle: "bg-orange-100 text-orange-700",
    },
    {
      id: "#DT-2023-002",
      petName: "Mimi",
      petType: "Mèo Anh",
      petAvatar: null,
      petInitials: "MM",
      petColor: "bg-blue-100 text-blue-600",
      owner: "Trần Văn Hoàng",
      date: "Hôm nay, 08:30",
      doctorName: "BS. Minh Tâm",
      doctorImg:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=100&q=80",
      status: "Đã thanh toán",
      statusStyle: "bg-green-100 text-green-700",
    },
    {
      id: "#DT-2023-003",
      petName: "Kiki",
      petType: "Corgi",
      petAvatar: null,
      petInitials: "KK",
      petColor: "bg-purple-100 text-purple-600",
      owner: "Lê Thu Thúy",
      date: "Hôm qua, 16:45",
      doctorName: "BS. Quốc Huy",
      doctorImg:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80",
      status: "Hoàn tất",
      statusStyle: "bg-blue-100 text-blue-700",
    },
    {
      id: "#DT-2023-004",
      petName: "Lu",
      petType: "Golden",
      petAvatar: null,
      petInitials: "LU",
      petColor: "bg-gray-100 text-gray-600",
      owner: "Phạm Minh Bình",
      date: "20/10/2023",
      doctorName: "BS. Lê Hữu",
      doctorImg:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80",
      status: "Hoàn tất",
      statusStyle: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <main className="w-full bg-[#fbfcfc] font-sans text-[#101918] min-h-screen p-8 lg:p-12">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* ====================================================================================
            PHẦN 1: HEADER & STATS
           ==================================================================================== */}
        <div className="flex flex-col gap-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 flex items-center gap-6 transition-transform hover:-translate-y-1 duration-300"
              >
                <div
                  className={`size-16 rounded-2xl flex items-center justify-center shrink-0 ${item.bgColor}`}
                >
                  <span
                    className={`material-symbols-outlined text-[32px] ${item.iconColor}`}
                  >
                    {item.icon}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#588d87] uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <h3 className="text-4xl font-extrabold text-[#101918]">
                    {item.value}
                  </h3>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* ====================================================================================
            PHẦN 2: BẢNG DANH SÁCH ĐƠN THUỐC
           ==================================================================================== */}
        <section className="bg-white rounded-[40px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 overflow-hidden">
          {/* Toolbar */}
          <div className="p-8 border-b border-[#e9f1f0] flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-extrabold text-[#101918] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2a9d90]">
                medication
              </span>
              Danh sách đơn thuốc
            </h3>
            <div className="flex gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#588d87]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn, tên khách..."
                  className="pl-12 pr-4 py-2.5 bg-[#f9fbfb] border border-[#e9f1f0] rounded-xl text-sm font-bold text-[#101918] focus:outline-none focus:border-[#2a9d90] w-[300px]"
                />
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#f9fbfb] hover:bg-[#e9f1f0] text-[#588d87] text-sm font-bold rounded-xl transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  filter_list
                </span>
                Bộ lọc
              </button>
              <Link to="/staff/receptionist/prescriptions/create">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#2a9d90] text-white text-sm font-bold rounded-xl hover:bg-[#2a9d90]/90 transition-colors shadow-lg shadow-[#2a9d90]/20">
                  <span className="material-symbols-outlined text-[20px]">
                    add
                  </span>
                  Tạo đơn mới
                </button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fbfb] border-b border-[#e9f1f0]">
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest">
                    Mã đơn
                  </th>
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest">
                    Thú cưng / Chủ nuôi
                  </th>
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest">
                    Ngày kê đơn
                  </th>
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest">
                    Bác sĩ phụ trách
                  </th>
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest">
                    Trạng thái
                  </th>
                  <th className="px-8 py-6 text-xs font-black text-[#588d87] uppercase tracking-widest text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9f1f0]">
                {prescriptions.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#f9fbfb] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-[#2a9d90] bg-[#2a9d90]/10 px-3 py-1.5 rounded-lg">
                        {item.id}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`size-12 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${item.petColor}`}
                        >
                          {item.petInitials}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-[#101918]">
                            {item.petName}{" "}
                            <span className="text-[#588d87] font-medium">
                              ({item.petType})
                            </span>
                          </p>
                          <p className="text-xs text-[#588d87] mt-0.5 font-medium">
                            Chủ: {item.owner}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-[#588d87]">
                      {item.date}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <img
                          alt="Doctor"
                          className="size-9 rounded-full object-cover border border-[#e9f1f0]"
                          src={item.doctorImg}
                        />
                        <span className="text-sm font-bold text-[#101918]">
                          {item.doctorName}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${item.statusStyle}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-4 py-2 bg-[#f9fbfb] border border-[#e9f1f0] text-xs font-bold text-[#588d87] rounded-xl hover:bg-white hover:border-[#2a9d90] hover:text-[#2a9d90] transition-all shadow-sm whitespace-nowrap">
                          Xem chi tiết
                        </button>
                        <button
                          className="size-10 flex items-center justify-center text-[#2a9d90] bg-[#2a9d90]/5 hover:bg-[#2a9d90]/10 rounded-xl transition-colors"
                          title="Thanh toán"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            payments
                          </span>
                        </button>
                        <button
                          className="size-10 flex items-center justify-center text-[#588d87] hover:bg-[#e9f1f0] rounded-xl transition-colors"
                          title="In đơn thuốc"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            print
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="px-8 py-6 bg-[#f9fbfb] border-t border-[#e9f1f0] flex items-center justify-between">
            <p className="text-sm text-[#588d87] font-medium">
              Hiển thị <span className="font-bold text-[#101918]">1 - 4</span>{" "}
              trên <span className="font-bold text-[#101918]">2,456</span> đơn
              thuốc
            </p>
            <div className="flex gap-2">
              <button
                className="size-10 rounded-xl border border-[#e9f1f0] bg-white text-[#588d87] hover:bg-gray-50 flex items-center justify-center disabled:opacity-50"
                disabled
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>
              <button className="size-10 rounded-xl bg-[#2a9d90] text-white text-sm font-bold shadow-md shadow-[#2a9d90]/20">
                1
              </button>
              <button className="size-10 rounded-xl border border-[#e9f1f0] bg-white text-[#588d87] text-sm font-bold hover:bg-gray-50 hover:text-[#2a9d90] transition-colors">
                2
              </button>
              <button className="size-10 rounded-xl border border-[#e9f1f0] bg-white text-[#588d87] text-sm font-bold hover:bg-gray-50 hover:text-[#2a9d90] transition-colors">
                3
              </button>
              <button className="size-10 rounded-xl border border-[#e9f1f0] bg-white text-[#588d87] hover:bg-gray-50 hover:text-[#2a9d90] transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ReceptionistPrescription;
