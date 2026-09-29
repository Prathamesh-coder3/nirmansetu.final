package com.nirmaansetu.auth;

import com.nirmaansetu.common.ApiResponse;
import com.nirmaansetu.security.JwtUtils;
import com.nirmaansetu.user.User;
import com.nirmaansetu.user.UserRepository;
import com.nirmaansetu.user.UserRole;
import com.nirmaansetu.worker.WorkerProfile;
import com.nirmaansetu.worker.WorkerProfileRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final WorkerProfileRepository workerProfileRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService,
                          UserRepository userRepository,
                          WorkerProfileRepository workerProfileRepository,
                          JwtUtils jwtUtils,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest req) {
        try {
            String identifier = req.getUsernameOrEmail() == null ? "" : req.getUsernameOrEmail().trim().toLowerCase();
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, req.getPassword())
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            User user = userRepository.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow();

            String token = jwtUtils.generateToken(
                Map.of("role", user.getRole().name(), "userId", user.getId()),
                userDetails
            );

            Optional<WorkerProfile> workerOpt = Optional.empty();
            if (user.getRole() == UserRole.WORKER) {
                workerOpt = workerProfileRepository.findByUserId(user.getId());
            }

            LoginResponse resp = LoginResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .workerId(workerOpt.map(WorkerProfile::getId).orElse(null))
                .build();

            return ResponseEntity.ok(ApiResponse.ok(resp, "Login successful"));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Invalid username or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Username already taken"));
        }
        if (req.getEmail() != null && userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Email already registered"));
        }

        UserRole role = UserRole.WORKER;
        try {
            if (req.getRole() != null) {
                role = UserRole.valueOf(req.getRole().toUpperCase());
            }
        } catch (IllegalArgumentException ignored) {}

        User user = User.builder()
            .username(req.getUsername())
            .email(req.getEmail())
            .phone(req.getPhone())
            .passwordHash(passwordEncoder.encode(req.getPassword()))
            .fullName(req.getFullName())
            .role(role)
            .active(true)
            .verified(false)
            .build();

        user = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtUtils.generateToken(
            Map.of("role", user.getRole().name(), "userId", user.getId()),
            userDetails
        );

        LoginResponse resp = LoginResponse.builder()
            .token(token)
            .id(user.getId())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .build();

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(resp));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getCurrentUser(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Not authenticated"));
        }
        User user = userRepository.findByUsernameOrEmail(auth.getName(), auth.getName())
            .orElseThrow(() -> new java.util.NoSuchElementException("User not found"));

        Optional<WorkerProfile> workerOpt = Optional.empty();
        if (user.getRole() == UserRole.WORKER) {
            workerOpt = workerProfileRepository.findByUserId(user.getId());
        }

        UserInfoResponse resp = UserInfoResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(user.getRole().name())
            .verified(user.isVerified())
            .workerId(workerOpt.map(WorkerProfile::getId).orElse(null))
            .profileComplete(workerOpt.map(WorkerProfile::getProfileCompletion).orElse(null))
            .build();

        return ResponseEntity.ok(ApiResponse.ok(resp));
    }

    // DTO classes

    @Data
    static class LoginRequest {
        @NotBlank private String usernameOrEmail;
        @NotBlank private String password;
    }

    @Data
    static class RegisterRequest {
        @NotBlank private String username;
        @NotBlank private String password;
        @NotBlank private String fullName;
        private String email;
        private String phone;
        private String role;
    }

    @lombok.Builder
    @lombok.Getter
    static class LoginResponse {
        private String token;
        private String id;
        private String username;
        private String fullName;
        private String email;
        private String role;
        private String workerId;
    }

    @lombok.Builder
    @lombok.Getter
    static class UserInfoResponse {
        private String id;
        private String username;
        private String fullName;
        private String email;
        private String phone;
        private String role;
        private boolean verified;
        private String workerId;
        private Integer profileComplete;
    }
}
