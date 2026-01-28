package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DanhGiaResponse {
    private Integer danhGiaId;
    private String tenNguoiDung;
    private String anhDaiDien;
    private Integer soSao;
    private String noiDung;
    private LocalDateTime ngayDanhGia;
    
    // Thông tin sản phẩm được đánh giá (null nếu là đánh giá chung đơn hàng)
    private Integer sanPhamId;
    private String tenSanPham;
    private String hinhAnhSanPham;

    // Thông tin phản hồi từ shop
    private String phanHoi;
    private LocalDateTime ngayPhanHoi;
}
