package org.harsh.transitops.controller;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.response.ReportResponse;
import org.harsh.transitops.service.interfaces.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/trips")
    public ResponseEntity<ReportResponse> trips(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) { return ResponseEntity.ok(reportService.generateReport(startDate, endDate)); }

    @GetMapping("/expenses")
    public ResponseEntity<ReportResponse> expenses(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) { return ResponseEntity.ok(reportService.generateReport(startDate, endDate)); }

    @GetMapping("/fuel")
    public ResponseEntity<ReportResponse> fuel(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) { return ResponseEntity.ok(reportService.generateReport(startDate, endDate)); }

    @GetMapping("/maintenance")
    public ResponseEntity<ReportResponse> maintenance(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) { return ResponseEntity.ok(reportService.generateReport(startDate, endDate)); }
}
