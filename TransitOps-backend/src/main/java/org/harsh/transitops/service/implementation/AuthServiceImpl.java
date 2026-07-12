package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.LoginRequest;
import org.harsh.transitops.dto.response.LoginResponse;
import org.harsh.transitops.entity.User;
import org.harsh.transitops.repository.UserRepository;
import org.harsh.transitops.service.interfaces.AuthService;
import org.harsh.transitops.security.JwtService;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        boolean legacyPlainTextPassword = !passwordMatches && request.getPassword().equals(user.getPassword());
        if (!passwordMatches && !legacyPlainTextPassword) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (legacyPlainTextPassword) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
        }

        LoginResponse.LoginResponseBuilder response = LoginResponse.builder()
                .token(jwtService.generateToken(user.getEmail()))
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole());

        if (user.getRole() == org.harsh.transitops.enums.Role.DRIVER && user.getDriver() != null) {
            response.driverId(user.getDriver().getId());
        }

        return response.build();
    }
}
