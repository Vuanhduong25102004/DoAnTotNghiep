package com.example.petlorshop.services;

import com.example.petlorshop.dto.HoSoBenhAnResponse;
import com.example.petlorshop.dto.ThuCungRequest;
import com.example.petlorshop.dto.ThuCungUpdateRequest;
import com.example.petlorshop.models.*;
import com.example.petlorshop.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
    private DonThuocRepository donThuocRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileStorageService fileStorageService;

    public Page<ThuCung> getAllThuCung(Pageable pageable, String keyword) {
        if (StringUtils.hasText(keyword)) {
            List<ThuCung> allMatches = thuCungRepository.searchByKeyword(keyword);
            
            String lowerKeyword = keyword.toLowerCase();
            List<ThuCung> filteredList = allMatches.stream()
                    .filter(t -> (t.getTenThuCung() != null && t.getTenThuCung().toLowerCase().contains(lowerKeyword)) || 
                                 (t.getChungLoai() != null && t.getChungLoai().toLowerCase().contains(lowerKeyword)) ||
                                 (t.getGiongLoai() != null && t.getGiongLoai().toLowerCase().contains(lowerKeyword)))
                    .collect(Collectors.toList());

            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), filteredList.size());
            
            if (start > filteredList.size()) {
                return new PageImpl<>(List.of(), pageable, filteredList.size());
            }
            
            List<ThuCung> pageContent = filteredList.subList(start, end);
            return new PageImpl<>(pageContent, pageable, filteredList.size());
        }
        return thuCungRepository.findAll(pageable);
    }

    public Optional<ThuCung> getThuCungById(Integer id) {
        return thuCungRepository.findById(id);
    }

    public List<ThuCung> getMyPets(String email) {
        return thuCungRepository.findByNguoiDung_Email(email);
    }

    public List<ThuCung> getPetsByOwnerPhone(String phone) {
        return thuCungRepository.findByOwnerPhone(phone);
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
    
    public void deleteMyPet(String email, Integer id) {
        ThuCung thuCung = thuCungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + id));

        if (!thuCung.getNguoiDung().getEmail().equals(email)) {
            throw new RuntimeException("Bạn không có quyền xóa thú cưng này.");
        }
        
        thuCungRepository.deleteById(id);
    }
    
    public HoSoBenhAnResponse getHoSoBenhAn(Integer thuCungId) {
        ThuCung thuCung = thuCungRepository.findById(thuCungId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + thuCungId));
        
        // 1. Lịch sử khám bệnh
        List<LichHen> lichSuKhamRaw = lichHenRepository.findAll().stream()
                .filter(lh -> lh.getThuCung() != null && lh.getThuCung().getThuCungId().equals(thuCungId))
                .filter(lh -> lh.getTrangThai() == LichHen.TrangThai.DA_HOAN_THANH)
                .collect(Collectors.toList());
        
        List<HoSoBenhAnResponse.LichSuKham> lichSuKham = lichSuKhamRaw.stream()
                .map(lh -> new HoSoBenhAnResponse.LichSuKham(
                        lh.getLichHenId(),
                        lh.getThoiGianBatDau(),
                        lh.getDichVu().getTenDichVu(),
                        lh.getNhanVien() != null ? lh.getNhanVien().getHoTen() : "Không rõ",
                        lh.getGhiChu(),
                        null
                ))
                .collect(Collectors.toList());
        
        // 2. Lịch sử tiêm chủng
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

        // 3. Lịch sử đơn thuốc
        List<DonThuoc> lichSuDonThuocRaw = donThuocRepository.findByThuCung_ThuCungId(thuCungId);

        List<HoSoBenhAnResponse.LichSuDonThuoc> lichSuDonThuoc = lichSuDonThuocRaw.stream()
                .map(dt -> {
                    List<HoSoBenhAnResponse.ChiTietThuoc> chiTietThuoc = dt.getChiTietDonThuocList().stream()
                            .map(ct -> new HoSoBenhAnResponse.ChiTietThuoc(
                                    ct.getThuoc().getTenSanPham(),
                                    ct.getSoLuong(),
                                    ct.getLieuDung()
                            ))
                            .collect(Collectors.toList());

                    return new HoSoBenhAnResponse.LichSuDonThuoc(
                            dt.getDonThuocId(),
                            dt.getNgayKe(),
                            dt.getBacSi() != null ? dt.getBacSi().getHoTen() : "Không rõ",
                            dt.getChanDoan(),
                            dt.getLoiDan(),
                            chiTietThuoc
                    );
                })
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
                thuCung.getHinhAnh(),
                lichSuKham,
                lichSuTiemChung,
                lichSuDonThuoc // Thêm danh sách đơn thuốc vào response
        );
    }
}
