package com.example.petlorshop.controllers;

import com.example.petlorshop.dto.NhanVienLichTrongResponse;
import com.example.petlorshop.dto.NhanVienRequest;
import com.example.petlorshop.dto.NhanVienResponse;
import com.example.petlorshop.models.NhanVien;
import com.example.petlorshop.services.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nhan-vien")
public class NhanVienController {

    @Autowired
    private NhanVienService nhanVienService;

    // --- API KIỂM TRA LỊCH TRỐNG ---
    @GetMapping("/{id}/lich-trong")
    public ResponseEntity<NhanVienLichTrongResponse> getAvailableSlots(
            @PathVariable Integer id,
            @RequestParam("ngay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            NhanVienLichTrongResponse response = nhanVienService.getNhanVienWithAvailableSlots(id, date);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    // -------------------------------

    @GetMapping
    public List<NhanVienResponse> getAllNhanVien() {
        return nhanVienService.getAllNhanVien();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhanVienResponse> getNhanVienById(@PathVariable Integer id) {
        return nhanVienService.getNhanVienById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<NhanVien> updateNhanVien(@PathVariable Integer id, @RequestBody NhanVienRequest request) {
        try {
            NhanVien updatedNhanVien = nhanVienService.updateNhanVien(id, request);
            return ResponseEntity.ok(updatedNhanVien);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNhanVien(@PathVariable Integer id) {
        try {
            nhanVienService.deleteNhanVien(id);
            return ResponseEntity.ok(Map.of("message", "Xóa nhân viên thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
