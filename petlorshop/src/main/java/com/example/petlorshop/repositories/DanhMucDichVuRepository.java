package com.example.petlorshop.repositories;

import com.example.petlorshop.models.DanhMucDichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DanhMucDichVuRepository extends JpaRepository<DanhMucDichVu, Integer> {
}
