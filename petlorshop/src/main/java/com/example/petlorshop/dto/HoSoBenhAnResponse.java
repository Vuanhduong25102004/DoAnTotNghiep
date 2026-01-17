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
    private BigDecimal canNang; // Sửa Double thành BigDecimal
    private String ghiChuSucKhoe;
    
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
        private String chanDoan; // Lấy từ ghi chú của lịch hẹn hoặc trường riêng nếu có
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
