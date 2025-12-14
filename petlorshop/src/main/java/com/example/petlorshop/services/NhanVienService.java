package com.example.petlorshop.services;

import com.example.petlorshop.dto.NhanVienLichTrongResponse;
import com.example.petlorshop.dto.NhanVienRequest;
import com.example.petlorshop.dto.NhanVienResponse;
import com.example.petlorshop.models.LichHen;
import com.example.petlorshop.models.NguoiDung;
import com.example.petlorshop.models.NhanVien;
import com.example.petlorshop.repositories.LichHenRepository;
import com.example.petlorshop.repositories.NguoiDungRepository;
import com.example.petlorshop.repositories.NhanVienRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NhanVienService {

    @Autowired
    private NhanVienRepository nhanVienRepository;
    @Autowired
    private LichHenRepository lichHenRepository;
    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    public NhanVienLichTrongResponse getNhanVienWithAvailableSlots(Integer nhanVienId, LocalDate date) {
        // 1. Lấy thông tin nhân viên
        NhanVienResponse nhanVienResponse = this.getNhanVienById(nhanVienId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + nhanVienId));

        // 2. Lấy lịch trống
        List<String> availableSlots = this.getAvailableSlots(nhanVienId, date);

        // 3. Kết hợp lại và trả về
        return new NhanVienLichTrongResponse(nhanVienResponse, availableSlots);
    }

    public List<NhanVienResponse> getAllNhanVien() {
        return nhanVienRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Optional<NhanVienResponse> getNhanVienById(Integer id) {
        return nhanVienRepository.findById(id).map(this::convertToResponse);
    }

    @Transactional
    public NhanVien updateNhanVien(Integer id, NhanVienRequest request) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại với id: " + id));
        NguoiDung nguoiDung = nguoiDungRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại với id: " + request.getUserId()));
        if (nhanVien.getNguoiDung() != null && !nhanVien.getNguoiDung().getUserId().equals(request.getUserId())) {
            throw new RuntimeException("UserId không khớp với nhân viên này.");
        }
        mapRequestToEntity(request, nhanVien, nguoiDung);
        nguoiDung.setHoTen(request.getHoTen());
        nguoiDung.setSoDienThoai(request.getSoDienThoai());
        if (!nguoiDung.getEmail().equals(request.getEmail())) {
            if (nguoiDungRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email mới đã được sử dụng bởi người khác.");
            }
            nguoiDung.setEmail(request.getEmail());
        }
        nguoiDungRepository.save(nguoiDung);
        return nhanVienRepository.save(nhanVien);
    }

    public void deleteNhanVien(Integer id) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại với id: " + id));
        nhanVienRepository.delete(nhanVien);
    }

    public List<String> getAvailableSlots(Integer nhanVienId, LocalDate date) {
        List<LichHen> appointments = lichHenRepository.findByNhanVienIdAndDate(nhanVienId, date);
        final LocalTime workStart = LocalTime.of(8, 0);
        final LocalTime workEnd = LocalTime.of(17, 30);
        final LocalTime lunchStart = LocalTime.of(12, 0);
        final LocalTime lunchEnd = LocalTime.of(13, 30);
        final int slotDurationMinutes = 30;
        List<String> availableSlots = new ArrayList<>();
        LocalTime currentTime = workStart;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        while (currentTime.isBefore(workEnd)) {
            LocalTime slotStart = currentTime;
            LocalTime slotEnd = currentTime.plusMinutes(slotDurationMinutes);
            if (slotStart.isBefore(lunchEnd) && slotEnd.isAfter(lunchStart)) {
                currentTime = currentTime.plusMinutes(slotDurationMinutes);
                continue;
            }
            boolean isOverlapping = false;
            for (LichHen appointment : appointments) {
                LocalTime appointmentStart = appointment.getThoiGianBatDau().toLocalTime();
                LocalTime appointmentEnd = appointment.getThoiGianKetThuc().toLocalTime();
                if (slotStart.isBefore(appointmentEnd) && slotEnd.isAfter(appointmentStart)) {
                    isOverlapping = true;
                    break;
                }
            }
            if (!isOverlapping) {
                availableSlots.add(slotStart.format(formatter));
            }
            currentTime = currentTime.plusMinutes(slotDurationMinutes);
        }
        return availableSlots;
    }

    private NhanVienResponse convertToResponse(NhanVien nhanVien) {
        return new NhanVienResponse(
                nhanVien.getNhanVienId(),
                nhanVien.getHoTen(),
                nhanVien.getChucVu(),
                nhanVien.getSoDienThoai(),
                nhanVien.getEmail(),
                nhanVien.getChuyenKhoa(),
                nhanVien.getKinhNghiem(),
                nhanVien.getNguoiDung() != null ? nhanVien.getNguoiDung().getUserId() : null
        );
    }

    private void mapRequestToEntity(NhanVienRequest request, NhanVien nhanVien, NguoiDung nguoiDung) {
        nhanVien.setHoTen(request.getHoTen());
        nhanVien.setChucVu(request.getChucVu());
        nhanVien.setSoDienThoai(request.getSoDienThoai());
        nhanVien.setEmail(request.getEmail());
        nhanVien.setChuyenKhoa(request.getChuyenKhoa());
        nhanVien.setKinhNghiem(request.getKinhNghiem());
        nhanVien.setNguoiDung(nguoiDung);
    }
}
