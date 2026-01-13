import React, { useState, useEffect } from "react";
import useEscapeKey from "../../../../../hooks/useEscapeKey";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "../../../../../utils/formatters";

const ImportFormModal = ({
  isOpen,
  onClose,
  suppliersList,
  productsList,
  categoriesList,
  onSubmit,
}) => {
  // --- State ---
  const [formData, setFormData] = useState({ nccId: "", ghiChu: "" });
  const [importDetails, setImportDetails] = useState([]);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // State dòng nhập liệu hiện tại
  const [currentLine, setCurrentLine] = useState({
    sanPhamId: "",
    tenSanPham: "",
    danhMucId: "",
    giaBan: 0,
    moTaChiTiet: "",
    soLuong: 1,
    giaNhap: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ nccId: "", ghiChu: "" });
      setImportDetails([]);
      resetCurrentLine();
    }
  }, [isOpen]);

  useEscapeKey(onClose, isOpen);

  const resetCurrentLine = () => {
    setCurrentLine({
      sanPhamId: "",
      tenSanPham: "",
      danhMucId: "",
      giaBan: 0,
      moTaChiTiet: "",
      soLuong: 1,
      giaNhap: 0,
    });
    setIsNewProduct(false);
  };

  const handleMasterChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLineChange = (e) => {
    const { name, value } = e.target;
    if (name === "sanPhamId" && !isNewProduct) {
      const selected = productsList.find(
        (p) => p.sanPhamId === parseInt(value)
      );
      setCurrentLine((prev) => ({
        ...prev,
        sanPhamId: value,
        tenSanPham: selected ? selected.tenSanPham : "",
      }));
    } else {
      setCurrentLine((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddLine = () => {
    if (currentLine.soLuong <= 0 || currentLine.giaNhap <= 0) {
      alert("Số lượng và Giá nhập phải lớn hơn 0");
      return;
    }

    let newLineItem = {};
    if (isNewProduct) {
      if (
        !currentLine.tenSanPham ||
        !currentLine.danhMucId ||
        !currentLine.giaBan
      ) {
        alert("Vui lòng nhập đủ Tên, Danh mục và Giá bán cho SP mới");
        return;
      }
      newLineItem = {
        sanPhamId: null,
        isNew: true,
        tenSanPham: currentLine.tenSanPham,
        danhMucId: parseInt(currentLine.danhMucId),
        giaBan: parseFloat(currentLine.giaBan),
        moTaChiTiet: currentLine.moTaChiTiet,
        soLuong: parseInt(currentLine.soLuong),
        giaNhap: parseFloat(currentLine.giaNhap),
        thanhTien:
          parseInt(currentLine.soLuong) * parseFloat(currentLine.giaNhap),
      };
    } else {
      if (!currentLine.sanPhamId) {
        alert("Vui lòng chọn sản phẩm");
        return;
      }
      newLineItem = {
        sanPhamId: parseInt(currentLine.sanPhamId),
        isNew: false,
        tenSanPham: currentLine.tenSanPham,
        soLuong: parseInt(currentLine.soLuong),
        giaNhap: parseFloat(currentLine.giaNhap),
        thanhTien:
          parseInt(currentLine.soLuong) * parseFloat(currentLine.giaNhap),
      };
    }
    setImportDetails([...importDetails, newLineItem]);
    resetCurrentLine();
  };

  const handleRemoveLine = (index) => {
    const newDetails = [...importDetails];
    newDetails.splice(index, 1);
    setImportDetails(newDetails);
  };

  const handleSubmit = () => {
    if (!formData.nccId || importDetails.length === 0) {
      alert("Vui lòng chọn NCC và thêm ít nhất 1 sản phẩm");
      return;
    }
    const payload = {
      nccId: parseInt(formData.nccId),
      nhanVienId: 1, // Hardcode tạm hoặc lấy từ context
      ghiChu: formData.ghiChu,
      chiTietList: importDetails,
    };
    onSubmit(payload);
  };

  const totalAmount = importDetails.reduce(
    (sum, item) => sum + item.thanhTien,
    0
  );

  // Shared Styles (Design System)
  const inputClass =
    "w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium focus:ring-0 transition-all focus:border-primary outline-none placeholder:text-slate-400 text-sm";
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
            className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    move_to_inbox
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Tạo Phiếu Nhập Hàng
                  </h2>
                  <p className="text-sm text-slate-500">
                    Nhập hàng vào kho từ nhà cung cấp
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
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                {/* CỘT TRÁI: FORM NHẬP (chiếm 4 phần) */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-2">
                  {/* Panel NCC */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary bg-teal-50 p-1 rounded text-lg">
                        store
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        Thông tin chung
                      </h3>
                    </div>
                    <div>
                      <label className={labelClass}>
                        Nhà cung cấp <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="nccId"
                        value={formData.nccId}
                        onChange={handleMasterChange}
                        className={inputClass}
                      >
                        <option value="">-- Chọn NCC --</option>
                        {suppliersList.map((ncc) => (
                          <option key={ncc.nccId} value={ncc.nccId}>
                            {ncc.tenNcc}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Ghi chú</label>
                      <textarea
                        name="ghiChu"
                        value={formData.ghiChu}
                        onChange={handleMasterChange}
                        className={`${inputClass} resize-none h-20`}
                        placeholder="Ghi chú phiếu nhập..."
                      ></textarea>
                    </div>
                  </section>

                  <div className="border-t border-slate-100"></div>

                  {/* Panel Sản phẩm */}
                  <section className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-1 rounded text-lg">
                          inventory_2
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                          Thêm sản phẩm
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setIsNewProduct(!isNewProduct);
                          resetCurrentLine();
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all border ${
                          isNewProduct
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isNewProduct ? "Quay lại" : "+ SP Mới"}
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 shadow-sm">
                      {!isNewProduct ? (
                        <div>
                          <label className={labelClass}>Chọn SP có sẵn</label>
                          <select
                            name="sanPhamId"
                            value={currentLine.sanPhamId}
                            onChange={handleLineChange}
                            className={`${inputClass} bg-white`}
                          >
                            <option value="">-- Tìm kiếm --</option>
                            {productsList.map((p) => (
                              <option key={p.sanPhamId} value={p.sanPhamId}>
                                {p.tenSanPham}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-3 animate-in fade-in zoom-in duration-200">
                          <div>
                            <label className={labelClass}>
                              Tên sản phẩm mới
                            </label>
                            <input
                              type="text"
                              name="tenSanPham"
                              value={currentLine.tenSanPham}
                              onChange={handleLineChange}
                              placeholder="Nhập tên sản phẩm..."
                              className={`${inputClass} bg-white`}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Danh mục</label>
                              <select
                                name="danhMucId"
                                value={currentLine.danhMucId}
                                onChange={handleLineChange}
                                className={`${inputClass} bg-white`}
                              >
                                <option value="">Danh mục *</option>
                                {categoriesList.map((c) => (
                                  <option
                                    key={c.danhMucId || c.id}
                                    value={c.danhMucId || c.id}
                                  >
                                    {c.tenDanhMuc}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className={labelClass}>
                                Giá bán dự kiến
                              </label>
                              <input
                                type="number"
                                name="giaBan"
                                value={currentLine.giaBan}
                                onChange={handleLineChange}
                                placeholder="0"
                                className={`${inputClass} bg-white`}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Số lượng</label>
                          <input
                            type="number"
                            name="soLuong"
                            min="1"
                            value={currentLine.soLuong}
                            onChange={handleLineChange}
                            className={`${inputClass} bg-white font-bold text-center`}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Giá nhập</label>
                          <input
                            type="number"
                            name="giaNhap"
                            min="0"
                            value={currentLine.giaNhap}
                            onChange={handleLineChange}
                            className={`${inputClass} bg-white font-bold text-right`}
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleAddLine}
                        className="w-full py-2.5 bg-white border-2 border-primary text-primary rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
                      >
                        <span className="material-symbols-outlined text-lg">
                          add
                        </span>
                        Thêm vào danh sách
                      </button>
                    </div>
                  </section>
                </div>

                {/* CỘT PHẢI: BẢNG PREVIEW (chiếm 8 phần) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden shadow-inner">
                  <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center shrink-0">
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">
                      Danh sách sản phẩm ({importDetails.length})
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        Tổng tiền:
                      </span>
                      <span className="text-primary font-extrabold text-xl">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto bg-white custom-scrollbar">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 sticky top-0 z-10 text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-3">Sản phẩm</th>
                          <th className="px-6 py-3 text-center">SL</th>
                          <th className="px-6 py-3 text-right">Giá nhập</th>
                          <th className="px-6 py-3 text-right">Thành tiền</th>
                          <th className="px-4 py-3 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {importDetails.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                              {item.tenSanPham}
                              {item.isNew && (
                                <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded border border-blue-200 font-bold uppercase tracking-wider">
                                  Mới
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-center font-medium text-slate-600">
                              {item.soLuong}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-slate-600">
                              {formatCurrency(item.giaNhap)}
                            </td>
                            <td className="px-6 py-4 text-sm text-right font-bold text-primary">
                              {formatCurrency(item.thanhTien)}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <button
                                onClick={() => handleRemoveLine(index)}
                                className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <span className="material-symbols-outlined text-lg">
                                  delete
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {importDetails.length === 0 && (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-6 py-12 text-center text-slate-400 text-sm italic flex flex-col items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-4xl opacity-20">
                                shopping_cart_off
                              </span>
                              Chưa có sản phẩm nào trong phiếu nhập.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
                <span className="material-symbols-outlined text-xl">check</span>{" "}
                Hoàn tất nhập hàng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImportFormModal;
