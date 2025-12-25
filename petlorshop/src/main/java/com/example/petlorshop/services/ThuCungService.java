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

import java.util.List;
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

    public List<ThuCung> getMyPets(String email) {
        return thuCungRepository.findByNguoiDung_Email(email);
    }

    public ThuCung getMyPetById(String email, Integer id) {
        ThuCung thuCung = thuCungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + id));

        if (!thuCung.getNguoiDung().getEmail().equals(email)) {
            throw new RuntimeException("Bạn không có quyền truy cập thông tin thú cưng này.");
        }

        return thuCung;
    }

    @Transactional
    public ThuCung createThuCung(ThuCungRequest request, MultipartFile hinhAnh) {
        NguoiDung chuSoHuu = findOrCreateOwner(request.getUserId(), request.getTenChuSoHuu(), request.getSoDienThoaiChuSoHuu());
        return saveThuCungInternal(request, hinhAnh, chuSoHuu);
    }

    @Transactional
    public ThuCung addMyPet(String email, ThuCungRequest request, MultipartFile hinhAnh) {
        NguoiDung currentUser = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));
        
        return saveThuCungInternal(request, hinhAnh, currentUser);
    }

    private ThuCung saveThuCungInternal(ThuCungRequest request, MultipartFile hinhAnh, NguoiDung chuSoHuu) {
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

    // Refactor: Tách logic tìm/tạo chủ sở hữu ra để dùng chung
    private NguoiDung findOrCreateOwner(Integer userId, String tenChuSoHuu, String soDienThoai) {
        if (userId != null) {
            return nguoiDungRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
        }

        if (StringUtils.hasText(soDienThoai)) {
            Optional<NguoiDung> existingUser = nguoiDungRepository.findBySoDienThoai(soDienThoai);
            if (existingUser.isPresent()) {
                return existingUser.get();
            }

            if (!StringUtils.hasText(tenChuSoHuu)) {
                throw new IllegalArgumentException("Tên chủ sở hữu là bắt buộc khi tạo người dùng mới.");
            }
            NguoiDung newUser = new NguoiDung();
            newUser.setHoTen(tenChuSoHuu);
            newUser.setSoDienThoai(soDienThoai);
            newUser.setEmail(soDienThoai + "@petshop.local");
            newUser.setMatKhau(passwordEncoder.encode(soDienThoai));
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

        // Logic đổi chủ sở hữu: Kiểm tra xem có thông tin đổi chủ không
        if (request.getUserId() != null || StringUtils.hasText(request.getSoDienThoaiChuSoHuu())) {
            NguoiDung chuMoi = findOrCreateOwner(request.getUserId(), request.getTenChuSoHuu(), request.getSoDienThoaiChuSoHuu());
            thuCung.setNguoiDung(chuMoi);
        }

        return thuCungRepository.save(thuCung);
    }

    public void deleteThuCung(Integer id) {
        if (!thuCungRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy thú cưng với ID: " + id);
        }
        thuCungRepository.deleteById(id);
    }
}
