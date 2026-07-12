package org.harsh.transitops.bootstrap;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.harsh.transitops.entity.User;
import org.harsh.transitops.enums.Role;
import org.harsh.transitops.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DefaultAdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Value("${transitops.bootstrap.admin.name}")
    private String adminName;

    @Value("${transitops.bootstrap.admin.email}")
    private String adminEmail;

    @Value("${transitops.bootstrap.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Default admin account already exists: {}", adminEmail);
            return;
        }

        userRepository.save(User.builder()
                .name(adminName)
                .email(adminEmail)
                .password(adminPassword)
                .role(Role.ADMIN)
                .build());

        log.info("Default admin account created. Email: {}, Password: {}", adminEmail, adminPassword);
    }
}
