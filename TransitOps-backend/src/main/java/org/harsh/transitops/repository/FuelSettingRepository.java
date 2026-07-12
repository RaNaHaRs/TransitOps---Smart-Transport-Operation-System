package org.harsh.transitops.repository;

import org.harsh.transitops.entity.FuelSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FuelSettingRepository extends JpaRepository<FuelSetting, Long> {

    Optional<FuelSetting> findTopByOrderByIdDesc();
}
