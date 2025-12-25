import React, { useState, useEffect } from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../../../components/utils";

const ServiceFormModal = ({
  isOpen,
  onClose,
  initialData, // Nếu null => Create, nếu có object => Edit
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
        // Chế độ Edit
        setFormData({
          tenDichVu: initialData.tenDichVu || "",
          moTa: initialData.moTa || "",
          giaDichVu: initialData.giaDichVu || 0,
          thoiLuongUocTinhPhut: initialData.thoiLuongUocTinhPhut || 0,
          danhMucDvId: initialData.danhMucDvId || "",
        });
        setPreviewImage(getImageUrl(initialData.hinhAnh));
      } else {
        // Chế độ Create
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden font-body mx-auto my-8"
          >
            {/* Header */}
            <div className="px-10 py-6 border-b border-border-light/50 flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-surface border border-border-light flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">
                    {isEdit ? "edit_note" : "add_circle"}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text-heading">
                    {isEdit
                      ? `Chỉnh sửa Dịch vụ #${initialData.dichVuId}`
                      : "Thêm Dịch vụ mới"}
                  </h1>
                  <p className="text-sm text-text-body/70 mt-1 font-light">
                    {isEdit
                      ? "Cập nhật thông tin dịch vụ"
                      : "Tạo dịch vụ mới cho hệ thống"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-text-heading hover:bg-surface transition-all duration-300"
              >
                <span className="material-symbols-outlined font-light">
                  close
                </span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-8 md:p-10 bg-white overflow-y-auto">
              <div className="space-y-8">
                <div className="input-group">
                  <label className="form-label">
                    Tên dịch vụ <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="tenDichVu"
                    className="form-control"
                    value={formData.tenDichVu}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    name="moTa"
                    rows={3}
                    className="form-control"
                    value={formData.moTa}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label className="form-label">Hình ảnh</label>
                  <div className="mt-2 flex items-center space-x-4">
                    <img
                      src={
                        previewImage ||
                        "https://placehold.co/100x100?text=Service"
                      }
                      alt="Preview"
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <input
                      type="file"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="input-group">
                    <label className="form-label">
                      Giá dịch vụ (VNĐ) <span className="text-primary">*</span>
                    </label>
                    <input
                      type="number"
                      name="giaDichVu"
                      min="0"
                      className="form-control"
                      value={formData.giaDichVu}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label className="form-label">Thời lượng (Phút)</label>
                    <input
                      type="number"
                      name="thoiLuongUocTinhPhut"
                      min="0"
                      className="form-control"
                      value={formData.thoiLuongUocTinhPhut}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label className="form-label">
                    Danh mục <span className="text-primary">*</span>
                  </label>
                  <select
                    name="danhMucDvId"
                    className="form-control"
                    value={formData.danhMucDvId}
                    onChange={handleChange}
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
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 tracking-wide"
              >
                <span className="material-symbols-outlined text-[18px]">
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
