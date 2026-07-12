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
        return FuelLogResponse.builder().id(fuelLog.getId()).fuelPrice(fuelLog.getFuelPrice())
                .fuelUsed(fuelLog.getFuelUsed()).fuelCost(fuelLog.getFuelCost()).createdAt(fuelLog.getCreatedAt())
                .tripId(fuelLog.getTrip() == null ? null : fuelLog.getTrip().getId())
                .vehicleId(fuelLog.getVehicle() == null ? null : fuelLog.getVehicle().getId())
                .vehicleRegistrationNumber(fuelLog.getVehicle() == null ? null : fuelLog.getVehicle().getRegistrationNumber()).build();
    }
}
