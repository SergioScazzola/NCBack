package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

public class Gasto {
     private int    idGasto;
     private Date   fecha;
     private int    idViaje;
     private String compGasto;   
     private String provGasto;
     private float  cantgasto;
     private String unidGasto;
     private double preGasto;
     private String descGasto;
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

     public float getCantgasto() {
         return cantgasto;
     }

     public void setCantgasto(float cantgasto) {
         this.cantgasto = cantgasto;
     }

     public String getUnidGasto() {
         return unidGasto;
     }

     public void setUnidGasto(String unidGasto) {
         this.unidGasto = unidGasto;
     }

     public double getPreGasto() {
         return preGasto;
     }

     public void setPreGasto(double preGasto) {
         this.preGasto = preGasto;
     }

     public String getDescGasto() {
         return descGasto;
     }

     public void setDescGasto(String descGasto) {
         this.descGasto = descGasto;
     }

          
}
