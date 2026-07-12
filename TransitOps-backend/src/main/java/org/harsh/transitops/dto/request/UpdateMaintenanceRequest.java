package org.harsh.transitops.dto.request;

import jakarta.validation.constraints.NotNull;
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
public class UpdateMaintenanceRequest {

    private String type;

    private String description;

    @NotNull
    private String status;

    private Double cost;

    private String startDate;
}
