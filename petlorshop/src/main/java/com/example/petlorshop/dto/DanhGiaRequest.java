package com.example.petlorshop.dto;

import lombok.Data;

@Data
public class DanhGiaRequest {
    private Integer sanPhamId;
    private Integer donHangId;
    private Integer soSao;
    private String noiDung;
}
