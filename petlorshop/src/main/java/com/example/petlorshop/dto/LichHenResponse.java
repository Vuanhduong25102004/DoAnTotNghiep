package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LichHenResponse {
    private Integer lichHenId;
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    private String trangThaiLichHen;
    private String loaiLichHen;
    private String ghiChuKhachHang;
    private String ghiChuBacSi; // Thêm trường này
    private String lyDoHuy;
    
    private Integer userId;
    private String tenKhachHang;
    private String soDienThoaiKhachHang;
    private String anhKhachHang;
    
    private Integer thuCungId;
    private String tenThuCung;
    private String giongLoai;
    private String anhThuCung;
    
    private Integer dichVuId;
    private String tenDichVu;
    private BigDecimal giaDichVu;
    
    private Integer nhanVienId;
    private String tenNhanVien;
    private String anhNhanVien;
}
