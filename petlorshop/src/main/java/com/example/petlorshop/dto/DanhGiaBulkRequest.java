package com.example.petlorshop.dto;

import lombok.Data;
import java.util.List;

@Data
public class DanhGiaBulkRequest {
    private Integer donHangId;
    private List<DanhGiaItemRequest> danhGiaList;
}
