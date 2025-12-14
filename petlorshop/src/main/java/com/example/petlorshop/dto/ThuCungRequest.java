package com.example.petlorshop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ThuCungRequest {
    @NotBlank(message = "Tên thú cưng không được để trống")
    private String tenThuCung;

    private String chungLoai;

    private String giongLoai;

    private LocalDate ngaySinh;

    private String gioiTinh;

    private String ghiChuSucKhoe;

    // userId không còn bắt buộc nếu có số điện thoại
    private Integer userId;

    // Thông tin chủ sở hữu (dùng khi không có userId)
    private String tenChuSoHuu;
    private String soDienThoaiChuSoHuu;
}
