package org.harsh.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Long vehicleId;
    private Long driverId;
    private Double cargoWeight;
    private Double plannedDistance;
    private Double startOdometer;
    private Double endOdometer;
    private Double fuelConsumed;
    private Double actualDistance;
    private String status;
    private String createdAt;
    private String dispatchedAt;
    private String completedAt;
}
