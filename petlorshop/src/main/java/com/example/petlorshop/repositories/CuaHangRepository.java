package com.example.petlorshop.repositories;

import com.example.petlorshop.models.CuaHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CuaHangRepository extends JpaRepository<CuaHang, Integer> {
}
