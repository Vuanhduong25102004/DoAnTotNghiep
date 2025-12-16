package com.example.petlorshop.services;

import com.example.petlorshop.dto.ThuCungRequest;
import com.example.petlorshop.dto.ThuCungUpdateRequest;
import com.example.petlorshop.models.NguoiDung;
import com.example.petlorshop.models.Role;
import com.example.petlorshop.models.ThuCung;
import com.example.petlorshop.repositories.NguoiDungRepository;
import com.example.petlorshop.repositories.ThuCungRepository;
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
public class ThuCungService {

    @Autowired
    private ThuCungRepository thuCungRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileStorageService fileStorageService;

    public Page<ThuCung> getAllThuCung(Pageable pageable) {
        return thuCungRepository.findAll(pageable);
    }

    public Optional<ThuCung> getThuCungById(Integer id) {
        return thuCungRepository.findById(id);
    }

    @Transactional
    public ThuCung createThuCung(ThuCungRequest request, MultipartFile hinhAnh) {
        // Logic "Find or Create" NguoiDung
        NguoiDung chuSoHuu = findOrCreateOwner(request);

        String fileName = null;
        if (hinhAnh != null && !hinhAnh.isEmpty()) {
            fileName = fileStorageService.storeFile(hinhAnh);
        }

        ThuCung thuCung = new ThuCung();
        thuCung.setTenThuCung(request.getTenThuCung());
        thuCung.setChungLoai(request.getChungLoai());
        thuCung.setGiongLoai(request.getGiongLoai());
        thuCung.setNgaySinh(request.getNgaySinh());
        thuCung.setGioiTinh(request.getGioiTinh());
        thuCung.setGhiChuSucKhoe(request.getGhiChuSucKhoe());
        thuCung.setHinhAnh(fileName);
        thuCung.setNguoiDung(chuSoHuu);

        return thuCungRepository.save(thuCung);
    }

    private NguoiDung findOrCreateOwner(ThuCungRequest request) {
        // Ưu tiên 1: Tìm theo userId nếu có
        if (request.getUserId() != null) {
            return nguoiDungRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + request.getUserId()));
        }

        // Ưu tiên 2: Tìm theo số điện thoại
        if (StringUtils.hasText(request.getSoDienThoaiChuSoHuu())) {
            Optional<NguoiDung> existingUser = nguoiDungRepository.findBySoDienThoai(request.getSoDienThoaiChuSoHuu());
            if (existingUser.isPresent()) {
                return existingUser.get();
            }

            // Nếu không tìm thấy, tạo người dùng mới
            if (!StringUtils.hasText(request.getTenChuSoHuu())) {
                throw new IllegalArgumentException("Tên chủ sở hữu là bắt buộc khi tạo người dùng mới.");
            }
            NguoiDung newUser = new NguoiDung();
            newUser.setHoTen(request.getTenChuSoHuu());
            newUser.setSoDienThoai(request.getSoDienThoaiChuSoHuu());
            // Email có thể để trống hoặc tạo email giả
            newUser.setEmail(request.getSoDienThoaiChuSoHuu() + "@petshop.local");
            // Mật khẩu mặc định là số điện thoại
            newUser.setMatKhau(passwordEncoder.encode(request.getSoDienThoaiChuSoHuu()));
            newUser.setRole(Role.USER);
            return nguoiDungRepository.save(newUser);
        }

        throw new IllegalArgumentException("Cần cung cấp userId hoặc Số điện thoại của chủ sở hữu.");
    }


    public ThuCung updateThuCung(Integer id, ThuCungUpdateRequest request, MultipartFile hinhAnh) {
        ThuCung thuCung = thuCungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + id));

        if (hinhAnh != null && !hinhAnh.isEmpty()) {
            String fileName = fileStorageService.storeFile(hinhAnh);
            thuCung.setHinhAnh(fileName);
        }

        thuCung.setTenThuCung(request.getTenThuCung());
        thuCung.setChungLoai(request.getChungLoai());
        thuCung.setGiongLoai(request.getGiongLoai());
        thuCung.setNgaySinh(request.getNgaySinh());
        thuCung.setGioiTinh(request.getGioiTinh());
        thuCung.setGhiChuSucKhoe(request.getGhiChuSucKhoe());

        return thuCungRepository.save(thuCung);
    }

    public void deleteThuCung(Integer id) {
        if (!thuCungRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy thú cưng với ID: " + id);
        }
        thuCungRepository.deleteById(id);
    }
}
