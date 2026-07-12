package org.harsh.transitops.service.interfaces;

import org.harsh.transitops.dto.request.CreateMaintenanceRequest;
import org.harsh.transitops.dto.request.UpdateMaintenanceRequest;
import org.harsh.transitops.dto.response.MaintenanceResponse;

import java.util.List;

public interface MaintenanceService {

    MaintenanceResponse createMaintenance(CreateMaintenanceRequest request);
    MaintenanceResponse updateMaintenance(Long id, UpdateMaintenanceRequest request);
    MaintenanceResponse completeMaintenance(Long id, Double cost);
    MaintenanceResponse getMaintenanceById(Long id);
    List<MaintenanceResponse> getAllMaintenance();
}
