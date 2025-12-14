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
public class UnifiedCreateUserRequest {
    // Thông tin bắt buộc cho mọi User
    private String hoTen;
    private String email;
    private String password;
    private String soDienThoai;
    private String diaChi;
    private Role role;

    // Thông tin chỉ dành cho Nhân viên (Optional)
    private String chucVu;
    private String chuyenKhoa;
    private String kinhNghiem;
}
