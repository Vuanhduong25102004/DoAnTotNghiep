package com.example.petlorshop.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "don_hang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "don_hang_id")
    private Integer donHangId;

    @CreationTimestamp
    @Column(name = "ngay_dat_hang", nullable = false, updatable = false)
    private LocalDateTime ngayDatHang;

    @Column(name = "tong_tien_hang", nullable = false, precision = 10, scale = 2)
    private BigDecimal tongTienHang;

    @Column(name = "so_tien_giam", precision = 10, scale = 2)
    private BigDecimal soTienGiam = BigDecimal.ZERO;
    
    @Column(name = "phi_van_chuyen", precision = 10, scale = 2)
    private BigDecimal phiVanChuyen = BigDecimal.ZERO;

    @Column(name = "tong_thanh_toan", nullable = false, precision = 10, scale = 2)
    private BigDecimal tongThanhToan;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai")
    private TrangThaiDonHang trangThai = TrangThaiDonHang.CHO_XU_LY;

    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc_thanh_toan")
    private PhuongThucThanhToan phuongThucThanhToan; // Bỏ mặc định COD
    
    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_thanh_toan")
    private TrangThaiThanhToan trangThaiThanhToan = TrangThaiThanhToan.CHUA_THANH_TOAN;
    
    @Column(name = "ma_giao_dich")
    private String maGiaoDich; // Mã giao dịch từ VNPAY/MOMO
    
    @Column(name = "ngay_thanh_toan")
    private LocalDateTime ngayThanhToan;

    @Column(name = "dia_chi_giao_hang", nullable = false, columnDefinition = "TEXT")
    private String diaChiGiaoHang;

    @Column(name = "so_dien_thoai_nhan", nullable = false, length = 20)
    private String soDienThoaiNhan;
    
    @Column(name = "ho_ten_nguoi_nhan", length = 100)
    private String hoTenNguoiNhan;

    @Column(name = "email_nguoi_nhan", length = 100)
    private String emailNguoiNhan;

    @Column(name = "ly_do_huy", columnDefinition = "TEXT")
    private String lyDoHuy;

    // --- Relationships ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khuyen_mai_id")
    @JsonIgnore
    private KhuyenMai khuyenMai;

    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDonHang> chiTietDonHangs;

    // --- Enums ---
    public enum TrangThaiDonHang {
        CHO_XU_LY("Chờ xử lý"),
        DA_XAC_NHAN("Đã xác nhận"),
        DANG_GIAO("Đang giao"),
        DA_GIAO("Đã giao"),// Đã đổi từ DA_GIAO sang HOAN_THANH
        DA_HUY("Đã hủy");

        private final String displayName;

        TrangThaiDonHang(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum PhuongThucThanhToan {
        COD, VNPAY, MOMO
    }
    
    public enum TrangThaiThanhToan {
        CHUA_THANH_TOAN, CHO_THANH_TOAN, DA_THANH_TOAN, THAT_BAI, HOAN_TIEN
    }

    public enum LyDoHuyDon {
        MUON_THAY_DOI_DIA_CHI("Muốn thay đổi địa chỉ/số điện thoại nhận hàng"),
        MUON_THAY_DOI_SAN_PHAM("Muốn thay đổi sản phẩm trong đơn hàng (size, màu sắc, số lượng...)"),
        THAY_DOI_PHUONG_THUC_THANH_TOAN("Thay đổi phương thức thanh toán"),
        KHAC("Lý do khác");

        private final String moTa;

        LyDoHuyDon(String moTa) {
            this.moTa = moTa;
        }

        public String getMoTa() {
            return moTa;
        }
    }
}
