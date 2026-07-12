package org.harsh.transitops.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class UpdateDriverRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String licenseNumber;

    @NotNull
    @Future
    private LocalDate licenseExpiry;

    @NotBlank
    private String phone;

    private String region;

    private String licenseCategory;

    @Positive
    private Double safetyScore;

    @NotNull
    private DriverStatus status;
}
