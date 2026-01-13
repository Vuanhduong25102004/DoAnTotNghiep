import React, { useState, useEffect } from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";

const SupplierFormModal = ({ isOpen, onClose, initialData, onSubmit }) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    tenNcc: "",
    soDienThoai: "",
    email: "",
    diaChi: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          tenNcc: initialData.tenNcc || "",
          soDienThoai: initialData.soDienThoai || "",
          email: initialData.email || "",
          diaChi: initialData.diaChi || "",
        });
      } else {
        setFormData({
          tenNcc: "",
          soDienThoai: "",
          email: "",
          diaChi: "",
        });
      }
    }
  }, [isOpen, initialData]);

  useEscapeKey(onClose, isOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.tenNcc || !formData.soDienThoai) {
      alert("Vui lòng nhập Tên NCC và Số điện thoại.");
      return;
    }
    onSubmit(formData);
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
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    {isEdit ? "edit_square" : "store"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isEdit ? "Cập nhật Nhà Cung Cấp" : "Thêm Nhà Cung Cấp"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Quản lý thông tin đối tác và nguồn hàng
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
              {/* Thông tin chung */}
              <section className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary bg-teal-50 p-1.5 rounded-lg text-xl">
                    badge
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Thông tin chung
                  </h3>
                </div>

                <div>
                  <label className={labelClass}>
                    Tên Nhà cung cấp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tenNcc"
                    value={formData.tenNcc}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="VD: Công ty Pet Food ABC..."
                  />
                </div>
              </section>

              {/* Thông tin liên hệ */}
              <section className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-1.5 rounded-lg text-xl">
                    contact_mail
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Thông tin liên hệ
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="soDienThoai"
                      value={formData.soDienThoai}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="example@mail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Địa chỉ</label>
                  <textarea
                    name="diaChi"
                    value={formData.diaChi}
                    onChange={handleChange}
                    className={`${inputClass} resize-none h-24`}
                    placeholder="Địa chỉ chi tiết..."
                  ></textarea>
                </div>
              </section>
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
                {isEdit ? "Lưu thay đổi" : "Thêm nhà cung cấp"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupplierFormModal;
