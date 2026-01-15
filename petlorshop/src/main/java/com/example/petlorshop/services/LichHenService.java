package com.example.petlorshop.services;

import com.example.petlorshop.dto.GuestAppointmentRequest;
import com.example.petlorshop.dto.LichHenRequest;
import com.example.petlorshop.dto.LichHenResponse;
import com.example.petlorshop.dto.LichHenUpdateRequest;
import com.example.petlorshop.models.*;
import com.example.petlorshop.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
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
    @Autowired private SoTiemChungRepository soTiemChungRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private static final LocalTime OPENING_TIME = LocalTime.of(8, 0);
    private static final LocalTime CLOSING_TIME = LocalTime.of(18, 0);

    public Page<LichHenResponse> getAllLichHen(Pageable pageable) {
        return lichHenRepository.findAll(pageable).map(this::convertToResponse);
    }

    public Optional<LichHenResponse> getLichHenById(Integer id) {
        return lichHenRepository.findById(id).map(this::convertToResponse);
    }

    public List<LichHenResponse> getMyLichHen(String email) {
        return lichHenRepository.findByNguoiDung_Email(email).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<LichHenResponse> getMyLichHenDetail(String email, Integer id) {
        return lichHenRepository.findById(id)
                .filter(lichHen -> lichHen.getNguoiDung().getEmail().equals(email))
                .map(this::convertToResponse);
    }

    @Transactional
    public LichHenResponse createLichHen(LichHenRequest request) {
        validateBusinessHours(request.getThoiGianBatDau());

        NguoiDung nguoiDung = findOrCreateUser(request);
        ThuCung thuCung = findOrCreatePet(request, nguoiDung);
        DichVu dichVu = dichVuRepository.findById(request.getDichVuId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + request.getDichVuId()));

        int thoiLuongPhut = dichVu.getThoiLuongUocTinh() != null ? dichVu.getThoiLuongUocTinh() : 60;
        LocalDateTime thoiGianKetThuc = request.getThoiGianBatDau().plusMinutes(thoiLuongPhut);
        
        if (thoiGianKetThuc.toLocalTime().isAfter(CLOSING_TIME)) {
            throw new RuntimeException("Dịch vụ dự kiến kết thúc lúc " + thoiGianKetThuc.toLocalTime() + ", vượt quá giờ đóng cửa (" + CLOSING_TIME + "). Vui lòng chọn giờ sớm hơn.");
        }

        NhanVien assignedNhanVien = findAvailableStaff(request, dichVu, request.getThoiGianBatDau(), thoiGianKetThuc);

        LichHen lichHen = new LichHen();
        lichHen.setThoiGianBatDau(request.getThoiGianBatDau());
        lichHen.setThoiGianKetThuc(thoiGianKetThuc);
        lichHen.setGhiChu(request.getGhiChuKhachHang());
        lichHen.setNguoiDung(nguoiDung);
        lichHen.setDichVu(dichVu);
        lichHen.setThuCung(thuCung);
        lichHen.setNhanVien(assignedNhanVien);
        lichHen.setTrangThai(LichHen.TrangThai.CHO_XAC_NHAN);

        LichHen savedLichHen = lichHenRepository.save(lichHen);
        return convertToResponse(savedLichHen);
    }
    
    @Transactional
    public LichHenResponse createGuestAppointment(GuestAppointmentRequest request) {
        validateBusinessHours(request.getThoiGianBatDau());

        DichVu dichVu = dichVuRepository.findById(request.getDichVuId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + request.getDichVuId()));

        int thoiLuongPhut = dichVu.getThoiLuongUocTinh() != null ? dichVu.getThoiLuongUocTinh() : 60;
        LocalDateTime thoiGianKetThuc = request.getThoiGianBatDau().plusMinutes(thoiLuongPhut);
        
        if (thoiGianKetThuc.toLocalTime().isAfter(CLOSING_TIME)) {
            throw new RuntimeException("Dịch vụ dự kiến kết thúc lúc " + thoiGianKetThuc.toLocalTime() + ", vượt quá giờ đóng cửa (" + CLOSING_TIME + ").");
        }

        // Tìm nhân viên rảnh (tái sử dụng logic cũ nhưng cần adapt vì request khác kiểu)
        // Tạo tạm LichHenRequest để dùng lại hàm findAvailableStaff
        LichHenRequest tempRequest = new LichHenRequest();
        tempRequest.setNhanVienId(request.getNhanVienId());
        NhanVien assignedNhanVien = findAvailableStaff(tempRequest, dichVu, request.getThoiGianBatDau(), thoiGianKetThuc);

        LichHen lichHen = new LichHen();
        lichHen.setThoiGianBatDau(request.getThoiGianBatDau());
        lichHen.setThoiGianKetThuc(thoiGianKetThuc);
        lichHen.setGhiChu(request.getGhiChu());
        
        // Lưu thông tin khách vãng lai
        lichHen.setNguoiDung(null);
        lichHen.setTenKhachHang(request.getTenKhachHang());
        lichHen.setSdtKhachHang(request.getSoDienThoaiKhachHang());
        lichHen.setEmailKhachHang(request.getEmailKhachHang());
        
        // Lưu thông tin thú cưng vào ghi chú hoặc xử lý riêng nếu cần
        // Ở đây ta có thể tạo một ThuCung tạm thời hoặc chỉ lưu tên vào ghi chú
        if (request.getTenThuCung() != null) {
            String note = (lichHen.getGhiChu() != null ? lichHen.getGhiChu() : "") + 
                          " [Thú cưng: " + request.getTenThuCung() + " - " + request.getChungLoai() + "]";
            lichHen.setGhiChu(note);
        }
        
        lichHen.setDichVu(dichVu);
        lichHen.setNhanVien(assignedNhanVien);
        lichHen.setTrangThai(LichHen.TrangThai.CHO_XAC_NHAN);

        LichHen savedLichHen = lichHenRepository.save(lichHen);
        return convertToResponse(savedLichHen);
    }

    private void validateBusinessHours(LocalDateTime startTime) {
        LocalTime time = startTime.toLocalTime();
        if (time.isBefore(OPENING_TIME) || time.isAfter(CLOSING_TIME)) {
            throw new RuntimeException("Vui lòng đặt lịch trong giờ hành chính (" + OPENING_TIME + " - " + CLOSING_TIME + ").");
        }
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
        return null;
    }

    private NhanVien findAvailableStaff(LichHenRequest request, DichVu dichVu, LocalDateTime start, LocalDateTime end) {
        if (request.getNhanVienId() != null) {
            NhanVien nhanVien = nhanVienRepository.findById(request.getNhanVienId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + request.getNhanVienId()));
            if (!isTimeSlotAvailable(nhanVien.getNhanVienId(), start, end)) {
                throw new RuntimeException("Nhân viên bạn chọn đã bận vào thời gian này.");
            }
            return nhanVien;
        } else {
            List<NhanVien> potentialStaff = nhanVienRepository.findAll();
            if (potentialStaff.isEmpty()) throw new RuntimeException("Không có nhân viên nào trong hệ thống.");

            return potentialStaff.stream()
                .filter(staff -> isTimeSlotAvailable(staff.getNhanVienId(), start, end))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Hết nhân viên rảnh cho dịch vụ này vào thời gian bạn chọn."));
        }
    }
    
    private boolean isTimeSlotAvailable(Integer nhanVienId, LocalDateTime start, LocalDateTime end) {
        return lichHenRepository.findOverlappingAppointments(nhanVienId, start, end).isEmpty();
    }

    @Transactional
    public LichHen updateLichHen(Integer id, LichHenUpdateRequest request) {
        LichHen lichHen = lichHenRepository.findById(id).orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại: " + id));
        
        if (request.getThoiGianBatDau() != null) {
            validateBusinessHours(request.getThoiGianBatDau());
            lichHen.setThoiGianBatDau(request.getThoiGianBatDau());
            
            int thoiLuongPhut = lichHen.getDichVu().getThoiLuongUocTinh() != null ? lichHen.getDichVu().getThoiLuongUocTinh() : 60;
            LocalDateTime thoiGianKetThuc = request.getThoiGianBatDau().plusMinutes(thoiLuongPhut);
            
            if (thoiGianKetThuc.toLocalTime().isAfter(CLOSING_TIME)) {
                throw new RuntimeException("Dịch vụ dự kiến kết thúc lúc " + thoiGianKetThuc.toLocalTime() + ", vượt quá giờ đóng cửa (" + CLOSING_TIME + ").");
            }
            lichHen.setThoiGianKetThuc(thoiGianKetThuc);
        }
        
        if (request.getThoiGianKetThuc() != null) {
             if (request.getThoiGianKetThuc().toLocalTime().isAfter(CLOSING_TIME)) {
                throw new RuntimeException("Giờ kết thúc vượt quá giờ đóng cửa (" + CLOSING_TIME + ").");
            }
            lichHen.setThoiGianKetThuc(request.getThoiGianKetThuc());
        }

        // Cập nhật ghi chú trước khi xử lý trạng thái
        if (request.getGhiChu() != null) {
            lichHen.setGhiChu(request.getGhiChu());
        }

        if (request.getTrangThai() != null) {
            // Logic tự động tạo sổ tiêm chủng khi hoàn thành lịch hẹn
            if (request.getTrangThai() == LichHen.TrangThai.DA_HOAN_THANH && lichHen.getTrangThai() != LichHen.TrangThai.DA_HOAN_THANH) {
                if (lichHen.getThuCung() != null) {
                    SoTiemChung stc = new SoTiemChung();
                    stc.setThuCung(lichHen.getThuCung());
                    stc.setTenVacXin("Chưa cập nhật"); // Để placeholder để nhắc nhở cập nhật
                    stc.setNgayTiem(LocalDateTime.now().toLocalDate());
                    stc.setNhanVien(lichHen.getNhanVien());
                    stc.setLichHen(lichHen);
                    stc.setGhiChu(lichHen.getGhiChu()); // Lấy ghi chú từ lịch hẹn
                    
                    soTiemChungRepository.save(stc);
                }
            }
            lichHen.setTrangThai(request.getTrangThai());
        }
        
        return lichHenRepository.save(lichHen);
    }

    @Transactional
    public LichHenResponse cancelMyLichHen(String email, Integer id, String lyDoHuy) {
        LichHen lichHen = lichHenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại: " + id));

        if (!lichHen.getNguoiDung().getEmail().equals(email)) {
            throw new RuntimeException("Bạn không có quyền hủy lịch hẹn này.");
        }

        if (lichHen.getTrangThai() == LichHen.TrangThai.DA_HOAN_THANH) {
            throw new RuntimeException("Không thể hủy lịch hẹn đã hoàn thành.");
        }
        
        if (lichHen.getTrangThai() == LichHen.TrangThai.DA_HUY) {
            throw new RuntimeException("Lịch hẹn này đã bị hủy trước đó.");
        }

        lichHen.setTrangThai(LichHen.TrangThai.DA_HUY);
        lichHen.setLyDoHuy(lyDoHuy);
        LichHen savedLichHen = lichHenRepository.save(lichHen);
        return convertToResponse(savedLichHen);
    }

    @Transactional
    public LichHenResponse updateMyLichHen(String email, Integer id, LichHenUpdateRequest request) {
        LichHen lichHen = lichHenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lịch hẹn không tồn tại: " + id));

        if (!lichHen.getNguoiDung().getEmail().equals(email)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa lịch hẹn này.");
        }

        if (lichHen.getTrangThai() != LichHen.TrangThai.CHO_XAC_NHAN) {
            throw new RuntimeException("Chỉ có thể chỉnh sửa lịch hẹn khi đang ở trạng thái Chờ xác nhận. Vui lòng liên hệ cửa hàng để được hỗ trợ.");
        }

        if (request.getThoiGianBatDau() != null) {
            validateBusinessHours(request.getThoiGianBatDau());
            
            int thoiLuongPhut = lichHen.getDichVu().getThoiLuongUocTinh() != null ? lichHen.getDichVu().getThoiLuongUocTinh() : 60;
            LocalDateTime thoiGianKetThuc = request.getThoiGianBatDau().plusMinutes(thoiLuongPhut);
            
            if (thoiGianKetThuc.toLocalTime().isAfter(CLOSING_TIME)) {
                throw new RuntimeException("Dịch vụ dự kiến kết thúc lúc " + thoiGianKetThuc.toLocalTime() + ", vượt quá giờ đóng cửa (" + CLOSING_TIME + ").");
            }
            // Kiểm tra lịch hẹn của nhân viên nếu trùng
            List<LichHen> conflicts = lichHenRepository.findOverlappingAppointments(lichHen.getNhanVien().getNhanVienId(), request.getThoiGianBatDau(), thoiGianKetThuc);
            // Loại bỏ chính lịch hẹn đang sửa khỏi danh sách conflict
            conflicts.removeIf(lh -> lh.getLichHenId().equals(id));
            
            if (!conflicts.isEmpty()) {
                throw new RuntimeException("Nhân viên phụ trách đã bận vào khung giờ mới này. Vui lòng chọn giờ khác.");
            }

            lichHen.setThoiGianBatDau(request.getThoiGianBatDau());
            lichHen.setThoiGianKetThuc(thoiGianKetThuc);
        }

        if (request.getGhiChu() != null) {
            lichHen.setGhiChu(request.getGhiChu());
        }

        // Không cho phép khách hàng tự đổi trạng thái qua API này (trừ khi hủy - đã có API riêng)
        
        LichHen savedLichHen = lichHenRepository.save(lichHen);
        return convertToResponse(savedLichHen);
    }
    
    public List<String> getLyDoHuyLichOptions() {
        List<String> options = new ArrayList<>();
        for (LichHen.LyDoHuyLich lyDo : LichHen.LyDoHuyLich.values()) {
            options.add(lyDo.getMoTa());
        }
        return options;
    }

    public void deleteLichHen(Integer id) {
        lichHenRepository.deleteById(id);
    }

    private LichHenResponse convertToResponse(LichHen lichHen) {
        NguoiDung nguoiDung = lichHen.getNguoiDung();
        ThuCung thuCung = lichHen.getThuCung();
        DichVu dichVu = lichHen.getDichVu();
        NhanVien nhanVien = lichHen.getNhanVien();
        
        // Logic hiển thị tên khách hàng: Nếu có User thì lấy tên User, nếu không thì lấy tên khách vãng lai
        String tenKhachHang = null;
        String sdtKhachHang = null;
        
        if (nguoiDung != null) {
            tenKhachHang = nguoiDung.getHoTen();
            sdtKhachHang = nguoiDung.getSoDienThoai();
        } else {
            tenKhachHang = lichHen.getTenKhachHang();
            sdtKhachHang = lichHen.getSdtKhachHang();
        }
        
        return new LichHenResponse(
                lichHen.getLichHenId(), lichHen.getThoiGianBatDau(), lichHen.getThoiGianKetThuc(),
                lichHen.getTrangThai().name(),
                lichHen.getGhiChu(),
                lichHen.getLyDoHuy(),
                nguoiDung != null ? nguoiDung.getUserId() : null, 
                tenKhachHang, // Tên hiển thị
                sdtKhachHang, // SĐT hiển thị
                thuCung != null ? thuCung.getThuCungId() : null, thuCung != null ? thuCung.getTenThuCung() : null,
                dichVu != null ? dichVu.getDichVuId() : null, dichVu != null ? dichVu.getTenDichVu() : null, dichVu != null ? dichVu.getGiaDichVu() : null,
                nhanVien != null ? nhanVien.getNhanVienId() : null, nhanVien != null ? nhanVien.getHoTen() : null
        );
    }
}
