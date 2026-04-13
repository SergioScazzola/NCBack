package com.apiTpte.apiRestTpte.Servicios;

import org.springframework.stereotype.Service;

@Service
public class AfipResponseParser {

   public AfipCredentials parse(String soapXml) {

    String inner = soapXml
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", "\"");

    String token = extract(inner, "<token>", "</token>");
    String sign = extract(inner, "<sign>", "</sign>");
    String generationTime = extract(inner, "<generationTime>", "</generationTime>");
    String expirationTime = extract(inner, "<expirationTime>", "</expirationTime>");

    if (token == null || sign == null) {
        throw new RuntimeException("No se pudo parsear token/sign");
    }

    return new AfipCredentials(token, sign, generationTime, expirationTime);
}

private String extract(String xml, String start, String end) {
    int i = xml.indexOf(start);
    int j = xml.indexOf(end);

    if (i == -1 || j == -1) return null;

    return xml.substring(i + start.length(), j);
}
}