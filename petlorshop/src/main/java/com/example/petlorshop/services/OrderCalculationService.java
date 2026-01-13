package com.example.petlorshop.services;

import com.example.petlorshop.dto.ChiTietDonHangRequest;
import com.example.petlorshop.dto.OrderCalculationResult;
import com.example.petlorshop.models.ChiTietDonHang;
import com.example.petlorshop.models.KhuyenMai;
import com.example.petlorshop.models.SanPham;
import com.example.petlorshop.repositories.KhuyenMaiRepository;
import com.example.petlorshop.repositories.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderCalculationService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;
    
    @Autowired
    private GhtkService ghtkService;

    public OrderCalculationResult calculateOrder(List<ChiTietDonHangRequest> items, String maKhuyenMai, String province, String district, String ward, String address) {
        BigDecimal tongTienHang = BigDecimal.ZERO;
        int tongTrongLuong = 0;
        List<ChiTietDonHang> chiTietItems = new ArrayList<>();

        // 1. Tính tổng tiền hàng và chuẩn bị danh sách chi tiết
        for (ChiTietDonHangRequest itemRequest : items) {
            SanPham sanPham = sanPhamRepository.findById(itemRequest.getSanPhamId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + itemRequest.getSanPhamId()));

            if (sanPham.getSoLuongTonKho() < itemRequest.getSoLuong()) {
                throw new RuntimeException("Sản phẩm '" + sanPham.getTenSanPham() + "' không đủ số lượng tồn kho.");
            }

            BigDecimal giaBan = Optional.ofNullable(sanPham.getGiaGiam()).orElse(sanPham.getGia());

            ChiTietDonHang chiTiet = new ChiTietDonHang();
            chiTiet.setSanPham(sanPham);
            chiTiet.setSoLuong(itemRequest.getSoLuong());
            chiTiet.setDonGia(giaBan);
            chiTietItems.add(chiTiet);

            tongTienHang = tongTienHang.add(giaBan.multiply(BigDecimal.valueOf(itemRequest.getSoLuong())));
            
            // Cộng dồn trọng lượng
            int trongLuongSP = sanPham.getTrongLuong() != null ? sanPham.getTrongLuong() : 500;
            tongTrongLuong += trongLuongSP * itemRequest.getSoLuong();
        }

        // 2. Tính giảm giá
        BigDecimal soTienGiam = BigDecimal.ZERO;
        KhuyenMai khuyenMai = null;

        if (maKhuyenMai != null && !maKhuyenMai.isEmpty()) {
            khuyenMai = validateAndGetKhuyenMai(maKhuyenMai, tongTienHang);
            
            if (khuyenMai.getLoaiGiamGia() == KhuyenMai.LoaiGiamGia.PHAN_TRAM) {
                soTienGiam = tongTienHang.multiply(khuyenMai.getGiaTriGiam().divide(new BigDecimal(100)));
            } else {
                soTienGiam = khuyenMai.getGiaTriGiam();
            }
            
            // Đảm bảo tiền giảm không vượt quá tổng tiền
            if (soTienGiam.compareTo(tongTienHang) > 0) {
                soTienGiam = tongTienHang;
            }
        }
        
        // 3. Tính phí vận chuyển
        BigDecimal phiVanChuyen = BigDecimal.ZERO;
        if (province != null && district != null) {
            phiVanChuyen = ghtkService.calculateShippingFee(province, district, ward, address, tongTrongLuong, tongTienHang.intValue());
        }

        BigDecimal tongThanhToan = tongTienHang.subtract(soTienGiam).add(phiVanChuyen);

        return new OrderCalculationResult(tongTienHang, soTienGiam, phiVanChuyen, tongThanhToan, khuyenMai, chiTietItems);
    }

    private KhuyenMai validateAndGetKhuyenMai(String maCode, BigDecimal tongTienHang) {
        KhuyenMai km = khuyenMaiRepository.findByMaCode(maCode)
                .orElseThrow(() -> new RuntimeException("Mã khuyến mãi không tồn tại."));

        if (!km.getTrangThai()) {
            throw new RuntimeException("Mã khuyến mãi đang bị khóa.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(km.getNgayBatDau())) {
            throw new RuntimeException("Mã khuyến mãi chưa đến thời gian áp dụng.");
        }

        if (now.isAfter(km.getNgayKetThuc())) {
            throw new RuntimeException("Mã khuyến mãi đã hết hạn.");
        }

        if (km.getSoLuongGioiHan() != null && km.getSoLuongGioiHan() <= 0) {
            throw new RuntimeException("Mã khuyến mãi đã hết lượt sử dụng.");
        }

        if (km.getDonToiThieu() != null && tongTienHang.compareTo(km.getDonToiThieu()) < 0) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này.");
        }

        return km;
    }
}
