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
public class FuelLogResponse {

    private Long id;
    private Double costPerLiter;
    private Double liters;
    private Double totalCost;
    private String date;
    private Double odometer;
    private Long tripId;
    private Long vehicleId;
}
