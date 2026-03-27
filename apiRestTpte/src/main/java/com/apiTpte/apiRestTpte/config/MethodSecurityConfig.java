package com.apiTpte.apiRestTpte.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class MethodSecurityConfig {
    // Con esto Spring evaluará @PreAuthorize y @PostAuthorize
}
