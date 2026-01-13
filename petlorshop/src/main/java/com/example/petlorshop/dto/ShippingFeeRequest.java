package com.example.petlorshop.dto;

import lombok.Data;

import java.util.List;

@Data
public class ShippingFeeRequest {
    private String tinhThanh;
    private String quanHuyen;
    private String phuongXa;
    private String diaChi;
    private List<ChiTietDonHangRequest> items;
}
