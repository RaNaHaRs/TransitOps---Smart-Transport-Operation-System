package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.CreateVehicleRequest;
import org.harsh.transitops.dto.request.UpdateVehicleRequest;
import org.harsh.transitops.dto.response.VehicleResponse;
import org.harsh.transitops.entity.Vehicle;
import org.harsh.transitops.enums.TripStatus;
import org.harsh.transitops.enums.VehicleStatus;
import org.harsh.transitops.repository.TripRepository;
import org.harsh.transitops.repository.VehicleRepository;
import org.harsh.transitops.service.interfaces.VehicleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;

    @Override
    @Transactional
    public VehicleResponse addVehicle(CreateVehicleRequest request) {
        if (vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new IllegalStateException("Registration number already exists");
        }
        Vehicle vehicle = Vehicle.builder()
                .registrationNumber(request.getRegistrationNumber())
                .vehicleName(request.getVehicleName())
                .vehicleType(request.getVehicleType())
                .capacity(request.getCapacity())
                .mileage(request.getMileage())
                .currentOdometer(request.getCurrentOdometer())
                .status(VehicleStatus.AVAILABLE)
                .build();
        return toResponse(vehicleRepository.save(vehicle));
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Long id, UpdateVehicleRequest request) {
        Vehicle vehicle = findVehicle(id);
        if (!vehicle.getRegistrationNumber().equals(request.getRegistrationNumber())
                && vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new IllegalStateException("Registration number already exists");
        }
        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setVehicleName(request.getVehicleName());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCapacity(request.getCapacity());
        vehicle.setMileage(request.getMileage());
        vehicle.setCurrentOdometer(request.getCurrentOdometer());
        vehicle.setStatus(request.getStatus());
        return toResponse(vehicleRepository.save(vehicle));
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = findVehicle(id);
        boolean activeTrip = tripRepository.findByVehicleId(id).stream()
                .anyMatch(trip -> trip.getStatus() == TripStatus.DISPATCHED);
        if (activeTrip) {
            throw new IllegalStateException("Vehicle cannot be deleted while assigned to an active trip");
        }
        vehicleRepository.delete(vehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(Long id) {
        return toResponse(findVehicle(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getAvailableVehicles() {
        return vehicleRepository.findByStatus(VehicleStatus.AVAILABLE).stream().map(this::toResponse).toList();
    }

    private Vehicle findVehicle(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId()).registrationNumber(vehicle.getRegistrationNumber())
                .vehicleName(vehicle.getVehicleName()).vehicleType(vehicle.getVehicleType())
                .capacity(vehicle.getCapacity()).mileage(vehicle.getMileage())
                .currentOdometer(vehicle.getCurrentOdometer()).status(vehicle.getStatus()).build();
    }
}
