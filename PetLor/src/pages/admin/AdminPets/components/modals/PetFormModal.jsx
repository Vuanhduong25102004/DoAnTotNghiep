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
    ghiChuSucKhoe: "",
    tenChuSoHuu: "",
    soDienThoaiChuSoHuu: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit mode: Convert date from ISO to YYYY-MM-DD for input[type=date]
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
          ghiChuSucKhoe: "",
          tenChuSoHuu: "",
          soDienThoaiChuSoHuu: "",
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
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden font-body mx-auto my-8"
          >
            {/* Header */}
            <div className="px-10 py-6 border-b border-border-light/50 flex justify-between items-center bg-white sticky top-0 z-20 backdrop-blur-sm bg-white/95">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-surface border border-border-light flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">
                    {isEdit ? "edit_note" : "add_circle"}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                    {isEdit
                      ? `Chỉnh sửa Thú cưng #${initialData.thuCungId}`
                      : "Thêm Thú cưng mới"}
                  </h1>
                  <p className="text-sm text-text-body/70 mt-1 font-light">
                    {isEdit
                      ? "Cập nhật thông tin hồ sơ thú cưng"
                      : "Tạo hồ sơ thú cưng mới"}
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
                    Tên thú cưng <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="tenThuCung"
                    className="form-control"
                    value={formData.tenThuCung}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label className="form-label">Hình ảnh</label>
                  <div className="mt-2 flex items-center space-x-4">
                    <img
                      src={
                        previewImage || "https://placehold.co/100x100?text=Pet"
                      }
                      alt="Pet Preview"
                      className="h-16 w-16 rounded-full object-cover"
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
                    <label className="form-label">Chủng loại</label>
                    <select
                      name="chungLoai"
                      className="form-control"
                      value={formData.chungLoai}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        -- Chọn chủng loại --
                      </option>
                      <option value="Chó">Chó</option>
                      <option value="Mèo">Mèo</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="form-label">Giới tính</label>
                    <select
                      name="gioiTinh"
                      className="form-control"
                      value={formData.gioiTinh}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        -- Chọn giới tính --
                      </option>
                      <option value="Đực">Đực</option>
                      <option value="Cái">Cái</option>
                      <option value="Chưa rõ">Chưa rõ</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="form-label">Giống loài</label>
                  <input
                    type="text"
                    name="giongLoai"
                    className="form-control"
                    value={formData.giongLoai}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    type="date"
                    name="ngaySinh"
                    className="form-control"
                    value={formData.ngaySinh}
                    onChange={handleChange}
                  />
                </div>

                {/* Phần thông tin chủ sở hữu - Chỉ hiển thị khi tạo mới nếu cần, hoặc khi edit cũng cho sửa */}
                {/* Dựa trên code cũ, Create mới yêu cầu, Edit thì thường không sửa chủ? 
                    Nhưng để đơn giản, ta cho phép sửa cả nếu API hỗ trợ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="input-group">
                    <label className="form-label">
                      Tên chủ sở hữu <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="tenChuSoHuu"
                      className="form-control"
                      value={formData.tenChuSoHuu}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label className="form-label">
                      SĐT chủ sở hữu <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="soDienThoaiChuSoHuu"
                      className="form-control"
                      value={formData.soDienThoaiChuSoHuu}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="form-label">Ghi chú sức khỏe</label>
                  <textarea
                    name="ghiChuSucKhoe"
                    rows={3}
                    className="form-control"
                    value={formData.ghiChuSucKhoe}
                    onChange={handleChange}
                  />
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
                {isEdit ? "Lưu thay đổi" : "Tạo Thú Cưng"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PetFormModal;
