package org.harsh.transitops.controller;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.response.DashboardResponse;
import org.harsh.transitops.service.interfaces.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<DashboardResponse> getAdmin() { return ResponseEntity.ok(dashboardService.getAdminDashboard()); }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<DashboardResponse> getDriver(@PathVariable Long driverId) { return ResponseEntity.ok(dashboardService.getDriverDashboard(driverId)); }

    @GetMapping("/safety")
    public ResponseEntity<DashboardResponse> getSafety() { return ResponseEntity.ok(dashboardService.getSafetyOfficerDashboard()); }

    @GetMapping("/finance")
    public ResponseEntity<DashboardResponse> getFinance() { return ResponseEntity.ok(dashboardService.getFinancialDashboard()); }
}
