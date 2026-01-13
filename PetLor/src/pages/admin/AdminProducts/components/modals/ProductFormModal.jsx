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
  useEscapeKey(onClose, isOpen);

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
                    {isEditing ? "edit_note" : "add_box"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isEditing ? "Cập nhật Sản phẩm" : "Thêm Sản phẩm Mới"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEditing
                      ? "Chỉnh sửa thông tin và hình ảnh sản phẩm"
                      : "Điền thông tin để tạo sản phẩm mới cho cửa hàng"}
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
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      value={formData.tenSanPham}
                      onChange={(e) =>
                        setFormData({ ...formData, tenSanPham: e.target.value })
                      }
                      placeholder="VD: Thức ăn hạt Royal Canin..."
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className={`${inputClass} appearance-none`}
                        value={formData.danhMucId || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            danhMucId: e.target.value,
                          })
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
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-xl">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Mô tả chi tiết</label>
                    <textarea
                      rows="5"
                      className={`${inputClass} resize-none`}
                      value={formData.moTaChiTiet}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          moTaChiTiet: e.target.value,
                        })
                      }
                      placeholder="Mô tả công dụng, thành phần..."
                    ></textarea>
                  </div>
                </section>

                {/* CỘT PHẢI: Giá & Hình ảnh */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-1.5 rounded-lg text-xl">
                      sell
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Giá & Thông số
                    </h3>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Giá bán (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className={inputClass}
                      value={formData.gia}
                      onChange={(e) =>
                        setFormData({ ...formData, gia: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        Trọng lượng (g) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className={inputClass}
                        value={formData.trongLuong || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            trongLuong: e.target.value,
                          })
                        }
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Số lượng tồn kho</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={formData.soLuongTonKho}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            soLuongTonKho: e.target.value,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className={labelClass}>Hình ảnh sản phẩm</label>
                    <div className="mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-5">
                      <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={
                            productImageFile
                              ? URL.createObjectURL(productImageFile)
                              : getImageUrl(formData.hinhAnh, "Product")
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
                        <label className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer">
                          <input
                            type="file"
                            className="hidden" // Ẩn input gốc đi để custom lại nếu muốn, ở đây dùng style mặc định của file input nhưng class tailwind
                            onChange={(e) =>
                              setProductImageFile(e.target.files[0])
                            }
                          />
                          {/* Custom File Input Hack for better styling */}
                          <div className="flex items-center gap-3">
                            <span
                              onClick={() =>
                                document.getElementById("file-upload").click()
                              }
                              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer shadow-sm transition-colors"
                            >
                              Chọn tệp...
                            </span>
                            <span className="text-xs text-slate-400 italic truncate max-w-[150px]">
                              {productImageFile
                                ? productImageFile.name
                                : "Chưa chọn tệp"}
                            </span>
                          </div>
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              setProductImageFile(e.target.files[0])
                            }
                          />
                        </label>
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
                onClick={onSave}
                className="flex items-center gap-2 px-10 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">save</span>
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
