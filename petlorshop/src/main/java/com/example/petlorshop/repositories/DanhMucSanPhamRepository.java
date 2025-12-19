package com.example.petlorshop.repositories;

import com.example.petlorshop.models.DanhMucSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DanhMucSanPhamRepository extends JpaRepository<DanhMucSanPham, Integer> {
    @Query("SELECT d FROM DanhMucSanPham d WHERE LOWER(d.tenDanhMuc) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(d.moTa) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<DanhMucSanPham> searchByKeyword(@Param("keyword") String keyword);
}
