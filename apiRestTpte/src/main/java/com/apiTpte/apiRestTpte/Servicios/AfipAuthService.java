package com.apiTpte.apiRestTpte.Servicios;
// @Service
// Los parámetros de configuracion los toma del archivo : application.yml en la carpeta "resources"

import java.util.Base64;

import org.springframework.stereotype.Service;

import com.apiTpte.apiRestTpte.config.AfipConfig;

@Service
public class AfipAuthService {

    private final AfipConfig config;
    private final AfipXmlBuilder xmlBuilder;
    private final AfipCmsSigner signer;
    private final AfipWsaaClient client;
    private final AfipResponseParser parser;

    public AfipAuthService(
        AfipConfig config,
        AfipXmlBuilder xmlBuilder,
        AfipCmsSigner signer,
        AfipWsaaClient client,
        AfipResponseParser parser
    ) {
        this.config = config;
        this.xmlBuilder = xmlBuilder;
        this.signer = signer;
        this.client = client;
        this.parser = parser;
    }

    public AfipCredentials autenticar(String service) throws Exception {

        String xml = xmlBuilder.build(service);

        byte[] cmsBytes = signer.sign(
            config.getKeystore(),
            config.getPassword(),
            config.getKsigner(),
            xml
        );

        String cmsBase64 = Base64.getEncoder().encodeToString(cmsBytes);
        boolean isprod = config.getIsProduction() == 1;
        String response = client.call(cmsBase64, isprod);

        return parser.parse(response);
    }
}