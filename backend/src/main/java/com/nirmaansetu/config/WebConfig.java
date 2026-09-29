package com.nirmaansetu.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * WebConfig - Serves React SPA from Spring Boot.
 *
 * Static resources: classpath:/static/
 * Development fallback: file:./src/main/resources/static/, file:./frontend/dist/
 *
 * SPA fallback: All non-API, non-asset routes return index.html
 * so React Router can handle client-side navigation.
 *
 * Equivalent to OceanVis WebConfig.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
            .addResourceHandler("/**")
            .addResourceLocations(
                "classpath:/static/",
                "file:./src/main/resources/static/",
                "file:./frontend/dist/"
            )
            .resourceChain(true)
            .addResolver(new PathResourceResolver() {
                @Override
                protected Resource getResource(String resourcePath, Resource location) throws IOException {
                    Resource requestedResource = location.createRelative(resourcePath);
                    // If the resource exists, serve it directly
                    if (requestedResource.exists() && requestedResource.isReadable()) {
                        return requestedResource;
                    }
                    // SPA fallback: return index.html for client-side routes
                    // But DO NOT fallback for /api/** (handled by controllers)
                    if (resourcePath.startsWith("api/")) {
                        return null; // Let Spring MVC handle
                    }
                    // Return index.html for React Router routes
                    Resource index = new ClassPathResource("/static/index.html");
                    if (!index.exists()) {
                        index = new org.springframework.core.io.FileSystemResource("./src/main/resources/static/index.html");
                    }
                    if (!index.exists()) {
                        index = new org.springframework.core.io.FileSystemResource("./frontend/dist/index.html");
                    }
                    return index.exists() ? index : null;
                }
            });
    }
}
