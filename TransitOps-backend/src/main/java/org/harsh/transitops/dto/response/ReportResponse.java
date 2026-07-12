package org.harsh.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponse {

    private LocalDate reportStartDate;
    private LocalDate reportEndDate;
    private Long completedTrips;
    private Double totalDistance;
    private Double totalFuelUsed;
    private Double totalFuelCost;
    private Double totalMaintenanceCost;
    private Double totalExpenseAmount;
}
