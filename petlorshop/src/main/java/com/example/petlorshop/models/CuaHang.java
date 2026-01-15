package com.example.petlorshop.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cua_hang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CuaHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "ten_cua_hang")
    private String tenCuaHang;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "dia_chi_chi_tiet")
    private String diaChiChiTiet;

    @Column(name = "tinh_thanh")
    private String tinhThanh;

    @Column(name = "quan_huyen")
    private String quanHuyen;

    @Column(name = "phuong_xa")
    private String phuongXa;

    @Column(name = "ghtk_token")
    private String ghtkToken;
}
