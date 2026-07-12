package org.harsh.transitops.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum VehicleStatus {
    AVAILABLE("Available"),
    ON_TRIP("On Trip"),
    IN_MAINTENANCE("In Shop"),
    RETIRED("Retired");

    private final String label;

    VehicleStatus(String label) { this.label = label; }

    @JsonValue
    public String getLabel() { return label; }

    @JsonCreator
    public static VehicleStatus fromLabel(String label) {
        for (VehicleStatus s : values()) {
            if (s.label.equalsIgnoreCase(label)) return s;
        }
        return valueOf(label);
    }
}
