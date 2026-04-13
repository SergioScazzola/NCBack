
package com.apiTpte.apiRestTpte.Servicios;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Component;

@Component
public class AfipXmlBuilder {

    private static final ZoneId AR_ZONE = ZoneId.of("America/Argentina/Buenos_Aires");
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    public String build(String service) {

        ZonedDateTime now = ZonedDateTime.now(AR_ZONE);
        ZonedDateTime gen = now.minusMinutes(5);   // margen recomendado
        ZonedDateTime exp = now.plusMinutes(10);   // ventana corta (AFIP best practice)

        return """
        <loginTicketRequest version="1.0">
            <header>
                <uniqueId>%s</uniqueId>
                <generationTime>%s</generationTime>
                <expirationTime>%s</expirationTime>
            </header>
            <service>%s</service>
        </loginTicketRequest>
        """.formatted(
                now.toEpochSecond(), // mejor que hashCode
                gen.format(FORMATTER),
                exp.format(FORMATTER),
                service
        );
    }
}