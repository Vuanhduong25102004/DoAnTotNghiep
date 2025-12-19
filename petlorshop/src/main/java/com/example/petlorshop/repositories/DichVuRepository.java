package com.example.petlorshop.repositories;

import com.example.petlorshop.models.DichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DichVuRepository extends JpaRepository<DichVu, Integer> {
    @Query("SELECT d FROM DichVu d WHERE LOWER(d.tenDichVu) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(d.moTa) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<DichVu> searchByKeyword(@Param("keyword") String keyword);
}
