package com.apiTpte.apiRestTpte.Servicios;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.apiTpte.apiRestTpte.Entidades.ultimoComprobanteDTO;

@Service
public class AfipService {

    private final WebClient afipWebClient;

    public AfipService(WebClient afipWebClient) {
        this.afipWebClient = afipWebClient;
    }

    public ultimoComprobanteDTO obtenerUltimoComprobante() {
        return afipWebClient
                .get() // <--- aquí es donde falla si afipWebClient es null
                .uri("/afip/ultcomp")
                .retrieve()
                .bodyToMono(ultimoComprobanteDTO.class)                    
                //.map(ultimoComprobanteDTO::ultimoComprobanteDTO)                                                              
                .block(); // bloqueante
    }
}

