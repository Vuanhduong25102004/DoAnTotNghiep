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
public class NguoiDungUpdateRequest {
    private String hoTen;
    private String email;
    private String password; // Optional: chỉ cập nhật nếu có giá trị
    private String soDienThoai;
    private String diaChi;
    private Role role;
}
