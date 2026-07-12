package org.harsh.transitops.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDriverRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String licenseNumber;

    @NotNull
    @Future
    private LocalDate licenseExpiry;

    @NotBlank
    private String phone;
}
