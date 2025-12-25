package com.example.petlorshop.services;

import com.example.petlorshop.dto.NguoiDungResponse;
import com.example.petlorshop.dto.NguoiDungUpdateRequest;
import com.example.petlorshop.dto.UnifiedCreateUserRequest;
import com.example.petlorshop.models.NguoiDung;
import com.example.petlorshop.models.NhanVien;
import com.example.petlorshop.models.Role;
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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class NguoiDungService {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileStorageService fileStorageService;

    private static final List<Role> STAFF_ROLES = Arrays.asList(Role.DOCTOR, Role.SPA, Role.STAFF, Role.RECEPTIONIST);

    @Transactional
    public NguoiDungResponse createUnifiedUser(UnifiedCreateUserRequest request, MultipartFile anhDaiDien) {
        if (nguoiDungRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng.");
        }
        if (StringUtils.hasText(request.getSoDienThoai()) && nguoiDungRepository.findBySoDienThoai(request.getSoDienThoai()).isPresent()) {
            throw new RuntimeException("Số điện thoại đã được sử dụng.");
        }

        Role role = Role.USER;
        if (StringUtils.hasText(request.getRole())) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Nếu role không hợp lệ, giữ mặc định là USER hoặc ném lỗi tùy logic
                role = Role.USER;
            }
        }

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

        if (STAFF_ROLES.contains(role)) {
            NhanVien newNhanVien = new NhanVien();
            newNhanVien.setHoTen(savedUser.getHoTen());
            newNhanVien.setEmail(savedUser.getEmail());
            newNhanVien.setSoDienThoai(savedUser.getSoDienThoai());
            
            if (StringUtils.hasText(request.getChucVu())) {
                newNhanVien.setChucVu(request.getChucVu());
            } else {
                newNhanVien.setChucVu(getDefaultTitleForRole(role));
            }

            newNhanVien.setChuyenKhoa(request.getChuyenKhoa());
            newNhanVien.setKinhNghiem(request.getKinhNghiem());
            newNhanVien.setAnhDaiDien(fileName);
            newNhanVien.setNguoiDung(savedUser);
            nhanVienRepository.save(newNhanVien);
        }

        Integer nhanVienId = (savedUser.getNhanVien() != null) ? savedUser.getNhanVien().getNhanVienId() : null;
        return new NguoiDungResponse(
                savedUser.getUserId(),
                savedUser.getHoTen(),
                savedUser.getEmail(),
                savedUser.getSoDienThoai(),
                savedUser.getDiaChi(),
                savedUser.getAnhDaiDien(),
                savedUser.getNgayTao(),
                savedUser.getRole(), // Đã sửa: truyền trực tiếp Enum Role
                nhanVienId
        );
    }

    private String getDefaultTitleForRole(Role role) {
        switch (role) {
            case DOCTOR: return "Bác sĩ thú y";
            case SPA: return "Nhân viên Spa/Grooming";
            case RECEPTIONIST: return "Lễ tân";
            case STAFF: return "Nhân viên cửa hàng";
            case ADMIN: return "Admin";
            default: return "Nhân viên";
        }
    }

    public Page<NguoiDung> getAllNguoiDung(Pageable pageable) {
        return nguoiDungRepository.findAll(pageable);
    }

    public Optional<NguoiDung> getNguoiDungById(Integer id) {
        return nguoiDungRepository.findById(id);
    }

    public NguoiDung getNguoiDungByEmail(String email) {
        return nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));
    }

    @Transactional
    public NguoiDung updateNguoiDung(Integer id, NguoiDungUpdateRequest request, MultipartFile anhDaiDien) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NguoiDung not found with id: " + id));

        return updateNguoiDungInternal(nguoiDung, request, anhDaiDien);
    }

    @Transactional
    public NguoiDung updateMyProfile(String email, NguoiDungUpdateRequest request, MultipartFile anhDaiDien) {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Prevent users from changing their own role via profile update
        request.setRole(null); 
        
        return updateNguoiDungInternal(nguoiDung, request, anhDaiDien);
    }

    private NguoiDung updateNguoiDungInternal(NguoiDung nguoiDung, NguoiDungUpdateRequest request, MultipartFile anhDaiDien) {
        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equals(nguoiDung.getEmail())) {
            nguoiDungRepository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
                throw new RuntimeException("Email đã được sử dụng bởi người dùng khác.");
            });
            nguoiDung.setEmail(request.getEmail());
        }

        if (StringUtils.hasText(request.getSoDienThoai()) && !request.getSoDienThoai().equals(nguoiDung.getSoDienThoai())) {
            nguoiDungRepository.findBySoDienThoai(request.getSoDienThoai()).ifPresent(existingUser -> {
                throw new RuntimeException("Số điện thoại đã được sử dụng bởi người dùng khác.");
            });
            nguoiDung.setSoDienThoai(request.getSoDienThoai());
        }

        nguoiDung.setHoTen(request.getHoTen());
        nguoiDung.setDiaChi(request.getDiaChi());

        if (StringUtils.hasText(request.getPassword())) {
            nguoiDung.setMatKhau(passwordEncoder.encode(request.getPassword()));
        }

        boolean roleChanged = false;
        if (request.getRole() != null) {
            try {
                Role newRole = Role.valueOf(request.getRole().toUpperCase());
                if (newRole != nguoiDung.getRole()) {
                    nguoiDung.setRole(newRole);
                    roleChanged = true;
                }
            } catch (IllegalArgumentException e) {
                // Ignore invalid role update
            }
        }

        if (anhDaiDien != null && !anhDaiDien.isEmpty()) {
            String fileName = fileStorageService.storeFile(anhDaiDien);
            nguoiDung.setAnhDaiDien(fileName);
        }

        NguoiDung savedUser = nguoiDungRepository.save(nguoiDung);

        if (savedUser.getNhanVien() != null) {
            NhanVien nhanVien = savedUser.getNhanVien();
            nhanVien.setHoTen(savedUser.getHoTen());
            nhanVien.setSoDienThoai(savedUser.getSoDienThoai());
            nhanVien.setEmail(savedUser.getEmail());
            nhanVien.setAnhDaiDien(savedUser.getAnhDaiDien());
            
            if (roleChanged) {
                nhanVien.setChucVu(getDefaultTitleForRole(savedUser.getRole()));
            }
            
            nhanVienRepository.save(nhanVien);
        }

        return savedUser;
    }

    @Transactional
    public NguoiDung updateAvatar(String email, MultipartFile avatarFile) {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String fileName = fileStorageService.storeFile(avatarFile);
        nguoiDung.setAnhDaiDien(fileName);

        if (nguoiDung.getNhanVien() != null) {
            NhanVien nhanVien = nguoiDung.getNhanVien();
            nhanVien.setAnhDaiDien(fileName);
            nhanVienRepository.save(nhanVien);
        }

        return nguoiDungRepository.save(nguoiDung);
    }

    public void deleteNguoiDung(Integer id) {
        if (!nguoiDungRepository.existsById(id)) {
            throw new RuntimeException("NguoiDung not found with id: " + id);
        }
        nguoiDungRepository.deleteById(id);
    }
}
