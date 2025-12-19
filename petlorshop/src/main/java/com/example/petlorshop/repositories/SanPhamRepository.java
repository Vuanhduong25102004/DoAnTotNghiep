package com.example.petlorshop.repositories;

import com.example.petlorshop.models.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {
    @Query("SELECT s FROM SanPham s WHERE LOWER(s.tenSanPham) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.moTaChiTiet) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<SanPham> searchByKeyword(@Param("keyword") String keyword);
}
