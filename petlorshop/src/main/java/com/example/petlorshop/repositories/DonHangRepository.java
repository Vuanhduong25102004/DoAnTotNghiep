package com.example.petlorshop.repositories;

import com.example.petlorshop.models.DonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Integer> {
    @Query("SELECT d FROM DonHang d WHERE LOWER(d.trangThaiDonHang) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(d.diaChiGiaoHang) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<DonHang> searchByKeyword(@Param("keyword") String keyword);
}
