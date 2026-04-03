package com.apiTpte.apiRestTpte.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



import org.springframework.beans.factory.annotation.Value;


@Configuration
public class WebConfig {
    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                System.out.println("CORS FRONTEND_URL: " + frontendUrl); // debug opcional

                registry.addMapping("/**")
                        .allowedOriginPatterns(frontendUrl) // ✔ correcto                        
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*") // 🔥 IMPORTANTE
                        .exposedHeaders("Authorization") // opcional (si usás JWT en headers)
                        .allowCredentials(true);
            }
        };
    }
}