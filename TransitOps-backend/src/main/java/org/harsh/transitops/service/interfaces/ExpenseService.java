package org.harsh.transitops.service.interfaces;

import org.harsh.transitops.dto.response.ExpenseResponse;

import java.util.List;

public interface ExpenseService {

    List<ExpenseResponse> getAllExpenses();
    List<ExpenseResponse> getExpensesByTrip(Long tripId);
    List<ExpenseResponse> getExpensesByMaintenance(Long maintenanceId);
}
