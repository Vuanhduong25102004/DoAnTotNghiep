package com.example.petlorshop.repositories;

import com.example.petlorshop.models.DanhMucDichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DanhMucDichVuRepository extends JpaRepository<DanhMucDichVu, Integer> {
    @Query("SELECT d FROM DanhMucDichVu d WHERE LOWER(d.tenDanhMucDv) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<DanhMucDichVu> searchByKeyword(@Param("keyword") String keyword);
}
