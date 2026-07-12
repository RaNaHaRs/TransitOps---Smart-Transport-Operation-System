package org.harsh.transitops.service.interfaces;

import org.harsh.transitops.dto.request.LoginRequest;
import org.harsh.transitops.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
