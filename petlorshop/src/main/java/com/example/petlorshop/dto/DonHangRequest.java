package com.example.petlorshop.dto;

import com.example.petlorshop.models.DonHang;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DonHangRequest {
    private Integer userId;
    private String diaChiGiaoHang;
    private String tinhThanh;
    private String quanHuyen;
    private String phuongXa;
    private String soDienThoaiNhan;
    private String maKhuyenMai;
    private DonHang.PhuongThucThanhToan phuongThucThanhToan;
    private List<ChiTietDonHangRequest> chiTietDonHangs;
}
