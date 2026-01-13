package com.example.petlorshop.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chi_tiet_gio_hang",
       uniqueConstraints = @UniqueConstraint(columnNames = {"gio_hang_id", "san_pham_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietGioHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gio_hang_id", nullable = false)
    private GioHang gioHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "san_pham_id", nullable = false)
    private SanPham sanPham;

    @Column(nullable = false)
    private int soLuong;
    
    @CreationTimestamp
    @Column(name = "ngay_them", updatable = false)
    private LocalDateTime ngayThem;
}
