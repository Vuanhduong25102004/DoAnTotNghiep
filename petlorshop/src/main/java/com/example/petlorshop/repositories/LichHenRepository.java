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

    @Query("SELECT lh FROM LichHen lh WHERE lh.nhanVien.nhanVienId = :nhanVienId AND NOT (lh.thoiGianKetThuc <= :newStart OR lh.thoiGianBatDau >= :newEnd)")
    List<LichHen> findOverlappingAppointments(@Param("nhanVienId") Integer nhanVienId,
                                            @Param("newStart") LocalDateTime newStart,
                                            @Param("newEnd") LocalDateTime newEnd);

    // Sửa lại query này để dùng BETWEEN cho chuẩn JPA và tránh lỗi FUNCTION('DATE') trên một số DB
    @Query("SELECT lh FROM LichHen lh WHERE lh.nhanVien.nhanVienId = :nhanVienId AND lh.thoiGianBatDau BETWEEN :start AND :end ORDER BY lh.thoiGianBatDau")
    List<LichHen> findByNhanVienIdAndDateRange(@Param("nhanVienId") Integer nhanVienId,
                                        @Param("start") LocalDateTime start,
                                        @Param("end") LocalDateTime end);

    // Tìm tất cả lịch hẹn trong khoảng thời gian (cho Lễ tân)
    @Query("SELECT lh FROM LichHen lh WHERE lh.thoiGianBatDau BETWEEN :start AND :end ORDER BY lh.thoiGianBatDau")
    List<LichHen> findAllByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT l FROM LichHen l WHERE LOWER(l.ghiChu) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<LichHen> searchByKeyword(@Param("keyword") String keyword);

    List<LichHen> findByNguoiDung_Email(String email);
    
    // Tìm lịch hẹn theo ID nhân viên
    List<LichHen> findByNhanVien_NhanVienId(Integer nhanVienId);

    // Đếm số lịch hẹn trong khoảng thời gian (dùng cho hôm nay)
    @Query("SELECT COUNT(lh) FROM LichHen lh WHERE lh.nhanVien.nhanVienId = :nhanVienId AND lh.thoiGianBatDau BETWEEN :start AND :end")
    long countLichHenByTimeRange(@Param("nhanVienId") Integer nhanVienId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Đếm số ca khẩn cấp trong khoảng thời gian
    @Query("SELECT COUNT(lh) FROM LichHen lh WHERE lh.nhanVien.nhanVienId = :nhanVienId AND lh.loaiLichHen = :loaiLichHen AND lh.thoiGianBatDau BETWEEN :start AND :end")
    long countCaKhanCapByTimeRange(@Param("nhanVienId") Integer nhanVienId, @Param("loaiLichHen") LichHen.LoaiLichHen loaiLichHen, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Đếm số ca khám đã hoàn thành (Bỏ DISTINCT để đếm tổng lượt khám)
    @Query("SELECT COUNT(lh) FROM LichHen lh WHERE lh.nhanVien.nhanVienId = :nhanVienId AND lh.trangThai = :trangThai")
    long countBenhNhanDaTiepNhan(@Param("nhanVienId") Integer nhanVienId, @Param("trangThai") LichHen.TrangThai trangThai);
}
