package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompleteAppointmentRequest {
    // Ghi chú chung của bác sĩ cho buổi khám
    private String ghiChuBacSi;

    // Phần tiêm chủng
    private boolean coTiemPhong; 
    private String tenVacXin;
    private LocalDate ngayTaiChung; 
    private String ghiChu; // Ghi chú riêng cho mũi tiêm (nếu cần)

    // Phần kê đơn thuốc
    private boolean coKeDon;
    private String chanDoan;
    private String loiDan;
    private List<ThuocKeDonDto> danhSachThuoc;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ThuocKeDonDto {
        private Integer thuocId; // ID sản phẩm
        private Integer soLuong;
        private String lieuDung;
    }
}
