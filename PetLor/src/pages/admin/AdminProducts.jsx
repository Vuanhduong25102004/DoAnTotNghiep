/**
 * @file AdminProducts.jsx
 * @description Trang quản lý các sản phẩm của cửa hàng.
 * Cho phép xem, tìm kiếm, lọc, tạo, cập nhật và xóa sản phẩm.
 */
import React, { useEffect, useState } from "react";
import productService from "../../services/productService";

// --- Helpers (Hàm hỗ trợ) ---

/**
 * Định dạng một số thành chuỗi tiền tệ VND.
 * @param {number} amount - Số tiền cần định dạng.
 * @returns {string} - Chuỗi tiền tệ đã định dạng.
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Trả về nhãn và màu sắc cho trạng thái kho hàng.
 * @param {number} quantity - Số lượng tồn kho.
 * @returns {{label: string, color: string}} - Đối tượng chứa nhãn và lớp CSS.
 */
const getStockStatus = (quantity) => {
  if (quantity <= 0)
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

/**
 * Xử lý URL hình ảnh để hiển thị, bao gồm cả fallback.
 * @param {string} imagePath - Đường dẫn tương đối của ảnh.
 * @param {string} [fallbackText="Product"] - Chữ hiển thị trên ảnh placeholder.
 * @returns {string} - URL đầy đủ của ảnh hoặc URL placeholder.
 */
const getImageUrl = (imagePath, fallbackText = "Product") => {
  if (!imagePath) return `https://placehold.co/100x100?text=${fallbackText}`;
  if (imagePath.startsWith("http")) return imagePath;
  return `http://localhost:8080/uploads/${imagePath}`;
};

const AdminProducts = () => {
  // 1. State
  // --- 1. State Management (Quản lý Trạng thái) ---

  // State lưu trữ dữ liệu chính và trạng thái tải
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [categories, setCategories] = useState([]); // Danh sách danh mục cho dropdown
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  // State cho các bộ lọc
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [filterCategory, setFilterCategory] = useState(""); // Lọc theo danh mục
  const [filterStock, setFilterStock] = useState(""); // Lọc theo trạng thái kho

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [totalElements, setTotalElements] = useState(0); // Tổng số sản phẩm
  const ITEMS_PER_PAGE = 5; // Số mục trên mỗi trang

  // State cho các form (Thêm/Sửa)
  const [isModalOpen, setIsModalOpen] = useState(false); // Mở/đóng modal thêm/sửa
  const [editingId, setEditingId] = useState(null); // ID của sản phẩm đang sửa, null nếu là thêm mới
  const [formData, setFormData] = useState({
    tenSanPham: "",
    moTaChiTiet: "",
    gia: 0,
    soLuongTonKho: 0,
    hinhAnh: "",
    danhMucId: "",
  });
  const [productImageFile, setProductImageFile] = useState(null); // File ảnh cho form

  // State cho việc xem chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Mở/đóng modal chi tiết
  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm được chọn để xem chi tiết

  // --- 2. Data Fetching (Lấy Dữ liệu từ API) ---

  /**
   * Lấy danh sách sản phẩm từ API dựa trên các tham số phân trang và lọc.
   */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1; // API sử dụng trang bắt đầu từ 0

      // Assuming productService.getAllProducts can now take parameters
      // for pagination and filtering based on the new backend.
      const response = await productService.getAllProducts({
        page,
        size: ITEMS_PER_PAGE,
        search: searchTerm,
        categoryId: filterCategory,
        stockStatus: filterStock,
      });

      const productsData = response?.content || [];
      const formattedProducts = productsData.map((p) => ({
        ...p,
        // API đã trả về `tenDanhMuc`, chỉ cần đảm bảo component sử dụng tên thuộc tính nhất quán.
        sanPhamId: p.sanPhamId,
        tenSanPham: p.tenSanPham,
        gia: p.gia || 0,
        soLuongTonKho: p.soLuongTonKho || 0,
        categoryName: p.tenDanhMuc || "Chưa phân loại",
        hinhAnh: p.hinhAnh,
      }));

      setProducts(formattedProducts);
      setTotalPages(response?.totalPages || 0);
      setTotalElements(response?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi tải dữ liệu sản phẩm:", error);
      alert("Không thể tải dữ liệu sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  // Effect: Lấy danh sách danh mục một lần khi component được mount.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await productService.getAllCategories();
        setCategories(categoriesRes || []);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
        alert("Không thể tải danh mục sản phẩm.");
      }
    };
    fetchCategories();
  }, []); // Mảng rỗng đảm bảo effect chỉ chạy một lần.

  // Effect: Tải lại danh sách sản phẩm mỗi khi trang hoặc bộ lọc thay đổi.
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, filterCategory, filterStock]);

  // --- 3. Event Handlers (Hàm Xử lý Sự kiện) ---

  /**
   * Mở modal để thêm sản phẩm mới và reset form.
   */
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      tenSanPham: "",
      moTaChiTiet: "",
      gia: 0,
      soLuongTonKho: 0,
      hinhAnh: "",
      // Mặc định chọn danh mục đầu tiên nếu có
      danhMucId:
        categories.length > 0
          ? categories[0].id || categories[0].danhMucId
          : "",
    });
    setProductImageFile(null);
    setIsModalOpen(true);
  };

  /**
   * Mở modal để chỉnh sửa một sản phẩm đã có.
   * @param {object} product - Đối tượng sản phẩm được chọn.
   */
  const handleOpenEditModal = (product) => {
    setEditingId(product.sanPhamId);
    setFormData({
      tenSanPham: product.tenSanPham,
      moTaChiTiet: product.moTaChiTiet || "",
      gia: product.gia,
      soLuongTonKho: product.soLuongTonKho,
      hinhAnh: product.hinhAnh || "",
      danhMucId:
        product.danhMucId ||
        (product.danhMuc
          ? product.danhMuc.id || product.danhMuc.danhMucId
          : ""),
    });
    setProductImageFile(null);
    setIsModalOpen(true);
  };

  /**
   * Xử lý sự kiện xóa một sản phẩm.
   * @param {number} id - ID của sản phẩm cần xóa.
   */
  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID: ${id}?`))
      return;

    try {
      await productService.deleteProduct(id);
      // Tải lại dữ liệu trên trang hiện tại để phản ánh thay đổi
      fetchProducts();
      alert("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert("Xóa thất bại! Có thể sản phẩm đang có trong đơn hàng.");
    }
  };

  /**
   * Gửi yêu cầu tạo hoặc cập nhật sản phẩm lên server.
   */
  const handleSave = async () => {
    if (!formData.tenSanPham || !formData.danhMucId || !formData.gia) {
      alert("Vui lòng nhập tên, danh mục và giá sản phẩm!");
      return;
    }

    const formDataPayload = new FormData();
    const productData = {
      ...formData,
      gia: parseFloat(formData.gia),
      soLuongTonKho: parseInt(formData.soLuongTonKho) || 0,
      danhMucId: parseInt(formData.danhMucId),
    };

    // Xóa trường text `hinhAnh` không cần thiết (vì đã gửi file qua multipart)
    delete productData.hinhAnh;

    // Gửi dữ liệu sản phẩm dưới dạng Blob với Content-Type application/json
    const jsonBlob = new Blob([JSON.stringify(productData)], {
      type: "application/json",
    });
    formDataPayload.append("sanPham", jsonBlob);

    // Gửi file ảnh (nếu có) với key 'hinhAnh'
    if (productImageFile) {
      formDataPayload.append("hinhAnh", productImageFile);
    }

    try {
      if (editingId) {
        await productService.updateProduct(editingId, formDataPayload);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(formDataPayload);
        alert("Thêm sản phẩm thành công!");
      }
      setIsModalOpen(false);
      setProductImageFile(null);
      // Tải lại dữ liệu để hiển thị sản phẩm mới/đã cập nhật.
      fetchProducts();
    } catch (error) {
      console.error("Lỗi lưu sản phẩm:", error);
      alert("Thao tác thất bại!");
    }
  };

  /**
   * Mở modal và tải chi tiết sản phẩm để xem.
   * @param {number} id - ID của sản phẩm cần xem.
   */
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
      alert("Không thể tải chi tiết sản phẩm từ server.");
    }
  };

  /**
   * Xử lý thay đổi trang.
   * @param {number} pageNumber - Số trang muốn chuyển đến.
   */
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // --- 4. Derived Data & Calculations (Dữ liệu & Tính toán) ---

  // Tính toán index của item đầu tiên trên trang
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  // Lưu ý: Các chỉ số thống kê bên dưới (Sắp hết, Giá trị kho) chỉ được tính cho các sản phẩm trên trang hiện tại.
  // Để có số liệu toàn bộ, backend cần cung cấp API riêng cho thống kê.
  const lowStockCount = products.filter((p) => p.soLuongTonKho < 10).length;
  // Tính tổng giá trị kho = sum(giá * số lượng)
  const inventoryValue = products.reduce(
    (total, p) => total + p.gia * p.soLuongTonKho,
    0
  );

  const stats = [
    {
      title: "Tổng sản phẩm",
      value: totalElements,
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

  // --- 5. UI Rendering (Kết xuất Giao diện) ---

  // Hiển thị trạng thái tải lần đầu tiên
  if (loading && products.length === 0)
    return (
      <div className="p-10 text-center">Đang tải danh sách sản phẩm...</div>
    );

  return (
    <>
      {/* Tiêu đề trang */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Sản phẩm
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {" "}
        {/* Lưới thống kê */}
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

      {/* Bộ lọc & Hành động */}
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Lọc theo danh mục */}
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setCurrentPage(1);
                }}
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

            {/* Lọc theo trạng thái kho */}
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md h-10"
                value={filterStock}
                onChange={(e) => {
                  setFilterStock(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả trạng thái kho</option>
                <option value="instock">Còn hàng (&ge;10)</option>
                <option value="lowstock">Sắp hết (&lt;10)</option>
                <option value="outstock">Hết hàng (0)</option>
              </select>
            </div>
          </div>

          {/* Các nút hành động */}
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
              onClick={handleOpenAddModal}
            >
              <span className="material-symbols-outlined text-sm mr-2">
                add
              </span>
              Thêm Sản phẩm
            </button>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
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
              {loading && (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    Đang tải...
                  </td>
                </tr>
              )}
              {!loading && products.length > 0
                ? products.map((product, index) => {
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
                                src={getImageUrl(product.hinhAnh)}
                                alt={product.tenSanPham}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/40?text=Pet";
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
                              onClick={() =>
                                handleViewDetail(product.sanPhamId)
                              }
                            >
                              <span className="material-symbols-outlined text-base">
                                visibility
                              </span>
                            </button>
                            <button
                              title="Chỉnh sửa"
                              className="text-gray-400 hover:text-blue-500 transition-colors"
                              onClick={() => handleOpenEditModal(product)}
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
                : !loading && (
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
                  {totalElements > 0 ? indexOfFirstItem + 1 : 0}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {indexOfFirstItem + products.length}
                </span>{" "}
                trong số <span className="font-medium">{totalElements}</span>{" "}
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

      {/* Modal Thêm/Sửa Sản phẩm */}
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
                  Hình ảnh
                </label>
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
                  src={getImageUrl(selectedProduct.hinhAnh)}
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
