package com.nirmaansetu.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.awt.Desktop;
import java.net.URI;

/**
 * BrowserLauncher - Automatically opens the default browser with the application URL.
 *
 * Windows:  rundll32 url.dll,FileProtocolHandler  (primary)
 *           cmd /c start  (fallback)
 *           PowerShell Start-Process  (second fallback)
 * macOS:    open
 * Linux:    xdg-open
 * JVM:      java.awt.Desktop.browse()  (last resort)
 *
 * Equivalent to OceanVis BrowserLauncher.
 */
public class BrowserLauncher {

    private static final Logger log = LoggerFactory.getLogger(BrowserLauncher.class);

    private BrowserLauncher() {}

    public static void openBrowser(String url) {
        String os = System.getProperty("os.name", "").toLowerCase();
        log.info("Attempting to open browser at: {}", url);

        boolean opened = false;

        if (os.contains("win")) {
            opened = openOnWindows(url);
        } else if (os.contains("mac")) {
            opened = runCommand("open", url);
        } else {
            opened = runCommand("xdg-open", url);
        }

        if (!opened) {
            opened = openWithDesktopApi(url);
        }

        if (!opened) {
            System.out.println("\n>>> BROWSER AUTO-LAUNCH FAILED");
            System.out.println(">>> Please open manually: " + url);
            System.out.println();
        }
    }

    private static boolean openOnWindows(String url) {
        // Method 1: rundll32
        try {
            Process p = new ProcessBuilder(
                "rundll32", "url.dll,FileProtocolHandler", url
            ).start();
            Thread.sleep(500);
            log.info("Browser opened via rundll32.");
            return true;
        } catch (Exception e) {
            log.debug("rundll32 failed: {}", e.getMessage());
        }

        // Method 2: cmd /c start
        try {
            Process p = new ProcessBuilder(
                "cmd", "/c", "start", "", url
            ).start();
            Thread.sleep(500);
            log.info("Browser opened via cmd start.");
            return true;
        } catch (Exception e) {
            log.debug("cmd start failed: {}", e.getMessage());
        }

        // Method 3: PowerShell
        try {
            Process p = new ProcessBuilder(
                "powershell", "-Command", "Start-Process", "'" + url + "'"
            ).start();
            Thread.sleep(500);
            log.info("Browser opened via PowerShell.");
            return true;
        } catch (Exception e) {
            log.debug("PowerShell failed: {}", e.getMessage());
        }

        return false;
    }

    private static boolean runCommand(String... cmd) {
        try {
            ProcessBuilder pb = new ProcessBuilder(cmd);
            pb.start();
            Thread.sleep(300);
            log.info("Browser opened via: {}", String.join(" ", cmd));
            return true;
        } catch (Exception e) {
            log.debug("Command failed ({}): {}", String.join(" ", cmd), e.getMessage());
            return false;
        }
    }

    private static boolean openWithDesktopApi(String url) {
        try {
            if (Desktop.isDesktopSupported()) {
                Desktop desktop = Desktop.getDesktop();
                if (desktop.isSupported(Desktop.Action.BROWSE)) {
                    desktop.browse(new URI(url));
                    log.info("Browser opened via Java Desktop API.");
                    return true;
                }
            }
        } catch (Exception e) {
            log.debug("Desktop API failed: {}", e.getMessage());
        }
        return false;
    }
}
