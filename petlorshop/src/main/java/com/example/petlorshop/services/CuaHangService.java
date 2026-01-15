package com.example.petlorshop.services;

import com.example.petlorshop.models.CuaHang;
import com.example.petlorshop.repositories.CuaHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CuaHangService {

    @Autowired
    private CuaHangRepository cuaHangRepository;

    public CuaHang getThongTinCuaHang() {
        List<CuaHang> list = cuaHangRepository.findAll();
        if (list.isEmpty()) {
            // Tạo mặc định nếu chưa có
            CuaHang defaultShop = new CuaHang();
            defaultShop.setTenCuaHang("Petlor Shop");
            defaultShop.setTinhThanh("Hà Nội");
            defaultShop.setQuanHuyen("Quận Cầu Giấy");
            return cuaHangRepository.save(defaultShop);
        }
        return list.get(0);
    }

    public CuaHang updateThongTinCuaHang(CuaHang thongTinMoi) {
        CuaHang currentShop = getThongTinCuaHang();
        
        currentShop.setTenCuaHang(thongTinMoi.getTenCuaHang());
        currentShop.setSoDienThoai(thongTinMoi.getSoDienThoai());
        currentShop.setDiaChiChiTiet(thongTinMoi.getDiaChiChiTiet());
        currentShop.setTinhThanh(thongTinMoi.getTinhThanh());
        currentShop.setQuanHuyen(thongTinMoi.getQuanHuyen());
        currentShop.setPhuongXa(thongTinMoi.getPhuongXa());
        
        if (thongTinMoi.getGhtkToken() != null && !thongTinMoi.getGhtkToken().isEmpty()) {
            currentShop.setGhtkToken(thongTinMoi.getGhtkToken());
        }

        return cuaHangRepository.save(currentShop);
    }
}
