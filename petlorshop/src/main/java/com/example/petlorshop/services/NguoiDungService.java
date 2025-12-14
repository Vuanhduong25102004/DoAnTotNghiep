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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

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

    @Transactional
    public NguoiDungResponse createUnifiedUser(UnifiedCreateUserRequest request) {
        if (nguoiDungRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng.");
        }

        // Mặc định role là USER nếu không được cung cấp
        Role role = request.getRole();
        if (role == null) {
            role = Role.USER;
        }

        // 1. Tạo NguoiDung
        NguoiDung newUser = new NguoiDung();
        newUser.setHoTen(request.getHoTen());
        newUser.setEmail(request.getEmail());
        newUser.setMatKhau(passwordEncoder.encode(request.getPassword()));
        newUser.setSoDienThoai(request.getSoDienThoai());
        newUser.setDiaChi(request.getDiaChi());
        newUser.setRole(role);
        NguoiDung savedUser = nguoiDungRepository.save(newUser);

        // 2. Nếu là vai trò nhân viên, tạo thêm NhanVien
        if (role == Role.DOCTOR || role == Role.SPA || role == Role.STAFF) {
            NhanVien newNhanVien = new NhanVien();
            newNhanVien.setHoTen(savedUser.getHoTen());
            newNhanVien.setEmail(savedUser.getEmail());
            newNhanVien.setSoDienThoai(savedUser.getSoDienThoai());
            newNhanVien.setChucVu(request.getChucVu());
            newNhanVien.setChuyenKhoa(request.getChuyenKhoa());
            newNhanVien.setKinhNghiem(request.getKinhNghiem());
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
                savedUser.getNgayTao(),
                savedUser.getRole(),
                nhanVienId
        );
    }

    public List<NguoiDung> getAllNguoiDung() {
        return nguoiDungRepository.findAll();
    }

    public Optional<NguoiDung> getNguoiDungById(Integer id) {
        return nguoiDungRepository.findById(id);
    }

    @Transactional
    public NguoiDung updateNguoiDung(Integer id, NguoiDungUpdateRequest request) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NguoiDung not found with id: " + id));

        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equals(nguoiDung.getEmail())) {
            nguoiDungRepository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
                throw new RuntimeException("Email đã được sử dụng bởi người dùng khác.");
            });
            nguoiDung.setEmail(request.getEmail());
        }

        nguoiDung.setHoTen(request.getHoTen());
        nguoiDung.setSoDienThoai(request.getSoDienThoai());
        nguoiDung.setDiaChi(request.getDiaChi());

        if (StringUtils.hasText(request.getPassword())) {
            nguoiDung.setMatKhau(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() != null) {
            nguoiDung.setRole(request.getRole());
        }

        NguoiDung savedUser = nguoiDungRepository.save(nguoiDung);

        if (savedUser.getNhanVien() != null) {
            NhanVien nhanVien = savedUser.getNhanVien();
            nhanVien.setHoTen(savedUser.getHoTen());
            nhanVien.setSoDienThoai(savedUser.getSoDienThoai());
            nhanVien.setEmail(savedUser.getEmail());
            nhanVienRepository.save(nhanVien);
        }

        return savedUser;
    }

    public void deleteNguoiDung(Integer id) {
        if (!nguoiDungRepository.existsById(id)) {
            throw new RuntimeException("NguoiDung not found with id: " + id);
        }
        nguoiDungRepository.deleteById(id);
    }
}
