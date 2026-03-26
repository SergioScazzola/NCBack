package com.apiTpte.apiRestTpte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
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

}
