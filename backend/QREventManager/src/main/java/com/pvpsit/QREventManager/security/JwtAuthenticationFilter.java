package com.pvpsit.QREventManager.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath();

        if (shouldSkipAuthentication(request, path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = authHeader.substring(7).trim();
            String username = jwtUtil.extractUsername(jwt);

            if (username != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                if (jwtUtil.validateToken(jwt, userDetails)) {

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authToken);
                }
            }

        } catch (ExpiredJwtException e) {
            SecurityContextHolder.clearContext();
            log.debug("Expired JWT for path {}", path);
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            log.debug("JWT authentication failed for path {}: {}", path, e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private boolean shouldSkipAuthentication(HttpServletRequest request, String path) {
        String method = request.getMethod();

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        if ("/error".equals(path)) {
            return true;
        }

        if ("/api/auth/login".equals(path) || "/api/auth/register".equals(path)) {
            return true;
        }

        if ("GET".equalsIgnoreCase(method)) {
            return "/api/events/list".equals(path)
                    || "/api/events/upcoming".equals(path)
                    || path.matches("^/api/events/[^/]+$");
        }

        return false;
    }
}
