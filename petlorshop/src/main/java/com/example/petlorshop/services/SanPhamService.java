package com.example.petlorshop.services;

import com.example.petlorshop.config.FilterConfig;
import com.example.petlorshop.dto.SanPhamRequest;
import com.example.petlorshop.dto.SanPhamResponse;
import com.example.petlorshop.models.DanhMucSanPham;
import com.example.petlorshop.models.SanPham;
import com.example.petlorshop.repositories.DanhMucSanPhamRepository;
import com.example.petlorshop.repositories.SanPhamRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private DanhMucSanPhamRepository danhMucSanPhamRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private FilterConfig filterConfig;

    @PostConstruct
    public void init() {
        filterConfig.enableDeletedProductFilter(false);
    }

    @Transactional(readOnly = true)
    public Page<SanPhamResponse> getAllSanPham(Pageable pageable, String keyword, Integer categoryId) {
        Page<SanPham> sanPhamPage;

        if (StringUtils.hasText(keyword) && categoryId != null) {
            // Tìm theo tên VÀ danh mục
            sanPhamPage = sanPhamRepository.findByTenSanPhamContainingIgnoreCaseAndDanhMucSanPham_DanhMucId(keyword, categoryId, pageable);
        } else if (StringUtils.hasText(keyword)) {
            // Chỉ tìm theo tên
            sanPhamPage = sanPhamRepository.findByTenSanPhamContainingIgnoreCase(keyword, pageable);
        } else if (categoryId != null) {
            // Chỉ lọc theo danh mục
            sanPhamPage = sanPhamRepository.findByDanhMucSanPham_DanhMucId(categoryId, pageable);
        } else {
            // Lấy tất cả
            sanPhamPage = sanPhamRepository.findAll(pageable);
        }

        return sanPhamPage.map(this::convertToResponse);
    }

    @Transactional(readOnly = true)
    public Optional<SanPhamResponse> getSanPhamById(Integer id) {
        return sanPhamRepository.findById(id).map(this::convertToResponse);
    }

    @Transactional
    public SanPham createSanPham(SanPhamRequest request, MultipartFile hinhAnh) {
        DanhMucSanPham danhMuc = danhMucSanPhamRepository.findById(request.getDanhMucId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với id: " + request.getDanhMucId()));

        SanPham newSanPham = new SanPham();
        newSanPham.setTenSanPham(request.getTenSanPham());
        newSanPham.setMoTaChiTiet(request.getMoTaChiTiet());
        newSanPham.setGia(request.getGia());
        newSanPham.setGiaGiam(request.getGiaGiam());
        newSanPham.setSoLuongTonKho(request.getSoLuongTonKho());
        newSanPham.setTrongLuong(request.getTrongLuong() != null ? request.getTrongLuong() : 500);
        newSanPham.setDanhMucSanPham(danhMuc);
        
        // Thuốc
        newSanPham.setHanSuDung(request.getHanSuDung());
        newSanPham.setSoLo(request.getSoLo());
        newSanPham.setDonViTinh(request.getDonViTinh());
        newSanPham.setThanhPhan(request.getThanhPhan());
        newSanPham.setChiDinh(request.getChiDinh());

        if (hinhAnh != null && !hinhAnh.isEmpty()) {
            String fileName = fileStorageService.storeFile(hinhAnh);
            newSanPham.setHinhAnh(fileName);
        }

        return sanPhamRepository.save(newSanPham);
    }

    @Transactional
    public SanPham updateSanPham(Integer id, SanPhamRequest request, MultipartFile hinhAnh) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với id: " + id));

        sanPham.setTenSanPham(request.getTenSanPham());
        sanPham.setMoTaChiTiet(request.getMoTaChiTiet());
        sanPham.setGia(request.getGia());
        sanPham.setGiaGiam(request.getGiaGiam());
        sanPham.setSoLuongTonKho(request.getSoLuongTonKho());
        
        if (request.getTrongLuong() != null) {
            sanPham.setTrongLuong(request.getTrongLuong());
        }
        
        // Thuốc
        sanPham.setHanSuDung(request.getHanSuDung());
        sanPham.setSoLo(request.getSoLo());
        sanPham.setDonViTinh(request.getDonViTinh());
        sanPham.setThanhPhan(request.getThanhPhan());
        sanPham.setChiDinh(request.getChiDinh());

        if (hinhAnh != null && !hinhAnh.isEmpty()) {
            String fileName = fileStorageService.storeFile(hinhAnh);
            sanPham.setHinhAnh(fileName);
        }

        if (request.getDanhMucId() != null) {
            DanhMucSanPham danhMuc = danhMucSanPhamRepository.findById(request.getDanhMucId())
                    .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với id: " + request.getDanhMucId()));
            sanPham.setDanhMucSanPham(danhMuc);
        }

        return sanPhamRepository.save(sanPham);
    }

    @Transactional
    public void deleteSanPham(Integer id) {
        sanPhamRepository.deleteById(id);
    }

    private SanPhamResponse convertToResponse(SanPham sanPham) {
        return new SanPhamResponse(
                sanPham.getSanPhamId(),
                sanPham.getTenSanPham(),
                sanPham.getMoTaChiTiet(),
                sanPham.getGia(),
                sanPham.getGiaGiam(),
                sanPham.getSoLuongTonKho(),
                sanPham.getHinhAnh(),
                sanPham.getTrongLuong(),
                sanPham.getDanhMucSanPham() != null ? sanPham.getDanhMucSanPham().getDanhMucId() : null,
                sanPham.getDanhMucSanPham() != null ? sanPham.getDanhMucSanPham().getTenDanhMuc() : null,
                sanPham.getHanSuDung(),
                sanPham.getSoLo(),
                sanPham.getDonViTinh(),
                sanPham.getThanhPhan(),
                sanPham.getChiDinh()
        );
    }
}
