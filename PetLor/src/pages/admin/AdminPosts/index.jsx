import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useEscapeKey from "../../../hooks/useEscapeKey";
import postService from "../../../services/postService";

// Components
import PostStats from "./components/PostStats";
import PostFilters from "./components/PostFilters";
import PostTable from "./components/PostTable";
import PostDetailModal from "./components/modals/PostDetailModal";
import PostFormModal from "./components/modals/PostFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const AdminPosts = () => {
  // --- Quản lý State ---
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc & Phân trang (Đồng bộ hoàn toàn với AdminProducts)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ITEMS_PER_PAGE = 5; // Cố định 5 mục mỗi trang

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  // Dữ liệu lựa chọn
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [postToDeleteId, setPostToDeleteId] = useState(null);

  // State Thống kê (Tương tự inventoryStats)
  const [postStats, setPostStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
  });

  // --- 1. Logic lấy dữ liệu chính (Lõi phân trang) ---
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let postsData = [];
      let totalP = 0;
      let totalE = 0;

      const term = searchTerm ? searchTerm.trim() : "";

      if (term) {
        // TRƯỜNG HỢP 1: CÓ TÌM KIẾM (Client-side Slicing)
        // Gọi API search global để lấy toàn bộ kết quả phù hợp
        const data = await postService.searchGlobal(term);
        const allSearchResults = data.baiViets || [];

        totalE = allSearchResults.length;
        // Tính tổng số trang: $totalPages = \lceil totalElements / ITEMS\_PER\_PAGE \rceil$
        totalP = Math.ceil(totalE / ITEMS_PER_PAGE);

        // Tính vị trí bắt đầu: $startIndex = (currentPage - 1) \times ITEMS\_PER\_PAGE$
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        postsData = allSearchResults.slice(
          startIndex,
          startIndex + ITEMS_PER_PAGE,
        );
      } else {
        // TRƯỜNG HỢP 2: DANH SÁCH MẶC ĐỊNH (Server-side Pagination)
        const response = await postService.getAllPosts({
          page: currentPage - 1,
          size: ITEMS_PER_PAGE,
          status: statusFilter,
        });
        postsData = response?.content || [];
        totalP = response?.totalPages || 0;
        totalE = response?.totalElements || 0;
      }

      setPosts(postsData);
      setTotalPages(totalP);
      setTotalElements(totalE);
    } catch (error) {
      console.error("Lỗi tải bài viết:", error);
      toast.error("Không thể tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Logic Thống kê (Dựa trên toàn bộ dữ liệu) ---
  const fetchPostStats = async () => {
    try {
      const term = searchTerm ? searchTerm.trim() : "";
      let allForStats = [];

      if (term) {
        const data = await postService.searchGlobal(term);
        allForStats = data.baiViets || [];
      } else {
        const response = await postService.getAllPosts({
          page: 0,
          size: 1000, // Lấy số lượng lớn để đếm
          status: statusFilter,
        });
        allForStats = response?.content || [];
      }

      setPostStats({
        total: allForStats.length,
        published: allForStats.filter((p) => p.trangThai === "CONG_KHAI")
          .length,
        draft: allForStats.filter((p) => p.trangThai === "NHAP").length,
      });
    } catch (error) {
      console.error("Lỗi thống kê:", error);
    }
  };

  // --- 3. Effects ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await postService.getAllPostCategories();
        setCategories(Array.isArray(res) ? res : res?.content || []);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchPostStats();
  }, [searchTerm, statusFilter]);

  // Thoát Modal bằng phím Esc
  useEscapeKey(
    () => {
      setIsFormModalOpen(false);
      setIsDetailModalOpen(false);
      setIsConfirmDeleteModalOpen(false);
    },
    isFormModalOpen || isDetailModalOpen || isConfirmDeleteModalOpen,
  );

  // --- 4. Handlers ---
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const confirmDelete = async () => {
    try {
      await postService.deletePost(postToDeleteId);
      toast.success("Xóa thành công!");
      fetchPosts();
    } catch (error) {
      toast.error("Xóa thất bại!");
    } finally {
      setIsConfirmDeleteModalOpen(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPost) {
        await postService.updatePost(editingPost.baiVietId, formData);
        toast.success("Cập nhật thành công!");
      } else {
        await postService.createPost(formData);
        toast.success("Tạo mới thành công!");
      }
      setIsFormModalOpen(false);
      fetchPosts();
    } catch (error) {
      toast.error("Thao tác thất bại.");
    }
  };

  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;

  const stats = [
    {
      title: "Tổng bài viết",
      value: postStats.total,
      icon: "article",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Công khai",
      value: postStats.published,
      icon: "visibility",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Bản nháp",
      value: postStats.draft,
      icon: "edit_document",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Quản lý Tin tức
        </p>
      </div>

      <PostStats stats={stats} />

      <PostFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setCurrentPage={setCurrentPage}
        onOpenAddModal={() => {
          setEditingPost(null);
          setIsFormModalOpen(true);
        }}
      />

      <PostTable
        loading={loading}
        posts={posts}
        totalElements={totalElements}
        totalPages={totalPages}
        currentPage={currentPage}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        indexOfFirstItem={indexOfFirstItem}
        onPageChange={handlePageChange}
        onViewDetail={(post) => {
          setSelectedPost(post);
          setIsDetailModalOpen(true);
        }}
        onEdit={(post) => {
          setEditingPost(post);
          setIsFormModalOpen(true);
        }}
        onDelete={(id) => {
          setPostToDeleteId(id);
          setIsConfirmDeleteModalOpen(true);
        }}
      />

      <PostDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        post={selectedPost}
      />

      <PostFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={editingPost}
        categories={categories}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default AdminPosts;
