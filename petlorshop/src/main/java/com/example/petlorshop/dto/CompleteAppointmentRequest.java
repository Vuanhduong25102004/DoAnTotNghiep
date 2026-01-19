package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompleteAppointmentRequest {
    private boolean coTiemPhong; // Checkbox từ modal
    private String tenVacXin;
    private LocalDate ngayTaiChung; // Ngày hẹn tiêm lại (nếu có)
    private String ghiChu; // Ghi chú thêm về mũi tiêm
}
