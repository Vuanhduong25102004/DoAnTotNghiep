/**
 * @file AdminServices.jsx
 * @description Trang quản lý các dịch vụ của cửa hàng (Grooming, Spa, Khám bệnh,...).
 * Cho phép xem, tìm kiếm, tạo, cập nhật và xóa dịch vụ.
 */
import React, { useEffect, useState } from "react";
import petService from "../../services/petService"; // Dùng chung service với Pet

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
 * Xử lý URL hình ảnh để hiển thị, bao gồm cả fallback.
 * @param {string} imagePath - Đường dẫn tương đối của ảnh.
 * @param {string} [fallbackText="Service"] - Chữ hiển thị trên ảnh placeholder.
 * @returns {string} - URL đầy đủ của ảnh hoặc URL placeholder.
 */
const getImageUrl = (imagePath, fallbackText = "Service") => {
  if (!imagePath) return `https://placehold.co/100x100?text=${fallbackText}`;
  if (imagePath.startsWith("http")) return imagePath;
  return `http://localhost:8080/uploads/${imagePath}`;
};

const AdminServices = () => {
  // --- 1. State Management (Quản lý Trạng thái) ---

  // State lưu trữ dữ liệu chính và trạng thái tải
  const [services, setServices] = useState([]); // Danh sách dịch vụ
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [serviceCategories, setServiceCategories] = useState([]); // Danh sách danh mục dịch vụ

  // State cho các form (Thêm/Sửa)
  const [newService, setNewService] = useState({
    tenDichVu: "",
    moTa: "",
    giaDichVu: 0,
    thoiLuongUocTinhPhut: 30,
    danhMucDvId: "",
    hinhAnh: "",
  });
  const [editingService, setEditingService] = useState(null); // Dịch vụ đang được chỉnh sửa
  const [serviceImageFile, setServiceImageFile] = useState(null); // File ảnh cho form

  // State cho việc xem chi tiết
  const [selectedService, setSelectedService] = useState(null); // Dịch vụ được chọn để xem chi tiết

  // State cho bộ lọc và phân trang
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [totalElements, setTotalElements] = useState(0); // Tổng số dịch vụ
  const ITEMS_PER_PAGE = 5; // Số mục trên mỗi trang

  // State quản lý hiển thị Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Mở/đóng modal thêm mới
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Mở/đóng modal chỉnh sửa
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Mở/đóng modal chi tiết

  // --- 2. Data Fetching (Lấy Dữ liệu từ API) ---

  /**
   * Lấy danh sách dịch vụ từ API dựa trên các tham số phân trang và tìm kiếm.
   */
  const fetchServices = async () => {
    setLoading(true);
    try {
      const page = currentPage - 1; // API sử dụng trang bắt đầu từ 0
      const response = await petService.getAllServices({
        page,
        size: ITEMS_PER_PAGE,
        search: searchTerm,
      });

      const servicesData = response?.content || [];
      // Chuẩn hóa dữ liệu từ API để đảm bảo tính nhất quán trong component
      const formattedData = servicesData.map((svc) => ({
        ...svc,
        dichVuId: svc.id || svc.dichVuId,
        tenDichVu: svc.tenDichVu || "Chưa đặt tên",
        moTa: svc.moTa || "Không có mô tả",
        giaDichVu: svc.giaDichVu || svc.gia || 0,
        thoiLuongUocTinhPhut: svc.thoiLuongUocTinhPhut || 0, // Phút
        trangThai: svc.trangThai || "Hoạt động",
        hinhAnh: svc.hinhAnh,
        // API trả về `tenDanhMucDv` nên không cần map lại
      }));

      setServices(formattedData);
      setTotalPages(response?.totalPages || 0);
      setTotalElements(response?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi tải dịch vụ:", error);
      alert("Không thể tải danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  // Effect: Lấy danh sách danh mục dịch vụ một lần khi component được mount.
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        // Giải pháp tạm thời: Lấy một trang lớn các dịch vụ để trích xuất ra các danh mục duy nhất.
        // Điều này là cần thiết vì không có API endpoint riêng để lấy danh mục dịch vụ (ví dụ: /api/danh-muc-dich-vu).
        // Lý tưởng nhất, backend nên cung cấp một endpoint như vậy.
        const response = await petService.getAllServices({
          page: 0,
          size: 200,
        });
        const allServices = response?.content || [];

        const categoriesMap = new Map();
        allServices.forEach((service) => {
          if (service.danhMucDvId && service.tenDanhMucDv) {
            categoriesMap.set(service.danhMucDvId, {
              id: service.danhMucDvId,
              danhMucDvId: service.danhMucDvId, // Để nhất quán
              tenDanhMucDv: service.tenDanhMucDv,
            });
          }
        });
        setServiceCategories(Array.from(categoriesMap.values()));
      } catch (error) {
        console.error("Lỗi tải danh mục dịch vụ:", error);
        alert(
          "Không thể tải danh sách danh mục dịch vụ. Chức năng Thêm/Sửa có thể không hoạt động đúng."
        );
      }
    };
    fetchServiceCategories();
  }, []); // Mảng rỗng đảm bảo effect chỉ chạy một lần.

  // Effect: Tải lại danh sách dịch vụ mỗi khi trang hoặc từ khóa tìm kiếm thay đổi.
  useEffect(() => {
    fetchServices();
  }, [currentPage, searchTerm]);

  // --- 3. Event Handlers (Hàm Xử lý Sự kiện) ---

  /**
   * Mở modal để thêm dịch vụ mới và reset form.
   */
  const handleOpenCreateModal = () => {
    setNewService({
      tenDichVu: "",
      moTa: "",
      giaDichVu: 0,
      thoiLuongUocTinhPhut: 30,
      danhMucDvId: "",
      hinhAnh: "",
    });
    setServiceImageFile(null);
    setIsAddModalOpen(true);
  };

  /**
   * Mở modal để chỉnh sửa một dịch vụ đã có.
   * @param {object} service - Đối tượng dịch vụ được chọn.
   */
  const handleEditClick = (service) => {
    setEditingService({ ...service });
    setServiceImageFile(null);
    setIsEditModalOpen(true);
  };

  /**
   * Mở modal và tải chi tiết dịch vụ để xem.
   * @param {number} id - ID của dịch vụ cần xem.
   */
  const handleViewDetail = async (id) => {
    try {
      const data = await petService.getServiceById(id);
      setSelectedService(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi tải chi tiết dịch vụ:", error);
      alert("Không thể tải chi tiết dịch vụ.");
    }
  };

  /**
   * Gửi yêu cầu tạo dịch vụ mới lên server.
   */
  const handleCreateService = async () => {
    if (
      !newService.tenDichVu ||
      !newService.giaDichVu ||
      !newService.danhMucDvId
    ) {
      alert("Vui lòng điền Tên dịch vụ, Giá và chọn Danh mục.");
      return;
    }

    const formData = new FormData();
    const serviceData = {
      ...newService,
      giaDichVu: Number(newService.giaDichVu),
      thoiLuongUocTinhPhut: Number(newService.thoiLuongUocTinhPhut),
      danhMucDvId: Number(newService.danhMucDvId),
    };
    delete serviceData.hinhAnh; // Xóa trường text `hinhAnh` không cần thiết

    // Gửi dữ liệu dịch vụ dưới dạng một chuỗi JSON với key 'dichVu'
    formData.append("dichVu", JSON.stringify(serviceData));

    // Gửi file ảnh (nếu có) với key 'hinhAnh' để khớp với yêu cầu của backend
    if (serviceImageFile) {
      formData.append("hinhAnh", serviceImageFile);
    }

    try {
      await petService.createService(formData);
      alert("Thêm dịch vụ thành công!");
      setIsAddModalOpen(false);
      setServiceImageFile(null);
      fetchServices(); // Tải lại danh sách để hiển thị dịch vụ mới
    } catch (error) {
      console.error("Lỗi tạo dịch vụ:", error);
      alert("Thêm dịch vụ thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  /**
   * Gửi yêu cầu cập nhật dịch vụ lên server.
   */
  const handleSaveService = async () => {
    if (!editingService) return;

    const formData = new FormData();
    const serviceData = {
      tenDichVu: editingService.tenDichVu,
      moTa: editingService.moTa,
      giaDichVu: Number(editingService.giaDichVu),
      thoiLuongUocTinhPhut: Number(editingService.thoiLuongUocTinhPhut),
      danhMucDvId: Number(editingService.danhMucDvId),
    };

    // Gửi dữ liệu dịch vụ dưới dạng một chuỗi JSON với key 'dichVu'
    formData.append("dichVu", JSON.stringify(serviceData));

    // Gửi file ảnh (nếu có) với key 'hinhAnh' để khớp với yêu cầu của backend
    if (serviceImageFile) {
      formData.append("hinhAnh", serviceImageFile);
    }

    try {
      await petService.updateService(editingService.dichVuId, formData);
      alert("Cập nhật thành công!");
      setIsEditModalOpen(false);
      setServiceImageFile(null);
      fetchServices(); // Tải lại danh sách để hiển thị thay đổi
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại.");
    }
  };

  /**
   * Xử lý sự kiện xóa một dịch vụ.
   * @param {number} id - ID của dịch vụ cần xóa.
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;
    try {
      await petService.deleteService(id);
      alert("Xóa thành công!");
      fetchServices(); // Tải lại danh sách
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại! Có thể dịch vụ đã được sử dụng trong lịch hẹn.");
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

  // Tính toán index của item đầu tiên trên trang để hiển thị thông tin phân trang
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  // Lưu ý: Các chỉ số thống kê bên dưới chỉ được tính cho các dịch vụ trên trang hiện tại.
  // Để có số liệu toàn bộ, backend cần cung cấp API riêng cho thống kê.
  const totalServices = totalElements;
  // Tính giá trung bình các dịch vụ
  const avgPrice =
    services.length > 0
      ? services.reduce((sum, s) => sum + s.giaDichVu, 0) / services.length
      : 0;

  // Tìm dịch vụ có giá cao nhất trên trang hiện tại
  const expensiveService =
    services.length > 0
      ? services.reduce((prev, current) =>
          prev.giaDichVu > current.giaDichVu ? prev : current
        )
      : { tenDichVu: "---" };

  const stats = [
    {
      title: "Tổng dịch vụ",
      value: totalServices,
      icon: "medical_services",
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-600",
    },
    {
      title: "Dịch vụ giá cao nhất",
      value: expensiveService.tenDichVu,
      icon: "star",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      border: "border-yellow-500",
    },
    {
      title: "Giá trung bình",
      value: formatCurrency(avgPrice),
      icon: "attach_money",
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
  ];

  // --- 5. UI Rendering (Kết xuất Giao diện) ---

  // Hiển thị trạng thái tải lần đầu tiên
  if (loading && services.length === 0)
    return (
      <div className="p-10 text-center">Đang tải danh sách dịch vụ...</div>
    );

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Dịch vụ
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
                      <div
                        className="text-lg font-bold text-gray-900 truncate"
                        title={String(stat.value)}
                      >
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
                placeholder="Tìm tên dịch vụ, mô tả..."
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          {/* Nút thêm mới */}
          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-600 focus:outline-none"
              type="button"
              onClick={handleOpenCreateModal}
            >
              <span className="material-symbols-outlined text-sm mr-2">
                add
              </span>{" "}
              Thêm Dịch vụ
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên Dịch Vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời lượng (Phút)
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    Đang tải...
                  </td>
                </tr>
              )}
              {!loading && services.length > 0
                ? services.map((service, index) => (
                    <tr
                      key={service.dichVuId || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{service.dichVuId}
                      </td>

                      {/* Tên */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.tenDichVu}
                      </td>

                      {/* Danh mục */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.tenDanhMucDv || "Chưa phân loại"}
                      </td>

                      {/* Hình ảnh */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.hinhAnh ? (
                          <img
                            src={getImageUrl(service.hinhAnh)}
                            alt={service.tenDichVu}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-400">
                              image
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Mô tả (cắt ngắn) */}
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[300px] truncate"
                        title={service.moTa}
                      >
                        {service.moTa}
                      </td>

                      {/* Giá */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(service.giaDichVu)}
                      </td>

                      {/* Thời lượng */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.thoiLuongUocTinhPhut > 0
                          ? `${service.thoiLuongUocTinhPhut} phút`
                          : "---"}
                      </td>

                      {/* Các nút hành động */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            title="Xem chi tiết"
                            onClick={() => handleViewDetail(service.dichVuId)}
                          >
                            <span className="material-symbols-outlined text-base">
                              visibility
                            </span>
                          </button>
                          <button
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            title="Chỉnh sửa"
                            onClick={() => handleEditClick(service)}
                          >
                            <span className="material-symbols-outlined text-base">
                              edit_note
                            </span>
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Xóa"
                            onClick={() => handleDelete(service.dichVuId)}
                          >
                            <span className="material-symbols-outlined text-base">
                              cancel
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Không tìm thấy dịch vụ nào phù hợp.
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
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
                  {indexOfFirstItem + services.length}
                </span>{" "}
                trong số <span className="font-medium">{totalElements}</span>{" "}
                kết quả
              </p>
            </div>
            {totalPages > 1 && (
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
            )}
          </div>
        </div>
      </div>

      {/* Modal Chỉnh sửa Dịch vụ */}
      {isEditModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chỉnh sửa Dịch vụ #{editingService.dichVuId}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên dịch vụ
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingService.tenDichVu || ""}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      tenDichVu: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingService.moTa || ""}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      moTa: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hình ảnh
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  <img
                    src={
                      serviceImageFile
                        ? URL.createObjectURL(serviceImageFile)
                        : getImageUrl(editingService.hinhAnh)
                    }
                    alt="Service"
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    onChange={(e) => setServiceImageFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giá dịch vụ (VNĐ)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={editingService.giaDichVu || 0}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        giaDichVu: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thời lượng (Phút)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={editingService.thoiLuongUocTinhPhut || 0}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        thoiLuongUocTinhPhut: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Danh mục
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={editingService.danhMucDvId || ""}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      danhMucDvId: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    -- Chọn danh mục --
                  </option>
                  {serviceCategories.map((cat) => (
                    <option
                      key={cat.id || cat.danhMucDvId}
                      value={cat.id || cat.danhMucDvId}
                    >
                      {cat.tenDanhMucDv}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveService}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 font-medium"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi tiết Dịch vụ */}
      {isDetailModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Chi tiết Dịch vụ #{selectedService.dichVuId}
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Tên dịch vụ</p>
                <p className="font-medium text-gray-900">
                  {selectedService.tenDichVu}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mô tả</p>
                <p className="text-gray-900">{selectedService.moTa}</p>
              </div>
              {selectedService.hinhAnh && (
                <div>
                  <p className="text-sm text-gray-500">Hình ảnh</p>
                  <img
                    src={getImageUrl(selectedService.hinhAnh)}
                    alt={selectedService.tenDichVu}
                    className="mt-2 rounded-lg max-w-xs h-auto shadow-md"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Giá dịch vụ</p>
                  <p className="font-bold text-primary">
                    {formatCurrency(selectedService.giaDichVu)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời lượng</p>
                  <p className="font-medium text-gray-900">
                    {selectedService.thoiLuongUocTinhPhut} phút
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm mới Dịch vụ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Thêm Dịch vụ mới
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên dịch vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newService.tenDichVu}
                  onChange={(e) =>
                    setNewService({ ...newService, tenDichVu: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newService.moTa}
                  onChange={(e) =>
                    setNewService({ ...newService, moTa: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hình ảnh
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  <img
                    src={
                      serviceImageFile
                        ? URL.createObjectURL(serviceImageFile)
                        : "https://placehold.co/100x100?text=Service"
                    }
                    alt="Service Preview"
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    onChange={(e) => setServiceImageFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giá dịch vụ (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={newService.giaDichVu}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        giaDichVu: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thời lượng (Phút)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={newService.thoiLuongUocTinhPhut}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        thoiLuongUocTinhPhut: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={newService.danhMucDvId}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      danhMucDvId: e.target.value,
                    })
                  }
                >
                  <option value="">-- Chọn danh mục --</option>
                  {serviceCategories.map((cat) => (
                    <option
                      key={cat.id || cat.danhMucDvId}
                      value={cat.id || cat.danhMucDvId}
                    >
                      {cat.tenDanhMucDv}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateService}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-600 font-medium"
              >
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminServices;
