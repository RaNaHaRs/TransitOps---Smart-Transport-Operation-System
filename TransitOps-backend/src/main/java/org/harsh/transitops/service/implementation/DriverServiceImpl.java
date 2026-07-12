package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.CreateDriverRequest;
import org.harsh.transitops.dto.request.UpdateDriverRequest;
import org.harsh.transitops.dto.response.DriverResponse;
import org.harsh.transitops.entity.Driver;
import org.harsh.transitops.entity.User;
import org.harsh.transitops.enums.Role;
import org.harsh.transitops.enums.DriverStatus;
import org.harsh.transitops.enums.TripStatus;
import org.harsh.transitops.repository.DriverRepository;
import org.harsh.transitops.repository.TripRepository;
import org.harsh.transitops.repository.UserRepository;
import org.harsh.transitops.service.interfaces.DriverService;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public DriverResponse addDriver(CreateDriverRequest request) {
        if (driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new IllegalStateException("License number already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }
        Driver driver = Driver.builder().name(request.getName()).licenseNumber(request.getLicenseNumber())
                .licenseExpiry(request.getLicenseExpiry()).phone(request.getPhone())
                .region(request.getRegion()).licenseCategory(request.getLicenseCategory())
                .safetyScore(85.0)
                .status(DriverStatus.AVAILABLE).build();
        Driver savedDriver = driverRepository.save(driver);
        User user = User.builder().name(savedDriver.getName()).email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())).role(Role.DRIVER).driver(savedDriver).build();
        User savedUser = userRepository.save(user);
        savedDriver.setUser(savedUser);
        return toResponse(savedDriver, request.getEmail());
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
        driver.setRegion(request.getRegion());
        driver.setLicenseCategory(request.getLicenseCategory());
        driver.setSafetyScore(request.getSafetyScore());
        driver.setStatus(request.getStatus());
        String email = userRepository.findByDriverId(id).map(User::getEmail).orElse(null);
        return toResponse(driverRepository.save(driver), email);
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
        userRepository.findByDriverId(id).ifPresent(userRepository::delete);
        driverRepository.delete(driver);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverResponse getDriverById(Long id) {
        Driver driver = findDriver(id);
        String email = userRepository.findByDriverId(id).map(User::getEmail).orElse(null);
        return toResponse(driver, email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponse> getAllDrivers() {
        return driverRepository.findAll().stream().map(d -> {
            String email = userRepository.findByDriverId(d.getId()).map(User::getEmail).orElse(null);
            return toResponse(d, email);
        }).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponse> getAvailableDrivers() {
        return driverRepository.findByStatus(DriverStatus.AVAILABLE).stream().map(d -> {
            String email = userRepository.findByDriverId(d.getId()).map(User::getEmail).orElse(null);
            return toResponse(d, email);
        }).toList();
    }

    private Driver findDriver(Long id) {
        return driverRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Driver not found"));
    }

    private DriverResponse toResponse(Driver driver, String email) {
        return DriverResponse.builder().id(driver.getId()).name(driver.getName()).email(email)
                .licenseNumber(driver.getLicenseNumber()).licenseExpiry(driver.getLicenseExpiry())
                .phone(driver.getPhone()).region(driver.getRegion()).licenseCategory(driver.getLicenseCategory())
                .safetyScore(driver.getSafetyScore()).status(driver.getStatus()).build();
    }
}
