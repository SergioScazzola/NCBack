/*package com.apiTpte.apiRestTpte;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import com.apiTpte.apiRestTpte.Servicios.AfipAuthService;
import com.apiTpte.apiRestTpte.Servicios.AfipCredentials;
import com.apiTpte.apiRestTpte.Servicios.AfipWsfeClient;



@Configuration
@Component
public class TestAfip {

  
 @Bean
public CommandLineRunner testAfipRunner(AfipAuthService service) {
    return args -> {
        AfipCredentials res = service.autenticar("wsfe");
       
        System.out.println("TOKEN: " + res.token());
        System.out.println("SIGN: " + res.sign());
        System.out.println("GENERATION TIME: " + res.generationTime());
        System.out.println("EXPIRATION TIME: " + res.expirationTime());

        int ultimo;
        AfipWsfeClient wsfeClient = new AfipWsfeClient();
        try {
            ultimo = wsfeClient.getUltimoComprobante(
                  res.token(),
                  res.sign(),
                  30716748754L,
                  8,
                  3
            );
            System.out.println("Último comprobante: " + ultimo);
        } catch (Exception e) {
           
            e.printStackTrace();
        };


    };
}
}*/