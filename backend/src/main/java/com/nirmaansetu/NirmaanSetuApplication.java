package com.nirmaansetu;

import com.nirmaansetu.util.BrowserLauncher;
import com.nirmaansetu.util.FrontendBuildManager;
import com.nirmaansetu.util.PortSelector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class NirmaanSetuApplication {

    private static final Logger log = LoggerFactory.getLogger(NirmaanSetuApplication.class);
    private static int selectedPort = 8080;
    private static final int MAX_RETRIES = 10;

    public static void main(String[] args) {
        // Allow AWT/Desktop API for browser launching
        System.setProperty("java.awt.headless", "false");

        // Ensure frontend production bundle is present
        FrontendBuildManager.ensureFrontendBundle();

        // Register JVM shutdown hook to clean up port file
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            cleanupPortFile();
            log.info("NirmaanSetu stopped.");
        }));

        // Check if PORT environment variable is provided (Vercel container / cloud environment)
        String envPort = System.getenv("PORT");
        boolean fixedPort = false;

        if (envPort != null && !envPort.isBlank()) {
            try {
                selectedPort = Integer.parseInt(envPort.trim());
                fixedPort = true;
                log.info("Running in container/Vercel mode with PORT={}", selectedPort);
            } catch (NumberFormatException e) {
                log.warn("Invalid PORT env '{}', falling back to auto-discovery", envPort);
                selectedPort = PortSelector.findAvailablePort(8080, MAX_RETRIES);
            }
        } else {
            // Determine available port and launch with retry logic for local dev
            selectedPort = PortSelector.findAvailablePort(8080, MAX_RETRIES);
        }

        setServerPort(selectedPort);

        SpringApplication app = new SpringApplication(NirmaanSetuApplication.class);

        ConfigurableApplicationContext ctx = null;
        int retries = 0;
        int maxAttempts = fixedPort ? 1 : MAX_RETRIES;
        while (retries < maxAttempts) {
            try {
                ctx = app.run(args);
                break; // success
            } catch (Exception ex) {
                String msg = ex.getMessage() != null ? ex.getMessage() : "";
                if (!fixedPort && (msg.contains("BindException") || msg.contains("Address already in use") ||
                        msg.contains("bind") || isCausedByBind(ex)) && retries < maxAttempts - 1) {
                    selectedPort = PortSelector.findAvailablePort(selectedPort + 1, maxAttempts - retries);
                    setServerPort(selectedPort);
                    retries++;
                    log.warn("Port bind failed. Retrying on port {} (attempt {})", selectedPort, retries);
                } else {
                    log.error("NirmaanSetu failed to start: {}", msg);
                    System.exit(1);
                }
            }
        }
    }

    private static void setServerPort(int port) {
        System.setProperty("server.port", String.valueOf(port));
        log.info("Configured Spring Boot server.port={}", port);
    }

    private static boolean isCausedByBind(Throwable t) {
        Throwable cause = t;
        while (cause != null) {
            if (cause instanceof java.net.BindException ||
                    (cause.getMessage() != null && cause.getMessage().contains("Address already in use"))) {
                return true;
            }
            cause = cause.getCause();
        }
        return false;
    }

    private static void cleanupPortFile() {
        try {
            Files.deleteIfExists(Paths.get(".backend-port"));
        } catch (IOException ignored) {
        }
    }

    @Component
    static class StartupListener {

        @EventListener(ApplicationReadyEvent.class)
        public void onApplicationReady(ApplicationReadyEvent event) {
            ConfigurableApplicationContext ctx = event.getApplicationContext();
            int port = selectedPort;
            try {
                if (ctx instanceof ServletWebServerApplicationContext webCtx) {
                    port = webCtx.getWebServer().getPort();
                }
            } catch (Exception ignored) {
            }

            String url = "http://localhost:" + port;

            // Write port file
            writePortFile(port);

            // Print startup banner
            printBanner(port, url);

            // Open browser only in local interactive desktop environment
            boolean isHeadless = "true".equalsIgnoreCase(System.getenv("HEADLESS")) ||
                                 System.getenv("PORT") != null ||
                                 System.getenv("VERCEL") != null ||
                                 Boolean.getBoolean("java.awt.headless");
            if (!isHeadless) {
                BrowserLauncher.openBrowser(url);
            }
        }

        private void writePortFile(int port) {
            try {
                Files.writeString(Paths.get(".backend-port"), String.valueOf(port));
            } catch (IOException e) {
                log.warn("Could not write .backend-port file: {}", e.getMessage());
            }
        }

        private void printBanner(int port, String url) {
            System.out.println();
            System.out.println("============================================================");
            System.out.println("  ███╗   ██╗██╗██████╗ ███╗   ███╗ █████╗  █████╗ ███╗   ██╗");
            System.out.println("  ████╗  ██║██║██╔══██╗████╗ ████║██╔══██╗██╔══██╗████╗  ██║");
            System.out.println("  ██╔██╗ ██║██║██████╔╝██╔████╔██║███████║███████║██╔██╗ ██║");
            System.out.println("  ██║╚██╗██║██║██╔══██╗██║╚██╔╝██║██╔══██║██╔══██║██║╚██╗██║");
            System.out.println("  ██║ ╚████║██║██║  ██║██║ ╚═╝ ██║██║  ██║██║  ██║██║ ╚████║");
            System.out.println("  ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝");
            System.out.println("============================================================");
            System.out.println("  SETU  |  Workforce & Skilling Intelligence Platform");
            System.out.println("  Government of Maharashtra  |  SIH Problem 26135");
            System.out.println("============================================================");
            System.out.printf("  DATA MODE       = DEMO (H2 in-memory, lock-free)%n");
            System.out.printf("  SERVER PORT     = %d%n", port);
            System.out.printf("  LOCAL URL       = %s%n", url);
            System.out.printf("  HEALTH          = %s/api/health%n", url);
            System.out.printf("  SWAGGER UI      = %s/api/swagger-ui.html%n", url);
            System.out.printf("  H2 CONSOLE      = %s/h2-console%n", url);
            System.out.println("============================================================");
            System.out.println("  Opening browser... (if auto-launch fails, open the URL above)");
            System.out.println("============================================================");
            System.out.println();
        }
    }
}
