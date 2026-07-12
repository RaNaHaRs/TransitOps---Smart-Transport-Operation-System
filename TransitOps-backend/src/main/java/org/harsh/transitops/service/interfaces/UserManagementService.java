package org.harsh.transitops.service.interfaces;

import org.harsh.transitops.dto.request.CreateStaffUserRequest;
import org.harsh.transitops.dto.response.UserResponse;

public interface UserManagementService {

    UserResponse createStaffUser(CreateStaffUserRequest request);

    UserResponse getMyProfile(String email);
}
