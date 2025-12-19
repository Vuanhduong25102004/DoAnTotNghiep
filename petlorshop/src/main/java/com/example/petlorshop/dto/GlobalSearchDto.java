package com.example.petlorshop.dto;

import com.example.petlorshop.models.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GlobalSearchDto {
    // Public search results
    private List<SanPham> sanPhams;
    private List<DichVu> dichVus;
    private List<ThuCung> thuCungs;

    // Admin-only search results
    private List<NguoiDung> nguoiDungs;
    private List<NhanVien> nhanViens;
    private List<DonHang> donHangs;
    private List<LichHen> lichHens;
    private List<DanhMucSanPham> danhMucSanPhams;
    private List<DanhMucDichVu> danhMucDichVus;

    // Constructor for public search
    public GlobalSearchDto(List<SanPham> sanPhams, List<DichVu> dichVus, List<ThuCung> thuCungs) {
        this.sanPhams = sanPhams;
        this.dichVus = dichVus;
        this.thuCungs = thuCungs;
    }
}
