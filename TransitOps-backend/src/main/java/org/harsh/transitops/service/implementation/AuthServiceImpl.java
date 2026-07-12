package org.harsh.transitops.service.implementation;

import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.LoginRequest;
import org.harsh.transitops.dto.response.LoginResponse;
import org.harsh.transitops.entity.User;
import org.harsh.transitops.repository.UserRepository;
import org.harsh.transitops.service.interfaces.AuthService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!Objects.equals(user.getPassword(), request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return LoginResponse.builder()
                .token(null)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
