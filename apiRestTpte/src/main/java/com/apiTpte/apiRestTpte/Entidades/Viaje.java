package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

public class Viaje {
    private int      idViaje;
    private Date     fecha;
    private int      idChofer;
    private String   nomchofer;
    private int      idCliente;
    private String   nomcliente;   
    private int      idCamion;
    private String   descrip;
    private String   origen;
    private String   destino;
    private String   ctg;
    private float    cantkm;
    private float    cargaton;
    private double   tarifap;
    private float    ltsgasoil;
    private double   impneto;
    private double   impviaje;

    
   public double getImpneto() {
    return impneto;
}

public void setImpneto(double impneto) {
    this.impneto = impneto;
}

 private int      facturado;

    public Viaje(){

    }

    public int getIdViaje() {
        return idViaje;
    }

    public void setIdViaje(int idViaje) {
        this.idViaje = idViaje;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public int getIdChofer() {
        return idChofer;
    }

    public void setIdChofer(int idChofer) {
        this.idChofer = idChofer;
    }

    public String getNomchofer() {
        return nomchofer;
    }

    public void setNomchofer(String nomchofer) {
        this.nomchofer = nomchofer;
    }

    public int getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }

    public String getNomcliente() {
        return nomcliente;
    }

    public void setNomcliente(String nomcliente) {
        this.nomcliente = nomcliente;
    }

    public int getIdCamion() {
        return idCamion;
    }

    public void setIdCamion(int idCamion) {
        this.idCamion = idCamion;
    }
      
    public String getOrigen() {
        return origen;
    }

    public void setOrigen(String origen) {
        this.origen = origen;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public String getCtg() {
        return ctg;
    }

    public void setCtg(String ctg) {
        this.ctg = ctg;
    }
  

    public float getCantkm() {
        return cantkm;
    }

    public void setCantkm(float cantkm) {
        this.cantkm = cantkm;
    }

    public float getCargaton() {
        return cargaton;
    }

    public void setCargaton(float cargaton) {
        this.cargaton = cargaton;
    }

    public double getTarifap() {
        return tarifap;
    }

    public void setTarifap(double tarifap) {
        this.tarifap = tarifap;
    }

    public float getLtsgasoil() {
        return ltsgasoil;
    }

    public void setLtsgasoil(float ltsgasoil) {
        this.ltsgasoil = ltsgasoil;
    }

    public double getImpviaje() {
        return impviaje;
    }

    public void setImpviaje(double impviaje) {
        this.impviaje = impviaje;
    }

    public String getDescrip() {
        return descrip;
    }

    public void setDescrip(String descrip) {
        this.descrip = descrip;
    }

    public int getFacturado() {
        return facturado;
    }

    public void setFacturado(int facturado) {
        this.facturado = facturado;
    }
   

 
    
}
