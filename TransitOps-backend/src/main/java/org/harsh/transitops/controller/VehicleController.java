package org.harsh.transitops.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.CreateVehicleRequest;
import org.harsh.transitops.dto.request.UpdateVehicleRequest;
import org.harsh.transitops.dto.response.VehicleResponse;
import org.harsh.transitops.service.interfaces.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<VehicleResponse> create(@Valid @RequestBody CreateVehicleRequest request) { return ResponseEntity.status(201).body(vehicleService.addVehicle(request)); }

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAll() { return ResponseEntity.ok(vehicleService.getAllVehicles()); }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getById(@PathVariable Long id) { return ResponseEntity.ok(vehicleService.getVehicleById(id)); }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateVehicleRequest request) { return ResponseEntity.ok(vehicleService.updateVehicle(id, request)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { vehicleService.deleteVehicle(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/available")
    public ResponseEntity<List<VehicleResponse>> getAvailable() { return ResponseEntity.ok(vehicleService.getAvailableVehicles()); }
}
