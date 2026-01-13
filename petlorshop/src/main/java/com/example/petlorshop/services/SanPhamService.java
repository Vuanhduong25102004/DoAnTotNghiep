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
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

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
    public Page<SanPhamResponse> getAllSanPham(Pageable pageable) {
        return sanPhamRepository.findAll(pageable)
                .map(this::convertToResponse);
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
        newSanPham.setTrongLuong(request.getTrongLuong() != null ? request.getTrongLuong() : 500); // Mặc định 500g
        newSanPham.setDanhMucSanPham(danhMuc);

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
                sanPham.getDanhMucSanPham() != null ? sanPham.getDanhMucSanPham().getTenDanhMuc() : null
        );
    }
}
