package com.mis.mis_backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Lightweight CORS filter that avoids Spring's CorsUtils (Boot 4.1 / SF 7
 * nested-jar ClassNotFoundException on UriComponents during CORS checks).
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SimpleCorsFilter extends OncePerRequestFilter {

    private final List<String> allowedOrigins;

    public SimpleCorsFilter(@Value("${app.cors.origins}") String corsOrigins) {
        this.allowedOrigins = Arrays.stream(corsOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String origin = request.getHeader("Origin");
        if (origin != null && isAllowed(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept,Origin");
            response.setHeader("Vary", "Origin");
            response.setHeader("Access-Control-Max-Age", "3600");
        }

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAllowed(String origin) {
        // Local CRA / static servers often use arbitrary ports (3000, 3002, 3010, …).
        if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
            return true;
        }
        return allowedOrigins.stream().anyMatch(allowed ->
                allowed.equals(origin)
                        || allowed.equals("*")
                        || origin.matches(allowed.replace(".", "\\.").replace("*", ".*")));
    }
}
