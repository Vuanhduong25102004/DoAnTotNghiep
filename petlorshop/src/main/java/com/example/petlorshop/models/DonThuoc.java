package com.example.petlorshop.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "don_thuoc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonThuoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "don_thuoc_id")
    private Integer donThuocId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lich_hen_id", nullable = false)
    @JsonIgnore
    private LichHen lichHen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    @JsonIgnore
    private NhanVien bacSi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thu_cung_id")
    @JsonIgnore
    private ThuCung thuCung;

    @Column(name = "chan_doan", columnDefinition = "TEXT")
    private String chanDoan;

    @Column(name = "loi_dan", columnDefinition = "TEXT")
    private String loiDan;

    @CreationTimestamp
    @Column(name = "ngay_ke")
    private LocalDateTime ngayKe;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai")
    private TrangThaiDonThuoc trangThai = TrangThaiDonThuoc.MOI_TAO;

    @OneToMany(mappedBy = "donThuoc", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDonThuoc> chiTietDonThuocList;

    public enum TrangThaiDonThuoc {
        MOI_TAO, DA_THANH_TOAN, DA_HUY
    }
}
