package com.example.petlorshop.controllers;

import com.example.petlorshop.dto.GuestAppointmentRequest;
import com.example.petlorshop.dto.LichHenRequest;
import com.example.petlorshop.dto.LichHenResponse;
import com.example.petlorshop.dto.LichHenUpdateRequest;
import com.example.petlorshop.models.LichHen;
import com.example.petlorshop.services.LichHenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lich-hen")
public class LichHenController {

    @Autowired
    private LichHenService lichHenService;

    @GetMapping
    public Page<LichHenResponse> getAllLichHen(Pageable pageable) {
        return lichHenService.getAllLichHen(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LichHenResponse> getLichHenById(@PathVariable Integer id) {
        return lichHenService.getLichHenById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn với ID: " + id));
    }

    @GetMapping("/me")
    public ResponseEntity<List<LichHenResponse>> getMyLichHen() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        List<LichHenResponse> myLichHen = lichHenService.getMyLichHen(userEmail);
        return ResponseEntity.ok(myLichHen);
    }
    
    @GetMapping("/me/{id}")
    public ResponseEntity<LichHenResponse> getMyLichHenDetail(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        return lichHenService.getMyLichHenDetail(userEmail, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // API cho bác sĩ xem lịch hẹn của mình
    @GetMapping("/doctor/me")
    public ResponseEntity<List<LichHenResponse>> getDoctorAppointments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        List<LichHenResponse> doctorAppointments = lichHenService.getDoctorAppointments(userEmail);
        return ResponseEntity.ok(doctorAppointments);
    }

    // API cho bác sĩ xác nhận lịch hẹn
    @PutMapping("/doctor/{id}/confirm")
    public ResponseEntity<LichHenResponse> confirmAppointment(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        LichHenResponse confirmedLichHen = lichHenService.confirmAppointment(userEmail, id);
        return ResponseEntity.ok(confirmedLichHen);
    }

    // API cho bác sĩ hoàn thành lịch hẹn
    @PutMapping("/doctor/{id}/complete")
    public ResponseEntity<LichHenResponse> completeAppointment(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        LichHenResponse completedLichHen = lichHenService.completeAppointment(userEmail, id);
        return ResponseEntity.ok(completedLichHen);
    }

    @PostMapping
    public ResponseEntity<LichHenResponse> createLichHen(@RequestBody LichHenRequest request) {
        LichHenResponse createdLichHen = lichHenService.createLichHen(request);
        return new ResponseEntity<>(createdLichHen, HttpStatus.CREATED);
    }
    
    @PostMapping("/guest")
    public ResponseEntity<LichHenResponse> createGuestAppointment(@RequestBody GuestAppointmentRequest request) {
        LichHenResponse createdLichHen = lichHenService.createGuestAppointment(request);
        return new ResponseEntity<>(createdLichHen, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LichHen> updateLichHen(@PathVariable Integer id, @RequestBody LichHenUpdateRequest request) {
        LichHen updatedLichHen = lichHenService.updateLichHen(id, request);
        return ResponseEntity.ok(updatedLichHen);
    }

    @PutMapping("/me/{id}")
    public ResponseEntity<LichHenResponse> updateMyLichHen(@PathVariable Integer id, @RequestBody LichHenUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        LichHenResponse updatedLichHen = lichHenService.updateMyLichHen(userEmail, id, request);
        return ResponseEntity.ok(updatedLichHen);
    }

    @PutMapping("/me/{id}/cancel")
    public ResponseEntity<LichHenResponse> cancelMyLichHen(@PathVariable Integer id, @RequestBody(required = false) Map<String, String> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        String lyDoHuy = body != null ? body.get("lyDoHuy") : null;
        LichHenResponse cancelledLichHen = lichHenService.cancelMyLichHen(userEmail, id, lyDoHuy);
        return ResponseEntity.ok(cancelledLichHen);
    }
    
    @GetMapping("/ly-do-huy")
    public ResponseEntity<List<String>> getLyDoHuyLichOptions() {
        return ResponseEntity.ok(lichHenService.getLyDoHuyLichOptions());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteLichHen(@PathVariable Integer id) {
        lichHenService.deleteLichHen(id);
        return ResponseEntity.ok(Map.of("message", "Xóa lịch hẹn thành công"));
    }
}
