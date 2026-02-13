package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

public class Gasto {
     private int    idGasto;
     private Date   fecha;
     private int    idViaje;
     private String compGasto;   
     private String provGasto;
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

     public String getCompGasto() {
         return compGasto;
     }

     public void setCompGasto(String compGasto) {
         this.compGasto = compGasto;
     }

     public String getProvGasto() {
         return provGasto;
     }

     public void setProvGasto(String provGasto) {
         this.provGasto = provGasto;
     }

     public double getImpgasto() {
         return impgasto;
     }

     public void setImpgasto(double impgasto) {
         this.impgasto = impgasto;
     }

          
}
