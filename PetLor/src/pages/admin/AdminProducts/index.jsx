/**
 * @file index.jsx
 * @description Trang quản lý các sản phẩm của cửa hàng (Container).
 */
import React, { useEffect, useState } from "react";
import useEscapeKey from "../../../hooks/useEscapeKey";
// Đảm bảo đường dẫn đúng (thêm một cấp ../)
import productService from "../../../services/productService";
import { toast } from "react-toastify";
import { formatCurrency } from "../components/utils";

// Components
import ProductStats from "./components/ProductStats";
import ProductFilters from "./components/ProductFilters";
import ProductTable from "./components/ProductTable";
import ProductDetailModal from "./components/modals/ProductDetailModal";
import ProductFormModal from "./components/modals/ProductFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const AdminProducts = () => {
  // --- State Management ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 5;

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    tenSanPham: "",
    moTaChiTiet: "",
    gia: 0,
    soLuongTonKho: 0,
    hinhAnh: "",
    danhMucId: "",
  });
  const [productImageFile, setProductImageFile] = useState(null);

  // State riêng cho các chỉ số cần tính trên toàn bộ dữ liệu
  const [inventoryStats, setInventoryStats] = useState({
    lowStockCount: "...",
    inventoryValue: 0,
  });

  // --- Data Fetching ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let productsData = [];
      let totalP = 0;
      let totalE = 0;

      // Trim để loại bỏ khoảng trắng thừa đầu/cuối
      const term = searchTerm ? searchTerm.trim() : "";

      if (term) {
        // --- LOGIC MỚI: SỬ DỤNG SERVICE ---
        console.log(`Đang tìm kiếm qua Service: "${term}"`);

        // 1. Gọi API qua productService (đã tách file)
        const data = await productService.searchGlobal(term);

        // 2. Lấy danh sách sản phẩm từ kết quả trả về (sanPhams, dichVus, thuCungs)
        const allSearchResults = data.sanPhams || [];

        // 3. Xử lý phân trang phía Client (Do API Search trả về all)
        totalE = allSearchResults.length;
        totalP = Math.ceil(totalE / ITEMS_PER_PAGE);

        // Cắt mảng để lấy đúng trang hiện tại
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        productsData = allSearchResults.slice(
          startIndex,
          startIndex + ITEMS_PER_PAGE
        );
      } else {
        // --- LOGIC CŨ: Lấy tất cả (Server-side Pagination) ---
        const page = currentPage - 1;
        const response = await productService.getAllProducts({
          page,
          size: ITEMS_PER_PAGE,
          categoryId: filterCategory,
          stockStatus: filterStock,
        });
        productsData = response?.content || [];
        totalP = response?.totalPages || 0;
        totalE = response?.totalElements || 0;
      }

      // Map dữ liệu để hiển thị
      const formattedProducts = productsData.map((p) => ({
        ...p,
        sanPhamId: p.sanPhamId,
        tenSanPham: p.tenSanPham,
        gia: p.gia || 0,
        soLuongTonKho: p.soLuongTonKho || 0,
        categoryName: p.tenDanhMuc || "Chưa phân loại",
        hinhAnh: p.hinhAnh,
      }));

      setProducts(formattedProducts);
      setTotalPages(totalP);
      setTotalElements(totalE);
    } catch (error) {
      console.error("Lỗi tải dữ liệu sản phẩm:", error);
      toast.error("Không thể tải dữ liệu sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, filterCategory, filterStock]);

  // Effect riêng để tính toán các chỉ số trên toàn bộ sản phẩm (không theo trang)
  useEffect(() => {
    const fetchInventoryStats = async () => {
      // Để tính toán chính xác các chỉ số như "Giá trị tồn kho" và "Sắp hết hàng",
      // chúng ta cần lấy TOÀN BỘ danh sách sản phẩm khớp với bộ lọc hiện tại,
      // không chỉ giới hạn ở trang đang xem.
      // Lưu ý: Cách làm này có thể không hiệu quả nếu có hàng nghìn sản phẩm.
      // Giải pháp tối ưu hơn là tạo một API endpoint riêng để trả về các chỉ số này.
      try {
        const term = searchTerm ? searchTerm.trim() : "";
        let allProductsForStats = [];

        if (term) {
          // Khi tìm kiếm, API searchGlobal đã trả về tất cả kết quả
          const data = await productService.searchGlobal(term);
          allProductsForStats = data.sanPhams || [];
        } else {
          // Khi lọc, chúng ta gọi API với size lớn để lấy tất cả sản phẩm
          const response = await productService.getAllProducts({
            page: 0,
            size: 100000, // Lấy tối đa 100,000 sản phẩm để tính toán
            categoryId: filterCategory,
            stockStatus: filterStock,
          });
          allProductsForStats = response?.content || [];
        }

        const lowStock = allProductsForStats.filter(
          (p) => (p.soLuongTonKho || 0) < 10
        ).length;
        const totalValue = allProductsForStats.reduce(
          (total, p) => total + (p.gia || 0) * (p.soLuongTonKho || 0),
          0
        );

        setInventoryStats({
          lowStockCount: lowStock,
          inventoryValue: totalValue,
        });
      } catch (error) {
        console.error("Lỗi tải dữ liệu thống kê tồn kho:", error);
        setInventoryStats({ lowStockCount: "Lỗi", inventoryValue: 0 });
      }
    };

    fetchInventoryStats();
  }, [searchTerm, filterCategory, filterStock]); // Chạy lại khi bộ lọc thay đổi

  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
    setIsConfirmDeleteModalOpen(false);
  };

  useEscapeKey(
    handleCloseModals,
    isModalOpen || isDetailModalOpen || isConfirmDeleteModalOpen
  );

  // --- Handlers ---
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      tenSanPham: "",
      moTaChiTiet: "",
      gia: 0,
      soLuongTonKho: 0,
      hinhAnh: "",
      danhMucId:
        categories.length > 0
          ? categories[0].id || categories[0].danhMucId
          : "",
    });
    setProductImageFile(null);
    setIsModalOpen(true);
  };

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
    delete productData.hinhAnh;

    const jsonBlob = new Blob([JSON.stringify(productData)], {
      type: "application/json",
    });
    formDataPayload.append("sanPham", jsonBlob);

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
      fetchProducts();
    } catch (error) {
      console.error("Lỗi lưu sản phẩm:", error);
      toast.error("Thao tác thất bại!");
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const data = await productService.getProductById(id);
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

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // --- Derived Data ---
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

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
      value: inventoryStats.lowStockCount,
      icon: "production_quantity_limits",
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-500",
    },
    {
      title: "Giá trị tồn kho",
      value: formatCurrency(inventoryStats.inventoryValue),
      icon: "monetization_on",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
  ];

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Sản phẩm
        </p>
      </div>

      <ProductStats stats={stats} />

      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStock={filterStock}
        setFilterStock={setFilterStock}
        categories={categories}
        setCurrentPage={setCurrentPage}
        onOpenAddModal={handleOpenAddModal}
        placeholder="Tìm tên SP, mã SP..."
      />

      <ProductTable
        loading={loading}
        products={products}
        totalElements={totalElements}
        totalPages={totalPages}
        currentPage={currentPage}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        indexOfFirstItem={indexOfFirstItem}
        onPageChange={handlePageChange}
        onViewDetail={handleViewDetail}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteClick}
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModals}
        product={selectedProduct}
      />

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModals}
        isEditing={!!editingId}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        productImageFile={productImageFile}
        setProductImageFile={setProductImageFile}
        onSave={handleSave}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default AdminProducts;
