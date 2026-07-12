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
public class DashboardResponse {

    private Long totalVehicles;
    private Long availableVehicles;
    private Long vehiclesOnTrip;
    private Long vehiclesInMaintenance;
    private Long totalDrivers;
    private Long availableDrivers;
    private Long activeTrips;
    private Long pendingMaintenanceCount;
    private Double totalFuelCost;
    private Double totalMaintenanceCost;
    private Double totalExpenseAmount;
}
