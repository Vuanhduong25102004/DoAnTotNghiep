package com.example.petlorshop.services;

import com.example.petlorshop.dto.SanPhamRequest;
import com.example.petlorshop.dto.SanPhamResponse;
import com.example.petlorshop.models.DanhMucSanPham;
import com.example.petlorshop.models.SanPham;
import com.example.petlorshop.repositories.DanhMucSanPhamRepository;
import com.example.petlorshop.repositories.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
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

    public Page<SanPhamResponse> getAllSanPham(Pageable pageable) {
        return sanPhamRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    public Optional<SanPhamResponse> getSanPhamById(Integer id) {
        return sanPhamRepository.findById(id).map(this::convertToResponse);
    }

    public SanPham createSanPham(SanPhamRequest request, MultipartFile hinhAnh) {
        DanhMucSanPham danhMuc = danhMucSanPhamRepository.findById(request.getDanhMucId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với id: " + request.getDanhMucId()));

        SanPham newSanPham = new SanPham();
        newSanPham.setTenSanPham(request.getTenSanPham());
        newSanPham.setMoTaChiTiet(request.getMoTaChiTiet());
        newSanPham.setGia(request.getGia());
        newSanPham.setSoLuongTonKho(request.getSoLuongTonKho());
        newSanPham.setDanhMucSanPham(danhMuc);

        if (hinhAnh != null && !hinhAnh.isEmpty()) {
            String fileName = fileStorageService.storeFile(hinhAnh);
            newSanPham.setHinhAnh(fileName);
        }

        return sanPhamRepository.save(newSanPham);
    }

    public SanPham updateSanPham(Integer id, SanPhamRequest request, MultipartFile hinhAnh) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với id: " + id));

        // Cập nhật các trường cơ bản
        sanPham.setTenSanPham(request.getTenSanPham());
        sanPham.setMoTaChiTiet(request.getMoTaChiTiet());
        sanPham.setGia(request.getGia());
        sanPham.setSoLuongTonKho(request.getSoLuongTonKho());

        // Chỉ cập nhật hình ảnh nếu có file mới được cung cấp
        if (hinhAnh != null && !hinhAnh.isEmpty()) {
            String fileName = fileStorageService.storeFile(hinhAnh);
            sanPham.setHinhAnh(fileName);
        }

        // Chỉ cập nhật danh mục nếu có ID mới được cung cấp
        if (request.getDanhMucId() != null) {
            DanhMucSanPham danhMuc = danhMucSanPhamRepository.findById(request.getDanhMucId())
                    .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại với id: " + request.getDanhMucId()));
            sanPham.setDanhMucSanPham(danhMuc);
        }

        return sanPhamRepository.save(sanPham);
    }

    public void deleteSanPham(Integer id) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với id: " + id));
        sanPhamRepository.delete(sanPham);
    }

    private SanPhamResponse convertToResponse(SanPham sanPham) {
        return new SanPhamResponse(
                sanPham.getSanPhamId(),
                sanPham.getTenSanPham(),
                sanPham.getMoTaChiTiet(),
                sanPham.getGia(),
                sanPham.getSoLuongTonKho(),
                sanPham.getHinhAnh(),
                sanPham.getDanhMucSanPham() != null ? sanPham.getDanhMucSanPham().getDanhMucId() : null,
                sanPham.getDanhMucSanPham() != null ? sanPham.getDanhMucSanPham().getTenDanhMuc() : null
        );
    }
}
