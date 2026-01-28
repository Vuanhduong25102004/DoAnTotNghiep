package com.example.petlorshop.services;

import com.example.petlorshop.dto.DichVuRequest;
import com.example.petlorshop.dto.DichVuResponse;
import com.example.petlorshop.models.DanhMucDichVu;
import com.example.petlorshop.models.DichVu;
import com.example.petlorshop.repositories.DanhMucDichVuRepository;
import com.example.petlorshop.repositories.DichVuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DichVuService {

    @Autowired
    private DichVuRepository dichVuRepository;

    @Autowired
    private DanhMucDichVuRepository danhMucDichVuRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Page<DichVuResponse> getAllDichVu(Pageable pageable, String keyword, Integer categoryId) {
        Page<DichVu> dichVuPage;

        if (StringUtils.hasText(keyword) && categoryId != null) {
            // Tìm theo từ khóa VÀ danh mục
            dichVuPage = dichVuRepository.searchByKeywordAndCategory(keyword, categoryId, pageable);
        } else if (StringUtils.hasText(keyword)) {
            // Chỉ tìm theo từ khóa
            dichVuPage = dichVuRepository.searchByKeyword(keyword, pageable);
        } else if (categoryId != null) {
            // Chỉ lọc theo danh mục
            dichVuPage = dichVuRepository.findByDanhMucDichVu_DanhMucDvId(categoryId, pageable);
        } else {
            // Lấy tất cả
            dichVuPage = dichVuRepository.findAll(pageable);
        }

        return dichVuPage.map(this::convertToResponse);
    }

    public Optional<DichVuResponse> getDichVuById(Integer id) {
        return dichVuRepository.findById(id).map(this::convertToResponse);
    }

    public DichVuResponse createDichVu(DichVuRequest request, MultipartFile hinhAnh) {
        DanhMucDichVu danhMuc = danhMucDichVuRepository.findById(request.getDanhMucDvId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục dịch vụ với ID: " + request.getDanhMucDvId()));

        DichVu dichVu = new DichVu();
        mapRequestToEntity(request, dichVu);
        dichVu.setDanhMucDichVu(danhMuc);

        if (hinhAnh != null && !hinhAnh.isEmpty()) {
            String fileName = fileStorageService.storeFile(hinhAnh);
            dichVu.setHinhAnh(fileName);
        }
        
        DichVu savedDichVu = dichVuRepository.save(dichVu);
        return convertToResponse(savedDichVu);
    }

    public DichVuResponse updateDichVu(Integer id, DichVuRequest request, MultipartFile hinhAnh) {
        DichVu dichVu = dichVuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại với id: " + id));
        
        mapRequestToEntity(request, dichVu);

        if (request.getDanhMucDvId() != null) {
            DanhMucDichVu danhMuc = danhMucDichVuRepository.findById(request.getDanhMucDvId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục dịch vụ với ID: " + request.getDanhMucDvId()));
            dichVu.setDanhMucDichVu(danhMuc);
        }

        if (hinhAnh != null && !hinhAnh.isEmpty()) {
            String fileName = fileStorageService.storeFile(hinhAnh);
            dichVu.setHinhAnh(fileName);
        }

        DichVu updatedDichVu = dichVuRepository.save(dichVu);
        return convertToResponse(updatedDichVu);
    }

    public void deleteDichVu(Integer id) {
        dichVuRepository.deleteById(id);
    }

    private void mapRequestToEntity(DichVuRequest request, DichVu dichVu) {
        dichVu.setTenDichVu(request.getTenDichVu());
        dichVu.setMoTa(request.getMoTa());
        dichVu.setGiaDichVu(request.getGiaDichVu());
        dichVu.setThoiLuongUocTinh(request.getThoiLuongUocTinh());
    }

    private DichVuResponse convertToResponse(DichVu dichVu) {
        return new DichVuResponse(
                dichVu.getDichVuId(),
                dichVu.getTenDichVu(),
                dichVu.getMoTa(),
                dichVu.getGiaDichVu(),
                dichVu.getThoiLuongUocTinh(),
                dichVu.getHinhAnh(),
                dichVu.getDanhMucDichVu() != null ? dichVu.getDanhMucDichVu().getDanhMucDvId() : null,
                dichVu.getDanhMucDichVu() != null ? dichVu.getDanhMucDichVu().getTenDanhMucDv() : null
        );
    }
}
