import React, { useState, useEffect } from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../../../components/utils";

const PetFormModal = ({
  isOpen,
  onClose,
  initialData, // null = Create, object = Edit
  onSubmit,
}) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    tenThuCung: "",
    chungLoai: "",
    giongLoai: "",
    ngaySinh: "",
    gioiTinh: "",
    canNang: "",
    ghiChuSucKhoe: "",
    tenChuSoHuu: "",
    soDienThoaiChuSoHuu: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit mode: Convert date from ISO to YYYY-MM-DD
        let formattedDate = "";
        if (initialData.ngaySinh) {
          const d = new Date(initialData.ngaySinh);
          if (!isNaN(d)) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            formattedDate = `${year}-${month}-${day}`;
          }
        }

        setFormData({
          tenThuCung: initialData.tenThuCung || "",
          chungLoai: initialData.chungLoai || "",
          giongLoai: initialData.giongLoai || "",
          ngaySinh: formattedDate,
          gioiTinh: initialData.gioiTinh || "",
          canNang: initialData.canNang || "",
          ghiChuSucKhoe: initialData.ghiChuSucKhoe || "",
          tenChuSoHuu: initialData.tenChu || "",
          soDienThoaiChuSoHuu: initialData.soDienThoaiChuSoHuu || "",
        });
        setPreviewImage(getImageUrl(initialData.img));
      } else {
        // Create mode
        setFormData({
          tenThuCung: "",
          chungLoai: "",
          giongLoai: "",
          ngaySinh: "",
          gioiTinh: "",
          canNang: "",
          ghiChuSucKhoe: "",
          tenChuSoHuu: "",
          soDienThoaiChuSoHuu: "",
        });
        setPreviewImage("");
      }
      setImageFile(null);
    }
  }, [isOpen, initialData]);

  useEscapeKey(onClose, isOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (
      !formData.tenThuCung ||
      !formData.tenChuSoHuu ||
      !formData.soDienThoaiChuSoHuu
    ) {
      alert("Vui lòng nhập đầy đủ tên thú cưng, tên chủ và số điện thoại!");
      return;
    }

    const submissionData = new FormData();

    const petData = {
      ...formData,
      canNang: formData.canNang ? parseFloat(formData.canNang) : null,
    };

    const jsonBlob = new Blob([JSON.stringify(petData)], {
      type: "application/json",
    });

    submissionData.append("thuCung", jsonBlob);

    if (imageFile) {
      submissionData.append("hinhAnh", imageFile);
    }

    onSubmit(submissionData);
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
                    {isEdit ? "edit_note" : "add_circle"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isEdit ? "Cập nhật Thú cưng" : "Thêm Thú cưng mới"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEdit
                      ? `Chỉnh sửa hồ sơ cho thú cưng #${initialData.thuCungId}`
                      : "Tạo hồ sơ thú cưng và thông tin chủ sở hữu"}
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
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {/* CỘT TRÁI: Thông tin Thú cưng */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary bg-teal-50 p-1.5 rounded-lg text-xl">
                      pets
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Thông tin Thú cưng
                    </h3>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Tên thú cưng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tenThuCung"
                      value={formData.tenThuCung}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="VD: Miu, Lu, Boss..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Chủng loại</label>
                      <select
                        name="chungLoai"
                        value={formData.chungLoai}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none`}
                      >
                        <option value="">-- Chọn --</option>
                        <option value="Chó">Chó</option>
                        <option value="Mèo">Mèo</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Giới tính</label>
                      <select
                        name="gioiTinh"
                        value={formData.gioiTinh}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none`}
                      >
                        <option value="">-- Chọn --</option>
                        <option value="Đực">Đực</option>
                        <option value="Cái">Cái</option>
                        <option value="Chưa rõ">Chưa rõ</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Giống loài</label>
                    <input
                      type="text"
                      name="giongLoai"
                      value={formData.giongLoai}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="VD: Corgi, Anh lông ngắn..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className={labelClass}>Hình ảnh</label>
                    <div className="mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-5">
                      <div className="w-20 h-20 bg-white rounded-full border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={
                            previewImage ||
                            "https://placehold.co/150x150?text=Pet"
                          }
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/150x150?text=Pet";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block w-full cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span
                              onClick={() =>
                                document
                                  .getElementById("pet-img-upload")
                                  .click()
                              }
                              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer shadow-sm transition-colors"
                            >
                              Chọn ảnh...
                            </span>
                            <span className="text-xs text-slate-400 italic truncate max-w-[150px]">
                              {imageFile ? imageFile.name : "Chưa chọn tệp"}
                            </span>
                          </div>
                          <input
                            id="pet-img-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </section>

                {/* CỘT PHẢI: Sức khỏe & Chủ sở hữu */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-1.5 rounded-lg text-xl">
                      medical_services
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Sức khỏe & Chủ sở hữu
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Ngày sinh</label>
                      <input
                        type="date"
                        name="ngaySinh"
                        value={formData.ngaySinh}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Cân nặng (kg)</label>
                      <input
                        type="number"
                        name="canNang"
                        value={formData.canNang}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="VD: 5.5"
                        step="0.1"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <label className={labelClass}>
                        Tên chủ sở hữu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="tenChuSoHuu"
                        value={formData.tenChuSoHuu}
                        onChange={handleChange}
                        className={`${inputClass} bg-white`}
                        placeholder="Họ và tên chủ"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        SĐT liên hệ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="soDienThoaiChuSoHuu"
                        value={formData.soDienThoaiChuSoHuu}
                        onChange={handleChange}
                        className={`${inputClass} bg-white`}
                        placeholder="09xx xxx xxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Ghi chú sức khỏe</label>
                    <textarea
                      name="ghiChuSucKhoe"
                      rows={3}
                      value={formData.ghiChuSucKhoe}
                      onChange={handleChange}
                      className={`${inputClass} resize-none`}
                      placeholder="Tiền sử bệnh, dị ứng, tính cách..."
                    />
                  </div>
                </section>
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
                {isEdit ? "Lưu thay đổi" : "Tạo thú cưng"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PetFormModal;
