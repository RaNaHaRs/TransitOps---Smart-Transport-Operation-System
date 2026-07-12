package org.harsh.transitops.service.interfaces;

import org.harsh.transitops.dto.response.DashboardResponse;

public interface DashboardService {

    DashboardResponse getAdminDashboard();
    DashboardResponse getDriverDashboard(Long driverId);
    DashboardResponse getSafetyOfficerDashboard();
    DashboardResponse getFinancialDashboard();
}
