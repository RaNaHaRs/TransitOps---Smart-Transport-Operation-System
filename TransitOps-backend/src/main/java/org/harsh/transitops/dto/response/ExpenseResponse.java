package org.harsh.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponse {

    private Long id;
    private String expenseType;
    private Double amount;
    private String description;
    private LocalDateTime expenseDate;
    private Long tripId;
    private Long maintenanceId;
}
