package org.harsh.transitops.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.CreateDriverRequest;
import org.harsh.transitops.dto.request.UpdateDriverRequest;
import org.harsh.transitops.dto.response.DriverResponse;
import org.harsh.transitops.service.interfaces.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @PostMapping
    public ResponseEntity<DriverResponse> create(@Valid @RequestBody CreateDriverRequest request) { return ResponseEntity.status(201).body(driverService.addDriver(request)); }

    @GetMapping
    public ResponseEntity<List<DriverResponse>> getAll() { return ResponseEntity.ok(driverService.getAllDrivers()); }

    @GetMapping("/{id}")
    public ResponseEntity<DriverResponse> getById(@PathVariable Long id) { return ResponseEntity.ok(driverService.getDriverById(id)); }

    @PutMapping("/{id}")
    public ResponseEntity<DriverResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateDriverRequest request) { return ResponseEntity.ok(driverService.updateDriver(id, request)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { driverService.deleteDriver(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/available")
    public ResponseEntity<List<DriverResponse>> getAvailable() { return ResponseEntity.ok(driverService.getAvailableDrivers()); }
}
