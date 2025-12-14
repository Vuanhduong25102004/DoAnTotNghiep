package com.example.petlorshop.controllers;

import com.example.petlorshop.dto.ThuCungRequest;
import com.example.petlorshop.dto.ThuCungResponse;
import com.example.petlorshop.dto.ThuCungUpdateRequest;
import com.example.petlorshop.models.ThuCung;
import com.example.petlorshop.services.ThuCungService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/thu-cung")
public class ThuCungController {

    @Autowired
    private ThuCungService thuCungService;

    private ThuCungResponse toThuCungResponse(ThuCung thuCung) {
        return new ThuCungResponse(
                thuCung.getThuCungId(),
                thuCung.getTenThuCung(),
                thuCung.getChungLoai(),
                thuCung.getGiongLoai(),
                thuCung.getNgaySinh(),
                thuCung.getGioiTinh(),
                thuCung.getGhiChuSucKhoe(),
                thuCung.getNguoiDung().getUserId(),
                thuCung.getNguoiDung().getHoTen()
        );
    }

    @GetMapping
    public List<ThuCungResponse> getAllThuCung() {
        return thuCungService.getAllThuCung().stream()
                .map(this::toThuCungResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThuCungResponse> getThuCungById(@PathVariable Integer id) {
        return thuCungService.getThuCungById(id)
                .map(thuCung -> ResponseEntity.ok(toThuCungResponse(thuCung)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ThuCungResponse> createThuCung(@Valid @RequestBody ThuCungRequest request) {
        try {
            ThuCung createdThuCung = thuCungService.createThuCung(request);
            return new ResponseEntity<>(toThuCungResponse(createdThuCung), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ThuCungResponse> updateThuCung(@PathVariable Integer id, @Valid @RequestBody ThuCungUpdateRequest request) {
        try {
            ThuCung updatedThuCung = thuCungService.updateThuCung(id, request);
            return ResponseEntity.ok(toThuCungResponse(updatedThuCung));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteThuCung(@PathVariable Integer id) {
        try {
            thuCungService.deleteThuCung(id);
            return ResponseEntity.ok(Map.of("message", "Xóa thú cưng thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
