package org.harsh.transitops.service.interfaces;

import org.harsh.transitops.dto.response.FuelLogResponse;

import java.util.List;

public interface FuelLogService {

    List<FuelLogResponse> getAllFuelLogs();
    List<FuelLogResponse> getFuelLogsByTrip(Long tripId);
    List<FuelLogResponse> getFuelLogsByVehicle(Long vehicleId);
}
