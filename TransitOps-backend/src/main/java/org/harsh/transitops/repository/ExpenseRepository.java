package org.harsh.transitops.repository;

import org.harsh.transitops.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByTripId(Long tripId);

    List<Expense> findByMaintenanceId(Long maintenanceId);
}
