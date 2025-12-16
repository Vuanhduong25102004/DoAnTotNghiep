package com.example.petlorshop.controllers;

import com.example.petlorshop.dto.NguoiDungResponse;
import com.example.petlorshop.dto.NguoiDungUpdateRequest;
import com.example.petlorshop.dto.UnifiedCreateUserRequest;
import com.example.petlorshop.models.NguoiDung;
import com.example.petlorshop.services.NguoiDungService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/nguoi-dung")
public class NguoiDungController {

    @Autowired
    private NguoiDungService nguoiDungService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(value = "/create-unified", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<NguoiDungResponse> createUnifiedUser(@RequestPart("nguoiDung") String userJson,
                                               @RequestPart(name = "anhDaiDien", required = false) MultipartFile anhDaiDien) throws JsonProcessingException {
        UnifiedCreateUserRequest request = objectMapper.readValue(userJson, UnifiedCreateUserRequest.class);
        NguoiDungResponse response = nguoiDungService.createUnifiedUser(request, anhDaiDien);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    private NguoiDungResponse toNguoiDungResponse(NguoiDung user) {
        Integer nhanVienId = (user.getNhanVien() != null) ? user.getNhanVien().getNhanVienId() : null;
        return new NguoiDungResponse(
                user.getUserId(),
                user.getHoTen(),
                user.getEmail(),
                user.getSoDienThoai(),
                user.getDiaChi(),
                user.getAnhDaiDien(),
                user.getNgayTao(),
                user.getRole(),
                nhanVienId
        );
    }

    @GetMapping
    public Page<NguoiDungResponse> getAllNguoiDung(Pageable pageable) {
        return nguoiDungService.getAllNguoiDung(pageable).map(this::toNguoiDungResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NguoiDungResponse> getNguoiDungById(@PathVariable Integer id) {
        NguoiDung user = nguoiDungService.getNguoiDungById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
        return ResponseEntity.ok(toNguoiDungResponse(user));
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<NguoiDungResponse> updateNguoiDung(@PathVariable Integer id,
                                             @RequestPart("nguoiDung") String nguoiDungJson,
                                             @RequestPart(name = "anhDaiDien", required = false) MultipartFile anhDaiDien) throws JsonProcessingException {
        NguoiDungUpdateRequest request = objectMapper.readValue(nguoiDungJson, NguoiDungUpdateRequest.class);
        NguoiDung updatedNguoiDung = nguoiDungService.updateNguoiDung(id, request, anhDaiDien);
        return ResponseEntity.ok(toNguoiDungResponse(updatedNguoiDung));
    }

    @PutMapping(value = "/me/avatar", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<NguoiDungResponse> updateMyAvatar(@RequestPart("avatar") MultipartFile avatarFile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        NguoiDung updatedUser = nguoiDungService.updateAvatar(userEmail, avatarFile);
        return ResponseEntity.ok(toNguoiDungResponse(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNguoiDung(@PathVariable Integer id) {
        nguoiDungService.deleteNguoiDung(id);
        return ResponseEntity.ok(Map.of("message", "Xóa người dùng thành công"));
    }
}
