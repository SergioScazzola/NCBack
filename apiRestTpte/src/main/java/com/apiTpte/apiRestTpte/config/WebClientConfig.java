package com.apiTpte.apiRestTpte.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import org.springframework.beans.factory.annotation.Value;



@Configuration
public class WebClientConfig {
    @Value("${afip.Url}")
    private String afipurl;

    @SuppressWarnings("null")
    @Bean
    WebClient afipWebClient(WebClient.Builder builder) {       
        return builder
                .baseUrl(afipurl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
    
}
