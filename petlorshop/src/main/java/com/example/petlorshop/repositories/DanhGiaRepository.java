package com.example.petlorshop.repositories;

import com.example.petlorshop.models.DanhGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia, Integer> {
    List<DanhGia> findBySanPham_SanPhamId(Integer sanPhamId);
    Page<DanhGia> findBySanPham_SanPhamId(Integer sanPhamId, Pageable pageable);
    
    // Lấy tất cả đánh giá của một đơn hàng
    List<DanhGia> findByDonHang_DonHangId(Integer donHangId);
    
    // Kiểm tra đánh giá sản phẩm
    boolean existsByNguoiDung_UserIdAndSanPham_SanPhamIdAndDonHang_DonHangId(Integer userId, Integer sanPhamId, Integer donHangId);

    // Kiểm tra đánh giá đơn hàng (sanPhamId is null)
    boolean existsByNguoiDung_UserIdAndDonHang_DonHangIdAndSanPhamIsNull(Integer userId, Integer donHangId);
}
