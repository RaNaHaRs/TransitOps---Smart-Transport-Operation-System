package org.harsh.transitops.controller;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.response.FuelLogResponse;
import org.harsh.transitops.service.interfaces.FuelLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/fuel-logs")
@RequiredArgsConstructor
public class FuelLogController {

    private final FuelLogService fuelLogService;

    @GetMapping
    public ResponseEntity<List<FuelLogResponse>> getAll() { return ResponseEntity.ok(fuelLogService.getAllFuelLogs()); }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<FuelLogResponse>> getByTrip(@PathVariable Long tripId) { return ResponseEntity.ok(fuelLogService.getFuelLogsByTrip(tripId)); }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<FuelLogResponse>> getByVehicle(@PathVariable Long vehicleId) { return ResponseEntity.ok(fuelLogService.getFuelLogsByVehicle(vehicleId)); }
}
