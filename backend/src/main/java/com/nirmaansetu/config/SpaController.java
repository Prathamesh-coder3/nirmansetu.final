package com.nirmaansetu.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

/**
 * SpaController - Explicit SPA route fallback controller.
 *
 * Forwards all non-API, non-static routes to index.html
 * so React Router handles client-side navigation.
 *
 * Routes handled:
 * /dashboard, /worker/**, /government/**, /agency/**,
 * /training/**, /admin/**, /login, /register, etc.
 */
@Controller
public class SpaController {

    /**
     * Forward all SPA routes to React's index.html.
     * Spring Security allows these through the permitAll() rule.
     */
    @RequestMapping(value = {
        "/",
        "/login",
        "/register",
        "/dashboard",
        "/worker/**",
        "/government/**",
        "/agency/**",
        "/training-org/**",
        "/admin/**",
        "/profile/**",
        "/passport/**",
        "/opportunities/**",
        "/applications/**",
        "/skill-passport",
        "/find-work"
    })
    public String forwardToReact() {
        return "forward:/index.html";
    }
}
