package com.Sisbul.ApiRrest.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



import java.util.logging.Logger;

@Configuration
public class WebConfig {

    private static final Logger logger = Logger.getLogger(WebConfig.class.getName());

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @SuppressWarnings("null")
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOriginPatterns("*") // Permitir cualquier origen
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .exposedHeaders("Authorization", "Content-Type")
                    .allowCredentials(true)
                    .maxAge(3600);
                
                logger.info("CORS configurado para permitir todos los orígenes usando allowedOriginPatterns");
            }
        };
    }
} 