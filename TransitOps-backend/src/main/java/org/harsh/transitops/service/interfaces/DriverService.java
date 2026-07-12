package org.harsh.transitops.service.interfaces;

import org.harsh.transitops.dto.request.CreateDriverRequest;
import org.harsh.transitops.dto.request.UpdateDriverRequest;
import org.harsh.transitops.dto.response.DriverResponse;

import java.util.List;

public interface DriverService {

    DriverResponse addDriver(CreateDriverRequest request);
    DriverResponse updateDriver(Long id, UpdateDriverRequest request);
    void deleteDriver(Long id);
    DriverResponse getDriverById(Long id);
    List<DriverResponse> getAllDrivers();
    List<DriverResponse> getAvailableDrivers();
}
