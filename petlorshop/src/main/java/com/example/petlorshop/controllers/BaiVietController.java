package com.example.petlorshop.controllers;

import com.example.petlorshop.dto.BaiVietRequest;
import com.example.petlorshop.dto.BaiVietResponse;
import com.example.petlorshop.models.DanhMucBaiViet;
import com.example.petlorshop.services.BaiVietService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bai-viet")
public class BaiVietController {

    @Autowired
    private BaiVietService baiVietService;

    @Autowired
    private ObjectMapper objectMapper; // Dùng để parse JSON thủ công

    // --- Danh Mục ---
    @GetMapping("/danh-muc")
    public ResponseEntity<List<DanhMucBaiViet>> getAllDanhMuc() {
        return ResponseEntity.ok(baiVietService.getAllDanhMuc());
    }

    @GetMapping("/danh-muc/{id}")
    public ResponseEntity<DanhMucBaiViet> getDanhMucById(@PathVariable Integer id) {
        return baiVietService.getDanhMucById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/danh-muc")
    public ResponseEntity<DanhMucBaiViet> createDanhMuc(@RequestBody DanhMucBaiViet danhMuc) {
        return ResponseEntity.ok(baiVietService.createDanhMuc(danhMuc.getTenDanhMuc(), danhMuc.getMoTa()));
    }

    @PutMapping("/danh-muc/{id}")
    public ResponseEntity<DanhMucBaiViet> updateDanhMuc(@PathVariable Integer id, @RequestBody DanhMucBaiViet danhMuc) {
        return ResponseEntity.ok(baiVietService.updateDanhMuc(id, danhMuc.getTenDanhMuc(), danhMuc.getMoTa()));
    }

    @DeleteMapping("/danh-muc/{id}")
    public ResponseEntity<Map<String, String>> deleteDanhMuc(@PathVariable Integer id) {
        baiVietService.deleteDanhMuc(id);
        return ResponseEntity.ok(Map.of("message", "Xóa danh mục thành công"));
    }

    // --- Bài Viết ---
    @GetMapping
    public ResponseEntity<Page<BaiVietResponse>> getAllBaiViet(Pageable pageable) {
        return ResponseEntity.ok(baiVietService.getAllBaiViet(pageable));
    }

    @GetMapping("/cong-khai")
    public ResponseEntity<List<BaiVietResponse>> getBaiVietCongKhai() {
        return ResponseEntity.ok(baiVietService.getBaiVietCongKhai());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaiVietResponse> getBaiVietById(@PathVariable Integer id) {
        return baiVietService.getBaiVietById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<BaiVietResponse> getBaiVietBySlug(@PathVariable String slug) {
        return baiVietService.getBaiVietBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/lien-quan")
    public ResponseEntity<List<BaiVietResponse>> getBaiVietLienQuan(@PathVariable Integer id) {
        return ResponseEntity.ok(baiVietService.getBaiVietLienQuan(id));
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<BaiVietResponse> createBaiViet(
            @RequestPart("data") String dataJson, // Nhận String thay vì Object để tránh lỗi Content-Type
            @RequestPart(value = "anhBia", required = false) MultipartFile anhBiaFile) throws JsonProcessingException {
        
        BaiVietRequest request = objectMapper.readValue(dataJson, BaiVietRequest.class);
        return ResponseEntity.ok(baiVietService.createBaiViet(request, anhBiaFile));
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<BaiVietResponse> updateBaiViet(
            @PathVariable Integer id,
            @RequestPart("data") String dataJson,
            @RequestPart(value = "anhBia", required = false) MultipartFile anhBiaFile) throws JsonProcessingException {
        
        BaiVietRequest request = objectMapper.readValue(dataJson, BaiVietRequest.class);
        return ResponseEntity.ok(baiVietService.updateBaiViet(id, request, anhBiaFile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBaiViet(@PathVariable Integer id) {
        baiVietService.deleteBaiViet(id);
        return ResponseEntity.ok(Map.of("message", "Xóa bài viết thành công"));
    }
}
