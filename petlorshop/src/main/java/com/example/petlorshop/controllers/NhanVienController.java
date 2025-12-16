package com.example.petlorshop.controllers;

import com.example.petlorshop.dto.NhanVienRequest;
import com.example.petlorshop.dto.NhanVienResponse;
import com.example.petlorshop.services.NhanVienService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/nhan-vien")
public class NhanVienController {

    @Autowired
    private NhanVienService nhanVienService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createNhanVien(@RequestPart("nhanVien") String nhanVienJson,
                                            @RequestPart(name = "anhDaiDien", required = false) MultipartFile anhDaiDien) {
        try {
            NhanVienRequest request = objectMapper.readValue(nhanVienJson, NhanVienRequest.class);
            NhanVienResponse newStaff = nhanVienService.createNhanVien(request, anhDaiDien);
            return ResponseEntity.ok(newStaff);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public Page<NhanVienResponse> getAllNhanVien(Pageable pageable) {
        return nhanVienService.getAllNhanVien(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhanVienResponse> getNhanVienById(@PathVariable Integer id) {
        return nhanVienService.getNhanVienById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateNhanVien(@PathVariable Integer id,
                                            @RequestPart("nhanVien") String nhanVienJson,
                                            @RequestPart(name = "anhDaiDien", required = false) MultipartFile anhDaiDien) {
        try {
            NhanVienRequest request = objectMapper.readValue(nhanVienJson, NhanVienRequest.class);
            NhanVienResponse updatedStaff = nhanVienService.updateNhanVien(id, request, anhDaiDien);
            return ResponseEntity.ok(updatedStaff);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON format for 'nhanVien' part."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNhanVien(@PathVariable Integer id) {
        nhanVienService.deleteNhanVien(id);
        return ResponseEntity.ok(Map.of("message", "Xóa nhân viên thành công"));
    }

    @GetMapping("/{id}/check-availability")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(
            @PathVariable Integer id,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        boolean isAvailable = nhanVienService.isTimeSlotAvailable(id, start, end);
        return ResponseEntity.ok(Map.of("available", isAvailable));
    }
}
