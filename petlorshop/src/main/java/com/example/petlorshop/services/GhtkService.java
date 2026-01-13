package com.example.petlorshop.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;

@Service
public class GhtkService {

    // TODO: Thay thế bằng Token và thông tin Shop thật của bạn
    private static final String GHTK_TOKEN = "YOUR_GHTK_TOKEN"; 
    private static final String GHTK_FEE_URL = "https://services.giaohangtietkiem.vn/services/shipment/fee";
    
    // Địa chỉ kho hàng (Shop)
    private static final String PICK_PROVINCE = "Hà Nội";
    private static final String PICK_DISTRICT = "Quận Cầu Giấy";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public BigDecimal calculateShippingFee(String province, String district, String ward, String address, Integer weight, Integer value) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Token", GHTK_TOKEN);
            headers.set("X-Client-Source", "S22581636"); // Ví dụ Partner Code

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(GHTK_FEE_URL)
                    .queryParam("pick_province", PICK_PROVINCE)
                    .queryParam("pick_district", PICK_DISTRICT)
                    .queryParam("province", province)
                    .queryParam("district", district)
                    .queryParam("weight", weight != null ? weight : 500) // Mặc định 500g
                    .queryParam("value", value != null ? value : 0);

            if (ward != null && !ward.isEmpty()) {
                builder.queryParam("ward", ward);
            }
            if (address != null && !address.isEmpty()) {
                builder.queryParam("address", address);
            }

            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.path("success").asBoolean()) {
                    int fee = root.path("fee").path("fee").asInt();
                    return BigDecimal.valueOf(fee);
                } else {
                    // Log lỗi từ GHTK nếu cần
                    System.err.println("GHTK Error: " + root.path("message").asText());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback: Nếu gọi API lỗi, trả về phí mặc định hoặc ném lỗi
        }
        
        // Trả về phí mặc định nếu không tính được (ví dụ 30k)
        return BigDecimal.valueOf(30000);
    }
}
