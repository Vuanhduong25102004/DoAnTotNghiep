package com.example.petlorshop.services;

import com.example.petlorshop.dto.NhanVienRequest;
import com.example.petlorshop.dto.NhanVienResponse;
import com.example.petlorshop.models.LichHen;
import com.example.petlorshop.models.NguoiDung;
import com.example.petlorshop.models.NhanVien;
import com.example.petlorshop.models.Role;
import com.example.petlorshop.repositories.LichHenRepository;
import com.example.petlorshop.repositories.NguoiDungRepository;
import com.example.petlorshop.repositories.NhanVienRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class NhanVienService {

    @Autowired private NhanVienRepository nhanVienRepository;
    @Autowired private LichHenRepository lichHenRepository;
    @Autowired private NguoiDungRepository nguoiDungRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private FileStorageService fileStorageService;

    @Transactional
    public NhanVienResponse createNhanVien(NhanVienRequest request, MultipartFile anhDaiDien) {
        // Kiểm tra trùng lặp
        if (nguoiDungRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng.");
        }
        if (StringUtils.hasText(request.getSoDienThoai()) && nguoiDungRepository.findBySoDienThoai(request.getSoDienThoai()).isPresent()) {
            throw new RuntimeException("Số điện thoại đã được sử dụng.");
        }
        if (!StringUtils.hasText(request.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu là bắt buộc khi tạo nhân viên mới.");
        }
        Role role = request.getRole();
        if (role == null || role == Role.USER || role == Role.ADMIN) {
            throw new IllegalArgumentException("Vai trò không hợp lệ. Phải là DOCTOR, RECEPTIONIST, SPA hoặc STAFF.");
        }

        String fileName = null;
        if (anhDaiDien != null && !anhDaiDien.isEmpty()) {
            fileName = fileStorageService.storeFile(anhDaiDien);
        }

        // 1. Tạo NguoiDung
        NguoiDung newUser = new NguoiDung();
        newUser.setHoTen(request.getHoTen());
        newUser.setEmail(request.getEmail());
        newUser.setMatKhau(passwordEncoder.encode(request.getPassword()));
        newUser.setSoDienThoai(request.getSoDienThoai());
        newUser.setDiaChi(request.getDiaChi());
        newUser.setRole(role);
        newUser.setAnhDaiDien(fileName); // Cập nhật ảnh cho NguoiDung
        NguoiDung savedUser = nguoiDungRepository.save(newUser);

        // 2. Tạo NhanVien
        NhanVien newNhanVien = new NhanVien();
        mapRequestToEntity(newNhanVien, request);
        newNhanVien.setAnhDaiDien(fileName); // Cập nhật ảnh cho NhanVien
        newNhanVien.setNguoiDung(savedUser);
        NhanVien savedNhanVien = nhanVienRepository.save(newNhanVien);

        return convertToResponse(savedNhanVien);
    }

    @Transactional
    public NhanVienResponse updateNhanVien(Integer id, NhanVienRequest request, MultipartFile anhDaiDien) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại với id: " + id));
        NguoiDung nguoiDung = nhanVien.getNguoiDung();
        if (nguoiDung == null) {
            throw new IllegalStateException("Nhân viên này không có tài khoản người dùng liên kết.");
        }

        // Kiểm tra trùng email
        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equals(nguoiDung.getEmail())) {
            nguoiDungRepository.findByEmail(request.getEmail()).ifPresent(u -> {
                throw new RuntimeException("Email đã được sử dụng.");
            });
            nguoiDung.setEmail(request.getEmail());
        }

        // Kiểm tra trùng số điện thoại
        if (StringUtils.hasText(request.getSoDienThoai()) && !request.getSoDienThoai().equals(nguoiDung.getSoDienThoai())) {
            nguoiDungRepository.findBySoDienThoai(request.getSoDienThoai()).ifPresent(u -> {
                throw new RuntimeException("Số điện thoại đã được sử dụng.");
            });
            nguoiDung.setSoDienThoai(request.getSoDienThoai());
        }

        String fileName = nhanVien.getAnhDaiDien(); // Giữ ảnh cũ nếu không có ảnh mới
        if (anhDaiDien != null && !anhDaiDien.isEmpty()) {
            fileName = fileStorageService.storeFile(anhDaiDien);
        }

        // Cập nhật NguoiDung
        nguoiDung.setHoTen(request.getHoTen());
        nguoiDung.setDiaChi(request.getDiaChi());
        nguoiDung.setAnhDaiDien(fileName); // Cập nhật ảnh
        
        if (StringUtils.hasText(request.getPassword())) {
            nguoiDung.setMatKhau(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null && request.getRole() != Role.USER && request.getRole() != Role.ADMIN) {
            nguoiDung.setRole(request.getRole());
        }
        nguoiDungRepository.save(nguoiDung);

        // Cập nhật NhanVien
        mapRequestToEntity(nhanVien, request);
        nhanVien.setAnhDaiDien(fileName); // Cập nhật ảnh
        NhanVien updatedNhanVien = nhanVienRepository.save(nhanVien);
        
        return convertToResponse(updatedNhanVien);
    }

    public Page<NhanVienResponse> getAllNhanVien(Pageable pageable) {
        return nhanVienRepository.findAll(pageable).map(this::convertToResponse);
    }

    public Optional<NhanVienResponse> getNhanVienById(Integer id) {
        return nhanVienRepository.findById(id).map(this::convertToResponse);
    }

    public void deleteNhanVien(Integer id) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại với id: " + id));
        // Cân nhắc: Có nên xóa cả NguoiDung liên kết? Hiện tại là không.
        nhanVienRepository.delete(nhanVien);
    }

    public boolean isTimeSlotAvailable(Integer nhanVienId, LocalDateTime start, LocalDateTime end) {
        if (!nhanVienRepository.existsById(nhanVienId)) {
            throw new RuntimeException("Không tìm thấy nhân viên với ID: " + nhanVienId);
        }
        return lichHenRepository.findOverlappingAppointments(nhanVienId, start, end).isEmpty();
    }

    private void mapRequestToEntity(NhanVien nhanVien, NhanVienRequest request) {
        nhanVien.setHoTen(request.getHoTen());
        nhanVien.setEmail(request.getEmail());
        nhanVien.setSoDienThoai(request.getSoDienThoai());
        nhanVien.setChucVu(request.getChucVu());
        nhanVien.setChuyenKhoa(request.getChuyenKhoa());
        nhanVien.setKinhNghiem(request.getKinhNghiem());
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
                nhanVien.getAnhDaiDien(),
                nhanVien.getNguoiDung() != null ? nhanVien.getNguoiDung().getUserId() : null
        );
    }
}
