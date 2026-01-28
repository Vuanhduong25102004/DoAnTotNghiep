import React, { useState, useEffect } from "react";

const ReviewModal = ({ isOpen, onClose, order, onSubmit, isSubmitting }) => {
  const [reviews, setReviews] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    if (order && order.chiTietDonHangs) {
      // LOGIC MỚI: Chỉ lấy những sản phẩm chưa được đánh giá (daDanhGia === false)
      const initial = order.chiTietDonHangs
        .filter((item) => !item.daDanhGia)
        .map((item) => ({
          sanPhamId: item.sanPhamId,
          tenSanPham: item.tenSanPham,
          hinhAnh: item.hinhAnh,
          soSao: 5,
          noiDung: "",
        }));
      setReviews(initial);
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  // Nếu mở modal lên mà không còn sản phẩm nào để đánh giá (trường hợp hy hữu)
  if (reviews.length === 0) return null;

  const updateReview = (index, field, value) => {
    const updated = [...reviews];
    updated[index][field] = value;
    setReviews(updated);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up flex flex-col max-h-[90vh]">
        <div className="p-8 pb-4 text-center">
          <h3 className="text-2xl font-black text-gray-900">
            Đánh giá sản phẩm
          </h3>
          <p className="text-gray-500 mt-2">Đơn hàng #{order.donHangId}</p>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          {reviews.map((item, idx) => (
            <div
              key={idx}
              className="space-y-4 border-b border-gray-100 pb-6 last:border-0"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`${API_URL}/uploads/${item.hinhAnh}`}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm"
                  alt=""
                />
                <span className="font-bold text-gray-800 line-clamp-1">
                  {item.tenSanPham}
                </span>
              </div>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateReview(idx, "soSao", star)}
                    className={`material-icons text-3xl transition-transform active:scale-90 ${star <= item.soSao ? "text-yellow-400" : "text-gray-200"}`}
                  >
                    star
                  </button>
                ))}
              </div>

              <textarea
                className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-sm"
                placeholder="Nhập nội dung đánh giá cho sản phẩm này..."
                rows="3"
                value={item.noiDung}
                onChange={(e) => updateReview(idx, "noiDung", e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="p-8 pt-0 flex gap-3">
          <button
            disabled={isSubmitting}
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition"
          >
            Quay lại
          </button>
          <button
            disabled={isSubmitting}
            onClick={() =>
              onSubmit({
                donHangId: order.donHangId,
                danhGiaList: reviews.map(
                  ({ tenSanPham, hinhAnh, ...rest }) => rest,
                ),
              })
            }
            className={`flex-[2] py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${isSubmitting ? "bg-gray-200" : "bg-[#10B981] hover:bg-emerald-600 shadow-emerald-100"}`}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
