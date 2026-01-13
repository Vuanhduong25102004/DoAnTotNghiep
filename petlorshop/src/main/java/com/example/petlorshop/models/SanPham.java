package com.example.petlorshop.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.Filter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "san_pham")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE san_pham SET da_xoa = true WHERE san_pham_id = ?")
@FilterDef(name = "deletedProductFilter", parameters = @ParamDef(name = "isDeleted", type = Boolean.class))
@Filter(name = "deletedProductFilter", condition = "da_xoa = :isDeleted")
public class SanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "san_pham_id")
    private Integer sanPhamId;

    @Column(name = "ten_san_pham", nullable = false, length = 255)
    private String tenSanPham;

    @Column(name = "mo_ta_chi_tiet", columnDefinition = "TEXT")
    private String moTaChiTiet;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal gia;

    @Column(name = "gia_giam", precision = 10, scale = 2)
    private BigDecimal giaGiam;

    @Column(name = "so_luong_ton_kho")
    private Integer soLuongTonKho;

    @Column(name = "hinh_anh", columnDefinition = "TEXT")
    private String hinhAnh;
    
    @Column(name = "trong_luong")
    private Integer trongLuong = 500; // Đơn vị: gram

    @Column(name = "da_xoa")
    private boolean daXoa = false;

    // --- Relationships ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "danh_muc_id")
    @JsonIgnore
    private DanhMucSanPham danhMucSanPham;

    @JsonIgnore
    @OneToMany(mappedBy = "sanPham")
    private List<ChiTietDonHang> danhSachChiTietDonHang;

    @JsonIgnore
    @OneToMany(mappedBy = "sanPham")
    private List<ChiTietGioHang> danhSachChiTietGioHang;
}
