package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.CreateStaffUserRequest;
import org.harsh.transitops.dto.response.UserResponse;
import org.harsh.transitops.entity.User;
import org.harsh.transitops.enums.Role;
import org.harsh.transitops.repository.UserRepository;
import org.harsh.transitops.service.interfaces.UserManagementService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserManagementServiceImpl implements UserManagementService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse createStaffUser(CreateStaffUserRequest request) {
        if (request.getRole() != Role.SAFETY_OFFICER && request.getRole() != Role.FINANCIAL_ANALYST) {
            throw new IllegalArgumentException("Only safety officer and financial analyst accounts can be created here");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }
        User user = userRepository.save(User.builder().name(request.getName()).email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())).role(request.getRole()).build());
        return UserResponse.builder().id(user.getId()).name(user.getName()).email(user.getEmail()).role(user.getRole()).build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Long driverId = (user.getDriver() != null) ? user.getDriver().getId() : null;
        return UserResponse.builder().id(user.getId()).name(user.getName()).email(user.getEmail())
                .role(user.getRole()).driverId(driverId).build();
    }
}
