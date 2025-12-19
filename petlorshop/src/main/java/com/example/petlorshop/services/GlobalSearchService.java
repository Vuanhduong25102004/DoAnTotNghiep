package com.example.petlorshop.services;

import com.example.petlorshop.dto.GlobalSearchDto;
import com.example.petlorshop.models.*;
import com.example.petlorshop.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GlobalSearchService {

    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private DichVuRepository dichVuRepository;
    @Autowired
    private ThuCungRepository thuCungRepository;
    @Autowired
    private NguoiDungRepository nguoiDungRepository;
    @Autowired
    private NhanVienRepository nhanVienRepository;
    @Autowired
    private DonHangRepository donHangRepository;
    @Autowired
    private LichHenRepository lichHenRepository;
    @Autowired
    private DanhMucSanPhamRepository danhMucSanPhamRepository;
    @Autowired
    private DanhMucDichVuRepository danhMucDichVuRepository;

    /**
     * Public search for anyone.
     */
    public GlobalSearchDto searchAll(String keyword) {
        List<SanPham> sanPhams = sanPhamRepository.searchByKeyword(keyword);
        List<DichVu> dichVus = dichVuRepository.searchByKeyword(keyword);
        List<ThuCung> thuCungs = thuCungRepository.searchByKeyword(keyword);
        return new GlobalSearchDto(sanPhams, dichVus, thuCungs);
    }

    /**
     * Comprehensive search for Admins.
     */
    public GlobalSearchDto searchAllForAdmin(String keyword) {
        GlobalSearchDto results = new GlobalSearchDto();
        results.setSanPhams(sanPhamRepository.searchByKeyword(keyword));
        results.setDichVus(dichVuRepository.searchByKeyword(keyword));
        results.setThuCungs(thuCungRepository.searchByKeyword(keyword));
        results.setNguoiDungs(nguoiDungRepository.searchByKeyword(keyword));
        results.setNhanViens(nhanVienRepository.searchByKeyword(keyword));
        results.setDonHangs(donHangRepository.searchByKeyword(keyword));
        results.setLichHens(lichHenRepository.searchByKeyword(keyword));
        results.setDanhMucSanPhams(danhMucSanPhamRepository.searchByKeyword(keyword));
        results.setDanhMucDichVus(danhMucDichVuRepository.searchByKeyword(keyword));
        return results;
    }
}
