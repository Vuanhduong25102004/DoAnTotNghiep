import React, { useState, useEffect } from "react";
import reviewService from "../../../services/reviewService";
import { toast } from "react-toastify";

// Components
import ReviewStats from "./components/ReviewStats";
import ReviewFilters from "./components/ReviewFilters";
import ReviewTable from "./components/ReviewTable";
import ReviewDetailModal from "./components/modals/ReviewDetailModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const AdminReviews = () => {
  // --- State ---
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    pendingReply: 0,
    hiddenCount: 0,
  });

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  // Selection
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewToDeleteId, setReviewToDeleteId] = useState(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("0");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // --- CẤU HÌNH SỐ LƯỢNG ITEM ---
  const ITEMS_PER_PAGE = 5; // Đã đổi thành 5 theo yêu cầu

  // --- Fetch Data ---
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
      };

      const response = await reviewService.getAllReviewsForAdmin(params);
      const rawContent = response.content || [];

      // --- Mapping Data (Flat to Nested) ---
      let mappedContent = rawContent.map((item) => {
        // Map Sản phẩm
        let sanPhamObj = null;
        if (item.sanPhamId) {
          sanPhamObj = {
            id: item.sanPhamId,
            tenSanPham: item.tenSanPham,
            hinhAnh: item.hinhAnhSanPham,
          };
        }

        // Map Dịch vụ
        let dichVuObj = null;
        if (item.dichVuId) {
          dichVuObj = {
            id: item.dichVuId,
            tenDichVu: item.tenDichVu,
            hinhAnh: item.hinhAnhDichVu,
          };
        }

        return {
          danhGiaId: item.danhGiaId,
          soSao: item.soSao,
          noiDung: item.noiDung,
          ngayTao: item.ngayDanhGia,
          trangThai: item.trangThai !== undefined ? item.trangThai : true,
          phanHoi: item.phanHoi || null,
          nguoiDung: {
            hoTen: item.tenNguoiDung,
            anhDaiDien: item.anhDaiDien,
            email: item.email || "",
          },
          sanPham: sanPhamObj,
          dichVu: dichVuObj,
        };
      });

      // --- Client-side Filtering ---
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        mappedContent = mappedContent.filter(
          (r) =>
            (r.nguoiDung?.hoTen || "").toLowerCase().includes(lowerTerm) ||
            (r.noiDung || "").toLowerCase().includes(lowerTerm) ||
            (r.sanPham?.tenSanPham || "").toLowerCase().includes(lowerTerm),
        );
      }

      if (ratingFilter !== "0") {
        mappedContent = mappedContent.filter(
          (r) => r.soSao === parseInt(ratingFilter),
        );
      }

      if (typeFilter === "PRODUCT") {
        mappedContent = mappedContent.filter((r) => r.sanPham !== null);
      } else if (typeFilter === "SERVICE") {
        mappedContent = mappedContent.filter((r) => r.dichVu !== null);
      }

      setReviews(mappedContent);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      calculateStats(mappedContent);
    } catch (error) {
      console.error("Fetch reviews error", error);
      toast.error("Lỗi tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) {
      setStats({ total: 0, avgRating: 0, pendingReply: 0, hiddenCount: 0 });
      return;
    }
    const total = data.length;
    const totalStars = data.reduce((acc, curr) => acc + curr.soSao, 0);
    const avgRating = total > 0 ? (totalStars / total).toFixed(1) : 0;
    const pendingReply = data.filter((r) => !r.phanHoi).length;
    const hiddenCount = data.filter((r) => !r.trangThai).length;

    setStats({ total, avgRating, pendingReply, hiddenCount });
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, ratingFilter, typeFilter]);

  // --- Handlers ---
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleToggleStatus = async (review) => {
    try {
      const newStatus = !review.trangThai;
      await reviewService.updateReviewStatus(review.danhGiaId, {
        trangThai: newStatus,
      });
      toast.success(`Đã ${newStatus ? "hiện" : "ẩn"} đánh giá`);
      fetchReviews();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleReplyReview = async (reviewId, replyContent) => {
    try {
      await reviewService.replyToReview(reviewId, { phanHoi: replyContent });

      toast.success("Gửi phản hồi thành công!");
      setIsDetailModalOpen(false);
      fetchReviews();
    } catch (error) {
      toast.error("Gửi phản hồi thất bại");
    }
  };

  const handleDeleteClick = (id) => {
    setReviewToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDeleteId) return;
    try {
      await reviewService.deleteReview(reviewToDeleteId);
      toast.success("Đã xóa đánh giá");
      fetchReviews();
    } catch (error) {
      toast.error("Xóa thất bại");
    } finally {
      setIsConfirmDeleteModalOpen(false);
      setReviewToDeleteId(null);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 mb-6">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">
          Quản lý Đánh giá
        </p>
      </div>

      <ReviewStats
        total={stats.total}
        avgRating={stats.avgRating}
        pendingReply={stats.pendingReply}
        hiddenCount={stats.hiddenCount}
      />

      <ReviewFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        setCurrentPage={setCurrentPage}
      />

      <ReviewTable
        loading={loading}
        reviews={reviews}
        totalElements={totalElements}
        totalPages={totalPages}
        currentPage={currentPage}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        indexOfFirstItem={(currentPage - 1) * ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
        onViewDetail={(item) => {
          setSelectedReview(item);
          setIsDetailModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteClick}
      />

      <ReviewDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        review={selectedReview}
        onReply={handleReplyReview}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa đánh giá?"
        message="Hành động này không thể hoàn tác."
      />
    </>
  );
};

export default AdminReviews;
