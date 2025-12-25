import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatDate,
  PostStatusBadge,
  getImageUrl,
} from "../../../components/utils";
import useEscapeKey from "../../../../../hooks/useEscapeKey";

const PostDetailModal = ({ isOpen, onClose, post }) => {
  useEscapeKey(onClose, isOpen);

  const [imgSrc, setImgSrc] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isOpen && post && post.anhBia) {
      setImgSrc(getFullImageUrl(post.anhBia));
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

  return (
    <AnimatePresence>
      {isOpen && post && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-8"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col font-body border border-white/10"
          >
            {/* --- PHẦN ẢNH BÌA (Đã sửa) --- */}
            {/* Giữ chiều cao lớn để hiển thị rõ nội dung */}
            <div className="relative h-96 lg:h-[500px] shrink-0 bg-gray-100">
              <img
                src={finalSrc}
                onError={handleError}
                // object-cover: Phủ kín khung, cắt phần thừa, KHÔNG méo, KHÔNG lặp
                // Bỏ hoàn toàn các class hover/transition/scale
                className="w-full h-full object-cover object-center"
                alt={post.tieuDe}
              />

              {/* Gradient để làm nổi chữ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Nút đóng */}
              <div className="absolute top-6 right-6 z-20">
                <button
                  onClick={onClose}
                  className="bg-black/30 backdrop-blur-md border border-white/20 p-2.5 rounded-full text-white hover:bg-white hover:text-black transition-colors duration-200 shadow-lg"
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
                </button>
              </div>

              {/* Thông tin bài viết đè lên ảnh */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10">
                <div className="flex flex-wrap items-center gap-3 mb-4 text-white/80 text-sm font-medium tracking-wide uppercase">
                  <span className="bg-primary/90 text-white px-3 py-1 rounded-md backdrop-blur-md shadow-sm">
                    {post.tenDanhMuc || "General"}
                  </span>
                  <span className="text-white/50">•</span>
                  <span>{formatDate(post.ngayDang)}</span>
                </div>

                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg font-display">
                  {post.tieuDe}
                </h2>

                <div className="flex items-center gap-3 text-white/90 text-base">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/70 font-light">
                      Tác giả
                    </span>
                    <strong className="text-white">
                      {post.tenTacGia || "Admin"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* --- PHẦN NỘI DUNG BÀI VIẾT --- */}
            <div className="flex-1 overflow-y-auto bg-white p-8 md:p-12 custom-scrollbar">
              <div className="max-w-4xl mx-auto">
                {/* Meta bar */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
                  <div className="flex items-center gap-4">
                    {PostStatusBadge(post.trangThai)}
                    <span className="text-gray-400 text-sm italic">
                      /{post.slug}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      title="Share"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        share
                      </span>
                    </button>
                    <button
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      title="Bookmark"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        bookmark_border
                      </span>
                    </button>
                  </div>
                </div>

                {/* Nội dung HTML */}
                <div className="prose prose-lg md:prose-xl prose-slate max-w-none text-gray-700 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                  <div dangerouslySetInnerHTML={{ __html: post.noiDung }} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostDetailModal;
