package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NhanVienRequest {
    private String hoTen;
    private String chucVu;
    private String soDienThoai;
    private String email;
    private String chuyenKhoa;
    private String kinhNghiem;
    private Integer userId;
}
