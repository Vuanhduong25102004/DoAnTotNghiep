package com.example.petlorshop.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "DichVu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DichVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dich_vu_id")
    private Integer dichVuId;

    @Column(name = "ten_dich_vu", nullable = false, length = 255)
    private String tenDichVu;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "gia_dich_vu", nullable = false, precision = 10, scale = 2)
    private BigDecimal giaDichVu;

    @Column(name = "thoi_luong_uoc_tinh_phut")
    private Integer thoiLuongUocTinhPhut;

    // --- Relationships ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "danh_muc_dv_id")
    @JsonIgnore
    private DanhMucDichVu danhMucDichVu;

    @JsonIgnore
    @OneToMany(mappedBy = "dichVu")
    private List<LichHen> danhSachLichHen;
}
