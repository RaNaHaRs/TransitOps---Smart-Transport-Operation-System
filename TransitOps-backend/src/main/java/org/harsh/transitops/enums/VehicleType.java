package org.harsh.transitops.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum VehicleType {
    TRUCK("Truck"),
    VAN("Van"),
    MINI_TRUCK("Mini-Truck"),
    BUS("Bus"),
    CAR("Car");

    private final String label;

    VehicleType(String label) { this.label = label; }

    @JsonValue
    public String getLabel() { return label; }

    @JsonCreator
    public static VehicleType fromLabel(String label) {
        for (VehicleType t : values()) {
            if (t.label.equalsIgnoreCase(label)) return t;
        }
        return valueOf(label);
    }
}
