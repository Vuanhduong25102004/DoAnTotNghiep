import React, { useState, useEffect } from "react";
import petService from "../../../services/petService";

const AddPetModal = ({ isOpen, onClose, onAddSuccess }) => {
  // Dữ liệu mặc định ban đầu
  const initialFormState = {
    tenThuCung: "",
    loai: "Chó", // Map sang: chungLoai
    giong: "", // Map sang: giongLoai
    gioiTinh: "Đực", // Map sang: gioiTinh (Đực/Cái theo ví dụ của bạn)
    ngaySinh: "", // Map sang: ngaySinh
    ghiChu: "", // Map sang: ghiChuSucKhoe
  };

  const [formData, setFormData] = useState(initialFormState);
  const [avatarFile, setAvatarFile] = useState(null); // State lưu file ảnh
  const [previewUrl, setPreviewUrl] = useState(""); // State lưu ảnh preview
  const [loading, setLoading] = useState(false);

  // Reset form khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFormData(initialFormState);
        setAvatarFile(null);
        setPreviewUrl("");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Xử lý thay đổi input text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData.tenThuCung) {
      alert("Vui lòng nhập tên thú cưng!");
      return;
    }

    setLoading(true);
    try {
      // 1. Tạo đối tượng FormData
      const dataToSend = new FormData();

      // 2. Chuẩn bị Object JSON thông tin thú cưng (Map đúng key backend yêu cầu)
      const petInfo = {
        tenThuCung: formData.tenThuCung,
        chungLoai: formData.loai,
        giongLoai: formData.giong,
        ngaySinh: formData.ngaySinh || null, // Nếu rỗng thì gửi null hoặc chuỗi rỗng tùy backend
        gioiTinh: formData.gioiTinh,
        ghiChuSucKhoe: formData.ghiChu,
      };

      // 3. Append JSON String vào key 'thuCung'
      dataToSend.append("thuCung", JSON.stringify(petInfo));

      // 4. Append File vào key 'hinhAnh' (nếu có)
      if (avatarFile) {
        dataToSend.append("hinhAnh", avatarFile);
      }

      // 5. Gọi API createMyPet (đã cập nhật trong service)
      await petService.createMyPet(dataToSend);

      alert("Thêm thú cưng thành công!");
      onAddSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi thêm thú cưng:", error);
      alert("Thêm thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden transition-visibility duration-500 ${
        isOpen ? "visible" : "invisible delay-500"
      }`}
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Slide-over Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10 pointer-events-none">
        {/* Drawer Content */}
        <div
          className={`pointer-events-auto w-screen max-w-md transform transition-transform duration-500 ease-in-out flex flex-col h-full bg-white shadow-2xl ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <div>
              <h3 className="text-xl font-bold text-[#0d1b0d] leading-tight">
                Thêm thú cưng
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Tạo hồ sơ mới cho người bạn nhỏ
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer focus:outline-none"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
            {/* --- Phần Upload Ảnh (Mới) --- */}
            <div className="flex flex-col items-center justify-center gap-3 pb-2">
              <div className="relative group">
                <div
                  className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-md bg-cover bg-center flex items-center justify-center overflow-hidden"
                  style={
                    previewUrl ? { backgroundImage: `url(${previewUrl})` } : {}
                  }
                >
                  {!previewUrl && (
                    <span className="material-symbols-outlined text-4xl text-gray-300">
                      pets
                    </span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-[#0fd60f] transition-all border-2 border-white hover:scale-105">
                  <span className="material-symbols-outlined text-[18px] block text-[#0d1b0d]">
                    add_a_photo
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Ảnh đại diện thú cưng
              </p>
            </div>

            {/* Tên thú cưng */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-gray-500">
                Tên thú cưng <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-[#0d1b0d] placeholder:text-gray-400 transition-all outline-none font-medium"
                name="tenThuCung"
                value={formData.tenThuCung}
                onChange={handleChange}
                placeholder="Ví dụ: Lu, Miu..."
                type="text"
              />
            </div>

            {/* Loài & Giống */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-gray-500">
                  Chủng loại
                </label>
                <div className="relative">
                  <select
                    className="appearance-none w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-[#0d1b0d] transition-all cursor-pointer outline-none font-medium"
                    name="loai"
                    value={formData.loai}
                    onChange={handleChange}
                  >
                    <option value="Chó">Chó</option>
                    <option value="Mèo">Mèo</option>
                    <option value="Chim">Chim</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <span className="material-symbols-outlined text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-gray-500">
                  Giống loài
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-[#0d1b0d] placeholder:text-gray-400 transition-all outline-none font-medium"
                  name="giong"
                  value={formData.giong}
                  onChange={handleChange}
                  placeholder="VD: Golden..."
                  type="text"
                />
              </div>
            </div>

            {/* Giới tính */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-gray-500">
                Giới tính
              </label>
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer group">
                  <input
                    className="peer sr-only"
                    name="gioiTinh"
                    type="radio"
                    value="Đực"
                    checked={formData.gioiTinh === "Đực"}
                    onChange={handleChange}
                  />
                  <div className="rounded-xl border border-gray-200 bg-white py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary-dark transition-all hover:bg-gray-50">
                    <span className="material-symbols-outlined text-[18px]">
                      male
                    </span>
                    Đực
                  </div>
                </label>
                <label className="flex-1 cursor-pointer group">
                  <input
                    className="peer sr-only"
                    name="gioiTinh"
                    type="radio"
                    value="Cái"
                    checked={formData.gioiTinh === "Cái"}
                    onChange={handleChange}
                  />
                  <div className="rounded-xl border border-gray-200 bg-white py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-gray-600 peer-checked:border-pink-500 peer-checked:bg-pink-50 peer-checked:text-pink-600 transition-all hover:bg-gray-50">
                    <span className="material-symbols-outlined text-[18px]">
                      female
                    </span>
                    Cái
                  </div>
                </label>
              </div>
            </div>

            {/* Ngày sinh */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-gray-500">
                Ngày sinh
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-[#0d1b0d] transition-all outline-none font-medium"
                name="ngaySinh"
                value={formData.ngaySinh}
                onChange={handleChange}
                type="date"
              />
            </div>

            {/* Ghi chú */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-gray-500">
                Ghi chú sức khỏe
              </label>
              <textarea
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-[#0d1b0d] placeholder:text-gray-400 transition-all resize-none min-h-[100px] outline-none font-medium"
                name="ghiChu"
                value={formData.ghiChu}
                onChange={handleChange}
                placeholder="Tiền sử bệnh, dị ứng..."
                rows="3"
              ></textarea>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                type="button"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-[#0d1b0d] shadow-lg shadow-green-500/20 hover:bg-[#0fd60f] hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                type="button"
              >
                {loading && (
                  <span className="material-symbols-outlined animate-spin text-sm">
                    progress_activity
                  </span>
                )}
                {loading ? "Đang lưu..." : "Thêm thú cưng"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPetModal;
