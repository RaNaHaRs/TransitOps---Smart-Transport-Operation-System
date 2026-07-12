package org.harsh.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuelLogResponse {

    private Long id;
    private Double fuelPrice;
    private Double fuelUsed;
    private Double fuelCost;
    private LocalDateTime createdAt;
    private Long tripId;
    private Long vehicleId;
    private String vehicleRegistrationNumber;
}
