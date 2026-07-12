package org.harsh.transitops.controller;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.response.ExpenseResponse;
import org.harsh.transitops.service.interfaces.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAll() { return ResponseEntity.ok(expenseService.getAllExpenses()); }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<ExpenseResponse>> getByTrip(@PathVariable Long tripId) { return ResponseEntity.ok(expenseService.getExpensesByTrip(tripId)); }

    @GetMapping("/maintenance/{maintenanceId}")
    public ResponseEntity<List<ExpenseResponse>> getByMaintenance(@PathVariable Long maintenanceId) { return ResponseEntity.ok(expenseService.getExpensesByMaintenance(maintenanceId)); }
}
