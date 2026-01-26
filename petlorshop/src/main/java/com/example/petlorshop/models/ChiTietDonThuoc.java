package com.example.petlorshop.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chi_tiet_don_thuoc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietDonThuoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "don_thuoc_id", nullable = false)
    @JsonIgnore
    private DonThuoc donThuoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "san_pham_id", nullable = false)
    private SanPham thuoc;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "lieu_dung", length = 255)
    private String lieuDung; // Ví dụ: Sáng 1, Tối 1
}
