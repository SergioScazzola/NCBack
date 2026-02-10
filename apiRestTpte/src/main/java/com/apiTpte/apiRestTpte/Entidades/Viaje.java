package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

public class Viaje {
    private int      idViaje;
    private Date     fecha;
    private int      idEmpTpte;
    private String   nometpte;
    private int      idChofer;
    private int      idCliente;
    private String   nomcliente;
    private String   nomchofer;
    private String   cuitchofer;
    private int      idCamion;
    private String   domChasis;
    private String   domAcop;
    private String   origen;
    private String   destino;
    private String   ctg;
    private String   titctg;
    private float    cantkm;
    private float    cargaton;
    private double   tarifap;
    private float    ltsgasoil;
    private double   impviaje;

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

    public int getIdEmpTpte() {
        return idEmpTpte;
    }

    public void setIdEmpTpte(int idEmpTpte) {
        this.idEmpTpte = idEmpTpte;
    }

    public int getIdChofer() {
        return idChofer;
    }

    public void setIdChofer(int idChofer) {
        this.idChofer = idChofer;
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

    public String getNomchofer() {
        return nomchofer;
    }

    public void setNomchofer(String nomchofer) {
        this.nomchofer = nomchofer;
    }

    public String getCuitchofer() {
        return cuitchofer;
    }

    public void setCuitchofer(String cuitchofer) {
        this.cuitchofer = cuitchofer;
    }

    public int getIdCamion() {
        return idCamion;
    }

    public void setIdCamion(int idCamion) {
        this.idCamion = idCamion;
    }

    public String getDomChasis() {
        return domChasis;
    }

    public void setDomChasis(String domChasis) {
        this.domChasis = domChasis;
    }

    public String getDomAcop() {
        return domAcop;
    }

    public void setDomAcop(String domAcop) {
        this.domAcop = domAcop;
    }

    public String getCtg() {
        return ctg;
    }

    public void setCtg(String ctg) {
        this.ctg = ctg;
    }

    public String getTitctg() {
        return titctg;
    }

    public void setTitctg(String titctg) {
        this.titctg = titctg;
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
    public String getNometpte() {
        return nometpte;
    }
    public void setNometpte(String nometpte) {
        this.nometpte = nometpte;
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

 
    
}
