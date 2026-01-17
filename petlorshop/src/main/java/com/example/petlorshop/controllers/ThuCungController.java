package com.example.petlorshop.controllers;

import com.example.petlorshop.dto.HoSoBenhAnResponse;
import com.example.petlorshop.dto.ThuCungRequest;
import com.example.petlorshop.dto.ThuCungResponse;
import com.example.petlorshop.dto.ThuCungUpdateRequest;
import com.example.petlorshop.models.ThuCung;
import com.example.petlorshop.services.ThuCungService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/thu-cung")
public class ThuCungController {

    @Autowired
    private ThuCungService thuCungService;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());


    private ThuCungResponse toThuCungResponse(ThuCung thuCung) {
        return new ThuCungResponse(
                thuCung.getThuCungId(),
                thuCung.getTenThuCung(),
                thuCung.getChungLoai(),
                thuCung.getGiongLoai(),
                thuCung.getNgaySinh(),
                thuCung.getGioiTinh(),
                thuCung.getCanNang(), // Thêm canNang
                thuCung.getGhiChuSucKhoe(),
                thuCung.getHinhAnh(),
                thuCung.getNguoiDung().getUserId(),
                thuCung.getNguoiDung().getHoTen(),
                thuCung.getNguoiDung().getSoDienThoai()
        );
    }

    @GetMapping
    public Page<ThuCungResponse> getAllThuCung(Pageable pageable) {
        return thuCungService.getAllThuCung(pageable).map(this::toThuCungResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThuCungResponse> getThuCungById(@PathVariable Integer id) {
        return thuCungService.getThuCungById(id)
                .map(thuCung -> ResponseEntity.ok(toThuCungResponse(thuCung)))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + id));
    }

    @GetMapping("/me")
    public ResponseEntity<List<ThuCungResponse>> getMyPets() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        List<ThuCung> myPets = thuCungService.getMyPets(userEmail);
        List<ThuCungResponse> response = myPets.stream()
                .map(this::toThuCungResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/{id}")
    public ResponseEntity<ThuCungResponse> getMyPetById(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        ThuCung thuCung = thuCungService.getMyPetById(userEmail, id);
        return ResponseEntity.ok(toThuCungResponse(thuCung));
    }

    @PostMapping(value = "/me", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ThuCungResponse> addMyPet(@RequestPart("thuCung") String thuCungJson,
                                                    @RequestPart(name = "hinhAnh", required = false) MultipartFile hinhAnh) throws JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        ThuCungRequest request = objectMapper.readValue(thuCungJson, ThuCungRequest.class);
        ThuCung createdThuCung = thuCungService.addMyPet(userEmail, request, hinhAnh);
        return new ResponseEntity<>(toThuCungResponse(createdThuCung), HttpStatus.CREATED);
    }

    @PutMapping(value = "/me/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ThuCungResponse> updateMyPet(@PathVariable Integer id,
                                                       @RequestPart("thuCung") String thuCungUpdateJson,
                                                       @RequestPart(name = "hinhAnh", required = false) MultipartFile hinhAnh) throws JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        ThuCungUpdateRequest request = objectMapper.readValue(thuCungUpdateJson, ThuCungUpdateRequest.class);
        ThuCung updatedThuCung = thuCungService.updateMyPet(userEmail, id, request, hinhAnh);
        return ResponseEntity.ok(toThuCungResponse(updatedThuCung));
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ThuCungResponse> createThuCung(@RequestPart("thuCung") String thuCungJson,
                                                         @RequestPart(name = "hinhAnh", required = false) MultipartFile hinhAnh) throws JsonProcessingException {
        ThuCungRequest request = objectMapper.readValue(thuCungJson, ThuCungRequest.class);
        ThuCung createdThuCung = thuCungService.createThuCung(request, hinhAnh);
        return new ResponseEntity<>(toThuCungResponse(createdThuCung), HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ThuCungResponse> updateThuCung(@PathVariable Integer id,
                                                         @RequestPart("thuCung") String thuCungUpdateJson,
                                                         @RequestPart(name = "hinhAnh", required = false) MultipartFile hinhAnh) throws JsonProcessingException {
        ThuCungUpdateRequest request = objectMapper.readValue(thuCungUpdateJson, ThuCungUpdateRequest.class);
        ThuCung updatedThuCung = thuCungService.updateThuCung(id, request, hinhAnh);
        return ResponseEntity.ok(toThuCungResponse(updatedThuCung));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteThuCung(@PathVariable Integer id) {
        thuCungService.deleteThuCung(id);
        return ResponseEntity.ok(Map.of("message", "Xóa thú cưng thành công"));
    }
    
    @GetMapping("/{id}/ho-so-benh-an")
    public ResponseEntity<HoSoBenhAnResponse> getHoSoBenhAn(@PathVariable Integer id) {
        HoSoBenhAnResponse hoSo = thuCungService.getHoSoBenhAn(id);
        return ResponseEntity.ok(hoSo);
    }
}
