package com.example.petlorshop.dto;

import com.example.petlorshop.models.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NhanVienRequest {
    // Thông tin chung
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String diaChi;

    // Thông tin nhân viên
    private String chucVu;
    private String chuyenKhoa;
    private String kinhNghiem;

    // Thông tin để tạo/sửa tài khoản
    private String password; // Bắt buộc khi tạo, tùy chọn khi sửa
    private Role role;       // Bắt buộc khi tạo
}
