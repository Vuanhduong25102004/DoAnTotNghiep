package com.example.petlorshop.services;

import com.example.petlorshop.dto.HoSoBenhAnResponse;
import com.example.petlorshop.dto.ThuCungRequest;
import com.example.petlorshop.dto.ThuCungUpdateRequest;
import com.example.petlorshop.models.LichHen;
import com.example.petlorshop.models.NguoiDung;
import com.example.petlorshop.models.Role;
import com.example.petlorshop.models.SoTiemChung;
import com.example.petlorshop.models.ThuCung;
import com.example.petlorshop.repositories.LichHenRepository;
import com.example.petlorshop.repositories.NguoiDungRepository;
import com.example.petlorshop.repositories.SoTiemChungRepository;
import com.example.petlorshop.repositories.ThuCungRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ThuCungService {

    @Autowired
    private ThuCungRepository thuCungRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;
    
    @Autowired
    private LichHenRepository lichHenRepository;
    
    @Autowired
    private SoTiemChungRepository soTiemChungRepository;

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
        
        if (request.getCanNang() != null) {
            thuCung.setCanNang(request.getCanNang());
        }

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

    @Transactional
    public ThuCung updateMyPet(String email, Integer id, ThuCungUpdateRequest request, MultipartFile hinhAnh) {
        ThuCung thuCung = thuCungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + id));

        if (!thuCung.getNguoiDung().getEmail().equals(email)) {
            throw new RuntimeException("Bạn không có quyền sửa thông tin thú cưng này.");
        }

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
        
        if (request.getCanNang() != null) {
            thuCung.setCanNang(request.getCanNang());
        }

        return thuCungRepository.save(thuCung);
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
        
        if (request.getCanNang() != null) {
            thuCung.setCanNang(request.getCanNang());
        }

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
    
    public HoSoBenhAnResponse getHoSoBenhAn(Integer thuCungId) {
        ThuCung thuCung = thuCungRepository.findById(thuCungId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + thuCungId));
        
        // Lấy lịch sử khám bệnh (Lịch hẹn đã hoàn thành)
        List<LichHen> lichSuKhamRaw = lichHenRepository.findAll().stream() // Cần tối ưu query sau này
                .filter(lh -> lh.getThuCung() != null && lh.getThuCung().getThuCungId().equals(thuCungId))
                .filter(lh -> lh.getTrangThai() == LichHen.TrangThai.DA_HOAN_THANH)
                .collect(Collectors.toList());
        
        List<HoSoBenhAnResponse.LichSuKham> lichSuKham = lichSuKhamRaw.stream()
                .map(lh -> new HoSoBenhAnResponse.LichSuKham(
                        lh.getLichHenId(),
                        lh.getThoiGianBatDau(),
                        lh.getDichVu().getTenDichVu(),
                        lh.getNhanVien() != null ? lh.getNhanVien().getHoTen() : "Không rõ",
                        lh.getGhiChu(), // Tạm dùng ghi chú làm chẩn đoán
                        null // Kết luận chưa có trường riêng
                ))
                .collect(Collectors.toList());
        
        // Lấy lịch sử tiêm chủng
        List<SoTiemChung> lichSuTiemChungRaw = soTiemChungRepository.findByThuCung_ThuCungId(thuCungId);
        
        List<HoSoBenhAnResponse.LichSuTiemChung> lichSuTiemChung = lichSuTiemChungRaw.stream()
                .map(stc -> new HoSoBenhAnResponse.LichSuTiemChung(
                        stc.getTiemChungId(),
                        stc.getTenVacXin(),
                        stc.getNgayTiem(),
                        stc.getNgayTaiChung(),
                        stc.getNhanVien() != null ? stc.getNhanVien().getHoTen() : "Không rõ",
                        stc.getGhiChu()
                ))
                .collect(Collectors.toList());
        
        return new HoSoBenhAnResponse(
                thuCung.getThuCungId(),
                thuCung.getTenThuCung(),
                thuCung.getChungLoai(),
                thuCung.getGiongLoai(),
                thuCung.getNgaySinh(),
                thuCung.getGioiTinh(),
                thuCung.getCanNang(),
                thuCung.getGhiChuSucKhoe(),
                lichSuKham,
                lichSuTiemChung
        );
    }
}
