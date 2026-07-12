package org.harsh.transitops.repository;

import org.harsh.transitops.entity.Maintenance;
import org.harsh.transitops.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    List<Maintenance> findByStatus(MaintenanceStatus status);

    List<Maintenance> findByVehicleId(Long vehicleId);
}
