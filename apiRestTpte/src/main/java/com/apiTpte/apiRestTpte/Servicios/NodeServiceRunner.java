package com.apiTpte.apiRestTpte.Servicios;


import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class NodeServiceRunner implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        ProcessBuilder processBuilder = new ProcessBuilder("node","C:\\ProyectoTranspte\\Microservicios\\Afip-Service\\src\\app.js");      
        // Redirige la salida de Node a la consola de Spring Boot
        processBuilder.inheritIO(); 
        
        try {
            processBuilder.start();
            System.out.println("Servicio Node.js iniciado correctamente.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}


