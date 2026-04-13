package com.apiTpte.apiRestTpte.Servicios;

import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AfipWsfeClient {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String WSFE_URL = 
        "https://servicios1.afip.gov.ar/wsfev1/service.asmx";
        // HOMO:
        // "https://wswhomo.afip.gov.ar/wsfev1/service.asmx";

    public int getUltimoComprobante(
            String token,
            String sign,
            long cuit,
            int ptoVta,
            int cbteTipo
    ) {

        String soap = """
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                          xmlns:ar="http://ar.gov.afip.dif.FEV1/">
          <soapenv:Header/>
          <soapenv:Body>
            <ar:FECompUltimoAutorizado>
              <ar:Auth>
                <ar:Token>%s</ar:Token>
                <ar:Sign>%s</ar:Sign>
                <ar:Cuit>%d</ar:Cuit>
              </ar:Auth>
              <ar:PtoVta>%d</ar:PtoVta>
              <ar:CbteTipo>%d</ar:CbteTipo>
            </ar:FECompUltimoAutorizado>
          </soapenv:Body>
        </soapenv:Envelope>
        """.formatted(token, sign, cuit, ptoVta, cbteTipo);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_XML);
        headers.add("SOAPAction", "http://ar.gov.afip.dif.FEV1/FECompUltimoAutorizado");

        HttpEntity<String> entity = new HttpEntity<>(soap, headers);

        String response = restTemplate.postForObject(
                WSFE_URL,
                entity,
                String.class
        );

        return parseUltimoComprobante(response);
    }

    private int parseUltimoComprobante(String xml) {

    String tagStart = "<CbteNro>";
    String tagEnd = "</CbteNro>";

    int i = xml.indexOf(tagStart);
    int j = xml.indexOf(tagEnd);

    if (i == -1 || j == -1) {
        throw new RuntimeException("No se encontró CbteNro en la respuesta");
    }

    String value = xml.substring(i + tagStart.length(), j);

    return Integer.parseInt(value);
}
}
