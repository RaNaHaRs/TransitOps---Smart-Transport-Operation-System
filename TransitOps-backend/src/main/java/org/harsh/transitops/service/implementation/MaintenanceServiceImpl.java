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

import java.time.LocalDateTime;
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
        Maintenance maintenance = Maintenance.builder().issue(request.getIssue()).description(request.getDescription())
                .status(MaintenanceStatus.PENDING).createdAt(LocalDateTime.now()).vehicle(vehicle).build();
        return toResponse(maintenanceRepository.save(maintenance));
    }

    @Override
    @Transactional
    public MaintenanceResponse updateMaintenance(Long id, UpdateMaintenanceRequest request) {
        Maintenance maintenance = findMaintenance(id);
        maintenance.setIssue(request.getIssue());
        maintenance.setDescription(request.getDescription());
        maintenance.setStatus(request.getStatus());
        maintenance.setCost(request.getCost());
        maintenance.setCompletedAt(request.getCompletedAt());
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
        maintenance.setCost(cost);
        maintenance.getVehicle().setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(maintenance.getVehicle());
        Maintenance saved = maintenanceRepository.save(maintenance);
        if (cost != null && cost > 0) {
            expenseRepository.save(Expense.builder().expenseType("MAINTENANCE").amount(cost)
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
        return MaintenanceResponse.builder().id(maintenance.getId()).issue(maintenance.getIssue())
                .description(maintenance.getDescription()).status(maintenance.getStatus()).createdAt(maintenance.getCreatedAt())
                .completedAt(maintenance.getCompletedAt()).cost(maintenance.getCost()).vehicleId(maintenance.getVehicle().getId())
                .vehicleRegistrationNumber(maintenance.getVehicle().getRegistrationNumber()).build();
    }
}
