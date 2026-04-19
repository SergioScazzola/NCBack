package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

public class Gasto {
     private int    idGasto;
     private Date   fecha;
     private int    idChofer;
     private String nomchofer;
     private int    idViaje;
     private String compgasto;   
     private String provgasto;
     private String tipogasto;
     private float  cantgasto;
     private String unidgasto;
     private double pregasto;
     private String descgasto;
     private double impgasto;

     public Gasto(){}

     public int getIdGasto() {
         return idGasto;
     }

     public void setIdGasto(int idGasto) {
         this.idGasto = idGasto;
     }

     public Date getFecha() {
         return fecha;
     }

     public void setFecha(Date fecha) {
         this.fecha = fecha;
     }

     public int getIdViaje() {
         return idViaje;
     }

     public void setIdViaje(int idViaje) {
         this.idViaje = idViaje;
     }

     public String getCompgasto() {
         return compgasto;
     }

     public void setCompgasto(String compGasto) {
         this.compgasto = compGasto;
     }

     public String getProvgasto() {
         return provgasto;
     }

     public void setProvgasto(String provGasto) {
         this.provgasto = provGasto;
     }

     public double getImpgasto() {
         return impgasto;
     }

     public void setImpgasto(double impgasto) {
         this.impgasto = impgasto;
     }

     public float getCantgasto() {
         return cantgasto;
     }

     public void setCantgasto(float cantgasto) {
         this.cantgasto = cantgasto;
     }

     public String getUnidgasto() {
            return unidgasto;
     }
     public void setUnidgasto(String unidgasto) {
        this.unidgasto = unidgasto;
     }


     public double getPregasto() {
         return pregasto;
     }

     public void setPregasto(double preGasto) {
         this.pregasto = preGasto;
     }

     public String getDescgasto() {
         return descgasto;
     }

     public void setDescgasto(String descGasto) {
         this.descgasto = descGasto;
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

    public String getTipogasto() {
            return tipogasto;
    }

    public void setTipogasto(String tipogasto) {
        this.tipogasto = tipogasto;
    }

          
}
