package com.example.petlorshop.repositories;

import com.example.petlorshop.models.SanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {
    
    // Global Search (List) - Chỉ tìm theo tên
    @Query("SELECT s FROM SanPham s WHERE LOWER(s.tenSanPham) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<SanPham> searchByKeyword(@Param("keyword") String keyword);

    // Page Search - Chỉ tìm theo tên
    Page<SanPham> findByTenSanPhamContainingIgnoreCase(String tenSanPham, Pageable pageable);

    // Filter by Category
    Page<SanPham> findByDanhMucSanPham_DanhMucId(Integer danhMucId, Pageable pageable);

    // Search by Name AND Category
    Page<SanPham> findByTenSanPhamContainingIgnoreCaseAndDanhMucSanPham_DanhMucId(String tenSanPham, Integer danhMucId, Pageable pageable);
}
