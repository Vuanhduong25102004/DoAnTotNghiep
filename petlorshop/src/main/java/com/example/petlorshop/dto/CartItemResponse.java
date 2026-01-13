package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Integer id; // Sửa ở đây
    private Integer sanPhamId;
    private String tenSanPham;
    private String hinhAnh;
    private BigDecimal donGia;
    private int soLuong;
    private BigDecimal thanhTien;
    private LocalDateTime ngayThem;
}
