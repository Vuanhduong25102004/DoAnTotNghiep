package com.example.petlorshop.services;

import com.example.petlorshop.dto.BaiVietRequest;
import com.example.petlorshop.dto.BaiVietResponse;
import com.example.petlorshop.models.BaiViet;
import com.example.petlorshop.models.DanhMucBaiViet;
import com.example.petlorshop.models.NhanVien;
import com.example.petlorshop.repositories.BaiVietRepository;
import com.example.petlorshop.repositories.DanhMucBaiVietRepository;
import com.example.petlorshop.repositories.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BaiVietService {

    @Autowired
    private BaiVietRepository baiVietRepository;

    @Autowired
    private DanhMucBaiVietRepository danhMucBaiVietRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // --- Danh Mục Bài Viết ---
    public List<DanhMucBaiViet> getAllDanhMuc() {
        return danhMucBaiVietRepository.findAll();
    }

    public Optional<DanhMucBaiViet> getDanhMucById(Integer id) {
        return danhMucBaiVietRepository.findById(id);
    }

    public DanhMucBaiViet createDanhMuc(String tenDanhMuc, String moTa) {
        DanhMucBaiViet dm = new DanhMucBaiViet();
        dm.setTenDanhMuc(tenDanhMuc);
        dm.setMoTa(moTa);
        return danhMucBaiVietRepository.save(dm);
    }

    public DanhMucBaiViet updateDanhMuc(Integer id, String tenDanhMuc, String moTa) {
        DanhMucBaiViet dm = danhMucBaiVietRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
        dm.setTenDanhMuc(tenDanhMuc);
        dm.setMoTa(moTa);
        return danhMucBaiVietRepository.save(dm);
    }

    public void deleteDanhMuc(Integer id) {
        DanhMucBaiViet dm = danhMucBaiVietRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
        
        List<BaiViet> baiViets = baiVietRepository.findByDanhMucBaiViet(dm);
        for (BaiViet bv : baiViets) {
            bv.setDanhMucBaiViet(null);
            baiVietRepository.save(bv);
        }

        danhMucBaiVietRepository.delete(dm);
    }

    // --- Bài Viết ---
    public Page<BaiVietResponse> getAllBaiViet(Pageable pageable) {
        return baiVietRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    public List<BaiVietResponse> getBaiVietCongKhai() {
        return baiVietRepository.findByTrangThai(BaiViet.TrangThaiBaiViet.CONG_KHAI).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Optional<BaiVietResponse> getBaiVietBySlug(String slug) {
        return baiVietRepository.findBySlug(slug).map(this::convertToResponse);
    }

    public Optional<BaiVietResponse> getBaiVietById(Integer id) {
        return baiVietRepository.findById(id).map(this::convertToResponse);
    }

    public List<BaiVietResponse> getBaiVietLienQuan(Integer id) {
        BaiViet currentPost = baiVietRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bài viết không tồn tại"));
        
        if (currentPost.getDanhMucBaiViet() == null) {
            return Collections.emptyList();
        }

        return baiVietRepository.findRelatedPosts(currentPost.getDanhMucBaiViet().getDanhMucBvId(), id)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BaiVietResponse createBaiViet(BaiVietRequest request, MultipartFile anhBiaFile) {
        // Tìm nhân viên dựa trên userId
        NhanVien nv = nhanVienRepository.findByNguoiDung_UserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ nhân viên cho User ID: " + request.getUserId()));
        
        BaiViet bv = new BaiViet();
        bv.setTieuDe(request.getTieuDe());
        bv.setSlug(request.getSlug());
        bv.setNoiDung(request.getNoiDung());
        bv.setTrangThai(request.getTrangThai());
        bv.setNhanVien(nv);

        if (anhBiaFile != null && !anhBiaFile.isEmpty()) {
            String fileName = fileStorageService.storeFile(anhBiaFile);
            bv.setAnhBia(fileName);
        } else {
            bv.setAnhBia(request.getAnhBia());
        }

        if (request.getDanhMucBvId() != null) {
            DanhMucBaiViet dm = danhMucBaiVietRepository.findById(request.getDanhMucBvId())
                    .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
            bv.setDanhMucBaiViet(dm);
        }

        BaiViet saved = baiVietRepository.save(bv);
        return convertToResponse(saved);
    }

    public BaiVietResponse updateBaiViet(Integer id, BaiVietRequest request, MultipartFile anhBiaFile) {
        BaiViet bv = baiVietRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bài viết không tồn tại"));

        bv.setTieuDe(request.getTieuDe());
        bv.setSlug(request.getSlug());
        bv.setNoiDung(request.getNoiDung());
        bv.setTrangThai(request.getTrangThai());

        if (anhBiaFile != null && !anhBiaFile.isEmpty()) {
            String fileName = fileStorageService.storeFile(anhBiaFile);
            bv.setAnhBia(fileName);
        } else if (request.getAnhBia() != null && !request.getAnhBia().isEmpty()) {
             bv.setAnhBia(request.getAnhBia());
        }

        if (request.getDanhMucBvId() != null) {
            DanhMucBaiViet dm = danhMucBaiVietRepository.findById(request.getDanhMucBvId())
                    .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
            bv.setDanhMucBaiViet(dm);
        } else {
            bv.setDanhMucBaiViet(null);
        }

        BaiViet saved = baiVietRepository.save(bv);
        return convertToResponse(saved);
    }

    public void deleteBaiViet(Integer id) {
        baiVietRepository.deleteById(id);
    }

    private BaiVietResponse convertToResponse(BaiViet bv) {
        return new BaiVietResponse(
                bv.getBaiVietId(),
                bv.getTieuDe(),
                bv.getSlug(),
                bv.getNoiDung(),
                bv.getAnhBia(),
                bv.getNgayDang(),
                bv.getNhanVien().getHoTen(),
                bv.getDanhMucBaiViet() != null ? bv.getDanhMucBaiViet().getTenDanhMuc() : null,
                bv.getTrangThai()
        );
    }
}
