import React, { useEffect, useState } from "react";
import petService from "../../services/petService"; // Dùng chung service với Pet

// Helper: Format tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const AdminServices = () => {
  // 1. State
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    tenDichVu: "",
    moTa: "",
    giaDichVu: 0,
    thoiLuongUocTinhPhut: 30,
    danhMucDvId: "",
    roleCanThucHien: "SPA",
  });
  const [serviceCategories, setServiceCategories] = useState([]);

  // 2. Fetch Data
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await petService.getAllServices();

      // Map dữ liệu
      const formattedData = Array.isArray(response)
        ? response.map((svc) => ({
            ...svc,
            dichVuId: svc.id || svc.dichVuId,
            tenDichVu: svc.tenDichVu || "Chưa đặt tên",
            moTa: svc.moTa || "Không có mô tả",
            giaDichVu: svc.giaDichVu || svc.gia || 0,
            thoiLuongUocTinhPhut: svc.thoiLuongUocTinhPhut || 0, // Phút
            trangThai: svc.trangThai || "Hoạt động",
          }))
        : [];

      setServices(formattedData);

      // Tự động trích xuất danh mục từ danh sách dịch vụ
      if (Array.isArray(response)) {
        const categoriesMap = new Map();
        response.forEach((service) => {
          if (service.danhMucDvId && service.tenDanhMucDv) {
            categoriesMap.set(service.danhMucDvId, {
              id: service.danhMucDvId,
              tenDanhMucDv: service.tenDanhMucDv,
            });
          }
        });
        setServiceCategories(Array.from(categoriesMap.values()));
      }
    } catch (error) {
      console.error("Lỗi tải dịch vụ:", error);
      alert("Không thể tải danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 3. Actions
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;
    try {
      await petService.deleteService(id);
      setServices((prev) => prev.filter((s) => s.dichVuId !== id));
      alert("Xóa thành công!");
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại! Có thể dịch vụ đã được sử dụng trong lịch hẹn.");
    }
  };

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

  const handleEditClick = (service) => {
    setEditingService({ ...service });
    setIsEditModalOpen(true);
  };

  const handleSaveService = async () => {
    if (!editingService) return;
    try {
      const payload = {
        tenDichVu: editingService.tenDichVu,
        moTa: editingService.moTa,
        giaDichVu: Number(editingService.giaDichVu),
        thoiLuongUocTinhPhut: Number(editingService.thoiLuongUocTinhPhut),
      };

      await petService.updateService(editingService.dichVuId, payload);

      setServices((prev) =>
        prev.map((s) =>
          s.dichVuId === editingService.dichVuId ? { ...s, ...payload } : s
        )
      );
      setIsEditModalOpen(false);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại.");
    }
  };

  const handleOpenCreateModal = () => {
    setNewService({
      tenDichVu: "",
      moTa: "",
      giaDichVu: 0,
      thoiLuongUocTinhPhut: 30,
      danhMucDvId: "",
      roleCanThucHien: "SPA",
    });
    setIsAddModalOpen(true);
  };

  const handleCreateService = async () => {
    if (
      !newService.tenDichVu ||
      !newService.giaDichVu ||
      !newService.danhMucDvId
    ) {
      alert("Vui lòng điền Tên dịch vụ, Giá và chọn Danh mục.");
      return;
    }

    try {
      const payload = {
        ...newService,
        giaDichVu: Number(newService.giaDichVu),
        thoiLuongUocTinhPhut: Number(newService.thoiLuongUocTinhPhut),
        danhMucDvId: Number(newService.danhMucDvId),
      };

      await petService.createService(payload);

      alert("Thêm dịch vụ thành công!");
      setIsAddModalOpen(false);
      fetchServices(); // Refresh list
    } catch (error) {
      console.error("Lỗi tạo dịch vụ:", error);
      alert("Thêm dịch vụ thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  // 4. Filter Logic
  const filteredServices = services.filter(
    (svc) =>
      svc.tenDichVu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      svc.moTa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 5. Stats Calculation
  const totalServices = services.length;
  // Tính giá trung bình các dịch vụ
  const avgPrice =
    totalServices > 0
      ? services.reduce((sum, s) => sum + s.giaDichVu, 0) / totalServices
      : 0;

  // Tìm dịch vụ có giá cao nhất
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
      icon: "star", // Có thể thay bằng icon khác
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

  if (loading)
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
                placeholder="Tìm tên dịch vụ, mô tả..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {/* Buttons */}
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

      {/* Data Table */}
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
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => (
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

                    {/* Mô tả (Truncate) */}
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

                    {/* Actions */}
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
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Chưa có dịch vụ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
              <div className="grid grid-cols-2 gap-4">
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
                      <option key={cat.id} value={cat.id}>
                        {cat.tenDanhMucDv}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role thực hiện
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={newService.roleCanThucHien}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        roleCanThucHien: e.target.value,
                      })
                    }
                  >
                    <option value="SPA">Spa</option>
                    <option value="DOCTOR">Bác sĩ</option>
                    <option value="STAFF">Nhân viên</option>
                  </select>
                </div>
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
