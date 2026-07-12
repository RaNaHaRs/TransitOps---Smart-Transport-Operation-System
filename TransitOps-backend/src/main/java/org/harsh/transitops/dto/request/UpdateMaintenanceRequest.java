package org.harsh.transitops.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class UpdateMaintenanceRequest {

    @NotBlank
    private String issue;

    private String description;

    @NotNull
    private MaintenanceStatus status;

    @Positive
    private Double cost;

    private LocalDateTime completedAt;
}
