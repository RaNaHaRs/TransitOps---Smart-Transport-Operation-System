package org.harsh.transitops.service.interfaces;

import org.harsh.transitops.dto.request.CreateVehicleRequest;
import org.harsh.transitops.dto.request.UpdateVehicleRequest;
import org.harsh.transitops.dto.response.VehicleResponse;

import java.util.List;

public interface VehicleService {

    VehicleResponse addVehicle(CreateVehicleRequest request);
    VehicleResponse updateVehicle(Long id, UpdateVehicleRequest request);
    void deleteVehicle(Long id);
    VehicleResponse getVehicleById(Long id);
    List<VehicleResponse> getAllVehicles();
    List<VehicleResponse> getAvailableVehicles();
}
