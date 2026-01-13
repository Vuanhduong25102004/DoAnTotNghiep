package com.example.petlorshop.dto;

import com.example.petlorshop.models.ChiTietDonHang;
import com.example.petlorshop.models.KhuyenMai;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCalculationResult {
    private BigDecimal tongTienHang;
    private BigDecimal soTienGiam;
    private BigDecimal phiVanChuyen;
    private BigDecimal tongThanhToan;
    private KhuyenMai khuyenMai;
    private List<ChiTietDonHang> chiTietDonHangs; // Danh sách chi tiết đã được chuẩn bị dữ liệu (giá, sp)
}
