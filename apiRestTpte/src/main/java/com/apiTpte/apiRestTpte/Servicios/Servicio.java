package com.apiTpte.apiRestTpte.Servicios;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

import org.springframework.stereotype.Service;

@Service
public class Servicio {
    private WebClient webClient;

    public void NodeClientService(WebClient.Builder builder) {
        // URL donde corre tu microservicio Node.js
        this.webClient = builder.baseUrl("http://localhost:3001").build();
    }

    public Mono<String> callAfipService() {
      // Mono<String> flujo de datos de contenedor asyncrono
      return this.webClient.get()
        .uri("/autorizar")
        .retrieve()
        .bodyToMono(String.class);
    }

}
