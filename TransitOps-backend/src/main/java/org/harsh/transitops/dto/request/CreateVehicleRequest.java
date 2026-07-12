package org.harsh.transitops.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.harsh.transitops.enums.VehicleType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVehicleRequest {

    @NotBlank
    private String registrationNumber;

    @NotBlank
    private String vehicleName;

    @NotNull
    private VehicleType vehicleType;

    @NotNull
    @Positive
    private Double capacity;

    @Positive
    private Double mileage;

    @Positive
    private Double currentOdometer;
}
