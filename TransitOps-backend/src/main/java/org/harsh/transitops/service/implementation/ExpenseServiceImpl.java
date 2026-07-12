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
        return ExpenseResponse.builder().id(expense.getId()).expenseType(expense.getExpenseType())
                .amount(expense.getAmount()).description(expense.getDescription()).expenseDate(expense.getExpenseDate())
                .tripId(expense.getTrip() == null ? null : expense.getTrip().getId())
                .maintenanceId(expense.getMaintenance() == null ? null : expense.getMaintenance().getId()).build();
    }
}
