package com.example.petlorshop.services;

import com.example.petlorshop.dto.DichVuRequest;
import com.example.petlorshop.dto.DichVuResponse;
import com.example.petlorshop.models.DanhMucDichVu;
import com.example.petlorshop.models.DichVu;
import com.example.petlorshop.repositories.DanhMucDichVuRepository;
import com.example.petlorshop.repositories.DichVuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DichVuService {

    @Autowired
    private DichVuRepository dichVuRepository;

    @Autowired
    private DanhMucDichVuRepository danhMucDichVuRepository;

    public List<DichVuResponse> getAllDichVu() {
        return dichVuRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Optional<DichVuResponse> getDichVuById(Integer id) {
        return dichVuRepository.findById(id).map(this::convertToResponse);
    }

    public DichVuResponse createDichVu(DichVuRequest request) {
        DanhMucDichVu danhMuc = danhMucDichVuRepository.findById(request.getDanhMucDvId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục dịch vụ với ID: " + request.getDanhMucDvId()));

        DichVu dichVu = new DichVu();
        mapRequestToEntity(request, dichVu, danhMuc);
        
        DichVu savedDichVu = dichVuRepository.save(dichVu);
        
        // Tự xây dựng response thay vì gọi convertToResponse
        return new DichVuResponse(
            savedDichVu.getDichVuId(),
            savedDichVu.getTenDichVu(),
            savedDichVu.getMoTa(),
            savedDichVu.getGiaDichVu(),
            savedDichVu.getThoiLuongUocTinhPhut(),
            danhMuc.getDanhMucDvId(),
            danhMuc.getTenDanhMucDv(),
            danhMuc.getRoleCanThucHien()
        );
    }

    public DichVuResponse updateDichVu(Integer id, DichVuRequest request) {
        DichVu dichVu = dichVuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại với id: " + id));
        
        DanhMucDichVu danhMuc = danhMucDichVuRepository.findById(request.getDanhMucDvId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục dịch vụ với ID: " + request.getDanhMucDvId()));

        mapRequestToEntity(request, dichVu, danhMuc);

        DichVu updatedDichVu = dichVuRepository.save(dichVu);
        
        // Tự xây dựng response
        return new DichVuResponse(
            updatedDichVu.getDichVuId(),
            updatedDichVu.getTenDichVu(),
            updatedDichVu.getMoTa(),
            updatedDichVu.getGiaDichVu(),
            updatedDichVu.getThoiLuongUocTinhPhut(),
            danhMuc.getDanhMucDvId(),
            danhMuc.getTenDanhMucDv(),
            danhMuc.getRoleCanThucHien()
        );
    }

    public void deleteDichVu(Integer id) {
        dichVuRepository.deleteById(id);
    }

    private void mapRequestToEntity(DichVuRequest request, DichVu dichVu, DanhMucDichVu danhMuc) {
        dichVu.setTenDichVu(request.getTenDichVu());
        dichVu.setMoTa(request.getMoTa());
        dichVu.setGiaDichVu(request.getGiaDichVu());
        dichVu.setThoiLuongUocTinhPhut(request.getThoiLuongUocTinhPhut());
        dichVu.setDanhMucDichVu(danhMuc);
    }

    private DichVuResponse convertToResponse(DichVu dichVu) {
        return new DichVuResponse(
                dichVu.getDichVuId(),
                dichVu.getTenDichVu(),
                dichVu.getMoTa(),
                dichVu.getGiaDichVu(),
                dichVu.getThoiLuongUocTinhPhut(),
                dichVu.getDanhMucDichVu() != null ? dichVu.getDanhMucDichVu().getDanhMucDvId() : null,
                dichVu.getDanhMucDichVu() != null ? dichVu.getDanhMucDichVu().getTenDanhMucDv() : null,
                dichVu.getDanhMucDichVu() != null ? dichVu.getDanhMucDichVu().getRoleCanThucHien() : null
        );
    }
}
