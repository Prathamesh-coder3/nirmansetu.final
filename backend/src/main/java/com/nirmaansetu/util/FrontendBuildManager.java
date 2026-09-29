package com.nirmaansetu.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;

/**
 * FrontendBuildManager - Ensures the React production bundle exists before Spring Boot serves it.
 *
 * Logic:
 * 1. Check if target/classes/static/index.html already exists → skip build
 * 2. Check if frontend/dist/index.html exists → copy to target/classes/static/
 * 3. Otherwise: run npm ci && npm run build in frontend/
 * 4. Copy frontend/dist → src/main/resources/static/ and target/classes/static/
 *
 * Equivalent to OceanVis FrontendBuildManager.
 */
public class FrontendBuildManager {

    private static final Logger log = LoggerFactory.getLogger(FrontendBuildManager.class);

    private static final String FRONTEND_DIR = "frontend";
    private static final String DIST_INDEX = "frontend/dist/index.html";
    private static final String TARGET_STATIC = "target/classes/static";
    private static final String RESOURCES_STATIC = "src/main/resources/static";

    private FrontendBuildManager() {}

    public static void ensureFrontendBundle() {
        log.info("=== Frontend Build Preflight ===");

        // In Vercel or cloud container, frontend is built and served by the Vercel frontend service
        if (System.getenv("VERCEL") != null || System.getenv("PORT") != null || "true".equalsIgnoreCase(System.getProperty("skip.frontend.build"))) {
            log.info("Container / Vercel environment detected. Frontend is served by Vercel frontend service.");
            return;
        }

        // Check if already bundled in target/classes/static
        if (new File(TARGET_STATIC + "/index.html").exists()) {
            log.info("Frontend bundle already present in target/classes/static. Skipping build.");
            return;
        }

        // Check relative frontend locations (standalone root vs backend monorepo folder)
        String distPath = new File(DIST_INDEX).exists() ? DIST_INDEX :
                          new File("../" + DIST_INDEX).exists() ? "../" + DIST_INDEX : null;

        if (distPath != null) {
            log.info("Frontend dist found at {}. Copying to target/classes/static...", distPath);
            copyDistFrom(distPath);
            return;
        }

        // Check if frontend directory and package.json exist (either ./frontend or ../frontend)
        File frontendDir = new File(FRONTEND_DIR).exists() ? new File(FRONTEND_DIR) :
                           new File("../" + FRONTEND_DIR).exists() ? new File("../" + FRONTEND_DIR) : null;

        if (frontendDir == null || !new File(frontendDir, "package.json").exists()) {
            log.warn("Frontend directory not found or package.json missing. Skipping frontend build.");
            log.warn("The application will start without the React frontend bundle.");
            return;
        }

        // Run npm build
        log.info("Frontend bundle not found. Running npm build...");
        boolean success = runNpmBuild(frontendDir);

        if (success && new File(DIST_INDEX).exists()) {
            log.info("Frontend build successful. Copying to static resources...");
            copyDist();
        } else {
            log.error("=== FRONTEND BUILD FAILED ===");
            log.error("The application will start but may not serve the React UI correctly.");
            log.error("To manually build: cd frontend && npm install && npm run build");
        }
    }

    private static boolean runNpmBuild(File frontendDir) {
        String os = System.getProperty("os.name", "").toLowerCase();
        boolean isWindows = os.contains("win");

        // Try npm ci first, fallback to npm install
        boolean installed = runNpmCommand(frontendDir, isWindows, "ci");
        if (!installed) {
            log.warn("npm ci failed, trying npm install...");
            installed = runNpmCommand(frontendDir, isWindows, "install");
        }
        if (!installed) {
            log.error("npm install failed. Node.js/npm may not be installed.");
            return false;
        }

        return runNpmCommand(frontendDir, isWindows, "run", "build");
    }

    private static boolean runNpmCommand(File workDir, boolean isWindows, String... npmArgs) {
        List<String> cmd;
        if (isWindows) {
            cmd = new java.util.ArrayList<>(Arrays.asList("cmd", "/c", "npm"));
        } else {
            cmd = new java.util.ArrayList<>(List.of("npm"));
        }
        cmd.addAll(Arrays.asList(npmArgs));

        log.info("Running: {}", String.join(" ", cmd));
        try {
            ProcessBuilder pb = new ProcessBuilder(cmd);
            pb.directory(workDir);
            pb.redirectErrorStream(true);
            pb.environment().put("CI", "false"); // prevent treating warnings as errors
            pb.environment().put("GENERATE_SOURCEMAP", "false");

            Process process = pb.start();

            // Stream output
            try (var reader = new java.io.BufferedReader(
                    new java.io.InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("  [npm] " + line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                log.info("Command succeeded: {}", String.join(" ", cmd));
                return true;
            } else {
                log.error("Command failed with exit code {}: {}", exitCode, String.join(" ", cmd));
                return false;
            }
        } catch (IOException | InterruptedException e) {
            log.error("Failed to run npm: {}", e.getMessage());
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return false;
        }
    }

    private static void copyDist() {
        copyDistFrom(DIST_INDEX);
    }

    private static void copyDistFrom(String distIndexPath) {
        try {
            Path distPath = Paths.get(distIndexPath).getParent();
            if (distPath == null || !Files.exists(distPath)) return;
            Path targetPath = Paths.get(TARGET_STATIC);
            Path resourcesPath = Paths.get(RESOURCES_STATIC);

            copyDirectory(distPath, targetPath);
            copyDirectory(distPath, resourcesPath);

            log.info("Frontend files copied to {} and {}", TARGET_STATIC, RESOURCES_STATIC);
        } catch (IOException e) {
            log.error("Failed to copy frontend dist: {}", e.getMessage());
        }
    }

    private static void copyDirectory(Path source, Path target) throws IOException {
        if (!Files.exists(source)) return;
        Files.createDirectories(target);

        Files.walk(source).forEach(src -> {
            try {
                Path dest = target.resolve(source.relativize(src));
                if (Files.isDirectory(src)) {
                    Files.createDirectories(dest);
                } else {
                    Files.copy(src, dest, StandardCopyOption.REPLACE_EXISTING);
                }
            } catch (IOException e) {
                log.warn("Could not copy {}: {}", src, e.getMessage());
            }
        });
    }
}
