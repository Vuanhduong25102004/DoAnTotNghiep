package com.example.petlorshop.controllers;

import com.example.petlorshop.dto.DichVuResponse;
import com.example.petlorshop.models.DichVu;
import com.example.petlorshop.services.DichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dich-vu")
public class DichVuController {

    @Autowired
    private DichVuService dichVuService;

    @GetMapping
    public List<DichVuResponse> getAllDichVu() {
        return dichVuService.getAllDichVu();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DichVuResponse> getDichVuById(@PathVariable Integer id) {
        return dichVuService.getDichVuById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public DichVu createDichVu(@RequestBody DichVu dichVu) {
        // Cần cập nhật để nhận DichVuRequest
        return dichVuService.createDichVu(dichVu);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DichVu> updateDichVu(@PathVariable Integer id, @RequestBody DichVu dichVuDetails) {
        // Cần cập nhật để nhận DichVuRequest
        try {
            DichVu updatedDichVu = dichVuService.updateDichVu(id, dichVuDetails);
            return ResponseEntity.ok(updatedDichVu);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDichVu(@PathVariable Integer id) {
        try {
            dichVuService.deleteDichVu(id);
            return ResponseEntity.ok(Map.of("message", "Xóa dịch vụ thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
