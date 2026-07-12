package org.harsh.transitops.service.interfaces;

import org.harsh.transitops.dto.response.ReportResponse;

import java.time.LocalDate;

public interface ReportService {

    ReportResponse generateReport(LocalDate startDate, LocalDate endDate);
}
