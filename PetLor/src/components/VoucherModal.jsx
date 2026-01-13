import React, { useState, useEffect } from "react";
import promotionService from "../services/promotionService";
// 1. Import tiện ích từ file formatters.js
import { formatCurrency, formatJustDate } from "../utils/formatters";

const VoucherModal = ({ isOpen, onClose, onApply }) => {
  const [inputCode, setInputCode] = useState("");
  const [selectedVoucherCode, setSelectedVoucherCode] = useState("");

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchVouchers();
    }
  }, [isOpen]);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await promotionService.getAllPromotions({
        page: 0,
        size: 20,
      });

      const activeVouchers = response.content.filter((v) => {
        const endDate = new Date(v.ngayKetThuc);
        const now = new Date();
        // Lọc voucher đang hoạt động và chưa hết hạn
        return v.trangThai === true && endDate > now;
      });

      setVouchers(activeVouchers);
    } catch (error) {
      console.error("Lỗi khi tải voucher:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    const codeToApply = inputCode.trim() || selectedVoucherCode;
    if (codeToApply) {
      onApply(codeToApply);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full max-w-[600px] shadow-2xl flex flex-col h-[750px] max-h-[90vh] rounded-sm overflow-hidden z-10 relative">
        {/* --- Header --- */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-[20px] font-normal text-gray-800">
            Chọn PetLor Voucher
          </h2>
          <div className="flex items-center gap-1 text-[#0000008a] text-[14px] cursor-pointer hover:opacity-80">
            <span>Hỗ Trợ</span>
            <span className="material-symbols-outlined text-[18px]">
              help_outline
            </span>
          </div>
        </div>

        {/* --- Body --- */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white">
          {/* Input Nhập Mã */}
          <div className="px-6 py-6 bg-[#f8f8f8] flex items-center gap-4">
            <span className="text-[16px] text-gray-700 whitespace-nowrap">
              Mã Voucher
            </span>
            <div className="flex-1">
              <input
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase());
                  setSelectedVoucherCode("");
                }}
                className="w-full bg-white border border-gray-200 px-3 py-2.5 text-[14px] focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-400 outline-none uppercase"
                placeholder="Mã PetLor Voucher"
                type="text"
              />
            </div>
            <button
              onClick={handleApply}
              disabled={!inputCode}
              className={`border border-gray-200 font-medium px-8 py-2.5 text-[14px] uppercase transition-all
                ${
                  inputCode
                    ? "bg-primary text-white cursor-pointer hover:opacity-90"
                    : "bg-white text-gray-400 cursor-not-allowed"
                }`}
            >
              ÁP DỤNG
            </button>
          </div>

          {/* Danh sách Voucher */}
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            <div className="mb-6">
              <h3 className="text-[16px] text-[#000000cc] font-medium">
                Mã giảm giá dành cho bạn
              </h3>
              <p className="text-[14px] text-[#0000008a] mb-4">
                Có thể chọn 1 Voucher
              </p>

              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : vouchers.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  Không có mã giảm giá nào khả dụng.
                </div>
              ) : (
                vouchers.map((voucher) => (
                  <div
                    key={voucher.khuyenMaiId}
                    className="mb-5 voucher-card cursor-pointer"
                    onClick={() => {
                      setSelectedVoucherCode(voucher.maCode);
                      setInputCode("");
                    }}
                  >
                    <div
                      className={`relative flex border rounded-sm bg-white min-h-[118px] transition-colors
                        ${
                          selectedVoucherCode === voucher.maCode
                            ? "border-primary"
                            : "border-gray-200"
                        }`}
                    >
                      <div className="absolute top-0 right-0 z-20">
                        <div className="bg-[#e7f6f2] text-primary text-[12px] px-2 py-0.5 rounded-bl-sm border-l border-b border-[#c8e6df]">
                          SL: {voucher.soLuongGioiHan}
                        </div>
                      </div>

                      <div className="w-[110px] bg-[#9EE0D0] flex flex-col items-center justify-center p-2 voucher-left-edge">
                        <div className="bg-primary rounded-full w-14 h-14 flex items-center justify-center mb-1.5 shadow-sm">
                          <span className="material-symbols-outlined text-white text-[32px]">
                            {voucher.loaiGiamGia === "PHAN_TRAM"
                              ? "percent"
                              : "attach_money"}
                          </span>
                        </div>
                        <span className="text-[12px] text-white font-bold leading-none text-center break-all">
                          {voucher.maCode}
                        </span>
                      </div>

                      <div className="flex-1 p-3 flex gap-4 dashed-separator">
                        <div className="flex-1 pt-1">
                          <h4 className="text-[14px] font-medium text-gray-800 leading-[1.2] mb-3">
                            {/* 2. Sử dụng formatCurrency từ utils */}
                            {voucher.loaiGiamGia === "PHAN_TRAM"
                              ? `Giảm ${voucher.giaTriGiam}%`
                              : `Giảm ${formatCurrency(voucher.giaTriGiam)}`}
                            <br />
                            {voucher.donToiThieu > 0
                              ? `Đơn tối thiểu ${formatCurrency(
                                  voucher.donToiThieu
                                )}`
                              : "Cho mọi đơn hàng"}
                          </h4>

                          <div className="w-[70%] h-[4px] bg-gray-100 rounded-full mb-2">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: "50%" }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-[#0000008a]">
                              {/* 3. Sử dụng formatJustDate từ utils */}
                              HSD: {formatJustDate(voucher.ngayKetThuc)}
                            </span>
                            <button className="text-[12px] text-blue-600 hover:underline">
                              Chi tiết
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center pr-1">
                          <input
                            checked={selectedVoucherCode === voucher.maCode}
                            onChange={() =>
                              setSelectedVoucherCode(voucher.maCode)
                            }
                            className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded-full cursor-pointer"
                            name="voucher"
                            type="radio"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#f0f9f7] px-4 py-2 border-x border-b border-gray-200 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        info
                      </span>
                      <span className="text-[12px] text-primary truncate">
                        {voucher.moTa || "Áp dụng cho các sản phẩm tại PetLor."}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* --- Footer Modal --- */}
        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2 bg-white">
          <button
            onClick={onClose}
            className="w-[140px] py-2 text-[14px] font-normal text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all uppercase rounded-sm"
          >
            TRỞ LẠI
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedVoucherCode && !inputCode}
            className={`w-[140px] py-2 text-[14px] font-medium text-white transition-all uppercase rounded-sm
                ${
                  !selectedVoucherCode && !inputCode
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:opacity-90"
                }`}
          >
            ĐỒNG Ý
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;
