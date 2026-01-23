import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import postService from "../../../../services/postService";
import {
  getImageUrl,
  createPostFormData,
  generateSlug, // Import thêm hàm này từ utils
} from "../../../admin/components/utils";

const CreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const storedUserId = localStorage.getItem("userId");
  // --- STATE ---
  const [formData, setFormData] = useState({
    tieuDe: "",
    slug: "",
    danhMucBvId: "",
    noiDung: "",
    trangThai: "CONG_KHAI",
    userId: storedUserId ? Number(storedUserId) : 1,
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modules Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "blockquote"],
      ["clean"],
    ],
  };

  // --- LOAD DATA ---
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await postService.getAllPostCategories();
        setCategories(Array.isArray(res) ? res : res.content || []);
      } catch (err) {
        console.error("Lỗi danh mục:", err);
      }
    };
    fetchCats();

    if (isEdit) {
      const fetchDetail = async () => {
        try {
          const res = await postService.getPostById(id);
          setFormData({
            tieuDe: res.tieuDe,
            slug: res.slug,
            danhMucBvId: res.danhMucBvId || res.danhMucBvId,
            noiDung: res.noiDung,
            trangThai: res.trangThai,
            userId: res.userId || (storedUserId ? Number(storedUserId) : 1),
          });
          setPreviewUrl(getImageUrl(res.anhBia));
        } catch (err) {
          toast.error("Không tìm thấy bài viết");
          navigate("/staff/receptionist/posts");
        }
      };
      fetchDetail();
    }
  }, [isEdit, id, navigate, storedUserId]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tieuDe" && !isEdit) {
      setFormData((prev) => ({
        ...prev,
        tieuDe: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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

  const handleSubmit = async () => {
    // 1. Kiểm tra validation cơ bản
    if (!formData.tieuDe || !formData.noiDung || !formData.danhMucBvId) {
      toast.warning("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    console.log("===== BẮT ĐẦU QUÁ TRÌNH SUBMIT =====");
    console.log("1. Dữ liệu gốc từ State (formData):", formData);

    setIsSubmitting(true);
    try {
      // 2. Lấy userId động từ localStorage
      const currentUserId = localStorage.getItem("userId");
      console.log("2. userId lấy từ LocalStorage:", currentUserId);

      // 3. Chuẩn bị dữ liệu JSON (Ép kiểu Number và đồng nhất tên trường)
      const dataToSubmit = {
        ...formData,
        userId: Number(currentUserId) || Number(formData.userId) || 1,
        danhMucBvId: Number(formData.danhMucBvId), // Chuyển "2" thành 2
      };

      console.log(
        "3. Dữ liệu JSON sau khi ép kiểu (dataToSubmit):",
        dataToSubmit,
      );
      console.log("   - Kiểu dữ liệu của userId:", typeof dataToSubmit.userId);
      console.log(
        "   - Kiểu dữ liệu của danhMucBvId:",
        typeof dataToSubmit.danhMucBvId,
      );

      // 4. Đóng gói vào FormData (Key 1: 'data', Key 2: 'anhBia')
      const payload = createPostFormData(dataToSubmit, imageFile);

      // 5. Kiểm tra nội dung bên trong FormData
      console.log("4. Kiểm tra các Key/Value trong FormData thực tế:");
      for (let pair of payload.entries()) {
        if (pair[1] instanceof Blob) {
          console.log(`   + Key [${pair[0]}]:`, {
            type: pair[1].type,
            size: pair[1].size + " bytes",
            // Lưu ý: Không thể log trực tiếp nội dung JSON trong Blob dễ dàng
          });
        } else {
          console.log(`   + Key [${pair[0]}]:`, pair[1]);
        }
      }

      // 6. Gọi API dựa trên chế độ Create hoặc Edit
      if (isEdit) {
        console.log("5. Chế độ: CẬP NHẬT bài viết ID:", id);
        await postService.updatePost(id, payload);
        toast.success("Cập nhật thành công!");
      } else {
        console.log("5. Chế độ: TẠO MỚI bài viết");
        await postService.createPost(payload);
        toast.success("Đăng bài thành công!");
      }

      navigate("/staff/receptionist/posts");
    } catch (error) {
      console.error("===== LỖI TỪ SERVER =====");
      if (error.response) {
        console.error("Status Code:", error.response.status);
        console.error("Dữ liệu lỗi trả về:", error.response.data);
        // Backend Spring Boot thường trả về lý do lỗi chi tiết trong error.response.data
      } else {
        console.error("Lỗi không xác định:", error.message);
      }

      const msg =
        error.response?.data?.message || "Lỗi cấu trúc dữ liệu (400)!";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
      console.log("===== KẾT THÚC QUÁ TRÌNH SUBMIT =====");
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-8 lg:p-12 pb-24 custom-scrollbar bg-[#fbfcfc] min-h-screen font-sans text-[#101918]">
      <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-10">
        {/* CỘT TRÁI */}
        <div className="flex-1 space-y-8">
          <div className="space-y-3">
            <label className="text-base font-extrabold text-[#101918] ml-2">
              Tiêu đề bài viết
            </label>
            <input
              name="tieuDe"
              value={formData.tieuDe}
              onChange={handleChange}
              className="w-full bg-white border border-[#e9f1f0] rounded-[24px] px-6 py-5 text-xl font-bold focus:ring-4 focus:ring-[#2a9d90]/10 focus:border-[#2a9d90] placeholder:text-gray-300 shadow-sm transition-all outline-none"
              placeholder="Nhập tiêu đề hấp dẫn..."
              type="text"
            />
          </div>

          {/* Input Slug (Có thể ẩn hoặc hiện để sửa) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 ml-2">
              Slug (URL)
            </label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-[#e9f1f0] rounded-[16px] px-4 py-3 text-sm text-gray-600 focus:outline-none"
              placeholder="duong-dan-bai-viet"
            />
          </div>

          <div className="space-y-3">
            <label className="text-base font-extrabold text-[#101918] ml-2">
              Nội dung chi tiết
            </label>
            <div className="bg-white border border-[#e9f1f0] rounded-[32px] overflow-hidden min-h-[600px] flex flex-col shadow-xl shadow-gray-200/50">
              <ReactQuill
                theme="snow"
                value={formData.noiDung}
                onChange={handleEditorChange}
                modules={modules}
                className="flex-1 h-full border-none"
                placeholder="Bắt đầu viết câu chuyện của bạn..."
              />
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (SIDEBAR) */}
        <div className="w-full xl:w-[400px] space-y-8 h-fit xl:sticky xl:top-8">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/staff/receptionist/posts")}
              className="py-4 bg-white border border-[#e9f1f0] text-[#588d87] text-sm font-bold rounded-[20px] hover:bg-[#f9fbfb] hover:text-[#2a9d90] transition-colors shadow-sm"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="py-4 bg-[#2a9d90] text-white text-sm font-bold rounded-[20px] hover:bg-[#2a9d90]/90 transition-all shadow-lg shadow-[#2a9d90]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
              )}
              {isEdit ? "Cập nhật" : "Đăng bài"}
            </button>
          </div>

          {/* Ảnh bìa */}
          <div className="bg-white p-6 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 space-y-4">
            <p className="text-base font-extrabold text-[#101918]">
              Ảnh đại diện
            </p>
            <label
              htmlFor="sidebar-upload"
              className="aspect-video bg-[#f9fbfb] rounded-[24px] overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-[#e9f1f0] hover:border-[#2a9d90]/30 cursor-pointer group transition-all relative"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-[#588d87] group-hover:scale-110 transition-transform">
                    image
                  </span>
                  <span className="text-sm font-bold text-[#588d87] mt-2">
                    Chọn ảnh bìa
                  </span>
                </>
              )}
              <input
                id="sidebar-upload"
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>

          {/* Cấu hình */}
          <div className="bg-white p-6 rounded-[32px] border border-[#e9f1f0] shadow-xl shadow-gray-200/50 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-[#588d87] uppercase tracking-widest ml-1">
                Chuyên mục
              </label>
              <div className="relative">
                <select
                  name="danhMucBvId"
                  value={formData.danhMucBvId}
                  onChange={handleChange}
                  className="w-full appearance-none bg-[#f9fbfb] border border-[#e9f1f0] rounded-[20px] px-5 py-4 text-sm font-bold text-[#101918] focus:ring-2 focus:ring-[#2a9d90]/20 focus:border-[#2a9d90] outline-none cursor-pointer"
                >
                  <option value="">-- Chọn chuyên mục --</option>
                  {categories.map((cat) => (
                    <option
                      key={cat.danhMucBvId || cat.id}
                      value={cat.danhMucBvId || cat.id}
                    >
                      {cat.tenDanhMuc}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#e9f1f0]"></div>

            <div className="space-y-3">
              <label className="text-xs font-black text-[#588d87] uppercase tracking-widest ml-1">
                Trạng thái hiển thị
              </label>
              <div className="flex flex-col gap-3">
                <label
                  className={`flex items-center gap-4 cursor-pointer group p-3 rounded-2xl border transition-all ${formData.trangThai === "CONG_KHAI" ? "border-[#2a9d90] bg-[#f9fbfb]" : "border-transparent hover:border-[#e9f1f0]"}`}
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      className="peer appearance-none size-5 border-2 border-gray-300 rounded-full checked:border-[#2a9d90] checked:bg-[#2a9d90]"
                      type="radio"
                      name="trangThai"
                      value="CONG_KHAI"
                      checked={formData.trangThai === "CONG_KHAI"}
                      onChange={handleChange}
                    />
                    <span className="material-symbols-outlined text-white text-[14px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none transform scale-0 peer-checked:scale-100 transition-transform">
                      check
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#101918]">
                      Công khai
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 cursor-pointer group p-3 rounded-2xl border transition-all ${formData.trangThai === "NHAP" ? "border-[#2a9d90] bg-[#f9fbfb]" : "border-transparent hover:border-[#e9f1f0]"}`}
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      className="peer appearance-none size-5 border-2 border-gray-300 rounded-full checked:border-[#2a9d90] checked:bg-[#2a9d90]"
                      type="radio"
                      name="trangThai"
                      value="NHAP"
                      checked={formData.trangThai === "NHAP"}
                      onChange={handleChange}
                    />
                    <span className="material-symbols-outlined text-white text-[14px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none transform scale-0 peer-checked:scale-100 transition-transform">
                      check
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#101918]">
                      Bản nháp
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreatePost;
