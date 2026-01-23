package com.example.petlorshop.dto;

import com.example.petlorshop.models.BaiViet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BaiVietRequest {
    private String tieuDe;
    private String slug;
    private String noiDung;
    private String anhBia;
    private Integer userId; // Thay nhanVienId bằng userId
    private Integer danhMucBvId;
    private BaiViet.TrangThaiBaiViet trangThai;
}
