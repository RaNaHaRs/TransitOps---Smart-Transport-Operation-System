package org.harsh.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.harsh.transitops.enums.VehicleStatus;
import org.harsh.transitops.enums.VehicleType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {

    private Long id;
    private String registrationNumber;
    private String vehicleName;
    private VehicleType vehicleType;
    private Double maximumLoadCapacity;
    private Double mileage;
    private Double currentOdometer;
    private String region;
    private Double acquisitionCost;
    private VehicleStatus status;
}
