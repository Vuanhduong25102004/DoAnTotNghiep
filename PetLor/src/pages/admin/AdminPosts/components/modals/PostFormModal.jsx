import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import {
  POST_STATUSES,
  POST_STATUS_MAP,
  createPostFormData,
  getImageUrl,
} from "../../../components/utils";

const PostFormModal = ({
  isOpen,
  onClose,
  initialData,
  categories,
  onSubmit,
}) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    tieuDe: "",
    slug: "",
    danhMucId: "",
    noiDung: "",
    trangThai: "NHAP",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // --- PHẦN SỬA ĐỔI CHÍNH Ở ĐÂY ---
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Logic tìm ID danh mục thông minh hơn
        let targetId = "";

        // B1: Lấy ID thô từ dữ liệu bài viết (chấp nhận nhiều trường hợp tên biến)
        const rawId =
          initialData.danhMucBvId ||
          initialData.danhMucId ||
          initialData?.danhMuc?.id; // Trường hợp API trả về object lồng nhau

        // B2: Logic tìm danh mục tương ứng trong list categories
        if (categories && categories.length > 0) {
          let foundCat = null;

          if (rawId) {
            // Tìm theo ID (so sánh lỏng == để chấp nhận cả string '1' và number 1)
            foundCat = categories.find(
              (c) => (c.id || c.danhMucBvId || c.danhMucId) == rawId
            );
          }

          // Nếu không tìm thấy theo ID, thử tìm theo tên (phương án dự phòng)
          if (!foundCat && initialData.tenDanhMuc) {
            foundCat = categories.find(
              (c) => c.tenDanhMuc === initialData.tenDanhMuc
            );
          }

          // Nếu tìm thấy, lấy ID chuẩn từ danh sách categories để gán vào state
          if (foundCat) {
            targetId =
              foundCat.id || foundCat.danhMucBvId || foundCat.danhMucId;
          }
        } else {
          // Trường hợp chưa có list categories, tạm thời gán rawId
          targetId = rawId;
        }

        setFormData({
          tieuDe: initialData.tieuDe || "",
          slug: initialData.slug || "",
          danhMucId: targetId, // Đã được chuẩn hóa
          noiDung: initialData.noiDung || "",
          trangThai: initialData.trangThai || "NHAP",
        });

        setPreviewUrl(getImageUrl(initialData.anhBia));
      } else {
        // Reset form khi tạo mới
        setFormData({
          tieuDe: "",
          slug: "",
          danhMucId: "",
          noiDung: "",
          trangThai: "NHAP",
        });
        setPreviewUrl("");
      }
      setImageFile(null);
    }
  }, [isOpen, initialData, categories]);
  // --------------------------------

  useEscapeKey(onClose, isOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      // Chuyển đổi sang số nguyên khi gửi đi (nếu backend cần Int)
      danhMucBvId: formData.danhMucId ? parseInt(formData.danhMucId) : null,
    };
    // Xóa trường tạm nếu không cần thiết
    delete payload.danhMucId;

    const finalFormData = createPostFormData(payload, imageFile);
    onSubmit(finalFormData);
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
            className="w-full max-w-4xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden font-body mx-auto my-8"
          >
            {/* Header */}
            <div className="px-10 py-6 border-b border-border-light/50 flex justify-between items-center bg-white sticky top-0 z-20 backdrop-blur-sm bg-white/95">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-surface border border-border-light flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">
                    {isEdit ? "edit_document" : "post_add"}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                    {isEdit ? "Chỉnh sửa Bài viết" : "Tạo Bài viết Mới"}
                  </h1>
                  <p className="text-sm text-text-body/70 mt-1 font-light">
                    {isEdit
                      ? "Cập nhật nội dung và hình ảnh bài viết"
                      : "Chia sẻ kiến thức mới với cộng đồng"}
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
                {/* Tiêu đề */}
                <div className="input-group">
                  <label className="form-label">
                    Tiêu đề bài viết <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="tieuDe"
                    value={formData.tieuDe}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Nhập tiêu đề bài viết..."
                  />
                </div>

                {/* Danh mục & Trạng thái */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="input-group">
                    <label className="form-label">
                      Danh mục <span className="text-primary">*</span>
                    </label>
                    <select
                      name="danhMucId"
                      value={formData.danhMucId}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((c) => (
                        <option
                          key={c.id || c.danhMucBvId || c.danhMucId}
                          // Value ở đây phải khớp với targetId lấy ở useEffect
                          value={c.id || c.danhMucBvId || c.danhMucId}
                        >
                          {c.tenDanhMuc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="form-label">Trạng thái</label>
                    <select
                      name="trangThai"
                      value={formData.trangThai}
                      onChange={handleChange}
                      className="form-control"
                    >
                      {POST_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {POST_STATUS_MAP[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ảnh bìa */}
                <div className="input-group">
                  <label className="form-label">Ảnh bìa</label>
                  <div className="mt-2 flex items-start gap-6">
                    <div className="relative group overflow-hidden rounded-lg border border-border-light bg-surface">
                      <img
                        src={
                          previewUrl ||
                          "https://placehold.co/300x200?text=No+Image"
                        }
                        alt="Preview"
                        className="h-32 w-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Error";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        name="anhBiaFile"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer transition-colors"
                        accept="image/png, image/jpeg, image/gif"
                      />
                      <p className="text-xs text-text-body/60 mt-2 font-light">
                        Chấp nhận: .png, .jpg, .gif (Tối đa 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nội dung */}
                <div className="input-group">
                  <label className="form-label">Nội dung</label>
                  <textarea
                    name="noiDung"
                    value={formData.noiDung}
                    onChange={handleChange}
                    className="form-control h-48 font-mono text-sm leading-relaxed"
                    placeholder="Nhập nội dung bài viết..."
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
                onClick={handleSubmit}
                className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 tracking-wide"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isEdit ? "save" : "check"}
                </span>
                {isEdit ? "Lưu thay đổi" : "Tạo bài viết"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostFormModal;
