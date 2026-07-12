package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.response.ReportResponse;
import org.harsh.transitops.entity.Expense;
import org.harsh.transitops.entity.Trip;
import org.harsh.transitops.enums.TripStatus;
import org.harsh.transitops.repository.ExpenseRepository;
import org.harsh.transitops.repository.TripRepository;
import org.harsh.transitops.service.interfaces.ReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    @Transactional(readOnly = true)
    public ReportResponse generateReport(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null || endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("A valid reporting period is required");
        }
        List<Trip> trips = tripRepository.findAll().stream()
                .filter(t -> t.getStartTime() != null && within(t.getStartTime().toLocalDate(), startDate, endDate)).toList();
        List<Expense> expenses = expenseRepository.findAll().stream()
                .filter(e -> e.getExpenseDate() != null && within(e.getExpenseDate().toLocalDate(), startDate, endDate)).toList();
        return ReportResponse.builder().reportStartDate(startDate).reportEndDate(endDate)
                .completedTrips((long) trips.stream().filter(t -> t.getStatus() == TripStatus.COMPLETED).count())
                .totalDistance(trips.stream().mapToDouble(t -> difference(t.getEndingOdometer(), t.getStartingOdometer())).sum())
                .totalFuelUsed(trips.stream().map(Trip::getFuelUsed).filter(value -> value != null).mapToDouble(Double::doubleValue).sum())
                .totalFuelCost(trips.stream().map(Trip::getFuelCost).filter(value -> value != null).mapToDouble(Double::doubleValue).sum())
                .totalMaintenanceCost(sumByType(expenses, "MAINTENANCE"))
                .totalExpenseAmount(expenses.stream().map(Expense::getAmount).filter(value -> value != null).mapToDouble(Double::doubleValue).sum()).build();
    }

    private boolean within(LocalDate value, LocalDate start, LocalDate end) { return !value.isBefore(start) && !value.isAfter(end); }
    private double difference(Double ending, Double starting) { return ending == null || starting == null ? 0 : ending - starting; }
    private double sumByType(List<Expense> expenses, String type) { return expenses.stream().filter(e -> type.equals(e.getExpenseType())).map(Expense::getAmount).filter(value -> value != null).mapToDouble(Double::doubleValue).sum(); }
}
