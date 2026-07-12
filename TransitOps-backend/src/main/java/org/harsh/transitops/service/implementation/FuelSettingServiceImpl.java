package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.UpdateFuelPriceRequest;
import org.harsh.transitops.entity.FuelSetting;
import org.harsh.transitops.repository.FuelSettingRepository;
import org.harsh.transitops.service.interfaces.FuelSettingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FuelSettingServiceImpl implements FuelSettingService {

    private final FuelSettingRepository fuelSettingRepository;

    @Override
    @Transactional(readOnly = true)
    public Double getCurrentFuelPrice() {
        return fuelSettingRepository.findTopByOrderByIdDesc().map(FuelSetting::getFuelPrice)
                .orElseThrow(() -> new IllegalStateException("Fuel price has not been configured"));
    }

    @Override
    @Transactional
    public Double updateFuelPrice(UpdateFuelPriceRequest request) {
        return fuelSettingRepository.save(FuelSetting.builder().fuelPrice(request.getFuelPrice()).build()).getFuelPrice();
    }
}
