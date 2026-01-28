package com.example.petlorshop.services;

import com.example.petlorshop.dto.*;
import com.example.petlorshop.models.*;
import com.example.petlorshop.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DonHangService {

    @Autowired
    private DonHangRepository donHangRepository;
    @Autowired
    private NguoiDungRepository nguoiDungRepository;
    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;
    @Autowired
    private GioHangService gioHangService;
    @Autowired
    private KhuyenMaiService khuyenMaiService;
    @Autowired
    private OrderCalculationService orderCalculationService;
    @Autowired
    private DonThuocRepository donThuocRepository;
    @Autowired
    private DanhGiaRepository danhGiaRepository;

    public Page<DonHangResponse> getAllDonHang(Pageable pageable, String keyword) {
        if (StringUtils.hasText(keyword)) {
            List<DonHang> allMatches = donHangRepository.searchByKeyword(keyword);
            
            String lowerKeyword = keyword.toLowerCase();
            List<DonHangResponse> filteredList = allMatches.stream()
                    .filter(d -> (d.getTrangThai() != null && d.getTrangThai().name().toLowerCase().contains(lowerKeyword)) || 
                                 (d.getDiaChiGiaoHang() != null && d.getDiaChiGiaoHang().toLowerCase().contains(lowerKeyword)))
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), filteredList.size());
            
            if (start > filteredList.size()) {
                return new PageImpl<>(List.of(), pageable, filteredList.size());
            }
            
            List<DonHangResponse> pageContent = filteredList.subList(start, end);
            return new PageImpl<>(pageContent, pageable, filteredList.size());
        }
        return donHangRepository.findAll(pageable).map(this::convertToResponse);
    }

    public Optional<DonHangResponse> getDonHangById(Integer id) {
        return donHangRepository.findById(id).map(this::convertToResponse);
    }

    public List<DonHangResponse> getMyDonHang(String email) {
        return donHangRepository.findByNguoiDung_Email(email).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<DonHangResponse> getMyDonHangDetail(String email, Integer id) {
        return donHangRepository.findById(id)
                .filter(donHang -> donHang.getNguoiDung().getEmail().equals(email))
                .map(this::convertToResponse);
    }
    
    public BigDecimal calculateShippingFee(ShippingFeeRequest request) {
        // Tái sử dụng logic tính toán của OrderCalculationService nhưng chỉ lấy phí ship
        OrderCalculationResult result = orderCalculationService.calculateOrder(
            request.getItems(),
            null, // Không cần mã khuyến mãi khi chỉ tính ship
            request.getTinhThanh(),
            request.getQuanHuyen(),
            request.getPhuongXa(),
            request.getDiaChi()
        );
        return result.getPhiVanChuyen();
    }

    @Transactional
    public DonHang createDonHang(DonHangRequest donHangRequest) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(donHangRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + donHangRequest.getUserId()));

        // 1. Tính toán đơn hàng (tổng tiền, giảm giá, chi tiết)
        OrderCalculationResult calculationResult = orderCalculationService.calculateOrder(
                donHangRequest.getChiTietDonHangs(), 
                donHangRequest.getMaKhuyenMai(),
                donHangRequest.getTinhThanh(),
                donHangRequest.getQuanHuyen(),
                donHangRequest.getPhuongXa(),
                donHangRequest.getDiaChiGiaoHang()
        );

        // 2. Tạo đơn hàng
        DonHang donHang = new DonHang();
        donHang.setNguoiDung(nguoiDung);
        
        // Lưu địa chỉ đầy đủ
        String fullAddress = String.format("%s, %s, %s, %s", 
            donHangRequest.getDiaChiGiaoHang(), 
            donHangRequest.getPhuongXa(), 
            donHangRequest.getQuanHuyen(), 
            donHangRequest.getTinhThanh());
        donHang.setDiaChiGiaoHang(fullAddress);
        
        donHang.setSoDienThoaiNhan(donHangRequest.getSoDienThoaiNhan());
        donHang.setPhuongThucThanhToan(donHangRequest.getPhuongThucThanhToan());
        donHang.setTrangThai(DonHang.TrangThaiDonHang.CHO_XU_LY);
        
        // Set trạng thái thanh toán mặc định
        if (donHangRequest.getPhuongThucThanhToan() == DonHang.PhuongThucThanhToan.COD) {
            donHang.setTrangThaiThanhToan(DonHang.TrangThaiThanhToan.CHUA_THANH_TOAN);
        } else {
            donHang.setTrangThaiThanhToan(DonHang.TrangThaiThanhToan.CHO_THANH_TOAN);
        }
        
        donHang.setTongTienHang(calculationResult.getTongTienHang());
        donHang.setSoTienGiam(calculationResult.getSoTienGiam());
        donHang.setPhiVanChuyen(calculationResult.getPhiVanChuyen());
        donHang.setTongThanhToan(calculationResult.getTongThanhToan());
        donHang.setKhuyenMai(calculationResult.getKhuyenMai());

        // 3. Lưu chi tiết đơn hàng và trừ tồn kho
        List<ChiTietDonHang> chiTietItems = calculationResult.getChiTietDonHangs();
        for (ChiTietDonHang chiTiet : chiTietItems) {
            chiTiet.setDonHang(donHang);
            
            // Trừ tồn kho
            SanPham sanPham = chiTiet.getSanPham();
            sanPham.setSoLuongTonKho(sanPham.getSoLuongTonKho() - chiTiet.getSoLuong());
            sanPhamRepository.save(sanPham);
            
            // Xóa khỏi giỏ hàng
            try {
                gioHangService.xoaSanPhamKhoiGio(donHangRequest.getUserId(), sanPham.getSanPhamId());
            } catch (Exception e) {
                // Ignore
            }
        }
        donHang.setChiTietDonHangs(chiTietItems);

        // 4. Trừ số lượng mã khuyến mãi
        if (calculationResult.getKhuyenMai() != null) {
            khuyenMaiService.suDungMaKhuyenMai(calculationResult.getKhuyenMai().getMaCode());
        }

        return donHangRepository.save(donHang);
    }
    
    @Transactional
    public DonHang createGuestOrder(GuestOrderRequest request) {
        if (request.getPhuongThucThanhToan() == DonHang.PhuongThucThanhToan.COD) {
            throw new RuntimeException("Khách vãng lai vui lòng thanh toán chuyển khoản (VNPAY/MOMO).");
        }

        // 1. Tính toán đơn hàng
        OrderCalculationResult calculationResult = orderCalculationService.calculateOrder(
                request.getChiTietDonHangs(), 
                request.getMaKhuyenMai(),
                request.getTinhThanh(),
                request.getQuanHuyen(),
                request.getPhuongXa(),
                request.getDiaChiGiaoHang()
        );

        // 2. Tạo đơn hàng
        DonHang donHang = new DonHang();
        donHang.setNguoiDung(null);
        
        // Lưu tên người nhận vào trường riêng nếu có, hoặc ghép vào địa chỉ
        donHang.setHoTenNguoiNhan(request.getHoTenNguoiNhan());
        donHang.setEmailNguoiNhan(request.getEmail());
        
        String fullAddress = String.format("%s, %s, %s, %s", 
            request.getDiaChiGiaoHang(),
            request.getPhuongXa(),
            request.getQuanHuyen(),
            request.getTinhThanh());
        donHang.setDiaChiGiaoHang(fullAddress);
        
        donHang.setSoDienThoaiNhan(request.getSoDienThoaiNhan());
        donHang.setPhuongThucThanhToan(request.getPhuongThucThanhToan());
        donHang.setTrangThai(DonHang.TrangThaiDonHang.CHO_XU_LY);
        
        // Set trạng thái thanh toán mặc định (Guest luôn là Online)
        donHang.setTrangThaiThanhToan(DonHang.TrangThaiThanhToan.CHUA_THANH_TOAN);

        donHang.setTongTienHang(calculationResult.getTongTienHang());
        donHang.setSoTienGiam(calculationResult.getSoTienGiam());
        donHang.setPhiVanChuyen(calculationResult.getPhiVanChuyen());
        donHang.setTongThanhToan(calculationResult.getTongThanhToan());
        donHang.setKhuyenMai(calculationResult.getKhuyenMai());

        // 3. Lưu chi tiết và trừ tồn kho
        List<ChiTietDonHang> chiTietItems = calculationResult.getChiTietDonHangs();
        for (ChiTietDonHang chiTiet : chiTietItems) {
            chiTiet.setDonHang(donHang);
            
            SanPham sanPham = chiTiet.getSanPham();
            sanPham.setSoLuongTonKho(sanPham.getSoLuongTonKho() - chiTiet.getSoLuong());
            sanPhamRepository.save(sanPham);
        }
        donHang.setChiTietDonHangs(chiTietItems);

        // 4. Trừ mã khuyến mãi
        if (calculationResult.getKhuyenMai() != null) {
            khuyenMaiService.suDungMaKhuyenMai(calculationResult.getKhuyenMai().getMaCode());
        }

        return donHangRepository.save(donHang);
    }

    @Transactional
    public DonHang createOrderFromPrescription(Integer donThuocId) {
        DonThuoc donThuoc = donThuocRepository.findById(donThuocId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn thuốc với ID: " + donThuocId));

        if (donThuoc.getTrangThai() != DonThuoc.TrangThaiDonThuoc.MOI_TAO) {
            throw new RuntimeException("Đơn thuốc này đã được thanh toán hoặc đã hủy.");
        }

        LichHen lichHen = donThuoc.getLichHen();
        NguoiDung nguoiDung = lichHen.getNguoiDung();

        DonHang donHang = new DonHang();
        donHang.setNguoiDung(nguoiDung);
        
        // Nếu là khách vãng lai (nguoiDung == null), lấy thông tin từ Lịch hẹn
        if (nguoiDung == null) {
            donHang.setHoTenNguoiNhan(lichHen.getTenKhachHang());
            donHang.setEmailNguoiNhan(lichHen.getEmailKhachHang());
        }
        
        // Địa chỉ giao hàng: Mặc định là "Tại quầy" hoặc lấy từ user
        donHang.setDiaChiGiaoHang("Mua trực tiếp tại quầy (Theo đơn thuốc #" + donThuocId + ")");
        donHang.setSoDienThoaiNhan(lichHen.getSdtKhachHang());
        
        // Phương thức thanh toán: Mặc định là Tiền mặt (hoặc có thể cho chọn sau)
        donHang.setPhuongThucThanhToan(DonHang.PhuongThucThanhToan.COD); // Tạm coi là thanh toán tại quầy
        donHang.setTrangThai(DonHang.TrangThaiDonHang.DA_GIAO); // Mua tại quầy -> Đã giao (Hoàn thành)
        donHang.setTrangThaiThanhToan(DonHang.TrangThaiThanhToan.DA_THANH_TOAN); // Đã thanh toán
        donHang.setNgayThanhToan(LocalDateTime.now());

        // Chuyển đổi chi tiết đơn thuốc -> chi tiết đơn hàng
        List<ChiTietDonHang> chiTietDonHangs = new ArrayList<>();
        BigDecimal tongTienHang = BigDecimal.ZERO;

        for (ChiTietDonThuoc ctThuoc : donThuoc.getChiTietDonThuocList()) {
            ChiTietDonHang ctDonHang = new ChiTietDonHang();
            ctDonHang.setDonHang(donHang);
            ctDonHang.setSanPham(ctThuoc.getThuoc());
            ctDonHang.setSoLuong(ctThuoc.getSoLuong());
            ctDonHang.setDonGia(ctThuoc.getThuoc().getGia()); // Lấy giá hiện tại
            
            chiTietDonHangs.add(ctDonHang);
            
            BigDecimal thanhTien = ctDonHang.getDonGia().multiply(BigDecimal.valueOf(ctDonHang.getSoLuong()));
            tongTienHang = tongTienHang.add(thanhTien);
            
            // Lưu ý: Tồn kho đã được trừ khi bác sĩ kê đơn (trong LichHenService), nên ở đây KHÔNG trừ nữa.
            // Nếu muốn chắc chắn, có thể kiểm tra lại logic trừ kho.
        }

        donHang.setChiTietDonHangs(chiTietDonHangs);
        donHang.setTongTienHang(tongTienHang);
        donHang.setSoTienGiam(BigDecimal.ZERO);
        donHang.setPhiVanChuyen(BigDecimal.ZERO);
        donHang.setTongThanhToan(tongTienHang);

        // Cập nhật trạng thái đơn thuốc
        donThuoc.setTrangThai(DonThuoc.TrangThaiDonThuoc.DA_THANH_TOAN);
        donThuocRepository.save(donThuoc);

        return donHangRepository.save(donHang);
    }
    
    @Transactional
    public void updatePaymentStatus(Integer donHangId, DonHang.TrangThaiThanhToan status, String transactionId) {
        DonHang donHang = donHangRepository.findById(donHangId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + donHangId));
        
        donHang.setTrangThaiThanhToan(status);
        if (transactionId != null) {
            donHang.setMaGiaoDich(transactionId);
        }
        if (status == DonHang.TrangThaiThanhToan.DA_THANH_TOAN) {
            donHang.setNgayThanhToan(LocalDateTime.now());
        }
        
        donHangRepository.save(donHang);
    }

    public DonHangResponse updateDonHangStatus(Integer id, DonHangUpdateRequest updateRequest) {
        DonHang donHang = donHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại với id: " + id));

        if (updateRequest.getTrangThai() != null) {
            donHang.setTrangThai(updateRequest.getTrangThai());
        }

        if (StringUtils.hasText(updateRequest.getDiaChiGiaoHang())) {
            donHang.setDiaChiGiaoHang(updateRequest.getDiaChiGiaoHang());
        }

        DonHang savedDonHang = donHangRepository.save(donHang);
        return convertToResponse(savedDonHang);
    }

    @Transactional
    public DonHangResponse cancelDonHang(Integer donHangId, String userEmail, String lyDoHuy) {
        DonHang donHang = donHangRepository.findById(donHangId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + donHangId));

        if (!donHang.getNguoiDung().getEmail().equals(userEmail)) {
             throw new RuntimeException("Bạn không có quyền hủy đơn hàng này.");
        }

        if (donHang.getTrangThai() != DonHang.TrangThaiDonHang.CHO_XU_LY) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng khi đang ở trạng thái chờ xử lý.");
        }

        for (ChiTietDonHang chiTiet : donHang.getChiTietDonHangs()) {
            SanPham sanPham = chiTiet.getSanPham();
            sanPham.setSoLuongTonKho(sanPham.getSoLuongTonKho() + chiTiet.getSoLuong());
            sanPhamRepository.save(sanPham);
        }

        donHang.setTrangThai(DonHang.TrangThaiDonHang.DA_HUY);
        donHang.setLyDoHuy(lyDoHuy);
        DonHang savedDonHang = donHangRepository.save(donHang);
        return convertToResponse(savedDonHang);
    }
    
    public List<String> getLyDoHuyDonOptions() {
        List<String> options = new ArrayList<>();
        for (DonHang.LyDoHuyDon lyDo : DonHang.LyDoHuyDon.values()) {
            options.add(lyDo.getMoTa());
        }
        return options;
    }

    public void deleteDonHang(Integer id) {
        donHangRepository.deleteById(id);
    }

    private DonHangResponse convertToResponse(DonHang donHang) {
        // Lấy danh sách đánh giá của đơn hàng này
        List<DanhGia> reviews = danhGiaRepository.findByDonHang_DonHangId(donHang.getDonHangId());
        
        boolean daDanhGiaChung = reviews.stream().anyMatch(r -> r.getSanPham() == null);
        
        Set<Integer> reviewedProductIds = reviews.stream()
                .filter(r -> r.getSanPham() != null)
                .map(r -> r.getSanPham().getSanPhamId())
                .collect(Collectors.toSet());

        List<ChiTietDonHangResponse> chiTietResponses = donHang.getChiTietDonHangs().stream()
                .map(ct -> convertChiTietToResponse(ct, reviewedProductIds))
                .collect(Collectors.toList());
        
        // Logic lấy tên người dùng: Nếu có User thì lấy tên User, nếu không thì lấy tên người nhận (Guest)
        String tenNguoiDung = null;
        String anhNguoiNhan = null; // Thêm biến ảnh
        if (donHang.getNguoiDung() != null) {
            tenNguoiDung = donHang.getNguoiDung().getHoTen();
            anhNguoiNhan = donHang.getNguoiDung().getAnhDaiDien(); // Lấy ảnh đại diện
        } else {
            tenNguoiDung = donHang.getHoTenNguoiNhan();
        }

        return new DonHangResponse(
                donHang.getDonHangId(),
                donHang.getNgayDatHang(),
                donHang.getTongTienHang(),
                donHang.getSoTienGiam(),
                donHang.getPhiVanChuyen(), // Thêm phí vận chuyển
                donHang.getTongThanhToan(),
                donHang.getTrangThai() != null ? donHang.getTrangThai().getDisplayName() : null,
                donHang.getPhuongThucThanhToan(),
                donHang.getTrangThaiThanhToan(), // Thêm trạng thái thanh toán
                donHang.getDiaChiGiaoHang(),
                donHang.getSoDienThoaiNhan(),
                donHang.getLyDoHuy(),
                donHang.getNguoiDung() != null ? donHang.getNguoiDung().getUserId() : null,
                tenNguoiDung, // Sử dụng tên đã xử lý logic
                anhNguoiNhan, // Truyền ảnh đại diện vào response
                donHang.getKhuyenMai() != null ? donHang.getKhuyenMai().getMaCode() : null,
                chiTietResponses,
                daDanhGiaChung
        );
    }

    private ChiTietDonHangResponse convertChiTietToResponse(ChiTietDonHang chiTiet, Set<Integer> reviewedProductIds) {
        SanPham sanPham = chiTiet.getSanPham();
        boolean daDanhGia = false;
        String tenDanhMuc = null;
        if (sanPham != null) {
             if (reviewedProductIds != null) {
                 daDanhGia = reviewedProductIds.contains(sanPham.getSanPhamId());
             }
             if (sanPham.getDanhMucSanPham() != null) {
                 tenDanhMuc = sanPham.getDanhMucSanPham().getTenDanhMuc();
             }
        }
        
        return new ChiTietDonHangResponse(
                chiTiet.getId(),
                chiTiet.getSoLuong(),
                chiTiet.getDonGia(),
                sanPham != null ? sanPham.getSanPhamId() : null,
                sanPham != null ? sanPham.getTenSanPham() : null,
                tenDanhMuc, // Thêm tên danh mục
                sanPham != null ? sanPham.getHinhAnh() : null,
                daDanhGia
        );
    }
}
