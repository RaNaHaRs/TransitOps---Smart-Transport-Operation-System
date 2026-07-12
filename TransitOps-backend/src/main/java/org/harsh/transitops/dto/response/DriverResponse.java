package org.harsh.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.harsh.transitops.enums.DriverStatus;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverResponse {

    private Long id;
    private String name;
    private String email;
    private String licenseNumber;
    private LocalDate licenseExpiry;
    private String phone;
    private String region;
    private String licenseCategory;
    private Double safetyScore;
    private DriverStatus status;
}
