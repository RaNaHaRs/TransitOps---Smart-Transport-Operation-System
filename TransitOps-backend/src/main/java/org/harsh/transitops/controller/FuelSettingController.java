package org.harsh.transitops.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.UpdateFuelPriceRequest;
import org.harsh.transitops.service.interfaces.FuelSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fuel")
@RequiredArgsConstructor
public class FuelSettingController {

    private final FuelSettingService fuelSettingService;

    @GetMapping
    public ResponseEntity<Double> getCurrentPrice() { return ResponseEntity.ok(fuelSettingService.getCurrentFuelPrice()); }

    @PutMapping
    public ResponseEntity<Double> updatePrice(@Valid @RequestBody UpdateFuelPriceRequest request) { return ResponseEntity.ok(fuelSettingService.updateFuelPrice(request)); }
}
