package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietDonHangResponse {
    private Integer id;
    private Integer soLuong;
    private BigDecimal donGia;
    private Integer sanPhamId;
    private String tenSanPham;
    private String tenDanhMuc; // Thêm trường tên danh mục
    private String hinhAnh;
    private boolean daDanhGia;
}
