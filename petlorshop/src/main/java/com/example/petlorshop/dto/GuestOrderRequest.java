package com.example.petlorshop.dto;

import com.example.petlorshop.models.DonHang;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GuestOrderRequest {
    private String hoTenNguoiNhan;
    private String soDienThoaiNhan;
    private String diaChiGiaoHang;
    private String tinhThanh;
    private String quanHuyen;
    private String phuongXa;
    private String email; // Optional, để gửi mail xác nhận
    private String maKhuyenMai;
    private DonHang.PhuongThucThanhToan phuongThucThanhToan;
    private List<ChiTietDonHangRequest> chiTietDonHangs;
}
