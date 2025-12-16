package com.example.petlorshop.services;

import com.example.petlorshop.dto.DichVuRequest;
import com.example.petlorshop.dto.DichVuResponse;
import com.example.petlorshop.models.DanhMucDichVu;
import com.example.petlorshop.models.DichVu;
import com.example.petlorshop.repositories.DanhMucDichVuRepository;
import com.example.petlorshop.repositories.DichVuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class DichVuService {

    @Autowired
    private DichVuRepository dichVuRepository;

    @Autowired
    private DanhMucDichVuRepository danhMucDichVuRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Page<DichVuResponse> getAllDichVu(Pageable pageable) {
        return dichVuRepository.findAll(pageable)
                .map(this::convertToResponse);
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

        // Chỉ cập nhật danh mục nếu có ID được cung cấp
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
        dichVu.setThoiLuongUocTinhPhut(request.getThoiLuongUocTinhPhut());
    }

    private DichVuResponse convertToResponse(DichVu dichVu) {
        return new DichVuResponse(
                dichVu.getDichVuId(),
                dichVu.getTenDichVu(),
                dichVu.getMoTa(),
                dichVu.getGiaDichVu(),
                dichVu.getThoiLuongUocTinhPhut(),
                dichVu.getHinhAnh(),
                dichVu.getDanhMucDichVu() != null ? dichVu.getDanhMucDichVu().getDanhMucDvId() : null,
                dichVu.getDanhMucDichVu() != null ? dichVu.getDanhMucDichVu().getTenDanhMucDv() : null,
                dichVu.getDanhMucDichVu() != null ? dichVu.getDanhMucDichVu().getRoleCanThucHien() : null
        );
    }
}
