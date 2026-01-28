package com.example.petlorshop.services;

import com.example.petlorshop.dto.DanhGiaBulkRequest;
import com.example.petlorshop.dto.DanhGiaItemRequest;
import com.example.petlorshop.dto.DanhGiaRequest;
import com.example.petlorshop.dto.DanhGiaResponse;
import com.example.petlorshop.models.ChiTietDonHang;
import com.example.petlorshop.models.DanhGia;
import com.example.petlorshop.models.DonHang;
import com.example.petlorshop.models.NguoiDung;
import com.example.petlorshop.models.SanPham;
import com.example.petlorshop.repositories.DanhGiaRepository;
import com.example.petlorshop.repositories.DonHangRepository;
import com.example.petlorshop.repositories.NguoiDungRepository;
import com.example.petlorshop.repositories.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DanhGiaService {

    @Autowired
    private DanhGiaRepository danhGiaRepository;

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    public Page<DanhGiaResponse> getAllDanhGia(Pageable pageable) {
        return danhGiaRepository.findAll(pageable).map(this::convertToResponse);
    }

    @Transactional
    public DanhGiaResponse createDanhGia(String email, DanhGiaRequest request) {
        NguoiDung user = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DonHang donHang = donHangRepository.findById(request.getDonHangId())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        // 1. Kiểm tra đơn hàng có phải của user này không
        if (!donHang.getNguoiDung().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Bạn không có quyền đánh giá đơn hàng này.");
        }

        // 2. Kiểm tra trạng thái đơn hàng (Phải là Đã giao)
        if (donHang.getTrangThai() != DonHang.TrangThaiDonHang.DA_GIAO) {
             throw new RuntimeException("Chỉ có thể đánh giá khi đơn hàng đã giao thành công.");
        }

        DanhGia danhGia = new DanhGia();
        danhGia.setNguoiDung(user);
        danhGia.setDonHang(donHang);
        danhGia.setSoSao(request.getSoSao());
        danhGia.setNoiDung(request.getNoiDung());

        // Trường hợp 1: Đánh giá sản phẩm cụ thể
        if (request.getSanPhamId() != null) {
            // Kiểm tra sản phẩm có trong đơn hàng không
            boolean productInOrder = false;
            for (ChiTietDonHang ct : donHang.getChiTietDonHangs()) {
                if (ct.getSanPham().getSanPhamId().equals(request.getSanPhamId())) {
                    productInOrder = true;
                    break;
                }
            }
            if (!productInOrder) {
                throw new RuntimeException("Sản phẩm này không có trong đơn hàng của bạn.");
            }

            // Kiểm tra đã đánh giá chưa
            if (danhGiaRepository.existsByNguoiDung_UserIdAndSanPham_SanPhamIdAndDonHang_DonHangId(
                    user.getUserId(), request.getSanPhamId(), request.getDonHangId())) {
                throw new RuntimeException("Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi.");
            }

            SanPham sanPham = sanPhamRepository.findById(request.getSanPhamId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
            danhGia.setSanPham(sanPham);
        } 
        // Trường hợp 2: Đánh giá chung đơn hàng (sanPhamId = null)
        else {
            if (danhGiaRepository.existsByNguoiDung_UserIdAndDonHang_DonHangIdAndSanPhamIsNull(
                    user.getUserId(), request.getDonHangId())) {
                throw new RuntimeException("Bạn đã đánh giá đơn hàng này rồi.");
            }
            danhGia.setSanPham(null);
        }

        DanhGia saved = danhGiaRepository.save(danhGia);
        return convertToResponse(saved);
    }
    
    @Transactional
    public List<DanhGiaResponse> createBulkDanhGia(String email, DanhGiaBulkRequest request) {
        NguoiDung user = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DonHang donHang = donHangRepository.findById(request.getDonHangId())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if (!donHang.getNguoiDung().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Bạn không có quyền đánh giá đơn hàng này.");
        }

        if (donHang.getTrangThai() != DonHang.TrangThaiDonHang.DA_GIAO) {
            throw new RuntimeException("Chỉ có thể đánh giá khi đơn hàng đã giao thành công.");
        }

        List<DanhGia> danhGiaList = new ArrayList<>();

        for (DanhGiaItemRequest item : request.getDanhGiaList()) {
            // Kiểm tra sản phẩm có trong đơn hàng không
            boolean productInOrder = false;
            for (ChiTietDonHang ct : donHang.getChiTietDonHangs()) {
                if (ct.getSanPham().getSanPhamId().equals(item.getSanPhamId())) {
                    productInOrder = true;
                    break;
                }
            }
            if (!productInOrder) {
                // Có thể throw exception hoặc bỏ qua item này. Ở đây chọn throw để strict.
                throw new RuntimeException("Sản phẩm ID " + item.getSanPhamId() + " không có trong đơn hàng.");
            }

            // Kiểm tra đã đánh giá chưa
            if (danhGiaRepository.existsByNguoiDung_UserIdAndSanPham_SanPhamIdAndDonHang_DonHangId(
                    user.getUserId(), item.getSanPhamId(), request.getDonHangId())) {
                // Nếu đã đánh giá rồi thì bỏ qua, không tạo thêm
                continue;
            }

            SanPham sanPham = sanPhamRepository.findById(item.getSanPhamId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            DanhGia danhGia = new DanhGia();
            danhGia.setNguoiDung(user);
            danhGia.setDonHang(donHang);
            danhGia.setSanPham(sanPham);
            danhGia.setSoSao(item.getSoSao());
            danhGia.setNoiDung(item.getNoiDung());
            
            danhGiaList.add(danhGia);
        }

        List<DanhGia> savedList = danhGiaRepository.saveAll(danhGiaList);
        return savedList.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public Page<DanhGiaResponse> getDanhGiaBySanPham(Integer sanPhamId, Pageable pageable) {
        return danhGiaRepository.findBySanPham_SanPhamId(sanPhamId, pageable)
                .map(this::convertToResponse);
    }
    
    @Transactional
    public DanhGiaResponse replyToReview(Integer danhGiaId, String phanHoi) {
        DanhGia danhGia = danhGiaRepository.findById(danhGiaId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá với ID: " + danhGiaId));
        
        danhGia.setPhanHoi(phanHoi);
        danhGia.setNgayPhanHoi(LocalDateTime.now());
        
        DanhGia saved = danhGiaRepository.save(danhGia);
        return convertToResponse(saved);
    }

    private DanhGiaResponse convertToResponse(DanhGia dg) {
        Integer sanPhamId = null;
        String tenSanPham = null;
        String hinhAnhSanPham = null;
        
        if (dg.getSanPham() != null) {
            sanPhamId = dg.getSanPham().getSanPhamId();
            tenSanPham = dg.getSanPham().getTenSanPham();
            hinhAnhSanPham = dg.getSanPham().getHinhAnh();
        }
        
        return new DanhGiaResponse(
                dg.getDanhGiaId(),
                dg.getNguoiDung().getHoTen(),
                dg.getNguoiDung().getAnhDaiDien(),
                dg.getSoSao(),
                dg.getNoiDung(),
                dg.getNgayDanhGia(),
                sanPhamId,
                tenSanPham,
                hinhAnhSanPham,
                dg.getPhanHoi(),
                dg.getNgayPhanHoi()
        );
    }
}
