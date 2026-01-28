package com.example.petlorshop.repositories;

import com.example.petlorshop.models.ThuCung;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThuCungRepository extends JpaRepository<ThuCung, Integer> {
    // Global Search (List)
    @Query("SELECT t FROM ThuCung t WHERE LOWER(t.tenThuCung) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.chungLoai) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.giongLoai) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<ThuCung> searchByKeyword(@Param("keyword") String keyword);

    // Page Search
    @Query("SELECT t FROM ThuCung t WHERE LOWER(t.tenThuCung) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.chungLoai) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.giongLoai) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ThuCung> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    List<ThuCung> findByNguoiDung_Email(String email);

    // Tìm thú cưng theo chủ sở hữu và tên (để tránh trùng lặp)
    List<ThuCung> findByNguoiDung_UserIdAndTenThuCungIgnoreCase(Integer userId, String tenThuCung);

    // Tìm thú cưng theo SĐT chủ sở hữu
    @Query("SELECT t FROM ThuCung t WHERE t.nguoiDung.soDienThoai = :soDienThoai")
    List<ThuCung> findByOwnerPhone(@Param("soDienThoai") String soDienThoai);
}
