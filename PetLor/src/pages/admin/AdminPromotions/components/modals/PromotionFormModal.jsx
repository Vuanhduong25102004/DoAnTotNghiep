import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEscapeKey from "../../../../../hooks/useEscapeKey";

const PromotionFormModal = ({ isOpen, onClose, initialData, onSubmit }) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    maCode: "",
    moTa: "",
    loaiGiamGia: "SO_TIEN", // SO_TIEN hoặc PHAN_TRAM
    giaTriGiam: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    soLuongGioiHan: "",
    donToiThieu: "",
    trangThai: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit Mode
        setFormData({
          maCode: initialData.maCode,
          moTa: initialData.moTa,
          loaiGiamGia: initialData.loaiGiamGia,
          giaTriGiam: initialData.giaTriGiam,
          ngayBatDau: initialData.ngayBatDau.split("T")[0],
          ngayKetThuc: initialData.ngayKetThuc.split("T")[0],
          soLuongGioiHan: initialData.soLuongGioiHan,
          donToiThieu: initialData.donToiThieu,
          trangThai: initialData.trangThai,
        });
      } else {
        // Create Mode
        setFormData({
          maCode: "",
          moTa: "",
          loaiGiamGia: "SO_TIEN",
          giaTriGiam: 0,
          ngayBatDau: new Date().toISOString().split("T")[0],
          ngayKetThuc: "",
          soLuongGioiHan: 100,
          donToiThieu: 0,
          trangThai: true,
        });
      }
    }
  }, [isOpen, initialData]);

  useEscapeKey(onClose, isOpen);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    // Validate cơ bản
    if (!formData.maCode || !formData.giaTriGiam || !formData.ngayKetThuc) {
      alert("Vui lòng điền các trường bắt buộc!");
      return;
    }

    // Format lại dữ liệu chuẩn bị gửi đi
    const submitData = {
      ...formData,
      giaTriGiam: parseFloat(formData.giaTriGiam),
      soLuongGioiHan: parseInt(formData.soLuongGioiHan),
      donToiThieu: parseFloat(formData.donToiThieu),
      ngayBatDau: formData.ngayBatDau.includes("T")
        ? formData.ngayBatDau
        : `${formData.ngayBatDau}T00:00:00`,
      ngayKetThuc: formData.ngayKetThuc.includes("T")
        ? formData.ngayKetThuc
        : `${formData.ngayKetThuc}T23:59:59`,
    };
    onSubmit(submitData);
  };

  // Shared Styles (Design System)
  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium focus:ring-0 transition-all focus:border-primary outline-none placeholder:text-slate-400";
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-hidden p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    {isEdit ? "edit_note" : "local_offer"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isEdit ? (
                      <>
                        Cập nhật Khuyến mãi{" "}
                        <span className="text-primary">
                          {initialData.maCode}
                        </span>
                      </>
                    ) : (
                      "Tạo Mã Khuyến Mãi Mới"
                    )}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEdit
                      ? "Điều chỉnh thông tin và thời gian áp dụng ưu đãi"
                      : "Thiết lập chương trình khuyến mãi và giảm giá"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* --- BODY --- */}
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {/* CỘT TRÁI: Thông tin cơ bản */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary bg-teal-50 p-1.5 rounded-lg text-xl">
                      badge
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Thông tin cơ bản
                    </h3>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Mã Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="maCode"
                      value={formData.maCode}
                      onChange={handleChange}
                      className={`${inputClass} uppercase tracking-wider font-bold`}
                      placeholder="VD: SALE50K"
                      disabled={isEdit}
                    />
                    {isEdit && (
                      <p className="text-xs text-slate-400 mt-1.5 ml-1">
                        * Mã khuyến mãi không thể thay đổi sau khi tạo
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Mô tả chương trình</label>
                    <textarea
                      name="moTa"
                      value={formData.moTa}
                      onChange={handleChange}
                      className={`${inputClass} resize-none h-32`}
                      placeholder="Mô tả chi tiết về chương trình..."
                    />
                  </div>
                </section>

                {/* CỘT PHẢI: Giá trị & Thời gian */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-1.5 rounded-lg text-xl">
                      savings
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Giá trị & Thời gian
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Loại giảm</label>
                      <select
                        name="loaiGiamGia"
                        value={formData.loaiGiamGia}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="SO_TIEN">Số tiền (VND)</option>
                        <option value="PHAN_TRAM">Phần trăm (%)</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>
                        Giá trị giảm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="giaTriGiam"
                        value={formData.giaTriGiam}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Ngày bắt đầu</label>
                      <input
                        type="date"
                        name="ngayBatDau"
                        value={formData.ngayBatDau}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Ngày kết thúc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="ngayKetThuc"
                        value={formData.ngayKetThuc}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Số lượng giới hạn</label>
                      <input
                        type="number"
                        name="soLuongGioiHan"
                        value={formData.soLuongGioiHan}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Đơn tối thiểu</label>
                      <input
                        type="number"
                        name="donToiThieu"
                        value={formData.donToiThieu}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Toggle Status */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="trangThai"
                      checked={formData.trangThai}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                      Kích hoạt chương trình
                    </span>
                    <span className="text-xs text-slate-500">
                      Mã khuyến mãi sẽ có hiệu lực ngay lập tức
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="p-8 border-t border-slate-100 flex justify-end items-center gap-6 bg-slate-50/30 shrink-0">
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 font-semibold transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-10 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">save</span>
                {isEdit ? "Lưu thay đổi" : "Tạo khuyến mãi"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromotionFormModal;
