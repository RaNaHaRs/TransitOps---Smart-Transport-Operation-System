package org.harsh.transitops.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.harsh.transitops.dto.request.CreateStaffUserRequest;
import org.harsh.transitops.dto.response.UserResponse;
import org.harsh.transitops.service.interfaces.UserManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserManagementService userManagementService;

    @PostMapping("/staff")
    public ResponseEntity<UserResponse> createStaffUser(@Valid @RequestBody CreateStaffUserRequest request) {
        return ResponseEntity.status(201).body(userManagementService.createStaffUser(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(userManagementService.getMyProfile(authentication.getName()));
    }
}
