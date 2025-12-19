package com.example.petlorshop.repositories;

import com.example.petlorshop.models.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Integer> {
    Optional<NguoiDung> findByEmail(String email);

    Optional<NguoiDung> findBySoDienThoai(String soDienThoai);

    @Query("SELECT u FROM NguoiDung u WHERE LOWER(u.hoTen) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR u.soDienThoai LIKE CONCAT('%', :keyword, '%')")
    List<NguoiDung> searchByKeyword(@Param("keyword") String keyword);
}
