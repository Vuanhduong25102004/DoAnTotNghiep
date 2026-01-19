package com.example.petlorshop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class LichHenResponse {
    private Integer lichHenId;
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    
    @JsonProperty("trangThaiLichHen")
    private String status;
    
    private String loaiLichHen;
    
    private String ghiChuKhachHang;
    private String lyDoHuy;
    
    // Thông tin khách hàng
    private Integer userId;
    private String tenKhachHang;
    private String soDienThoaiKhachHang;

    // Thông tin thú cưng
    private Integer thuCungId;
    private String tenThuCung;
    private String giongLoai; // Thêm trường này

    // Thông tin dịch vụ
    private Integer dichVuId;
    private String tenDichVu;
    private BigDecimal giaDichVu;

    // Thông tin nhân viên (có thể null nếu chưa phân công)
    private Integer nhanVienId;
    private String tenNhanVien;

    public LichHenResponse(Integer lichHenId, LocalDateTime thoiGianBatDau, LocalDateTime thoiGianKetThuc, String status, String loaiLichHen, String ghiChuKhachHang, String lyDoHuy, Integer userId, String tenKhachHang, String soDienThoaiKhachHang, Integer thuCungId, String tenThuCung, String giongLoai, Integer dichVuId, String tenDichVu, BigDecimal giaDichVu, Integer nhanVienId, String tenNhanVien) {
        this.lichHenId = lichHenId;
        this.thoiGianBatDau = thoiGianBatDau;
        this.thoiGianKetThuc = thoiGianKetThuc;
        this.status = status;
        this.loaiLichHen = loaiLichHen;
        this.ghiChuKhachHang = ghiChuKhachHang;
        this.lyDoHuy = lyDoHuy;
        this.userId = userId;
        this.tenKhachHang = tenKhachHang;
        this.soDienThoaiKhachHang = soDienThoaiKhachHang;
        this.thuCungId = thuCungId;
        this.tenThuCung = tenThuCung;
        this.giongLoai = giongLoai;
        this.dichVuId = dichVuId;
        this.tenDichVu = tenDichVu;
        this.giaDichVu = giaDichVu;
        this.nhanVienId = nhanVienId;
        this.tenNhanVien = tenNhanVien;
    }
}
