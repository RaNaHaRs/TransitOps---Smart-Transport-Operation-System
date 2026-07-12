package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.CreateMaintenanceRequest;
import org.harsh.transitops.dto.request.UpdateMaintenanceRequest;
import org.harsh.transitops.dto.response.MaintenanceResponse;
import org.harsh.transitops.entity.Expense;
import org.harsh.transitops.entity.Maintenance;
import org.harsh.transitops.entity.Vehicle;
import org.harsh.transitops.enums.MaintenanceStatus;
import org.harsh.transitops.enums.VehicleStatus;
import org.harsh.transitops.repository.ExpenseRepository;
import org.harsh.transitops.repository.MaintenanceRepository;
import org.harsh.transitops.repository.VehicleRepository;
import org.harsh.transitops.service.interfaces.MaintenanceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    @Transactional
    public MaintenanceResponse createMaintenance(CreateMaintenanceRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        vehicle.setStatus(VehicleStatus.IN_MAINTENANCE);
        vehicleRepository.save(vehicle);

        LocalDateTime startDate = null;
        if (request.getStartDate() != null && !request.getStartDate().isBlank()) {
            try {
                startDate = LocalDate.parse(request.getStartDate()).atStartOfDay();
            } catch (Exception ignored) {}
        }

        Maintenance maintenance = Maintenance.builder()
                .type(request.getType())
                .issue(request.getType())
                .description(request.getDescription())
                .cost(request.getCost())
                .status(MaintenanceStatus.PENDING)
                .createdAt(startDate != null ? startDate : LocalDateTime.now())
                .vehicle(vehicle)
                .build();
        return toResponse(maintenanceRepository.save(maintenance));
    }

    @Override
    @Transactional
    public MaintenanceResponse updateMaintenance(Long id, UpdateMaintenanceRequest request) {
        Maintenance maintenance = findMaintenance(id);
        if (request.getType() != null) {
            maintenance.setType(request.getType());
            maintenance.setIssue(request.getType());
        }
        if (request.getDescription() != null) maintenance.setDescription(request.getDescription());
        if (request.getCost() != null) maintenance.setCost(request.getCost());
        if (request.getStatus() != null) {
            maintenance.setStatus(MaintenanceStatus.valueOf(request.getStatus()));
        }
        if (request.getStartDate() != null) {
            try {
                maintenance.setCreatedAt(LocalDate.parse(request.getStartDate()).atStartOfDay());
            } catch (Exception ignored) {}
        }
        return toResponse(maintenanceRepository.save(maintenance));
    }

    @Override
    @Transactional
    public MaintenanceResponse completeMaintenance(Long id, Double cost) {
        Maintenance maintenance = findMaintenance(id);
        if (maintenance.getStatus() == MaintenanceStatus.COMPLETED) {
            throw new IllegalStateException("Maintenance is already completed");
        }
        maintenance.setStatus(MaintenanceStatus.COMPLETED);
        maintenance.setCompletedAt(LocalDateTime.now());
        if (cost != null) maintenance.setCost(cost);
        maintenance.getVehicle().setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(maintenance.getVehicle());
        Maintenance saved = maintenanceRepository.save(maintenance);
        if (saved.getCost() != null && saved.getCost() > 0) {
            expenseRepository.save(Expense.builder().expenseType("MAINTENANCE").amount(saved.getCost())
                    .description("Maintenance expense: " + saved.getIssue()).expenseDate(LocalDateTime.now())
                    .maintenance(saved).build());
        }
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceResponse getMaintenanceById(Long id) { return toResponse(findMaintenance(id)); }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceResponse> getAllMaintenance() { return maintenanceRepository.findAll().stream().map(this::toResponse).toList(); }

    private Maintenance findMaintenance(Long id) {
        return maintenanceRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Maintenance not found"));
    }

    private MaintenanceResponse toResponse(Maintenance maintenance) {
        return MaintenanceResponse.builder()
                .id(maintenance.getId())
                .type(maintenance.getType())
                .description(maintenance.getDescription())
                .status(maintenance.getStatus() == MaintenanceStatus.PENDING ? "Open" : "Closed")
                .cost(maintenance.getCost())
                .startDate(maintenance.getCreatedAt() != null ? maintenance.getCreatedAt().toLocalDate().toString() : null)
                .vehicleId(maintenance.getVehicle().getId())
                .vehicleRegistrationNumber(maintenance.getVehicle().getRegistrationNumber())
                .build();
    }
}
