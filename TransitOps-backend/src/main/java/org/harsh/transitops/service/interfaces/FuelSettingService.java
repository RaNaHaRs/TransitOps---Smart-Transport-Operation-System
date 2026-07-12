package org.harsh.transitops.service.interfaces;

import org.harsh.transitops.dto.request.UpdateFuelPriceRequest;

public interface FuelSettingService {

    Double getCurrentFuelPrice();
    Double updateFuelPrice(UpdateFuelPriceRequest request);
}
