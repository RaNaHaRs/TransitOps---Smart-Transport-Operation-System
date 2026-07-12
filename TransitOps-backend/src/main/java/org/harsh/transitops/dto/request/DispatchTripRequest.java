package org.harsh.transitops.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class DispatchTripRequest {

    @NotNull
    @Positive
    private Long vehicleId;

    @NotNull
    @Positive
    private Long driverId;

    @NotNull
    @Positive
    private Double startingOdometer;

    @NotNull
    private LocalDateTime startTime;
}
