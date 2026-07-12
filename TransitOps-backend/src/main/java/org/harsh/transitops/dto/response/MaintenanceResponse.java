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
public class MaintenanceResponse {

    private Long id;
    private String type;
    private String description;
    private String status;
    private Double cost;
    private String startDate;
    private Long vehicleId;
    private String vehicleRegistrationNumber;
}
