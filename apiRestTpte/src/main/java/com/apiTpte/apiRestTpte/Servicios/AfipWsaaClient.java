package com.apiTpte.apiRestTpte.Servicios;

import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AfipWsaaClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public String call(String cms, boolean production) {

        String url = production
                ? "https://wsaa.afip.gov.ar/ws/services/LoginCms"
                : "https://wsaahomo.afip.gov.ar/ws/services/LoginCms";

        
        String body =
        """
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
            <soapenv:Body>
                <loginCms>
                    <in0>%s</in0>
                </loginCms>
            </soapenv:Body>
        </soapenv:Envelope>
        """.formatted(cms);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_XML);
        headers.add("SOAPAction", "");

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        return restTemplate.postForObject(url, entity, String.class);
    }
}
