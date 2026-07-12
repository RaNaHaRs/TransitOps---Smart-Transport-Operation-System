package org.harsh.transitops.security;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.enums.Role;
import org.harsh.transitops.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("dashboardAccess")
@RequiredArgsConstructor
public class DashboardAccess {

    private final UserRepository userRepository;

    public boolean canAccessDriverDashboard(Authentication authentication, Long driverId) {
        return userRepository.findByEmail(authentication.getName())
                .map(user -> user.getRole() == Role.ADMIN
                        || (user.getRole() == Role.DRIVER && user.getDriver() != null
                        && user.getDriver().getId().equals(driverId)))
                .orElse(false);
    }
}
