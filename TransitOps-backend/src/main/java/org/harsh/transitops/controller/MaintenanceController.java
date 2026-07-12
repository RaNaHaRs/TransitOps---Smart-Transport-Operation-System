package org.harsh.transitops.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.CreateMaintenanceRequest;
import org.harsh.transitops.dto.request.UpdateMaintenanceRequest;
import org.harsh.transitops.dto.response.MaintenanceResponse;
import org.harsh.transitops.service.interfaces.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping
    public ResponseEntity<MaintenanceResponse> create(@Valid @RequestBody CreateMaintenanceRequest request) { return ResponseEntity.status(201).body(maintenanceService.createMaintenance(request)); }

    @GetMapping
    public ResponseEntity<List<MaintenanceResponse>> getAll() { return ResponseEntity.ok(maintenanceService.getAllMaintenance()); }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceResponse> getById(@PathVariable Long id) { return ResponseEntity.ok(maintenanceService.getMaintenanceById(id)); }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateMaintenanceRequest request) { return ResponseEntity.ok(maintenanceService.updateMaintenance(id, request)); }

    @PutMapping("/complete/{id}")
    public ResponseEntity<MaintenanceResponse> complete(@PathVariable Long id, @RequestParam(required = false) @Positive Double cost) { return ResponseEntity.ok(maintenanceService.completeMaintenance(id, cost)); }

    @PutMapping("/{id}/close")
    public ResponseEntity<MaintenanceResponse> close(@PathVariable Long id) { return ResponseEntity.ok(maintenanceService.completeMaintenance(id, null)); }
}
