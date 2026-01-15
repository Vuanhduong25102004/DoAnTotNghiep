package com.example.petlorshop.controllers;

import com.example.petlorshop.models.CuaHang;
import com.example.petlorshop.services.CuaHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cua-hang")
public class CuaHangController {

    @Autowired
    private CuaHangService cuaHangService;

    @GetMapping
    public ResponseEntity<CuaHang> getInfo() {
        return ResponseEntity.ok(cuaHangService.getThongTinCuaHang());
    }

    @PutMapping
    public ResponseEntity<CuaHang> updateInfo(@RequestBody CuaHang cuaHang) {
        return ResponseEntity.ok(cuaHangService.updateThongTinCuaHang(cuaHang));
    }
}
