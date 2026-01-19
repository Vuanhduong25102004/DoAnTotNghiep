import React from "react";

const ReceptionistAppointment = () => {
  // Dữ liệu giả lập từ HTML của bạn
  const appointments = [
    {
      id: 1,
      time: "14:00",
      petName: "Mimi",
      petType: "Mèo Ba Tư",
      owner: "Anh Hoàng",
      phone: "090xxxx123",
      service: "Tắm & Vệ sinh",
      staff: "Mai Ngọc",
      staffRole: "MN",
      staffColor: "bg-[#2a9d90]/20 text-[#2a9d90]", // Primary color
      status: "Sắp tới",
      statusStyle: "bg-orange-50 text-orange-500 border-orange-100",
      canCheckIn: true,
      img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 2,
      time: "13:15",
      petName: "Kiki",
      petType: "Shiba Inu",
      owner: "Chị Thúy",
      phone: "091xxxx456",
      service: "Kiểm tra định kỳ",
      staff: "Quốc Nam",
      staffRole: "BS",
      staffColor: "bg-blue-100 text-blue-600",
      status: "Đã check-in",
      statusStyle: "bg-[#2a9d90]/10 text-[#2a9d90] border-[#2a9d90]/20",
      canCheckIn: false,
      img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 3,
      time: "12:30",
      petName: "Lu",
      petType: "Golden Retriever",
      owner: "Anh Bình",
      phone: "098xxxx789",
      service: "Cắt tỉa lông",
      staff: "Lê Huy",
      staffRole: "LH",
      staffColor: "bg-purple-100 text-purple-600",
      status: "Đang khám",
      statusStyle: "bg-blue-50 text-blue-500 border-blue-100",
      canCheckIn: false,
      img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 4,
      time: "15:30",
      petName: "Nâu",
      petType: "Poodle",
      owner: "Chị Lan",
      phone: "094xxxx222",
      service: "Tiêm chủng",
      staff: "Quốc Nam",
      staffRole: "BS",
      staffColor: "bg-blue-100 text-blue-600",
      status: "Sắp tới",
      statusStyle: "bg-orange-50 text-orange-500 border-orange-100",
      canCheckIn: true,
      img: null, // Trường hợp không có ảnh
    },
  ];

  return (
    <main className="w-full bg-[#fbfcfc] font-sans text-[#101918] min-h-screen p-8 lg:p-12">
      <div className="max-w-[1600px] mx-auto space-y-10">
        {/* ====================================================================================
            PHẦN 1: THỐNG KÊ (STATS)
           ==================================================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 flex items-center gap-6">
            <div className="size-16 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-orange-500 text-[36px]">
                pending_actions
              </span>
            </div>
            <div>
              <p className="text-[#588d87] text-sm font-bold uppercase tracking-widest">
                Lịch chờ check-in
              </p>
              <h3 className="text-4xl font-extrabold mt-1 text-[#101918]">
                12
              </h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 flex items-center gap-6">
            <div className="size-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-blue-500 text-[36px]">
                medical_services
              </span>
            </div>
            <div>
              <p className="text-[#588d87] text-sm font-bold uppercase tracking-widest">
                Đang thực hiện
              </p>
              <h3 className="text-4xl font-extrabold mt-1 text-[#101918]">
                08
              </h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 flex items-center gap-6">
            <div className="size-16 bg-[#2a9d90]/10 rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#2a9d90] text-[36px]">
                check_circle
              </span>
            </div>
            <div>
              <p className="text-[#588d87] text-sm font-bold uppercase tracking-widest">
                Lịch đã hoàn thành
              </p>
              <h3 className="text-4xl font-extrabold mt-1 text-[#101918]">
                45
              </h3>
            </div>
          </div>
        </section>

        {/* ====================================================================================
            PHẦN 2: DANH SÁCH LỊCH HẸN
           ==================================================================================== */}
        <div className="space-y-8">
          {/* Header & Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-2xl font-extrabold text-[#101918] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2a9d90] text-[32px]">
                calendar_month
              </span>
              Lịch hẹn hôm nay
            </h3>

            <div className="flex gap-3 bg-white p-1.5 rounded-2xl border border-[#e9f1f0] shadow-sm">
              <button className="px-6 py-2.5 text-sm font-bold bg-[#2a9d90] text-white rounded-xl shadow-md shadow-[#2a9d90]/20 transition-all">
                Tất cả
              </button>
              <button className="px-6 py-2.5 text-sm font-bold text-[#588d87] hover:bg-[#f9fbfb] rounded-xl transition-colors">
                Sắp tới
              </button>
              <button className="px-6 py-2.5 text-sm font-bold text-[#588d87] hover:bg-[#f9fbfb] rounded-xl transition-colors">
                Đang khám
              </button>
            </div>
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {appointments.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#2a9d90]/10 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col gap-6"
              >
                {/* Time Header */}
                <div className="flex items-center justify-between border-b border-[#e9f1f0] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#2a9d90] text-[24px]">
                      schedule
                    </span>
                    <span className="text-xl font-black text-[#2a9d90]">
                      {item.time}
                    </span>
                  </div>
                  <span className="text-xs text-[#588d87] font-bold uppercase tracking-wide bg-[#f9fbfb] px-3 py-1 rounded-full">
                    Hôm nay, 24/05
                  </span>
                </div>

                {/* Pet Info */}
                <div className="flex items-start gap-5">
                  {item.img ? (
                    <img
                      alt={item.petName}
                      className="size-20 rounded-2xl object-cover border border-[#e9f1f0] shadow-sm"
                      src={item.img}
                    />
                  ) : (
                    <div className="size-20 rounded-2xl bg-[#f9fbfb] flex items-center justify-center border border-[#e9f1f0] text-[#588d87]">
                      <span className="material-symbols-outlined text-[32px]">
                        pets
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0 py-1">
                    <h4 className="text-lg font-extrabold truncate text-[#101918]">
                      {item.petName}
                    </h4>
                    <p className="text-sm text-[#588d87] font-medium mb-1.5">
                      {item.petType}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#588d87]">
                        person
                      </span>
                      <p className="text-xs text-[#588d87] font-bold truncate">
                        {item.owner} • {item.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Info Box */}
                <div className="bg-[#f9fbfb] rounded-2xl p-4 space-y-3 border border-[#e9f1f0]/50">
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-white rounded-full flex items-center justify-center border border-[#e9f1f0] text-[#2a9d90]">
                      <span className="material-symbols-outlined text-[18px]">
                        medical_information
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#588d87] font-bold uppercase">
                        Dịch vụ
                      </p>
                      <span className="text-sm font-bold text-[#101918]">
                        {item.service}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center text-[10px] font-black border border-white shadow-sm ${item.staffColor}`}
                    >
                      {item.staffRole}
                    </div>
                    <div>
                      <p className="text-[10px] text-[#588d87] font-bold uppercase">
                        Phụ trách
                      </p>
                      <span className="text-sm font-bold text-[#101918]">
                        {item.staff}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span
                    className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border ${item.statusStyle}`}
                  >
                    {item.status}
                  </span>

                  <div className="flex gap-3">
                    <button className="size-10 flex items-center justify-center text-[#588d87] hover:bg-[#f9fbfb] hover:text-[#2a9d90] rounded-xl transition-colors border border-transparent hover:border-[#e9f1f0]">
                      <span className="material-symbols-outlined text-[20px]">
                        edit
                      </span>
                    </button>
                    {item.canCheckIn ? (
                      <button className="px-6 py-2 bg-[#2a9d90] text-white text-xs font-bold rounded-xl hover:bg-[#2a9d90]/90 transition-all shadow-lg shadow-[#2a9d90]/20">
                        Check-in
                      </button>
                    ) : (
                      <button className="px-6 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed border border-gray-200">
                        Check-in
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-6 border-t border-[#e9f1f0]">
            <p className="text-sm font-medium text-[#588d87]">
              Hiển thị <span className="font-bold text-[#101918]">4</span> trong
              số <span className="font-bold text-[#101918]">65</span> lịch hẹn
            </p>
            <div className="flex gap-2">
              <button className="size-10 flex items-center justify-center rounded-xl border border-[#e9f1f0] bg-white hover:bg-[#f9fbfb] hover:border-[#2a9d90] transition-colors text-[#588d87]">
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>
              <button className="size-10 flex items-center justify-center rounded-xl bg-[#2a9d90] text-white text-sm font-bold shadow-md shadow-[#2a9d90]/20">
                1
              </button>
              <button className="size-10 flex items-center justify-center rounded-xl border border-[#e9f1f0] bg-white hover:bg-[#f9fbfb] hover:text-[#2a9d90] transition-colors text-sm font-bold text-[#588d87]">
                2
              </button>
              <button className="size-10 flex items-center justify-center rounded-xl border border-[#e9f1f0] bg-white hover:bg-[#f9fbfb] hover:text-[#2a9d90] transition-colors text-sm font-bold text-[#588d87]">
                3
              </button>
              <button className="size-10 flex items-center justify-center rounded-xl border border-[#e9f1f0] bg-white hover:bg-[#f9fbfb] hover:border-[#2a9d90] transition-colors text-[#588d87]">
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReceptionistAppointment;
