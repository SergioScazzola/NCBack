package com.apiTpte.apiRestTpte.Servicios;



public record AfipCredentials(
        String token,
        String sign,
        String generationTime,
        String expirationTime
) {}