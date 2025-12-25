package com.example.petlorshop.config;

import com.example.petlorshop.models.Role;
import com.example.petlorshop.repositories.NguoiDungRepository;
import com.example.petlorshop.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final NguoiDungRepository nguoiDungRepository;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(NguoiDungRepository nguoiDungRepository, @Lazy JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.nguoiDungRepository = nguoiDungRepository;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> nguoiDungRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        String admin = "ROLE_" + Role.ADMIN.name();

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // == PUBLIC ENDPOINTS ==
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/search/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll() // Cho phép truy cập ảnh
                        .requestMatchers(HttpMethod.GET, "/api/san-pham/**", "/api/dich-vu/**", "/api/danh-muc-san-pham/**").permitAll()

                        // == SPECIFIC RULES FIRST ==
                        .requestMatchers(HttpMethod.GET, "/api/nhan-vien/*/lich-trong").authenticated() // Cho phép xem lịch trống
                        
                        // == USER PROFILE (Authenticated Users) ==
                        // Phải đặt trước rule ADMIN của /api/nguoi-dung/**
                        .requestMatchers("/api/nguoi-dung/me/**").authenticated()

                        // == ADMIN ONLY ==
                        .requestMatchers("/api/admin/**").hasAuthority(admin) // Rule for all admin endpoints
                        .requestMatchers("/api/nguoi-dung/**").hasAuthority(admin)
                        .requestMatchers(HttpMethod.POST, "/api/nhan-vien/**").hasAuthority(admin)
                        .requestMatchers(HttpMethod.PUT, "/api/nhan-vien/**").hasAuthority(admin)
                        .requestMatchers(HttpMethod.DELETE, "/api/nhan-vien/**").hasAuthority(admin)
                        .requestMatchers(HttpMethod.POST, "/api/san-pham", "/api/dich-vu", "/api/danh-muc-san-pham").hasAuthority(admin)
                        .requestMatchers(HttpMethod.PUT, "/api/san-pham/**", "/api/dich-vu/**", "/api/danh-muc-san-pham/**").hasAuthority(admin)
                        .requestMatchers(HttpMethod.DELETE, "/api/san-pham/**", "/api/dich-vu/**", "/api/danh-muc-san-pham/**").hasAuthority(admin)
                        .requestMatchers(HttpMethod.PUT, "/api/don-hang/**").hasAuthority(admin)
                        .requestMatchers(HttpMethod.GET, "/api/lich-hen/**").hasAuthority(admin)
                        .requestMatchers(HttpMethod.PUT, "/api/lich-hen/**").hasAuthority(admin)
                        .requestMatchers("/api/nha-cung-cap/**").hasAuthority(admin) // Nhà cung cấp chỉ admin được quản lý

                        // == ANY AUTHENTICATED USER ==
                        .requestMatchers(HttpMethod.GET, "/api/nhan-vien/**").authenticated()
                        .requestMatchers("/api/thu-cung/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/don-hang").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/lich-hen").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/don-hang/user/**").authenticated()

                        // Authenticated: Các tính năng mới
                        .requestMatchers("/api/so-tiem-chung/**").authenticated()
                        .requestMatchers("/api/chat/**").authenticated()
                        .requestMatchers("/api/thong-bao/**").authenticated()
                        .requestMatchers("/api/giao-dich/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/danh-gia").authenticated()

                        // Deny all other requests by default
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
