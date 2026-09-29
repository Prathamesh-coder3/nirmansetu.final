package com.nirmaansetu.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Value("${spring.application.name:NirmaanSetu}")
    private String appName;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Value("${nirmaansetu.demo-mode:true}")
    private boolean demoMode;

    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.ok(Map.of(
            "status", "UP",
            "application", appName,
            "version", "1.0.0",
            "profile", activeProfile,
            "demoMode", demoMode,
            "timestamp", LocalDateTime.now().toString(),
            "description", "Workforce Skilling and Employment Outcome Intelligence Platform",
            "organization", "Government of Maharashtra",
            "sihProblem", "26135"
        ));
    }
}
