package com.example.petlorshop.dto;

import com.example.petlorshop.models.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DichVuResponse {
    private Integer dichVuId;
    private String tenDichVu;
    private String moTa;
    private BigDecimal giaDichVu;
    private Integer thoiLuongUocTinhPhut;

    // Thông tin danh mục
    private Integer danhMucDvId;
    private String tenDanhMucDv;
    private Role roleCanThucHien;
}
