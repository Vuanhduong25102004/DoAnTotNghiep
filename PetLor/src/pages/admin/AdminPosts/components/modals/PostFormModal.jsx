import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// --- THAY ĐỔI Ở ĐÂY ---
import ReactQuill from "react-quill-new"; // Dùng thư viện mới
import "react-quill-new/dist/quill.snow.css"; // CSS của thư viện mới
// ----------------------
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

  // --- Rich Text Editor Configuration ---
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // --- LOGIC GIỮ NGUYÊN (Data Loading) ---
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        let targetId = "";
        const rawId =
          initialData.danhMucBvId ||
          initialData.danhMucId ||
          initialData?.danhMuc?.id;

        if (categories && categories.length > 0) {
          let foundCat = null;
          if (rawId) {
            foundCat = categories.find(
              (c) => (c.id || c.danhMucBvId || c.danhMucId) == rawId,
            );
          }
          if (!foundCat && initialData.tenDanhMuc) {
            foundCat = categories.find(
              (c) => c.tenDanhMuc === initialData.tenDanhMuc,
            );
          }
          if (foundCat) {
            targetId =
              foundCat.id || foundCat.danhMucBvId || foundCat.danhMucId;
          }
        } else {
          targetId = rawId;
        }

        setFormData({
          tieuDe: initialData.tieuDe || "",
          slug: initialData.slug || "",
          danhMucId: targetId,
          noiDung: initialData.noiDung || "", // Load HTML content
          trangThai: initialData.trangThai || "NHAP",
        });

        setPreviewUrl(getImageUrl(initialData.anhBia));
      } else {
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

  // Handler specific for React Quill
  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, noiDung: content }));
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
      danhMucBvId: formData.danhMucId ? parseInt(formData.danhMucId) : null,
    };
    delete payload.danhMucId;

    const finalFormData = createPostFormData(payload, imageFile);
    onSubmit(finalFormData);
  };

  // Shared Styles
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
            className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    {isEdit ? "edit_document" : "post_add"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {isEdit ? "Chỉnh sửa Bài viết" : "Tạo Bài viết Mới"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {isEdit
                      ? "Cập nhật nội dung và hình ảnh bài viết"
                      : "Chia sẻ kiến thức mới với cộng đồng"}
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
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                {/* Tiêu đề */}
                <div>
                  <label className={labelClass}>
                    Tiêu đề bài viết <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tieuDe"
                    value={formData.tieuDe}
                    onChange={handleChange}
                    className={`${inputClass} text-lg font-semibold`}
                    placeholder="Nhập tiêu đề bài viết..."
                  />
                </div>

                {/* Danh mục & Trạng thái */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClass}>
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="danhMucId"
                        value={formData.danhMucId}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none`}
                      >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((c) => (
                          <option
                            key={c.id || c.danhMucBvId || c.danhMucId}
                            value={c.id || c.danhMucBvId || c.danhMucId}
                          >
                            {c.tenDanhMuc}
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
                    <label className={labelClass}>Trạng thái</label>
                    <div className="relative">
                      <select
                        name="trangThai"
                        value={formData.trangThai}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none`}
                      >
                        {POST_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {POST_STATUS_MAP[s]}
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
                </div>

                {/* Ảnh bìa */}
                <div>
                  <label className={labelClass}>Ảnh bìa</label>
                  <div className="mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-6">
                    <div className="relative w-48 h-32 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group">
                      <img
                        src={
                          previewUrl ||
                          "https://placehold.co/300x200?text=No+Image"
                        }
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Error";
                        }}
                      />
                    </div>
                    <div className="flex-1 pt-2">
                      <label className="block w-full cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            onClick={() =>
                              document.getElementById("post-img-upload").click()
                            }
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer shadow-sm transition-colors"
                          >
                            Chọn ảnh bìa...
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 italic">
                          {imageFile ? imageFile.name : "Chưa chọn tệp"}
                        </span>
                        <input
                          id="post-img-upload"
                          type="file"
                          name="anhBiaFile"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/png, image/jpeg, image/gif"
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-2 font-light">
                        Hỗ trợ: .png, .jpg, .gif (Tối đa 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- EDITOR (REPLACED TEXTAREA) --- */}
                <div className="h-[450px]">
                  <label className={labelClass}>Nội dung bài viết</label>
                  <div className="h-[350px] bg-white rounded-xl">
                    <ReactQuill
                      theme="snow"
                      value={formData.noiDung}
                      onChange={handleEditorChange}
                      modules={modules}
                      className="h-full"
                      placeholder="Nhập nội dung bài viết..."
                    />
                  </div>
                </div>
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
