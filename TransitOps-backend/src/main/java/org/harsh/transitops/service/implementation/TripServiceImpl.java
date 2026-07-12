package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.CompleteTripRequest;
import org.harsh.transitops.dto.request.CreateTripRequest;
import org.harsh.transitops.dto.request.DispatchTripRequest;
import org.harsh.transitops.dto.response.TripResponse;
import org.harsh.transitops.entity.Driver;
import org.harsh.transitops.entity.Expense;
import org.harsh.transitops.entity.FuelLog;
import org.harsh.transitops.entity.Trip;
import org.harsh.transitops.entity.Vehicle;
import org.harsh.transitops.enums.DriverStatus;
import org.harsh.transitops.enums.TripStatus;
import org.harsh.transitops.enums.VehicleStatus;
import org.harsh.transitops.repository.DriverRepository;
import org.harsh.transitops.repository.ExpenseRepository;
import org.harsh.transitops.repository.FuelLogRepository;
import org.harsh.transitops.repository.FuelSettingRepository;
import org.harsh.transitops.repository.TripRepository;
import org.harsh.transitops.repository.VehicleRepository;
import org.harsh.transitops.service.interfaces.TripService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final FuelSettingRepository fuelSettingRepository;
    private final FuelLogRepository fuelLogRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    @Transactional
    public TripResponse createTrip(CreateTripRequest request) {
        String tripCode = request.getTripCode();
        if (tripCode == null || tripCode.isBlank()) {
            tripCode = "TRIP-" + System.currentTimeMillis();
        }
        if (tripRepository.existsByTripCode(tripCode)) {
            throw new IllegalStateException("Trip code already exists");
        }
        Vehicle vehicle = findVehicle(request.getVehicleId());
        Driver driver = findDriver(request.getDriverId());
        validateTripAssignment(vehicle, driver, request.getCargoWeight());

        Trip trip = Trip.builder().tripCode(tripCode).source(request.getSource())
                .destination(request.getDestination()).cargoWeight(request.getCargoWeight())
                .plannedDistance(request.getPlannedDistance()).status(TripStatus.CREATED)
                .createdAt(LocalDateTime.now())
                .vehicle(vehicle).driver(driver).build();
        return toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public TripResponse dispatchTrip(Long id, DispatchTripRequest request) {
        Trip trip = findTrip(id);
        if (trip.getStatus() != TripStatus.CREATED) {
            throw new IllegalStateException("Only created trips can be dispatched");
        }
        Long vehicleId = request.getVehicleId() != null ? request.getVehicleId() : trip.getVehicle().getId();
        Long driverId = request.getDriverId() != null ? request.getDriverId() : trip.getDriver().getId();
        if (!trip.getVehicle().getId().equals(vehicleId) || !trip.getDriver().getId().equals(driverId)) {
            throw new IllegalArgumentException("Dispatch assignment must match the trip assignment");
        }
        validateTripAssignment(trip.getVehicle(), trip.getDriver(), trip.getCargoWeight());
        if (request.getStartingOdometer() != null) {
            trip.setStartingOdometer(request.getStartingOdometer());
        }
        trip.setStartTime(request.getStartTime() != null ? request.getStartTime() : LocalDateTime.now());
        trip.setStatus(TripStatus.DISPATCHED);
        trip.getVehicle().setStatus(VehicleStatus.ON_TRIP);
        trip.getDriver().setStatus(DriverStatus.ON_TRIP);
        vehicleRepository.save(trip.getVehicle());
        driverRepository.save(trip.getDriver());
        return toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public TripResponse completeTrip(Long id, CompleteTripRequest request) {
        Trip trip = findTrip(id);
        if (trip.getStatus() != TripStatus.DISPATCHED || trip.getStartingOdometer() == null) {
            throw new IllegalStateException("Only dispatched trips can be completed");
        }
        double distance = request.getEndOdometer() - trip.getStartingOdometer();
        double fuelUsed;
        double fuelCost;
        if (request.getFuelConsumed() != null && request.getFuelConsumed() > 0) {
            fuelUsed = request.getFuelConsumed();
            Double fuelPrice = fuelSettingRepository.findTopByOrderByIdDesc().map(setting -> setting.getFuelPrice()).orElse(0.0);
            fuelCost = fuelUsed * fuelPrice;
        } else {
            if (distance < 0 || trip.getVehicle().getMileage() == null || trip.getVehicle().getMileage() <= 0) {
                throw new IllegalStateException("Trip odometer or vehicle mileage is invalid");
            }
            fuelUsed = distance / trip.getVehicle().getMileage();
            Double fuelPrice = fuelSettingRepository.findTopByOrderByIdDesc().map(setting -> setting.getFuelPrice())
                    .orElseThrow(() -> new IllegalStateException("Fuel price has not been configured"));
            fuelCost = fuelUsed * fuelPrice;
        }

        trip.setEndingOdometer(request.getEndOdometer());
        trip.setFuelUsed(fuelUsed);
        trip.setFuelCost(fuelCost);
        trip.setEndTime(LocalDateTime.now());
        trip.setStatus(TripStatus.COMPLETED);
        trip.getVehicle().setCurrentOdometer(request.getEndOdometer());
        trip.getVehicle().setStatus(VehicleStatus.AVAILABLE);
        trip.getDriver().setStatus(DriverStatus.AVAILABLE);

        Trip savedTrip = tripRepository.save(trip);
        vehicleRepository.save(savedTrip.getVehicle());
        driverRepository.save(savedTrip.getDriver());
        fuelLogRepository.save(FuelLog.builder().fuelPrice(0.0).fuelUsed(fuelUsed).fuelCost(fuelCost)
                .createdAt(LocalDateTime.now()).trip(savedTrip).vehicle(savedTrip.getVehicle()).build());
        expenseRepository.save(Expense.builder().expenseType("FUEL").amount(fuelCost)
                .description("Fuel expense for trip " + savedTrip.getTripCode()).expenseDate(LocalDateTime.now())
                .trip(savedTrip).build());
        return toResponse(savedTrip);
    }

    @Override
    @Transactional
    public TripResponse cancelTrip(Long id) {
        Trip trip = findTrip(id);
        if (trip.getStatus() == TripStatus.COMPLETED || trip.getStatus() == TripStatus.CANCELLED) {
            throw new IllegalStateException("Completed or cancelled trips cannot be cancelled");
        }
        trip.setStatus(TripStatus.CANCELLED);
        trip.getVehicle().setStatus(VehicleStatus.AVAILABLE);
        trip.getDriver().setStatus(DriverStatus.AVAILABLE);
        vehicleRepository.save(trip.getVehicle());
        driverRepository.save(trip.getDriver());
        return toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponse getTripById(Long id) { return toResponse(findTrip(id)); }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> getAllTrips() { return tripRepository.findAll().stream().map(this::toResponse).toList(); }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> getTripsByDriver(Long driverId) { return tripRepository.findByDriverId(driverId).stream().map(this::toResponse).toList(); }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> getTripsByVehicle(Long vehicleId) { return tripRepository.findByVehicleId(vehicleId).stream().map(this::toResponse).toList(); }

    private void validateTripAssignment(Vehicle vehicle, Driver driver, Double cargoWeight) {
        if (vehicle.getStatus() != VehicleStatus.AVAILABLE || driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new IllegalStateException("Vehicle and driver must be available");
        }
        if (driver.getLicenseExpiry() == null || !driver.getLicenseExpiry().isAfter(LocalDate.now())) {
            throw new IllegalStateException("Driver license is expired");
        }
        if (cargoWeight != null && (vehicle.getCapacity() == null || cargoWeight > vehicle.getCapacity())) {
            throw new IllegalStateException("Cargo weight exceeds vehicle capacity");
        }
    }

    private Trip findTrip(Long id) { return tripRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Trip not found")); }
    private Vehicle findVehicle(Long id) { return vehicleRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Vehicle not found")); }
    private Driver findDriver(Long id) { return driverRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Driver not found")); }

    private TripResponse toResponse(Trip trip) {
        Double actualDistance = null;
        if (trip.getStartingOdometer() != null && trip.getEndingOdometer() != null) {
            actualDistance = trip.getEndingOdometer() - trip.getStartingOdometer();
        }
        return TripResponse.builder()
                .id(trip.getId())
                .tripCode(trip.getTripCode())
                .source(trip.getSource())
                .destination(trip.getDestination())
                .vehicleId(trip.getVehicle().getId())
                .driverId(trip.getDriver().getId())
                .cargoWeight(trip.getCargoWeight())
                .plannedDistance(trip.getPlannedDistance())
                .startOdometer(trip.getStartingOdometer())
                .endOdometer(trip.getEndingOdometer())
                .fuelConsumed(trip.getFuelUsed())
                .actualDistance(actualDistance)
                .status(trip.getStatus().getLabel())
                .createdAt(trip.getCreatedAt() != null ? trip.getCreatedAt().toLocalDate().toString() : null)
                .dispatchedAt(trip.getStartTime() != null ? trip.getStartTime().toLocalDate().toString() : null)
                .completedAt(trip.getEndTime() != null ? trip.getEndTime().toLocalDate().toString() : null)
                .build();
    }
}
