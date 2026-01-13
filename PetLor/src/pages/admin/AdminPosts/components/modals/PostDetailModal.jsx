import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatDate,
  PostStatusBadge, // Đã fix theo yêu cầu: Dùng Component
  getImageUrl,
} from "../../../components/utils";
import useEscapeKey from "../../../../../hooks/useEscapeKey";

const PostDetailModal = ({ isOpen, onClose, post }) => {
  useEscapeKey(onClose, isOpen);

  const [imgSrc, setImgSrc] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isOpen && post && post.anhBia) {
      setImgSrc(getImageUrl(post.anhBia));
      setIsError(false);
    } else {
      setImgSrc("");
      if (!post?.anhBia) setIsError(true);
    }
  }, [isOpen, post]);

  const handleError = () => {
    if (!isError) {
      setIsError(true);
      setImgSrc("https://via.placeholder.com/1200x800?text=No+Image");
    }
  };

  const finalSrc =
    isError || !imgSrc
      ? "https://via.placeholder.com/1200x800?text=No+Image"
      : imgSrc;

  // Style constants
  const labelClass =
    "text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block";
  const valueBoxClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium";

  return (
    <AnimatePresence>
      {isOpen && post && (
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
            className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-primary border border-teal-100/50">
                  <span className="material-symbols-outlined text-3xl">
                    article
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Chi tiết Bài viết
                  </h2>
                  <p className="text-sm text-slate-500">
                    Xem nội dung và thông tin bài đăng
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
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              {/* Ảnh bìa */}
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 border border-slate-100 shadow-sm relative group">
                <img
                  src={finalSrc}
                  onError={handleError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={post.tieuDe}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="bg-primary px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                    {post.tenDanhMuc || "General"}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight text-shadow-sm">
                    {post.tieuDe}
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cột trái: Thông tin Meta */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <div>
                      <label className={labelClass}>Tác giả</label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined">
                            person
                          </span>
                        </div>
                        <span className="font-bold text-slate-800">
                          {post.tenTacGia || "Admin"}
                        </span>
                      </div>
                    </div>
                    <div className="h-px bg-slate-200 w-full"></div>
                    <div>
                      <label className={labelClass}>Ngày đăng</label>
                      <div className="text-slate-700 font-medium">
                        {formatDate(post.ngayDang)}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Trạng thái</label>
                      <div>
                        <PostStatusBadge status={post.trangThai} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Slug</label>
                      <div className="text-xs text-slate-500 font-mono break-all">
                        /{post.slug}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cột phải: Nội dung bài viết */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">
                      description
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Nội dung
                    </h3>
                  </div>
                  <div className="prose prose-slate max-w-none p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div dangerouslySetInnerHTML={{ __html: post.noiDung }} />
                  </div>
                </div>
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="px-8 py-6 border-t border-slate-100 flex justify-end bg-slate-50/30 shrink-0">
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors bg-white border border-slate-200 shadow-sm"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostDetailModal;
