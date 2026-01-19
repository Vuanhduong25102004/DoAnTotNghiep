import React from "react";

const CreatePrescription = () => {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#fbfcfc] font-sans text-[#101918]">
      {/* ====================================================================================
          HEADER
         ==================================================================================== */}
      <header className="h-16 border-b border-[#e9f1f0] bg-white flex items-center justify-between px-8 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#f9fbfb] rounded-full transition-colors text-[#588d87]">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold text-[#101918]">
            Lên đơn thuốc mới
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#101918] leading-none">
                Minh Anh
              </p>
              <p className="text-[10px] text-[#588d87] mt-1">Lễ tân Ca sáng</p>
            </div>
            <img
              alt="Receptionist profile avatar"
              className="size-9 rounded-full border border-[#e9f1f0]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-xFs8HvUArVqDUgTOifQoS5I78w5m_t8vIinou8Gtqk-xi3UwJcajOBJmqlDcirKEAfD6hc_DXw7vT1Mgy706asRNQF-vAvYBPKt7bdPhvYnHut4C49L6RXUYun8lMEmHsJy25a0kG_UDUPMKufr4iDoQ2uTxs6JQ4Ro_sDy7kRDKj7GpCaRxyGpzuFxBSD1sO7bFGEqrG1reNm69lI66rwcgtJyuXRjHchDF29q1tZBQpwzYURUMQrMVh3f0x9Uh8Y1sjiQ2Jfk"
            />
          </div>
        </div>
      </header>

      {/* ====================================================================================
          MAIN CONTENT
         ==================================================================================== */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar pb-32">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* SECTION 1: THÔNG TIN BỆNH NHI */}
          <section className="bg-white rounded-2xl border border-[#e9f1f0] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e9f1f0]">
              <h3 className="text-base font-bold text-[#101918] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2a9d90]">
                  pets
                </span>
                Thông tin bệnh nhi
              </h3>
            </div>
            <div className="p-6">
              <div className="relative mb-6">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#588d87] text-[20px]">
                  search
                </span>
                <input
                  className="w-full bg-[#f9fbfb] border border-[#e9f1f0] rounded-xl pl-10 py-2.5 text-sm focus:ring-2 focus:ring-[#2a9d90]/20 focus:outline-none placeholder:text-[#588d87]"
                  placeholder="Tìm tên thú cưng hoặc tên chủ nuôi..."
                  type="text"
                  defaultValue="Bơ (Poodle) - Nguyễn Lan Anh"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 bg-[#f9fbfb] rounded-xl border border-[#e9f1f0]">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#588d87] uppercase tracking-wider">
                    Tên thú cưng
                  </span>
                  <span className="text-sm font-semibold text-[#101918]">
                    Bơ
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#588d87] uppercase tracking-wider">
                    Giống loài
                  </span>
                  <span className="text-sm font-semibold text-[#101918]">
                    Chó Poodle
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#588d87] uppercase tracking-wider">
                    Tuổi
                  </span>
                  <span className="text-sm font-semibold text-[#101918]">
                    2 tuổi 4 tháng
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#588d87] uppercase tracking-wider">
                    Chủ nuôi
                  </span>
                  <span className="text-sm font-semibold text-[#101918]">
                    Nguyễn Lan Anh
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: CHI TIẾT ĐƠN THUỐC */}
          <section className="bg-white rounded-2xl border border-[#e9f1f0] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e9f1f0] flex justify-between items-center">
              <h3 className="text-base font-bold text-[#101918] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2a9d90]">
                  pill
                </span>
                Chi tiết đơn thuốc
              </h3>
              <span className="text-xs text-[#588d87] font-medium italic">
                Vui lòng kiểm tra kỹ liều lượng trước khi in
              </span>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f9fbfb] border-b border-[#e9f1f0]">
                      <th className="px-4 py-3 text-[11px] font-bold text-[#588d87] uppercase tracking-wider w-[35%]">
                        Tên thuốc
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#588d87] uppercase tracking-wider w-[10%]">
                        Số lượng
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#588d87] uppercase tracking-wider w-[10%]">
                        Đơn vị
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#588d87] uppercase tracking-wider w-[20%]">
                        Liều dùng
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#588d87] uppercase tracking-wider w-[20%]">
                        Cách dùng
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#588d87] uppercase tracking-wider w-[5%]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e9f1f0]">
                    {/* Row 1: Có dữ liệu */}
                    <tr>
                      <td className="px-4 py-4">
                        <div className="relative">
                          <input
                            className="w-full text-sm bg-[#f9fbfb] border border-[#e9f1f0] rounded-lg focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none px-3 py-2"
                            type="text"
                            defaultValue="Apoquel 3.6mg"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          className="w-full text-sm bg-[#f9fbfb] border border-[#e9f1f0] rounded-lg focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none px-3 py-2"
                          type="number"
                          defaultValue="10"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <select className="w-full text-sm bg-[#f9fbfb] border border-[#e9f1f0] rounded-lg focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none px-2 py-2">
                          <option>Viên</option>
                          <option>Ống</option>
                          <option>Lọ</option>
                          <option>Gói</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          className="w-full text-sm bg-[#f9fbfb] border border-[#e9f1f0] rounded-lg focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none px-3 py-2"
                          type="text"
                          defaultValue="1 viên/lần, 2 lần/ngày"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          className="w-full text-sm bg-[#f9fbfb] border border-[#e9f1f0] rounded-lg focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none px-3 py-2"
                          type="text"
                          defaultValue="Sau ăn sáng và tối"
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-red-400 hover:text-red-600 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </td>
                    </tr>

                    {/* Row 2: Placeholder */}
                    <tr>
                      <td className="px-4 py-4">
                        <input
                          className="w-full text-sm bg-white border-dashed border-2 border-[#e9f1f0] rounded-lg focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none px-3 py-2 placeholder:text-gray-400 transition-all"
                          placeholder="Tìm tên thuốc..."
                          type="text"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          className="w-full text-sm bg-white border-dashed border-2 border-[#e9f1f0] rounded-lg focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none px-3 py-2 transition-all"
                          type="number"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <select className="w-full text-sm bg-white border-dashed border-2 border-[#e9f1f0] rounded-lg focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none px-2 py-2 text-gray-400 transition-all">
                          <option>Đơn vị</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          className="w-full text-sm bg-white border-dashed border-2 border-[#e9f1f0] rounded-lg focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none px-3 py-2 placeholder:text-gray-400 transition-all"
                          placeholder="VD: 2 lần/ngày"
                          type="text"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          className="w-full text-sm bg-white border-dashed border-2 border-[#e9f1f0] rounded-lg focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none px-3 py-2 placeholder:text-gray-400 transition-all"
                          placeholder="VD: Sau ăn"
                          type="text"
                        />
                      </td>
                      <td className="px-4 py-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="mt-4 flex items-center gap-2 text-[#2a9d90] font-bold text-sm hover:underline">
                <span className="material-symbols-outlined text-[20px]">
                  add_circle
                </span>
                Thêm thuốc mới vào đơn
              </button>
            </div>
          </section>

          {/* SECTION 3: CHẨN ĐOÁN & GHI CHÚ */}
          <section className="bg-white rounded-2xl border border-[#e9f1f0] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#e9f1f0]">
              <h3 className="text-base font-bold text-[#101918] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2a9d90]">
                  assignment
                </span>
                Chẩn đoán &amp; Ghi chú
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#588d87] uppercase tracking-wider">
                  Chẩn đoán của bác sĩ
                </label>
                <textarea
                  className="w-full text-sm bg-[#f9fbfb] border border-[#e9f1f0] rounded-xl focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none placeholder:text-gray-400 p-3"
                  placeholder="Nhập kết luận chẩn đoán bệnh..."
                  rows="4"
                ></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#588d87] uppercase tracking-wider">
                  Lời dặn thêm
                </label>
                <textarea
                  className="w-full text-sm bg-[#f9fbfb] border border-[#e9f1f0] rounded-xl focus:ring-1 focus:ring-[#2a9d90] focus:border-[#2a9d90] focus:outline-none placeholder:text-gray-400 p-3"
                  placeholder="Dặn dò chủ nuôi chăm sóc tại nhà..."
                  rows="4"
                ></textarea>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ====================================================================================
          FOOTER (FIXED)
         ==================================================================================== */}
      <footer className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-[#e9f1f0] px-8 flex items-center justify-between z-10 lg:left-0">
        {/* Note: Left-64 was removed to make it fit within this component container. 
            If sidebar is outside, this footer should span full width of this component */}
        <div className="flex items-center gap-4 text-sm text-[#588d87]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2a9d90]"></span> Đang
            soạn thảo
          </span>
          <span className="h-4 w-[1px] bg-[#e9f1f0]"></span>
          <p>
            Bác sĩ chỉ định:{" "}
            <span className="font-semibold text-[#101918]">BS. Lê Hữu</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#588d87] hover:bg-[#f9fbfb] transition-colors">
            Hủy
          </button>
          <button className="flex items-center gap-2 bg-[#2a9d90] text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2a9d90]/90 transition-all shadow-md shadow-[#2a9d90]/20">
            <span className="material-symbols-outlined text-[20px]">print</span>
            Lưu & In đơn thuốc
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CreatePrescription;
