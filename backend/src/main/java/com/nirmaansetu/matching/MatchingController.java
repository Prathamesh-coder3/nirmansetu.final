package com.nirmaansetu.matching;

import com.nirmaansetu.common.ApiResponse;
import com.nirmaansetu.requirement.WorkforceRequirement;
import com.nirmaansetu.requirement.WorkforceRequirementRepository;
import com.nirmaansetu.worker.WorkerProfile;
import com.nirmaansetu.worker.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    private final MatchingService matchingService;
    private final WorkforceRequirementRepository requirementRepository;
    private final WorkerProfileRepository workerProfileRepository;

    public MatchingController(MatchingService matchingService,
                              WorkforceRequirementRepository requirementRepository,
                              WorkerProfileRepository workerProfileRepository) {
        this.matchingService = matchingService;
        this.requirementRepository = requirementRepository;
        this.workerProfileRepository = workerProfileRepository;
    }

    /**
     * Find top matching workers for a specific project requirement.
     */
    @GetMapping("/requirement/{requirementId}")
    @PreAuthorize("hasAnyRole('GOVERNMENT', 'PROJECT_AGENCY', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> findMatchesForRequirement(
            @PathVariable String requirementId,
            @RequestParam(defaultValue = "30.0") double minScore) {

        WorkforceRequirement requirement = requirementRepository.findById(requirementId)
            .orElseThrow(() -> new NoSuchElementException("Requirement not found: " + requirementId));

        Map<String, Object> result = matchingService.findMatchesForRequirement(requirement, minScore);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    /**
     * Compute compatibility score between a specific worker and requirement.
     */
    @GetMapping("/score")
    public ResponseEntity<ApiResponse<Map<String, Object>>> computeScore(
            @RequestParam String workerId,
            @RequestParam String requirementId) {

        WorkerProfile worker = workerProfileRepository.findById(workerId)
            .orElseThrow(() -> new NoSuchElementException("Worker not found: " + workerId));
        WorkforceRequirement requirement = requirementRepository.findById(requirementId)
            .orElseThrow(() -> new NoSuchElementException("Requirement not found: " + requirementId));

        Map<String, Object> result = matchingService.computeFullMatch(worker, requirement);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
