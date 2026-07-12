package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.response.FuelLogResponse;
import org.harsh.transitops.entity.FuelLog;
import org.harsh.transitops.repository.FuelLogRepository;
import org.harsh.transitops.service.interfaces.FuelLogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FuelLogServiceImpl implements FuelLogService {

    private final FuelLogRepository fuelLogRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FuelLogResponse> getAllFuelLogs() { return fuelLogRepository.findAll().stream().map(this::toResponse).toList(); }

    @Override
    @Transactional(readOnly = true)
    public List<FuelLogResponse> getFuelLogsByTrip(Long tripId) { return fuelLogRepository.findByTripId(tripId).stream().map(this::toResponse).toList(); }

    @Override
    @Transactional(readOnly = true)
    public List<FuelLogResponse> getFuelLogsByVehicle(Long vehicleId) { return fuelLogRepository.findByVehicleId(vehicleId).stream().map(this::toResponse).toList(); }

    private FuelLogResponse toResponse(FuelLog fuelLog) {
        Double odometer = null;
        if (fuelLog.getTrip() != null && fuelLog.getTrip().getStartingOdometer() != null) {
            odometer = fuelLog.getTrip().getStartingOdometer();
        } else if (fuelLog.getVehicle() != null && fuelLog.getVehicle().getCurrentOdometer() != null) {
            odometer = fuelLog.getVehicle().getCurrentOdometer();
        }
        return FuelLogResponse.builder()
                .id(fuelLog.getId())
                .costPerLiter(fuelLog.getFuelPrice())
                .liters(fuelLog.getFuelUsed())
                .totalCost(fuelLog.getFuelCost())
                .date(fuelLog.getCreatedAt() != null ? fuelLog.getCreatedAt().toLocalDate().toString() : null)
                .odometer(odometer)
                .tripId(fuelLog.getTrip() == null ? null : fuelLog.getTrip().getId())
                .vehicleId(fuelLog.getVehicle() == null ? null : fuelLog.getVehicle().getId())
                .build();
    }
}
