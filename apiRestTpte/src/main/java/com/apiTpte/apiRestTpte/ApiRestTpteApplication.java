package com.apiTpte.apiRestTpte;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.apiTpte.apiRestTpte.Servicios.AfipAuthService;
import com.apiTpte.apiRestTpte.Servicios.AfipTokenResponse;

import io.github.cdimascio.dotenv.Dotenv;
@SpringBootApplication(scanBasePackages = {
    "com.apiRestTpte", 
    "com.apiTpte.apiRestTpte"
})

public class ApiRestTpteApplication {

	public static void main(String[] args) {		
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(e ->
        System.setProperty(e.getKey(), e.getValue())
    );

		SpringApplication.run(ApiRestTpteApplication.class, args);
	}

    /*@Bean
    public CommandLineRunner testAfipAuth(AfipAuthService service) {
        return args -> service.autenticar("wsfe");
    };*/

}


