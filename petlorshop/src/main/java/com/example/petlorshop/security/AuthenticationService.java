package com.example.petlorshop.security;

import com.example.petlorshop.dto.JwtAuthenticationResponse;
import com.example.petlorshop.dto.LoginRequest;
import com.example.petlorshop.dto.NguoiDungResponse;
import com.example.petlorshop.dto.SignUpRequest;
import com.example.petlorshop.models.NguoiDung;
import com.example.petlorshop.models.Role;
import com.example.petlorshop.repositories.NguoiDungRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(NguoiDungRepository nguoiDungRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.nguoiDungRepository = nguoiDungRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public NguoiDungResponse signup(SignUpRequest request) {
        if (nguoiDungRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }
        NguoiDung user = new NguoiDung();
        user.setHoTen(request.getHoTen());
        user.setEmail(request.getEmail());
        user.setMatKhau(passwordEncoder.encode(request.getMatkhau()));
        user.setSoDienThoai(request.getSoDienThoai());
        user.setDiaChi(request.getDiaChi());
        user.setRole(Role.USER); // Explicitly set the role for new users
        
        NguoiDung savedUser = nguoiDungRepository.save(user);

        return new NguoiDungResponse(
            savedUser.getUserId(),
            savedUser.getHoTen(),
            savedUser.getEmail(),
            savedUser.getSoDienThoai(),
            savedUser.getDiaChi(),
            savedUser.getNgayTao(),
            savedUser.getRole(),
            null // nhanVienId is null for new users
        );
    }

    public JwtAuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var user = nguoiDungRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email hoặc mật khẩu không hợp lệ."));
        var jwt = jwtService.generateToken(user);
        return new JwtAuthenticationResponse(jwt);
    }
}
