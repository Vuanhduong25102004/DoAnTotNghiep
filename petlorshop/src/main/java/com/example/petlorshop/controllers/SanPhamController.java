package com.example.petlorshop.controllers;

import com.example.petlorshop.dto.SanPhamRequest;
import com.example.petlorshop.dto.SanPhamResponse;
import com.example.petlorshop.models.SanPham;
import com.example.petlorshop.services.SanPhamService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/san-pham")
public class SanPhamController {

    @Autowired
    private SanPhamService sanPhamService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public Page<SanPhamResponse> getAllSanPham(Pageable pageable) {
        return sanPhamService.getAllSanPham(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SanPhamResponse> getSanPhamById(@PathVariable Integer id) {
        return sanPhamService.getSanPhamById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<SanPham> createSanPham(@RequestPart("sanPham") String sanPhamJson,
                                           @RequestPart(name = "hinhAnh", required = false) MultipartFile hinhAnh) throws JsonProcessingException {
        SanPhamRequest request = objectMapper.readValue(sanPhamJson, SanPhamRequest.class);
        SanPham createdSanPham = sanPhamService.createSanPham(request, hinhAnh);
        return new ResponseEntity<>(createdSanPham, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<SanPham> updateSanPham(@PathVariable Integer id,
                                           @RequestPart("sanPham") String sanPhamJson,
                                           @RequestPart(name = "hinhAnh", required = false) MultipartFile hinhAnh) throws JsonProcessingException {
        SanPhamRequest request = objectMapper.readValue(sanPhamJson, SanPhamRequest.class);
        SanPham updatedSanPham = sanPhamService.updateSanPham(id, request, hinhAnh);
        return ResponseEntity.ok(updatedSanPham);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSanPham(@PathVariable Integer id) {
        sanPhamService.deleteSanPham(id);
        return ResponseEntity.ok(Map.of("message", "Xóa sản phẩm thành công"));
    }
}
