/**
 * @file AdminProducts.jsx
 * @description Trang quản lý các sản phẩm của cửa hàng.
 * Cho phép xem, tìm kiếm, lọc, tạo, cập nhật và xóa sản phẩm.
 */
import React, { useEffect, useState } from "react";
import productService from "../../services/productService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

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

// Component Skeleton Loading cho Table
const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100 last:border-0">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
    <td className="px-6 py-4 flex items-center gap-3">
      <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-3 bg-gray-100 rounded w-20"></div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div>
    </td>
  </tr>
);

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
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);
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
      toast.error("Không thể tải dữ liệu sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý phím ESC để đóng modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setIsDetailModalOpen(false);
        setIsConfirmDeleteModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  // Effect: Lấy danh sách danh mục một lần khi component được mount.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await productService.getAllCategories();
        setCategories(categoriesRes || []);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
        toast.error("Không thể tải danh mục sản phẩm.");
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
  const handleDeleteClick = (id) => {
    setProductToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDeleteId) return;
    try {
      await productService.deleteProduct(productToDeleteId);
      toast.success("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (error) {
      console.error("Lỗi xóa:", error);
      toast.error("Xóa thất bại! Có thể sản phẩm đang có trong đơn hàng.");
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setProductToDeleteId(null);
    }
  };

  /**
   * Gửi yêu cầu tạo hoặc cập nhật sản phẩm lên server.
   */
  const handleSave = async () => {
    if (!formData.tenSanPham || !formData.danhMucId || !formData.gia) {
      toast.warning("Vui lòng nhập tên, danh mục và giá sản phẩm!");
      return;
    }

    const formDataPayload = new FormData();
    const productData = {
      ...formData,
      gia: parseFloat(formData.gia) || 0,
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
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(formDataPayload);
        toast.success("Thêm sản phẩm thành công!");
      }
      setIsModalOpen(false);
      setProductImageFile(null);
      // Tải lại dữ liệu để hiển thị sản phẩm mới/đã cập nhật.
      fetchProducts();
    } catch (error) {
      console.error("Lỗi lưu sản phẩm:", error);
      toast.error("Thao tác thất bại!");
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
      toast.error("Không thể tải chi tiết sản phẩm từ server.");
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
              {loading
                ? Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                    <SkeletonRow key={idx} />
                  ))
                : products.length > 0
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
                              onClick={() =>
                                handleDeleteClick(product.sanPhamId)
                              }
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
      <AnimatePresence>
        {isModalOpen && (
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
                      {editingId ? "edit_note" : "add_circle"}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                      {editingId ? "Cập nhật Sản phẩm" : "Thêm Sản phẩm Mới"}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      {editingId
                        ? "Chỉnh sửa thông tin sản phẩm"
                        : "Tạo sản phẩm mới cho cửa hàng"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-text-heading hover:bg-surface transition-all duration-300"
                >
                  <span className="material-symbols-outlined font-light">
                    close
                  </span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-8 md:p-10 bg-white overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-1 md:col-span-2 input-group">
                    <label className="form-label">
                      Tên sản phẩm <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tenSanPham}
                      onChange={(e) =>
                        setFormData({ ...formData, tenSanPham: e.target.value })
                      }
                    />
                  </div>

                  <div className="input-group">
                    <label className="form-label">
                      Danh mục <span className="text-primary">*</span>
                    </label>
                    <select
                      className="form-control"
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

                  <div className="input-group">
                    <label className="form-label">
                      Giá bán (VNĐ) <span className="text-primary">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.gia}
                      onChange={(e) =>
                        setFormData({ ...formData, gia: e.target.value })
                      }
                    />
                  </div>

                  <div className="input-group">
                    <label className="form-label">Số lượng tồn kho</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.soLuongTonKho}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          soLuongTonKho: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 input-group">
                    <label className="form-label">Hình ảnh</label>
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

                  <div className="col-span-1 md:col-span-2 input-group">
                    <label className="form-label">Mô tả chi tiết</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      value={formData.moTaChiTiet}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          moTaChiTiet: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 tracking-wide"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    save
                  </span>
                  {editingId ? "Lưu thay đổi" : "Tạo sản phẩm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Chi tiết Sản phẩm */}
      <AnimatePresence>
        {isDetailModalOpen && selectedProduct && (
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
              className="w-full max-w-3xl bg-white rounded-2xl shadow-modal flex flex-col max-h-[95vh] relative overflow-hidden font-body mx-auto my-8"
            >
              {/* Header */}
              <div className="px-10 py-6 border-b border-border-light/50 flex justify-between items-center bg-white sticky top-0 z-20 backdrop-blur-sm bg-white/95">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-surface border border-border-light flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">
                      visibility
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-text-heading tracking-tight font-display">
                      Chi tiết Sản phẩm #
                      {selectedProduct.id || selectedProduct.sanPhamId}
                    </h1>
                    <p className="text-sm text-text-body/70 mt-1 font-light">
                      Xem thông tin chi tiết sản phẩm
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
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
                  <div className="flex justify-center mb-8">
                    <img
                      src={getImageUrl(selectedProduct.hinhAnh)}
                      alt={selectedProduct.tenSanPham}
                      className="h-48 w-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150?text=No+Image";
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Tên sản phẩm
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body font-medium">
                        {selectedProduct.tenSanPham || selectedProduct.name}
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Danh mục
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                        {selectedProduct.categoryName}
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Giá bán
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body font-bold text-primary">
                        {formatCurrency(selectedProduct.gia)}
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="form-label block text-sm font-medium text-text-heading mb-2">
                        Tồn kho
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body">
                        {selectedProduct.soLuongTonKho}
                      </div>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="form-label block text-sm font-medium text-text-heading mb-2">
                      Mô tả chi tiết
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-border-light text-text-body min-h-[80px]">
                      {selectedProduct.moTaChiTiet || "Không có mô tả"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 bg-white border-t border-border-light/50 flex justify-end gap-4 sticky bottom-0 z-20">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-body hover:bg-surface hover:text-text-heading transition-colors border border-transparent hover:border-border-light"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- MODAL XÁC NHẬN XÓA --- */}
      <AnimatePresence>
        {isConfirmDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            >
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <span className="material-symbols-outlined text-red-600 text-3xl">
                    warning
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  Xác nhận xóa
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không
                  thể hoàn tác và có thể ảnh hưởng đến dữ liệu liên quan.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsConfirmDeleteModalOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminProducts;
