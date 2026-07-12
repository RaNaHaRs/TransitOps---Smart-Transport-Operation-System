package org.harsh.transitops.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TripStatus {
    CREATED("Draft"),
    DISPATCHED("Dispatched"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled");

    private final String label;

    TripStatus(String label) { this.label = label; }

    @JsonValue
    public String getLabel() { return label; }

    @JsonCreator
    public static TripStatus fromLabel(String label) {
        for (TripStatus s : values()) {
            if (s.label.equalsIgnoreCase(label)) return s;
        }
        return valueOf(label);
    }
}
