package org.harsh.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.harsh.transitops.enums.TripStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripResponse {

    private Long id;
    private String tripCode;
    private String source;
    private String destination;
    private Double cargoWeight;
    private Double plannedDistance;
    private Double startingOdometer;
    private Double endingOdometer;
    private Double fuelUsed;
    private Double fuelCost;
    private TripStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String driverName;
    private String vehicleRegistrationNumber;
}
