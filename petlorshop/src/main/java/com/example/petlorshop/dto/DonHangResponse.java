package com.example.petlorshop.dto;

import com.example.petlorshop.models.DonHang;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DonHangResponse {
    private Integer donHangId;
    private LocalDateTime ngayDatHang;
    private BigDecimal tongTienHang;
    private BigDecimal soTienGiam;
    private BigDecimal phiVanChuyen;
    private BigDecimal tongThanhToan;
    private String trangThai;
    private DonHang.PhuongThucThanhToan phuongThucThanhToan;
    private DonHang.TrangThaiThanhToan trangThaiThanhToan;
    private String diaChiGiaoHang;
    private String soDienThoaiNhan;
    private String lyDoHuy;
    private Integer userId;
    private String tenNguoiNhan;
    private String anhNguoiNhan; // Thêm trường ảnh đại diện
    private String maKhuyenMai;
    private List<ChiTietDonHangResponse> chiTietDonHangs;
    private boolean daDanhGiaChung;
}
