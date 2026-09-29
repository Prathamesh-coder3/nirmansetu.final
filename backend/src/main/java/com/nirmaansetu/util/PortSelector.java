package com.nirmaansetu.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.ServerSocket;

/**
 * PortSelector - Finds an available TCP port for Spring Boot to bind to.
 *
 * Priority order:
 * 1. --server.port command line argument (handled by Spring itself)
 * 2. Programmatic search from startPort upward
 *
 * Used by NirmaanSetuApplication before SpringApplication.run()
 */
public class PortSelector {

    private static final Logger log = LoggerFactory.getLogger(PortSelector.class);

    private PortSelector() {}

    /**
     * Find an available port starting from startPort.
     * Searches up to maxAttempts ports.
     */
    public static int findAvailablePort(int startPort, int maxAttempts) {
        int port = startPort;
        int attempts = 0;

        while (attempts < maxAttempts) {
            if (isPortAvailable(port)) {
                if (port != startPort) {
                    log.info("Port {} is busy. Using port {} instead.", startPort, port);
                } else {
                    log.info("Using port {}.", port);
                }
                return port;
            }
            log.debug("Port {} is occupied. Trying {}...", port, port + 1);
            port++;
            attempts++;
        }

        // Last resort: let OS pick
        log.warn("Could not find available port in range {}-{}. Using OS-assigned port.", startPort, startPort + maxAttempts - 1);
        return port;
    }

    /**
     * Check if a port is available (not currently bound).
     */
    public static boolean isPortAvailable(int port) {
        try (ServerSocket socket = new ServerSocket(port)) {
            socket.setReuseAddress(true);
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
