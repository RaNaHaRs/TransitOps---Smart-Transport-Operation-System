package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.response.DashboardResponse;
import org.harsh.transitops.entity.Driver;
import org.harsh.transitops.entity.Expense;
import org.harsh.transitops.enums.DriverStatus;
import org.harsh.transitops.enums.TripStatus;
import org.harsh.transitops.enums.VehicleStatus;
import org.harsh.transitops.repository.DriverRepository;
import org.harsh.transitops.repository.ExpenseRepository;
import org.harsh.transitops.repository.MaintenanceRepository;
import org.harsh.transitops.repository.TripRepository;
import org.harsh.transitops.repository.VehicleRepository;
import org.harsh.transitops.service.interfaces.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getAdminDashboard() {
        List<Expense> expenses = expenseRepository.findAll();
        return DashboardResponse.builder().totalVehicles((long) vehicleRepository.findAll().size())
                .availableVehicles((long) vehicleRepository.findByStatus(VehicleStatus.AVAILABLE).size())
                .vehiclesOnTrip((long) vehicleRepository.findByStatus(VehicleStatus.ON_TRIP).size())
                .vehiclesInMaintenance((long) vehicleRepository.findByStatus(VehicleStatus.IN_MAINTENANCE).size())
                .totalDrivers((long) driverRepository.findAll().size())
                .availableDrivers((long) driverRepository.findByStatus(DriverStatus.AVAILABLE).size())
                .activeTrips((long) tripRepository.findByStatus(TripStatus.DISPATCHED).size())
                .pendingMaintenanceCount((long) maintenanceRepository.findByStatus(org.harsh.transitops.enums.MaintenanceStatus.PENDING).size())
                .totalExpenseAmount(sum(expenses)).totalFuelCost(sumByType(expenses, "FUEL"))
                .totalMaintenanceCost(sumByType(expenses, "MAINTENANCE")).build();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDriverDashboard(Long driverId) {
        return DashboardResponse.builder()
                .assignedTrips((long) tripRepository.findByDriverId(driverId).stream().filter(t -> t.getStatus() == TripStatus.DISPATCHED).count())
                .completedTrips((long) tripRepository.findByDriverId(driverId).stream().filter(t -> t.getStatus() == TripStatus.COMPLETED).count())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getSafetyOfficerDashboard() {
        LocalDate today = LocalDate.now();
        LocalDate limit = today.plusDays(30);
        List<Driver> drivers = driverRepository.findAll();
        return DashboardResponse.builder()
                .expiredLicenseDrivers((long) drivers.stream().filter(d -> d.getLicenseExpiry() != null && d.getLicenseExpiry().isBefore(today)).count())
                .expiringLicenseDrivers((long) drivers.stream().filter(d -> d.getLicenseExpiry() != null && !d.getLicenseExpiry().isBefore(today) && !d.getLicenseExpiry().isAfter(limit)).count())
                .vehiclesInMaintenance((long) vehicleRepository.findByStatus(VehicleStatus.IN_MAINTENANCE).size()).build();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getFinancialDashboard() {
        List<Expense> expenses = expenseRepository.findAll();
        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
        return DashboardResponse.builder().totalExpenseAmount(sum(expenses)).fuelExpenseAmount(sumByType(expenses, "FUEL"))
                .maintenanceExpenseAmount(sumByType(expenses, "MAINTENANCE"))
                .monthlyExpenseAmount(expenses.stream().filter(e -> e.getExpenseDate() != null && !e.getExpenseDate().toLocalDate().isBefore(monthStart))
                        .map(Expense::getAmount).filter(amount -> amount != null).mapToDouble(Double::doubleValue).sum()).build();
    }

    private double sum(List<Expense> expenses) { return expenses.stream().map(Expense::getAmount).filter(amount -> amount != null).mapToDouble(Double::doubleValue).sum(); }
    private double sumByType(List<Expense> expenses, String type) { return expenses.stream().filter(e -> type.equals(e.getExpenseType())).map(Expense::getAmount).filter(amount -> amount != null).mapToDouble(Double::doubleValue).sum(); }
}
