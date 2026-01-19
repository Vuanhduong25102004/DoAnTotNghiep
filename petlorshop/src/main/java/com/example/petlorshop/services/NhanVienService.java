package com.example.petlorshop.services;

import com.example.petlorshop.dto.DoctorDashboardStatsResponse;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class NhanVienService {

    @Autowired private NhanVienRepository nhanVienRepository;
    @Autowired private LichHenRepository lichHenRepository;
    @Autowired private NguoiDungRepository nguoiDungRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private FileStorageService fileStorageService;

    private static final List<String> INVALID_ROLES = Arrays.asList("USER", "ADMIN");

    @Transactional
    public NhanVienResponse createNhanVien(NhanVienRequest request, MultipartFile anhDaiDien) {
        if (nguoiDungRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng.");
        }
        if (StringUtils.hasText(request.getSoDienThoai()) && nguoiDungRepository.findBySoDienThoai(request.getSoDienThoai()).isPresent()) {
            throw new RuntimeException("Số điện thoại đã được sử dụng.");
        }
        if (!StringUtils.hasText(request.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu là bắt buộc khi tạo nhân viên mới.");
        }
        String roleStr = request.getRole();
        if (roleStr == null || INVALID_ROLES.contains(roleStr.toUpperCase())) {
            throw new IllegalArgumentException("Vai trò không hợp lệ. Phải là một vai trò nhân viên (ví dụ: STAFF, DOCTOR).");
        }

        Role role;
        try {
            role = Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Vai trò không hợp lệ: " + roleStr);
        }

        // Tự động set chức vụ theo role
        request.setChucVu(getChucVuByRole(role));

        String fileName = null;
        if (anhDaiDien != null && !anhDaiDien.isEmpty()) {
            fileName = fileStorageService.storeFile(anhDaiDien);
        }

        NguoiDung newUser = new NguoiDung();
        newUser.setHoTen(request.getHoTen());
        newUser.setEmail(request.getEmail());
        newUser.setMatKhau(passwordEncoder.encode(request.getPassword()));
        newUser.setSoDienThoai(request.getSoDienThoai());
        newUser.setDiaChi(request.getDiaChi());
        newUser.setRole(role);
        newUser.setAnhDaiDien(fileName);
        NguoiDung savedUser = nguoiDungRepository.save(newUser);

        NhanVien newNhanVien = new NhanVien();
        mapRequestToEntity(newNhanVien, request);
        newNhanVien.setAnhDaiDien(fileName);
        newNhanVien.setNguoiDung(savedUser);
        NhanVien savedNhanVien = nhanVienRepository.save(newNhanVien);

        return convertToResponse(savedNhanVien);
    }

    @Transactional
    public NhanVienResponse updateNhanVien(Integer id, NhanVienRequest request, MultipartFile anhDaiDien) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại với id: " + id));
        
        NguoiDung nguoiDung = nhanVien.getNguoiDung();
        boolean isNewUser = false;

        if (nguoiDung == null) {
            nguoiDung = new NguoiDung();
            isNewUser = true;
        }

        // Check Email
        if (StringUtils.hasText(request.getEmail())) {
            if (!request.getEmail().equals(nhanVien.getEmail())) {
                if (nhanVienRepository.findByEmail(request.getEmail()).isPresent()) {
                    throw new RuntimeException("Email đã được sử dụng bởi nhân viên khác.");
                }
            }
            
            Optional<NguoiDung> existingUser = nguoiDungRepository.findByEmail(request.getEmail());
            if (existingUser.isPresent()) {
                if (isNewUser || !existingUser.get().getUserId().equals(nguoiDung.getUserId())) {
                    throw new RuntimeException("Email đã được sử dụng bởi người dùng khác.");
                }
            }
            nguoiDung.setEmail(request.getEmail());
        } else if (isNewUser) {
            if (StringUtils.hasText(nhanVien.getEmail())) {
                 if (nguoiDungRepository.findByEmail(nhanVien.getEmail()).isPresent()) {
                      throw new RuntimeException("Email hiện tại của nhân viên đã được sử dụng bởi tài khoản khác.");
                 }
                 nguoiDung.setEmail(nhanVien.getEmail());
            } else {
                throw new IllegalArgumentException("Email là bắt buộc để tạo tài khoản người dùng.");
            }
        }

        // Check Phone
        if (StringUtils.hasText(request.getSoDienThoai())) {
            if (!request.getSoDienThoai().equals(nhanVien.getSoDienThoai()) || isNewUser) {
                Optional<NguoiDung> existingUser = nguoiDungRepository.findBySoDienThoai(request.getSoDienThoai());
                if (existingUser.isPresent()) {
                    if (isNewUser || !existingUser.get().getUserId().equals(nguoiDung.getUserId())) {
                        throw new RuntimeException("Số điện thoại đã được sử dụng.");
                    }
                }
            }
            nguoiDung.setSoDienThoai(request.getSoDienThoai());
        }

        String fileName = nhanVien.getAnhDaiDien();
        if (anhDaiDien != null && !anhDaiDien.isEmpty()) {
            fileName = fileStorageService.storeFile(anhDaiDien);
        }

        nguoiDung.setHoTen(request.getHoTen());
        nguoiDung.setDiaChi(request.getDiaChi());
        nguoiDung.setAnhDaiDien(fileName);
        
        if (StringUtils.hasText(request.getPassword())) {
            nguoiDung.setMatKhau(passwordEncoder.encode(request.getPassword()));
        } else if (isNewUser) {
            throw new IllegalArgumentException("Mật khẩu là bắt buộc để tạo tài khoản người dùng mới.");
        }
        
        // Update Role và Chức vụ
        String roleStr = request.getRole();
        if (roleStr != null && !INVALID_ROLES.contains(roleStr.toUpperCase())) {
            try {
                Role role = Role.valueOf(roleStr.toUpperCase());
                nguoiDung.setRole(role);
                // Tự động cập nhật chức vụ theo role mới
                request.setChucVu(getChucVuByRole(role));
            } catch (IllegalArgumentException e) {
                // Ignore invalid role
            }
        } else if (isNewUser) {
            nguoiDung.setRole(Role.STAFF);
            request.setChucVu(getChucVuByRole(Role.STAFF));
        }
        
        NguoiDung savedUser = nguoiDungRepository.save(nguoiDung);

        mapRequestToEntity(nhanVien, request);
        nhanVien.setAnhDaiDien(fileName);
        nhanVien.setNguoiDung(savedUser);
        
        if (nhanVien.getEmail() == null) {
            nhanVien.setEmail(savedUser.getEmail());
        }

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
        nhanVienRepository.delete(nhanVien);
    }

    public boolean isTimeSlotAvailable(Integer nhanVienId, LocalDateTime start, LocalDateTime end) {
        if (!nhanVienRepository.existsById(nhanVienId)) {
            throw new RuntimeException("Không tìm thấy nhân viên với ID: " + nhanVienId);
        }
        return lichHenRepository.findOverlappingAppointments(nhanVienId, start, end).isEmpty();
    }

    public DoctorDashboardStatsResponse getDoctorDashboardStats(Integer userId) {
        NhanVien nhanVien = nhanVienRepository.findByNguoiDung_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với User ID: " + userId));
        
        Integer nhanVienId = nhanVien.getNhanVienId();
        
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        long lichKhamHomNay = lichHenRepository.countLichHenByTimeRange(nhanVienId, startOfDay, endOfDay);
        long soCaKhanCap = lichHenRepository.countCaKhanCapByTimeRange(nhanVienId, LichHen.LoaiLichHen.KHAN_CAP, startOfDay, endOfDay);
        long benhNhanDaTiepNhan = lichHenRepository.countBenhNhanDaTiepNhan(nhanVienId, LichHen.TrangThai.DA_HOAN_THANH);
        
        return new DoctorDashboardStatsResponse(lichKhamHomNay, soCaKhanCap, benhNhanDaTiepNhan);
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
                nhanVien.getNguoiDung() != null ? nhanVien.getNguoiDung().getRole() : null, // Đã sửa: truyền trực tiếp Enum Role
                nhanVien.getNguoiDung() != null ? nhanVien.getNguoiDung().getUserId() : null
        );
    }

    private String getChucVuByRole(Role role) {
        if (role == null) return "Nhân viên";
        switch (role) {
            case DOCTOR: return "Bác sĩ thú y";
            case SPA: return "Nhân viên Spa";
            case RECEPTIONIST: return "Lễ tân";
            case ADMIN: return "Quản lý";
            case STAFF: return "Nhân viên cửa hàng";
            default: return "Nhân viên";
        }
    }
}
