package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LichHenResponse {
    private Integer lichHenId;
    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    private String trangThaiLichHen;
    private String ghiChuKhachHang;
    
    // Thông tin khách hàng
    private Integer userId;
    private String tenKhachHang;
    private String soDienThoaiKhachHang;

    // Thông tin thú cưng
    private Integer thuCungId;
    private String tenThuCung;

    // Thông tin dịch vụ
    private Integer dichVuId;
    private String tenDichVu;

    // Thông tin nhân viên (có thể null nếu chưa phân công)
    private Integer nhanVienId;
    private String tenNhanVien;
}
