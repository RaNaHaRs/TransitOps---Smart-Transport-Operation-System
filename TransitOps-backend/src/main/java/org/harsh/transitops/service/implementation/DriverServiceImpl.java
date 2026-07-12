package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.CreateDriverRequest;
import org.harsh.transitops.dto.request.UpdateDriverRequest;
import org.harsh.transitops.dto.response.DriverResponse;
import org.harsh.transitops.entity.Driver;
import org.harsh.transitops.enums.DriverStatus;
import org.harsh.transitops.enums.TripStatus;
import org.harsh.transitops.repository.DriverRepository;
import org.harsh.transitops.repository.TripRepository;
import org.harsh.transitops.service.interfaces.DriverService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    @Override
    @Transactional
    public DriverResponse addDriver(CreateDriverRequest request) {
        if (driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new IllegalStateException("License number already exists");
        }
        Driver driver = Driver.builder().name(request.getName()).licenseNumber(request.getLicenseNumber())
                .licenseExpiry(request.getLicenseExpiry()).phone(request.getPhone())
                .status(DriverStatus.AVAILABLE).build();
        return toResponse(driverRepository.save(driver));
    }

    @Override
    @Transactional
    public DriverResponse updateDriver(Long id, UpdateDriverRequest request) {
        Driver driver = findDriver(id);
        if (!driver.getLicenseNumber().equals(request.getLicenseNumber())
                && driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new IllegalStateException("License number already exists");
        }
        driver.setName(request.getName());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setLicenseExpiry(request.getLicenseExpiry());
        driver.setPhone(request.getPhone());
        driver.setSafetyScore(request.getSafetyScore());
        driver.setStatus(request.getStatus());
        return toResponse(driverRepository.save(driver));
    }

    @Override
    @Transactional
    public void deleteDriver(Long id) {
        Driver driver = findDriver(id);
        boolean activeTrip = tripRepository.findByDriverId(id).stream()
                .anyMatch(trip -> trip.getStatus() == TripStatus.DISPATCHED);
        if (activeTrip) {
            throw new IllegalStateException("Driver cannot be deleted while assigned to an active trip");
        }
        driverRepository.delete(driver);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverResponse getDriverById(Long id) {
        return toResponse(findDriver(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponse> getAllDrivers() {
        return driverRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponse> getAvailableDrivers() {
        return driverRepository.findByStatus(DriverStatus.AVAILABLE).stream().map(this::toResponse).toList();
    }

    private Driver findDriver(Long id) {
        return driverRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Driver not found"));
    }

    private DriverResponse toResponse(Driver driver) {
        return DriverResponse.builder().id(driver.getId()).name(driver.getName())
                .licenseNumber(driver.getLicenseNumber()).licenseExpiry(driver.getLicenseExpiry())
                .phone(driver.getPhone()).safetyScore(driver.getSafetyScore()).status(driver.getStatus()).build();
    }
}
