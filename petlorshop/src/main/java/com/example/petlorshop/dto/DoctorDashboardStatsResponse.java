package com.example.petlorshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDashboardStatsResponse {
    private long lichKhamHomNay;
    private long soCaKhanCap;
    private long benhNhanDaTiepNhan;
}
