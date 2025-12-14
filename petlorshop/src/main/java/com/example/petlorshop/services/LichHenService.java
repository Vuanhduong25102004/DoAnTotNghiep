package com.example.petlorshop.services;

import com.example.petlorshop.dto.LichHenRequest;
import com.example.petlorshop.dto.LichHenResponse;
import com.example.petlorshop.dto.LichHenUpdateRequest;
import com.example.petlorshop.models.*;
import com.example.petlorshop.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LichHenService {

    @Autowired private LichHenRepository lichHenRepository;
    @Autowired private NguoiDungRepository nguoiDungRepository;
    @Autowired private ThuCungRepository thuCungRepository;
    @Autowired private DichVuRepository dichVuRepository;
    @Autowired private NhanVienRepository nhanVienRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public List<LichHenResponse> getAllLichHen() {
        return lichHenRepository.findAll().stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public Optional<LichHenResponse> getLichHenById(Integer id) {
        return lichHenRepository.findById(id).map(this::convertToResponse);
    }

    @Transactional
    public LichHenResponse createLichHen(LichHenRequest request) {
        // 1. Tìm hoặc tạo NguoiDung
        NguoiDung nguoiDung = findOrCreateUser(request);

        // 2. Tìm hoặc tạo ThuCung
        ThuCung thuCung = findOrCreatePet(request, nguoiDung);

        // 3. Tìm DichVu
        DichVu dichVu = dichVuRepository.findById(request.getDichVuId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + request.getDichVuId()));

        // 4. Logic tự động tìm nhân viên
        NhanVien assignedNhanVien = findAvailableStaff(request, dichVu);

        // 5. Tạo và lưu LichHen
        LichHen lichHen = new LichHen();
        lichHen.setThoiGianBatDau(request.getThoiGianBatDau());
        lichHen.setThoiGianKetThuc(request.getThoiGianKetThuc());
        lichHen.setGhiChuKhachHang(request.getGhiChuKhachHang());
        lichHen.setNguoiDung(nguoiDung);
        lichHen.setDichVu(dichVu);
        lichHen.setThuCung(thuCung); // Có thể null nếu dịch vụ không cần thú cưng
        lichHen.setNhanVien(assignedNhanVien);
        lichHen.setTrangThaiLichHen("CHỜ XÁC NHẬN");

        LichHen savedLichHen = lichHenRepository.save(lichHen);
        return convertToResponse(savedLichHen);
    }

    private NguoiDung findOrCreateUser(LichHenRequest request) {
        if (request.getUserId() != null) {
            return nguoiDungRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + request.getUserId()));
        }
        if (StringUtils.hasText(request.getSoDienThoaiKhachHang())) {
            return nguoiDungRepository.findBySoDienThoai(request.getSoDienThoaiKhachHang())
                    .orElseGet(() -> {
                        if (!StringUtils.hasText(request.getTenKhachHang())) {
                            throw new IllegalArgumentException("Tên khách hàng là bắt buộc khi tạo người dùng mới.");
                        }
                        NguoiDung newUser = new NguoiDung();
                        newUser.setHoTen(request.getTenKhachHang());
                        newUser.setSoDienThoai(request.getSoDienThoaiKhachHang());
                        newUser.setEmail(request.getSoDienThoaiKhachHang() + "@petshop.local");
                        newUser.setMatKhau(passwordEncoder.encode(request.getSoDienThoaiKhachHang()));
                        newUser.setRole(Role.USER);
                        return nguoiDungRepository.save(newUser);
                    });
        }
        throw new IllegalArgumentException("Cần cung cấp userId hoặc thông tin khách hàng (tên, SĐT).");
    }

    private ThuCung findOrCreatePet(LichHenRequest request, NguoiDung owner) {
        if (request.getThuCungId() != null) {
            return thuCungRepository.findById(request.getThuCungId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + request.getThuCungId()));
        }
        if (StringUtils.hasText(request.getTenThuCung())) {
            ThuCung newPet = new ThuCung();
            newPet.setTenThuCung(request.getTenThuCung());
            newPet.setChungLoai(request.getChungLoai());
            newPet.setGiongLoai(request.getGiongLoai());
            newPet.setNgaySinh(request.getNgaySinh());
            newPet.setGioiTinh(request.getGioiTinh());
            newPet.setNguoiDung(owner);
            return thuCungRepository.save(newPet);
        }
        // Trả về null nếu không có thông tin thú cưng (cho các dịch vụ không cần thú cưng)
        return null;
    }

    private NhanVien findAvailableStaff(LichHenRequest request, DichVu dichVu) {
        if (request.getNhanVienId() != null) {
            NhanVien nhanVien = nhanVienRepository.findById(request.getNhanVienId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + request.getNhanVienId()));
            if (!isTimeSlotAvailable(nhanVien.getNhanVienId(), request.getThoiGianBatDau(), request.getThoiGianKetThuc())) {
                throw new RuntimeException("Nhân viên bạn chọn đã bận vào thời gian này.");
            }
            return nhanVien;
        } else {
            if (dichVu.getDanhMucDichVu() == null) throw new RuntimeException("Dịch vụ chưa được phân loại.");
            Role requiredRole = dichVu.getDanhMucDichVu().getRoleCanThucHien();
            if (requiredRole == null) throw new RuntimeException("Danh mục dịch vụ chưa có vai trò thực hiện.");
            
            List<NhanVien> potentialStaff = nhanVienRepository.findByRole(requiredRole);
            if (potentialStaff.isEmpty()) throw new RuntimeException("Không có nhân viên cho vai trò: " + requiredRole);

            return potentialStaff.stream()
                .filter(staff -> isTimeSlotAvailable(staff.getNhanVienId(), request.getThoiGianBatDau(), request.getThoiGianKetThuc()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Hết nhân viên rảnh cho dịch vụ này vào thời gian bạn chọn."));
        }
    }
    
    private boolean isTimeSlotAvailable(Integer nhanVienId, LocalDateTime start, LocalDateTime end) {
        return lichHenRepository.findOverlappingAppointments(nhanVienId, start, end).isEmpty();
    }

    public LichHen updateLichHen(Integer id, LichHenUpdateRequest request) {
        LichHen lichHen = lichHenRepository.findById(id).orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại: " + id));
        lichHen.setThoiGianBatDau(request.getThoiGianBatDau());
        lichHen.setThoiGianKetThuc(request.getThoiGianKetThuc());
        lichHen.setTrangThaiLichHen(request.getTrangThaiLichHen());
        lichHen.setGhiChuKhachHang(request.getGhiChuKhachHang());
        return lichHenRepository.save(lichHen);
    }

    public void deleteLichHen(Integer id) {
        lichHenRepository.deleteById(id);
    }

    private LichHenResponse convertToResponse(LichHen lichHen) {
        NguoiDung nguoiDung = lichHen.getNguoiDung();
        ThuCung thuCung = lichHen.getThuCung();
        DichVu dichVu = lichHen.getDichVu();
        NhanVien nhanVien = lichHen.getNhanVien();
        return new LichHenResponse(
                lichHen.getLichHenId(), lichHen.getThoiGianBatDau(), lichHen.getThoiGianKetThuc(),
                lichHen.getTrangThaiLichHen(), lichHen.getGhiChuKhachHang(),
                nguoiDung != null ? nguoiDung.getUserId() : null, nguoiDung != null ? nguoiDung.getHoTen() : null,
                nguoiDung != null ? nguoiDung.getSoDienThoai() : null,
                thuCung != null ? thuCung.getThuCungId() : null, thuCung != null ? thuCung.getTenThuCung() : null,
                dichVu != null ? dichVu.getDichVuId() : null, dichVu != null ? dichVu.getTenDichVu() : null,
                nhanVien != null ? nhanVien.getNhanVienId() : null, nhanVien != null ? nhanVien.getHoTen() : null
        );
    }
}
