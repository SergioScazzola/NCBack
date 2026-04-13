package com.apiTpte.apiRestTpte.Servicios;

public class AfipTokenResponse {

    private String token;
    private String sign;

    public AfipTokenResponse(String token, String sign) {
        this.token = token;
        this.sign = sign;
    }

    public String getToken() { return token; }
    public String getSign() { return sign; }
}