package com.example.petlorshop.controllers;

import com.example.petlorshop.dto.LichHenRequest;
import com.example.petlorshop.dto.LichHenResponse;
import com.example.petlorshop.dto.LichHenUpdateRequest;
import com.example.petlorshop.models.LichHen;
import com.example.petlorshop.services.LichHenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lich-hen")
public class LichHenController {

    @Autowired
    private LichHenService lichHenService;

    @GetMapping
    public List<LichHenResponse> getAllLichHen() {
        return lichHenService.getAllLichHen();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LichHenResponse> getLichHenById(@PathVariable Integer id) {
        return lichHenService.getLichHenById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createLichHen(@RequestBody LichHenRequest request) {
        try {
            LichHenResponse createdLichHen = lichHenService.createLichHen(request);
            return ResponseEntity.ok(createdLichHen);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<LichHen> updateLichHen(@PathVariable Integer id, @RequestBody LichHenUpdateRequest request) {
        try {
            LichHen updatedLichHen = lichHenService.updateLichHen(id, request);
            return ResponseEntity.ok(updatedLichHen);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteLichHen(@PathVariable Integer id) {
        try {
            lichHenService.deleteLichHen(id);
            return ResponseEntity.ok(Map.of("message", "Xóa lịch hẹn thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
