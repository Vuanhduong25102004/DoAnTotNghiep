import React, { useState, useEffect } from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../../../components/utils";

const ServiceFormModal = ({
  isOpen,
  onClose,
  initialData,
  serviceCategories,
  onSubmit,
}) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    tenDichVu: "",
    moTa: "",
    giaDichVu: 0,
    thoiLuongUocTinhPhut: 30,
    danhMucDvId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit
        setFormData({
          tenDichVu: initialData.tenDichVu || "",
          moTa: initialData.moTa || "",
          giaDichVu: initialData.giaDichVu || 0,
          thoiLuongUocTinhPhut: initialData.thoiLuongUocTinhPhut || 0,
          danhMucDvId: initialData.danhMucDvId || "",
        });
        setPreviewImage(getImageUrl(initialData.hinhAnh));
      } else {
        // Create
        setFormData({
          tenDichVu: "",
          moTa: "",
          giaDichVu: 0,
          thoiLuongUocTinhPhut: 30,
          danhMucDvId: "",
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
    onSubmit(formData, imageFile);
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
                    {isEdit ? "Cập nhật Dịch vụ" : "Thêm Dịch vụ mới"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEdit
                      ? `Chỉnh sửa thông tin cho dịch vụ #${initialData.dichVuId}`
                      : "Thiết lập thông tin dịch vụ spa/chăm sóc mới"}
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
                {/* CỘT TRÁI: Thông tin cơ bản */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary bg-teal-50 p-1.5 rounded-lg text-xl">
                      info
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Thông tin cơ bản
                    </h3>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Tên dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tenDichVu"
                      value={formData.tenDichVu}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="VD: Tắm spa trọn gói..."
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="danhMucDvId"
                        value={formData.danhMucDvId}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none`}
                      >
                        <option value="">-- Chọn danh mục --</option>
                        {serviceCategories.map((cat) => (
                          <option
                            key={cat.id || cat.danhMucDvId}
                            value={cat.id || cat.danhMucDvId}
                          >
                            {cat.tenDanhMucDv}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-xl">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Mô tả</label>
                    <textarea
                      name="moTa"
                      rows={5}
                      value={formData.moTa}
                      onChange={handleChange}
                      className={`${inputClass} resize-none`}
                      placeholder="Mô tả chi tiết về quy trình..."
                    />
                  </div>
                </section>

                {/* CỘT PHẢI: Giá & Hình ảnh */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-1.5 rounded-lg text-xl">
                      sell
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Chi phí & Hình ảnh
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>
                        Giá dịch vụ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="giaDichVu"
                        min="0"
                        value={formData.giaDichVu}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Thời lượng (Phút)</label>
                      <input
                        type="number"
                        name="thoiLuongUocTinhPhut"
                        min="0"
                        value={formData.thoiLuongUocTinhPhut}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Image Upload Style Mới */}
                  <div>
                    <label className={labelClass}>Hình ảnh minh họa</label>
                    <div className="mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-5">
                      <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={
                            previewImage ||
                            "https://via.placeholder.com/150?text=IMG"
                          }
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150?text=IMG";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block w-full cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span
                              onClick={() =>
                                document
                                  .getElementById("service-img-upload")
                                  .click()
                              }
                              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer shadow-sm transition-colors"
                            >
                              Chọn tệp...
                            </span>
                            <span className="text-xs text-slate-400 italic truncate max-w-[150px]">
                              {imageFile ? imageFile.name : "Chưa chọn tệp"}
                            </span>
                          </div>
                          <input
                            id="service-img-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="text-[10px] text-slate-400 mt-2">
                          Định dạng: JPG, PNG. Dung lượng tối đa 5MB.
                        </p>
                      </div>
                    </div>
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
                <span className="material-symbols-outlined text-xl">
                  {isEdit ? "save" : "check"}
                </span>
                {isEdit ? "Lưu thay đổi" : "Tạo Dịch Vụ"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceFormModal;
