package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DichVuRequest {
    private String tenDichVu;
    private String moTa;
    private BigDecimal giaDichVu;
    private Integer thoiLuongUocTinhPhut;
    private Integer danhMucDvId;
}
