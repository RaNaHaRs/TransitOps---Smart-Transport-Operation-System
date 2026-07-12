package org.harsh.transitops.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DriverStatus {
    AVAILABLE("Available"),
    ON_TRIP("On Trip"),
    OFF_DUTY("Off Duty"),
    SUSPENDED("Suspended");

    private final String label;

    DriverStatus(String label) { this.label = label; }

    @JsonValue
    public String getLabel() { return label; }

    @JsonCreator
    public static DriverStatus fromLabel(String label) {
        for (DriverStatus s : values()) {
            if (s.label.equalsIgnoreCase(label)) return s;
        }
        return valueOf(label);
    }
}
