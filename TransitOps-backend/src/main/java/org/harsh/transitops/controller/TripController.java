package org.harsh.transitops.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.CompleteTripRequest;
import org.harsh.transitops.dto.request.CreateTripRequest;
import org.harsh.transitops.dto.request.DispatchTripRequest;
import org.harsh.transitops.dto.response.TripResponse;
import org.harsh.transitops.service.interfaces.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<TripResponse> create(@Valid @RequestBody CreateTripRequest request) { return ResponseEntity.status(201).body(tripService.createTrip(request)); }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getAll() { return ResponseEntity.ok(tripService.getAllTrips()); }

    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getById(@PathVariable Long id) { return ResponseEntity.ok(tripService.getTripById(id)); }

    @PutMapping("/dispatch/{id}")
    public ResponseEntity<TripResponse> dispatch(@PathVariable Long id, @Valid @RequestBody DispatchTripRequest request) { return ResponseEntity.ok(tripService.dispatchTrip(id, request)); }

    @PutMapping("/complete/{id}")
    public ResponseEntity<TripResponse> complete(@PathVariable Long id, @Valid @RequestBody CompleteTripRequest request) { return ResponseEntity.ok(tripService.completeTrip(id, request)); }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<TripResponse> cancel(@PathVariable Long id) { return ResponseEntity.ok(tripService.cancelTrip(id)); }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<TripResponse>> getByDriver(@PathVariable Long driverId) { return ResponseEntity.ok(tripService.getTripsByDriver(driverId)); }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<TripResponse>> getByVehicle(@PathVariable Long vehicleId) { return ResponseEntity.ok(tripService.getTripsByVehicle(vehicleId)); }
}
