package org.harsh.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.harsh.transitops.enums.MaintenanceStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceResponse {

    private Long id;
    private String issue;
    private String description;
    private MaintenanceStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private Double cost;
    private Long vehicleId;
    private String vehicleRegistrationNumber;
}
