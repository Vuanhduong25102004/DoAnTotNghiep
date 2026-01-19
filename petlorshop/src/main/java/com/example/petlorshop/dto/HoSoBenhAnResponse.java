package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoSoBenhAnResponse {
    private Integer thuCungId;
    private String tenThuCung;
    private String chungLoai;
    private String giongLoai;
    private LocalDate ngaySinh;
    private String gioiTinh;
    private BigDecimal canNang;
    private String ghiChuSucKhoe;
    private String hinhAnh; // Thêm trường hình ảnh
    
    private List<LichSuKham> lichSuKham;
    private List<LichSuTiemChung> lichSuTiemChung;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LichSuKham {
        private Integer lichHenId;
        private LocalDateTime ngayKham;
        private String tenDichVu;
        private String bacSiPhuTrach;
        private String chanDoan;
        private String ketLuan;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LichSuTiemChung {
        private Integer tiemChungId;
        private String tenVacXin;
        private LocalDate ngayTiem;
        private LocalDate ngayTaiChung;
        private String bacSiThucHien;
        private String ghiChu;
    }
}
