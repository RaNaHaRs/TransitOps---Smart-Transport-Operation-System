package org.harsh.transitops.service.interfaces;

import org.harsh.transitops.dto.request.CompleteTripRequest;
import org.harsh.transitops.dto.request.CreateTripRequest;
import org.harsh.transitops.dto.request.DispatchTripRequest;
import org.harsh.transitops.dto.response.TripResponse;

import java.util.List;

public interface TripService {

    TripResponse createTrip(CreateTripRequest request);
    TripResponse dispatchTrip(Long id, DispatchTripRequest request);
    TripResponse completeTrip(Long id, CompleteTripRequest request);
    TripResponse cancelTrip(Long id);
    TripResponse getTripById(Long id);
    List<TripResponse> getAllTrips();
    List<TripResponse> getTripsByDriver(Long driverId);
    List<TripResponse> getTripsByVehicle(Long vehicleId);
}
