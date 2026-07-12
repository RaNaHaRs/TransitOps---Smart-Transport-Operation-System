package org.harsh.transitops.repository;

import org.harsh.transitops.entity.Trip;
import org.harsh.transitops.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByStatus(TripStatus status);

    List<Trip> findByDriverId(Long driverId);

    List<Trip> findByVehicleId(Long vehicleId);

    Optional<Trip> findByTripCode(String tripCode);

    boolean existsByTripCode(String tripCode);
}
