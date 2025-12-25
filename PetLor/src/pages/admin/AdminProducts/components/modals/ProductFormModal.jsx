import React from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../../../components/utils";

const ProductFormModal = ({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  categories,
  productImageFile,
  setProductImageFile,
  onSave,
}) => {
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
            className="w-full max-w-4xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden font-body mx-auto my-8"
          >
            {/* Header */}
            <div className="px-10 py-6 border-b border-border-light/50 flex justify-between items-center bg-white sticky top-0 z-20 backdrop-blur-sm bg-white/95">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-surface border border-border-light flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">
                    {isEditing ? "edit_note" : "add_circle"}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                    {isEditing ? "Cập nhật Sản phẩm" : "Thêm Sản phẩm Mới"}
                  </h1>
                  <p className="text-sm text-text-body/70 mt-1 font-light">
                    {isEditing
                      ? "Chỉnh sửa thông tin sản phẩm"
                      : "Tạo sản phẩm mới cho cửa hàng"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-1 md:col-span-2 input-group">
                  <label className="form-label">
                    Tên sản phẩm <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.tenSanPham}
                    onChange={(e) =>
                      setFormData({ ...formData, tenSanPham: e.target.value })
                    }
                  />
                </div>

                <div className="input-group">
                  <label className="form-label">
                    Danh mục <span className="text-primary">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.danhMucId || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, danhMucId: e.target.value })
                    }
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories && categories.length > 0 ? (
                      categories.map((cat) => (
                        <option
                          key={cat.id || cat.danhMucId}
                          value={cat.id || cat.danhMucId}
                        >
                          {cat.tenDanhMuc}
                        </option>
                      ))
                    ) : (
                      <option disabled>Không có dữ liệu danh mục</option>
                    )}
                  </select>
                </div>

                <div className="input-group">
                  <label className="form-label">
                    Giá bán (VNĐ) <span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.gia}
                    onChange={(e) =>
                      setFormData({ ...formData, gia: e.target.value })
                    }
                  />
                </div>

                <div className="input-group">
                  <label className="form-label">Số lượng tồn kho</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.soLuongTonKho}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        soLuongTonKho: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-1 md:col-span-2 input-group">
                  <label className="form-label">Hình ảnh</label>
                  <div className="mt-2 flex items-center space-x-4">
                    <img
                      src={
                        productImageFile
                          ? URL.createObjectURL(productImageFile)
                          : getImageUrl(formData.hinhAnh, "Product")
                      }
                      alt="Product Preview"
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <input
                      type="file"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      onChange={(e) => setProductImageFile(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 input-group">
                  <label className="form-label">Mô tả chi tiết</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    value={formData.moTaChiTiet}
                    onChange={(e) =>
                      setFormData({ ...formData, moTaChiTiet: e.target.value })
                    }
                  ></textarea>
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
                onClick={onSave}
                className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 tracking-wide"
              >
                <span className="material-symbols-outlined text-[18px]">
                  save
                </span>
                {isEditing ? "Lưu thay đổi" : "Tạo sản phẩm"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductFormModal;
