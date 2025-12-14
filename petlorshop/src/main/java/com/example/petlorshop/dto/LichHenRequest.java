package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LichHenRequest {
    // Thông tin lịch hẹn (bắt buộc)
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    private Integer dichVuId;
    private String ghiChuKhachHang;

    // Kịch bản 1: Khách quen, thú cưng quen (gửi ID)
    private Integer userId;
    private Integer thuCungId;

    // Kịch bản 2: Khách vãng lai (gửi thông tin)
    private String tenKhachHang;
    private String soDienThoaiKhachHang;

    // Kịch bản 3: Thú cưng mới (gửi thông tin)
    private String tenThuCung;
    private String chungLoai;
    private String giongLoai;
    private LocalDate ngaySinh;
    private String gioiTinh;
    
    // Tùy chọn: Chỉ định nhân viên
    private Integer nhanVienId;
}
