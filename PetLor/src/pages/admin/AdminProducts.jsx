import React, { useEffect, useState } from "react";
import productService from "../../services/productService";

// Helper: Format tiền tệ (VND)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper: Xác định trạng thái kho hàng
const getStockStatus = (quantity) => {
  if (quantity === 0)
    return {
      label: "Hết hàng",
      color: "bg-red-100 text-red-800 border-red-200",
    };
  if (quantity < 10)
    return {
      label: "Sắp hết",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
  return {
    label: "Còn hàng",
    color: "bg-green-100 text-green-800 border-green-200",
  };
};

const AdminProducts = () => {
  // 1. State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Để hiển thị trong Dropdown lọc
  const [loading, setLoading] = useState(true);

  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStock, setFilterStock] = useState("");

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // State cho Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tenSanPham: "",
    moTaChiTiet: "",
    gia: 0,
    soLuongTonKho: 0,
    hinhAnhUrl: "",
    danhMucId: "",
  });

  // State cho Modal Chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 2. Hàm tải dữ liệu
  const fetchData = async () => {
    setLoading(true);
    try {
      // Tải dữ liệu sản phẩm và danh mục song song
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAllProducts(),
        productService.getAllCategories(),
      ]);
      setCategories(categoriesRes || []);

      // Map dữ liệu sản phẩm
      const formattedProducts = Array.isArray(productsRes)
        ? productsRes.map((p) => {
            // Map tên danh mục từ ID
            const catName = p.danhMuc
              ? p.danhMuc.tenDanhMuc
              : (categoriesRes || []).find(
                  (c) => (c.id || c.danhMucId) == p.danhMucId
                )?.tenDanhMuc || "Chưa phân loại";

            return {
              ...p,
              sanPhamId: p.id || p.sanPhamId,
              tenSanPham: p.tenSanPham || p.name,
              gia: p.gia || 0,
              soLuongTonKho: p.soLuongTonKho || 0,
              categoryName: catName,
              hinhAnhUrl:
                p.hinhAnhUrl || "https://placehold.co/100x100?text=No+Image",
            };
          })
        : [];

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Lỗi tải dữ liệu sản phẩm:", error);
      alert("Không thể tải dữ liệu sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset trang về 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStock]);

  // 3. Xử lý Xóa
  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID: ${id}?`))
      return;

    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.sanPhamId !== id));
      alert("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert("Xóa thất bại! Có thể sản phẩm đang có trong đơn hàng.");
    }
  };

  // Hàm xử lý Lưu (Thêm mới hoặc Cập nhật)
  const handleSave = async () => {
    if (!formData.tenSanPham || !formData.danhMucId || !formData.gia) {
      alert("Vui lòng nhập tên, danh mục và giá sản phẩm!");
      return;
    }

    try {
      const payload = {
        ...formData,
        gia: parseFloat(formData.gia),
        soLuongTonKho: parseInt(formData.soLuongTonKho) || 0,
        danhMucId: parseInt(formData.danhMucId),
      };

      if (editingId) {
        await productService.updateProduct(editingId, payload);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(payload);
        alert("Thêm sản phẩm thành công!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Lỗi lưu sản phẩm:", error);
      alert("Thao tác thất bại!");
    }
  };

  // Hàm xem chi tiết (Gọi API /api/san-pham/{id})
  const handleViewDetail = async (id) => {
    try {
      const data = await productService.getProductById(id);
      // Map tên danh mục (nếu API chi tiết chỉ trả về ID)
      const catName = data.danhMuc
        ? data.danhMuc.tenDanhMuc
        : categories.find((c) => (c.id || c.danhMucId) === data.danhMucId)
            ?.tenDanhMuc || "Chưa phân loại";

      setSelectedProduct({ ...data, categoryName: catName });
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
      // Fallback nếu API lỗi
      alert("Không thể tải chi tiết sản phẩm từ server.");
    }
  };

  // 4. Logic Lọc dữ liệu (Frontend Filter)
  const filteredProducts = products.filter((product) => {
    // Lọc theo từ khóa (Tên hoặc ID)
    const matchSearch =
      product.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sanPhamId.toString().includes(searchTerm);

    // Lọc theo Danh mục
    const matchCategory = filterCategory
      ? product.danhMucId?.toString() === filterCategory ||
        (product.danhMuc &&
          (product.danhMuc.id || product.danhMuc.danhMucId)?.toString() ===
            filterCategory)
      : true;

    // Lọc theo Trạng thái kho
    let matchStock = true;
    if (filterStock === "outstock") matchStock = product.soLuongTonKho === 0;
    else if (filterStock === "lowstock")
      matchStock = product.soLuongTonKho > 0 && product.soLuongTonKho < 10;
    else if (filterStock === "instock")
      matchStock = product.soLuongTonKho >= 10;

    return matchSearch && matchCategory && matchStock;
  });

  // Logic Phân trang
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 5. Tính toán Thống kê (Stats)
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.soLuongTonKho < 10).length;
  // Tính tổng giá trị kho = sum(giá * số lượng)
  const inventoryValue = products.reduce(
    (total, p) => total + p.gia * p.soLuongTonKho,
    0
  );

  const stats = [
    {
      title: "Tổng sản phẩm",
      value: totalProducts,
      icon: "inventory_2",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    {
      title: "Sắp hết / Hết hàng",
      value: lowStockCount,
      icon: "production_quantity_limits",
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-500",
    },
    {
      title: "Giá trị tồn kho",
      value: formatCurrency(inventoryValue),
      icon: "monetization_on",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
  ];

  if (loading)
    return (
      <div className="p-10 text-center">Đang tải danh sách sản phẩm...</div>
    );

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Sản phẩm
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 border-l-4 ${stat.border}`}
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bg} rounded-md p-3`}>
                  <span
                    className={`material-symbols-outlined ${stat.color} text-2xl`}
                  >
                    {stat.icon}
                  </span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          <div className="flex-1 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative rounded-md shadow-sm max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400">
                  search
                </span>
              </div>
              <input
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
                placeholder="Tìm tên SP, mã SP..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Select Category (Dynamic) */}
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option
                    key={cat.id || cat.danhMucId}
                    value={cat.id || cat.danhMucId}
                  >
                    {cat.tenDanhMuc}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Stock Status */}
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
              >
                <option value="">Tất cả trạng thái kho</option>
                <option value="instock">Còn hàng (&ge;10)</option>
                <option value="lowstock">Sắp hết (&lt;10)</option>
                <option value="outstock">Hết hàng (0)</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              type="button"
            >
              <span className="material-symbols-outlined text-sm mr-2">
                file_download
              </span>
              Xuất Excel
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none"
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  tenSanPham: "",
                  moTaChiTiet: "",
                  gia: 0,
                  soLuongTonKho: 0,
                  hinhAnhUrl: "",
                  danhMucId:
                    categories.length > 0
                      ? categories[0].id || categories[0].danhMucId
                      : "",
                });
                setIsModalOpen(true);
              }}
            >
              <span className="material-symbols-outlined text-sm mr-2">
                add
              </span>
              Thêm Sản phẩm
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thông tin Sản phẩm
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Giá bán
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tồn kho
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mô tả
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((product, index) => {
                  const stockStatus = getStockStatus(product.soLuongTonKho);
                  return (
                    <tr
                      key={product.sanPhamId || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{product.sanPhamId}
                      </td>

                      {/* Sản phẩm (Ảnh + Tên + Danh mục) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover border border-gray-200"
                              src={product.hinhAnhUrl}
                              alt={product.tenSanPham}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/40?text=Pet";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div
                              className="text-sm font-medium text-gray-900 max-w-[200px] truncate"
                              title={product.tenSanPham}
                            >
                              {product.tenSanPham}
                            </div>
                            <div className="text-xs text-gray-500">
                              Danh mục:{" "}
                              <span className="font-semibold">
                                {product.categoryName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Giá */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(product.gia)}
                      </td>

                      {/* Tồn kho */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 font-medium">
                            {product.soLuongTonKho}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${stockStatus.color}`}
                          >
                            {stockStatus.label}
                          </span>
                        </div>
                      </td>

                      {/* Mô tả */}
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate"
                        title={product.moTaChiTiet}
                      >
                        {product.moTaChiTiet || "Chưa có mô tả"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            title="Xem chi tiết"
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            onClick={() => handleViewDetail(product.sanPhamId)}
                          >
                            <span className="material-symbols-outlined text-base">
                              visibility
                            </span>
                          </button>
                          <button
                            title="Chỉnh sửa"
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            onClick={() => {
                              setEditingId(product.sanPhamId);
                              setFormData({
                                tenSanPham: product.tenSanPham,
                                moTaChiTiet: product.moTaChiTiet || "",
                                gia: product.gia,
                                soLuongTonKho: product.soLuongTonKho,
                                hinhAnhUrl: product.hinhAnhUrl || "",
                                danhMucId:
                                  product.danhMucId ||
                                  (product.danhMuc
                                    ? product.danhMuc.id ||
                                      product.danhMuc.danhMucId
                                    : ""),
                              });
                              setIsModalOpen(true);
                            }}
                          >
                            <span className="material-symbols-outlined text-base">
                              edit_note
                            </span>
                          </button>
                          <button
                            title="Xóa"
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => handleDelete(product.sanPhamId)}
                          >
                            <span className="material-symbols-outlined text-base">
                              cancel
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy sản phẩm nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredProducts.length)}
                </span>{" "}
                trong số{" "}
                <span className="font-medium">{filteredProducts.length}</span>{" "}
                kết quả
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <span className="material-symbols-outlined text-base">
                    chevron_left
                  </span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number
                          ? "z-10 bg-primary border-primary text-white"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages || totalPages === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <span className="material-symbols-outlined text-base">
                    chevron_right
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Thêm/Sửa Sản Phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Cập nhật Sản phẩm" : "Thêm Sản phẩm Mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  value={formData.tenSanPham}
                  onChange={(e) =>
                    setFormData({ ...formData, tenSanPham: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá bán (VNĐ) *
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  value={formData.gia}
                  onChange={(e) =>
                    setFormData({ ...formData, gia: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tồn kho
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  value={formData.soLuongTonKho}
                  onChange={(e) =>
                    setFormData({ ...formData, soLuongTonKho: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Hình ảnh (URL)
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  value={formData.hinhAnhUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, hinhAnhUrl: e.target.value })
                  }
                  placeholder="http://example.com/image.jpg"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  value={formData.moTaChiTiet}
                  onChange={(e) =>
                    setFormData({ ...formData, moTaChiTiet: e.target.value })
                  }
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600"
              >
                Lưu lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi tiết Sản phẩm */}
      {isDetailModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chi tiết Sản phẩm #
                {selectedProduct.id || selectedProduct.sanPhamId}
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={
                    selectedProduct.hinhAnhUrl ||
                    "https://placehold.co/100x100?text=No+Image"
                  }
                  alt={selectedProduct.tenSanPham}
                  className="h-48 w-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tên sản phẩm</p>
                  <p className="font-medium text-gray-900">
                    {selectedProduct.tenSanPham || selectedProduct.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Danh mục</p>
                  <p className="font-medium text-gray-900">
                    {selectedProduct.categoryName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giá bán</p>
                  <p className="font-bold text-primary">
                    {formatCurrency(selectedProduct.gia)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tồn kho</p>
                  <p className="font-medium text-gray-900">
                    {selectedProduct.soLuongTonKho}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Mô tả chi tiết</p>
                <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-700 min-h-[80px] border border-gray-100">
                  {selectedProduct.moTaChiTiet || "Không có mô tả"}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProducts;
