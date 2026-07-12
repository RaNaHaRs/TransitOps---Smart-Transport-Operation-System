package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.response.ExpenseResponse;
import org.harsh.transitops.entity.Expense;
import org.harsh.transitops.repository.ExpenseRepository;
import org.harsh.transitops.service.interfaces.ExpenseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses() { return expenseRepository.findAll().stream().map(this::toResponse).toList(); }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByTrip(Long tripId) { return expenseRepository.findByTripId(tripId).stream().map(this::toResponse).toList(); }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByMaintenance(Long maintenanceId) { return expenseRepository.findByMaintenanceId(maintenanceId).stream().map(this::toResponse).toList(); }

    private ExpenseResponse toResponse(Expense expense) {
        Long vehicleId = null;
        if (expense.getTrip() != null && expense.getTrip().getVehicle() != null) {
            vehicleId = expense.getTrip().getVehicle().getId();
        } else if (expense.getMaintenance() != null && expense.getMaintenance().getVehicle() != null) {
            vehicleId = expense.getMaintenance().getVehicle().getId();
        }
        return ExpenseResponse.builder()
                .id(expense.getId())
                .type(expense.getExpenseType())
                .amount(expense.getAmount())
                .description(expense.getDescription())
                .date(expense.getExpenseDate() != null ? expense.getExpenseDate().toLocalDate().toString() : null)
                .vehicleId(vehicleId)
                .tripId(expense.getTrip() == null ? null : expense.getTrip().getId())
                .maintenanceId(expense.getMaintenance() == null ? null : expense.getMaintenance().getId())
                .build();
    }
}
