package com.example.petlorshop.controllers;

import com.example.petlorshop.dto.DichVuRequest;
import com.example.petlorshop.dto.DichVuResponse;
import com.example.petlorshop.services.DichVuService;
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
@RequestMapping("/api/dich-vu")
public class DichVuController {

    @Autowired
    private DichVuService dichVuService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public Page<DichVuResponse> getAllDichVu(Pageable pageable) {
        return dichVuService.getAllDichVu(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DichVuResponse> getDichVuById(@PathVariable Integer id) {
        return dichVuService.getDichVuById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + id));
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<DichVuResponse> createDichVu(@RequestPart("dichVu") String dichVuJson,
                                          @RequestPart(name = "hinhAnh", required = false) MultipartFile hinhAnh) throws JsonProcessingException {
        DichVuRequest request = objectMapper.readValue(dichVuJson, DichVuRequest.class);
        DichVuResponse response = dichVuService.createDichVu(request, hinhAnh);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<DichVuResponse> updateDichVu(@PathVariable Integer id,
                                          @RequestPart("dichVu") String dichVuJson,
                                          @RequestPart(name = "hinhAnh", required = false) MultipartFile hinhAnh) throws JsonProcessingException {
        DichVuRequest request = objectMapper.readValue(dichVuJson, DichVuRequest.class);
        DichVuResponse updatedDichVu = dichVuService.updateDichVu(id, request, hinhAnh);
        return ResponseEntity.ok(updatedDichVu);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDichVu(@PathVariable Integer id) {
        dichVuService.deleteDichVu(id);
        return ResponseEntity.ok(Map.of("message", "Xóa dịch vụ thành công"));
    }
}
