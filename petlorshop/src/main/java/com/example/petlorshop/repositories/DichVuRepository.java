package com.example.petlorshop.repositories;

import com.example.petlorshop.models.DichVu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DichVuRepository extends JpaRepository<DichVu, Integer> {
    
    // Global Search (List)
    @Query("SELECT d FROM DichVu d WHERE LOWER(d.tenDichVu) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(d.moTa) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<DichVu> searchByKeyword(@Param("keyword") String keyword);

    // Page Search (Keyword only)
    @Query("SELECT d FROM DichVu d WHERE LOWER(d.tenDichVu) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(d.moTa) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<DichVu> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Page Search (Keyword + Category)
    @Query("SELECT d FROM DichVu d WHERE (LOWER(d.tenDichVu) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(d.moTa) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND d.danhMucDichVu.danhMucDvId = :categoryId")
    Page<DichVu> searchByKeywordAndCategory(@Param("keyword") String keyword, @Param("categoryId") Integer categoryId, Pageable pageable);

    // Page Search (Category only)
    Page<DichVu> findByDanhMucDichVu_DanhMucDvId(Integer danhMucDvId, Pageable pageable);
}
