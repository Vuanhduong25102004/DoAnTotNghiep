package com.example.petlorshop.repositories;

import com.example.petlorshop.models.LichHen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LichHenRepository extends JpaRepository<LichHen, Integer> {

    @Query("SELECT lh FROM LichHen lh WHERE lh.nhanVien.id = :nhanVienId AND NOT (lh.thoiGianKetThuc <= :newStart OR lh.thoiGianBatDau >= :newEnd)")
    List<LichHen> findOverlappingAppointments(@Param("nhanVienId") Integer nhanVienId,
                                            @Param("newStart") LocalDateTime newStart,
                                            @Param("newEnd") LocalDateTime newEnd);

    @Query("SELECT lh FROM LichHen lh WHERE lh.nhanVien.id = :nhanVienId AND FUNCTION('DATE', lh.thoiGianBatDau) = :date ORDER BY lh.thoiGianBatDau")
    List<LichHen> findByNhanVienIdAndDate(@Param("nhanVienId") Integer nhanVienId,
                                        @Param("date") java.time.LocalDate date);
}
