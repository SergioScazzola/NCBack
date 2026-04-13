package com.apiTpte.apiRestTpte.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "afip.wsaa")
public class AfipConfig {

    private String endpoint;
    private String service;
    private String keystore;
    private String password;
    private String dstDn;
    private int    ticketTime;
    private String ksigner;
    private String endfev;
    private int    isProduction;

    public String getEndpoint() {
        return endpoint;
    }
    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }
    public String getService() {
        return service;
    }
    public void setService(String service) {
        this.service = service;
    }
    public String getKeystore() {
        return keystore;
    }
    public void setKeystore(String keystore) {
        this.keystore = keystore;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getDstDn() {
        return dstDn;
    }
    public void setDstDn(String dstDn) {
        this.dstDn = dstDn;
    }
    public int getTicketTime() {
        return ticketTime;
    }
    public void setTicketTime(int ticketTime) {
        this.ticketTime = ticketTime;
    }
    public String getKsigner() {
        return ksigner;
    }
    public void setKsigner(String ksigner) {
        this.ksigner = ksigner;
    }
    public String getEndfev() {
        return endfev;
    }
    public void setEndfev(String endfev) {
        this.endfev = endfev;
    }
    public int getIsProduction() {
        return isProduction;
    }
    public void setIsProduction(int isproduction) {
        this.isProduction = isproduction;
    }

    // getters y setters
}

    // getters
