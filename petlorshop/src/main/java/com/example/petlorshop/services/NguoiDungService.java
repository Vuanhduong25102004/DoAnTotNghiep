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

    @Transactional
    public NguoiDungResponse createUnifiedUser(UnifiedCreateUserRequest request, MultipartFile anhDaiDien) {
        // Kiểm tra trùng lặp
        if (nguoiDungRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng.");
        }
        if (StringUtils.hasText(request.getSoDienThoai()) && nguoiDungRepository.findBySoDienThoai(request.getSoDienThoai()).isPresent()) {
            throw new RuntimeException("Số điện thoại đã được sử dụng.");
        }

        // Mặc định role là USER nếu không được cung cấp
        Role role = request.getRole();
        if (role == null) {
            role = Role.USER;
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
        newUser.setAnhDaiDien(fileName); // Lưu ảnh
        NguoiDung savedUser = nguoiDungRepository.save(newUser);

        // 2. Nếu là vai trò nhân viên, tạo thêm NhanVien
        if (role == Role.DOCTOR || role == Role.SPA || role == Role.STAFF || role == Role.RECEPTIONIST) {
            NhanVien newNhanVien = new NhanVien();
            newNhanVien.setHoTen(savedUser.getHoTen());
            newNhanVien.setEmail(savedUser.getEmail());
            newNhanVien.setSoDienThoai(savedUser.getSoDienThoai());
            
            // Tự động chọn chức vụ nếu không được cung cấp
            if (StringUtils.hasText(request.getChucVu())) {
                newNhanVien.setChucVu(request.getChucVu());
            } else {
                newNhanVien.setChucVu(getDefaultTitleForRole(role));
            }

            newNhanVien.setChuyenKhoa(request.getChuyenKhoa());
            newNhanVien.setKinhNghiem(request.getKinhNghiem());
            newNhanVien.setAnhDaiDien(fileName); // Lưu ảnh cho nhân viên luôn
            newNhanVien.setNguoiDung(savedUser);
            nhanVienRepository.save(newNhanVien);
        }

        // 3. Trả về response
        Integer nhanVienId = (savedUser.getNhanVien() != null) ? savedUser.getNhanVien().getNhanVienId() : null;
        return new NguoiDungResponse(
                savedUser.getUserId(),
                savedUser.getHoTen(),
                savedUser.getEmail(),
                savedUser.getSoDienThoai(),
                savedUser.getDiaChi(),
                savedUser.getAnhDaiDien(),
                savedUser.getNgayTao(),
                savedUser.getRole(),
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

    @Transactional
    public NguoiDung updateNguoiDung(Integer id, NguoiDungUpdateRequest request, MultipartFile anhDaiDien) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NguoiDung not found with id: " + id));

        // Kiểm tra trùng email
        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equals(nguoiDung.getEmail())) {
            nguoiDungRepository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
                throw new RuntimeException("Email đã được sử dụng bởi người dùng khác.");
            });
            nguoiDung.setEmail(request.getEmail());
        }

        // Kiểm tra trùng số điện thoại
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
        if (request.getRole() != null && request.getRole() != nguoiDung.getRole()) {
            nguoiDung.setRole(request.getRole());
            roleChanged = true;
        }

        if (anhDaiDien != null && !anhDaiDien.isEmpty()) {
            String fileName = fileStorageService.storeFile(anhDaiDien);
            nguoiDung.setAnhDaiDien(fileName);
        }

        NguoiDung savedUser = nguoiDungRepository.save(nguoiDung);

        // Đồng bộ thông tin với NhanVien nếu có
        if (savedUser.getNhanVien() != null) {
            NhanVien nhanVien = savedUser.getNhanVien();
            nhanVien.setHoTen(savedUser.getHoTen());
            nhanVien.setSoDienThoai(savedUser.getSoDienThoai());
            nhanVien.setEmail(savedUser.getEmail());
            nhanVien.setAnhDaiDien(savedUser.getAnhDaiDien()); // Đồng bộ ảnh
            
            // Nếu role thay đổi, tự động cập nhật chức vụ
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

        // Nếu người dùng này cũng là nhân viên, cập nhật ảnh cho nhân viên
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
