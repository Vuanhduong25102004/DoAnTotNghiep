package com.example.petlorshop.repositories;

import com.example.petlorshop.models.NhanVien;
import com.example.petlorshop.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Integer> {
    
    @Query("SELECT nv FROM NhanVien nv WHERE nv.nguoiDung.role = :role")
    List<NhanVien> findByRole(@Param("role") Role role);
}
