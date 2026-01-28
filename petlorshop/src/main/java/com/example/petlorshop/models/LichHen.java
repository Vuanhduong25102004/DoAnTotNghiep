package com.example.petlorshop.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "lich_hen")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LichHen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lich_hen_id")
    private Integer lichHenId;

    @Column(name = "thoi_gian_bat_dau", nullable = false)
    private LocalDateTime thoiGianBatDau;

    @Column(name = "thoi_gian_ket_thuc", nullable = false)
    private LocalDateTime thoiGianKetThuc;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai")
    private TrangThai trangThai;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "loai_lich_hen")
    private LoaiLichHen loaiLichHen = LoaiLichHen.THUONG_LE; // Mặc định là thường lệ

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu; // Ghi chú của khách hàng/lễ tân

    @Column(name = "ghi_chu_bac_si", columnDefinition = "TEXT")
    private String ghiChuBacSi; // Ghi chú chuyên môn của bác sĩ

    @Column(name = "ly_do_huy", columnDefinition = "TEXT")
    private String lyDoHuy;
    
    // --- Thông tin khách vãng lai ---
    @Column(name = "ten_khach_hang")
    private String tenKhachHang;

    @Column(name = "sdt_khach_hang")
    private String sdtKhachHang;
    
    @Column(name = "email_khach_hang")
    private String emailKhachHang;

    // --- Relationships ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true) // Cho phép null
    @JsonIgnore
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thu_cung_id")
    @JsonIgnore
    private ThuCung thuCung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dich_vu_id", nullable = false)
    @JsonIgnore
    private DichVu dichVu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    @JsonIgnore
    private NhanVien nhanVien;

    // --- Enum for TrangThai ---
    public enum TrangThai {
        CHO_XAC_NHAN, DA_XAC_NHAN, DA_HOAN_THANH, DA_HUY
    }
    
    public enum LoaiLichHen {
        KHAN_CAP("Khẩn cấp (Cấp cứu)"),
        THUONG_LE("Thường lệ"),
        TAI_KHAM("Tái khám"),
        TU_VAN("Tư vấn"),
        TIEM_PHONG("Tiêm phòng"),
        PHAU_THUAT("Phẫu thuật");
        
        private final String displayName;
        
        LoaiLichHen(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }

    public enum LyDoHuyLich {
        BAN_VIEC_DOT_XUAT("Bận việc đột xuất"),
        MUON_DOI_LICH_SANG_NGAY_KHAC("Muốn đổi lịch sang ngày khác"),
        MUON_DOI_DICH_VU("Muốn thay đổi dịch vụ"),
        KHAC("Lý do khác");

        private final String moTa;

        LyDoHuyLich(String moTa) {
            this.moTa = moTa;
        }

        public String getMoTa() {
            return moTa;
        }
    }
}
