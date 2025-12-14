package com.example.petlorshop.services;

import com.example.petlorshop.dto.DichVuResponse;
import com.example.petlorshop.models.DichVu;
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

    public List<DichVuResponse> getAllDichVu() {
        return dichVuRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Optional<DichVuResponse> getDichVuById(Integer id) {
        return dichVuRepository.findById(id).map(this::convertToResponse);
    }

    public DichVu createDichVu(DichVu dichVu) {
        // Cần cập nhật để nhận DichVuRequest
        return dichVuRepository.save(dichVu);
    }

    public DichVu updateDichVu(Integer id, DichVu dichVuDetails) {
        // Cần cập nhật để nhận DichVuRequest
        DichVu dichVu = dichVuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại với id: " + id));

        dichVu.setTenDichVu(dichVuDetails.getTenDichVu());
        dichVu.setMoTa(dichVuDetails.getMoTa());
        dichVu.setGiaDichVu(dichVuDetails.getGiaDichVu());
        dichVu.setThoiLuongUocTinhPhut(dichVuDetails.getThoiLuongUocTinhPhut());

        return dichVuRepository.save(dichVu);
    }

    public void deleteDichVu(Integer id) {
        DichVu dichVu = dichVuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại với id: " + id));
        dichVuRepository.delete(dichVu);
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
