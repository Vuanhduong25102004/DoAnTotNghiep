package com.example.petlorshop.repositories;

import com.example.petlorshop.models.BaiViet;
import com.example.petlorshop.models.DanhMucBaiViet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BaiVietRepository extends JpaRepository<BaiViet, Integer> {
    Optional<BaiViet> findBySlug(String slug);
    List<BaiViet> findByTrangThai(BaiViet.TrangThaiBaiViet trangThai);
    List<BaiViet> findByDanhMucBaiViet(DanhMucBaiViet danhMucBaiViet);

    // Tìm bài viết liên quan: Cùng danh mục, khác ID hiện tại, trạng thái công khai, giới hạn 5 bài
    @Query("SELECT bv FROM BaiViet bv WHERE bv.danhMucBaiViet.danhMucBvId = :danhMucId AND bv.baiVietId <> :currentId AND bv.trangThai = 'CONG_KHAI' ORDER BY bv.ngayDang DESC LIMIT 5")
    List<BaiViet> findRelatedPosts(@Param("danhMucId") Integer danhMucId, @Param("currentId") Integer currentId);
}
