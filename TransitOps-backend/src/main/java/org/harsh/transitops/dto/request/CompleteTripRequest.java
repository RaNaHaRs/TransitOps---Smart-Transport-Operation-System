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
public class CompleteTripRequest {

    @NotNull
    @Positive
    private Double endingOdometer;

    @NotNull
    @Positive
    private Double fuelUsed;

    @NotNull
    @Positive
    private Double fuelCost;

    @NotNull
    private LocalDateTime endTime;
}
