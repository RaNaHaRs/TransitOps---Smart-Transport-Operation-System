package org.harsh.transitops.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MaintenanceStatus {
    PENDING("Open"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Closed");

    private final String label;

    MaintenanceStatus(String label) { this.label = label; }

    @JsonValue
    public String getLabel() { return label; }

    @JsonCreator
    public static MaintenanceStatus fromLabel(String label) {
        for (MaintenanceStatus s : values()) {
            if (s.label.equalsIgnoreCase(label)) return s;
        }
        if ("Open".equalsIgnoreCase(label)) return PENDING;
        if ("Closed".equalsIgnoreCase(label)) return COMPLETED;
        return valueOf(label);
    }
}
