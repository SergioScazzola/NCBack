package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;
// Factura emitida por una Empresa de Transporte a NC Logistica
public class FactTpte {
     private int    idFactura;
     private String nrofactura;
     private String facndc;
     private Date   fecha;
     private int    idEmptpte;
     private String nomempresa;
     private int    cantit;
        
     private double impneto;
     private float  tasaiva;
     private double impiva;
     private double totalfac;

     public FactTpte(){
        
     }

     public int getIdFactura() {
         return idFactura;
     }

     public void setIdFactura(int idFactura) {
         this.idFactura = idFactura;
     }

     public String getNrofactura() {
         return nrofactura;
     }

     public void setNrofactura(String nrofactura) {
         this.nrofactura = nrofactura;
     }

     public Date getFecha() {
         return fecha;
     }

     public void setFecha(Date fecha) {
         this.fecha = fecha;
     }

     public int getIdEmptpte() {
         return idEmptpte;
     }

     public void setIdEmptpte(int idEmptpte) {
         this.idEmptpte = idEmptpte;
     }

     public String getNomempresa() {
         return nomempresa;
     }

     public void setNomempresa(String nomempresa) {
         this.nomempresa = nomempresa;
     }

     public int getCantit() {
         return cantit;
     }

     public void setCantit(int cantit) {
         this.cantit = cantit;
     }

     public double getImpneto() {
         return impneto;
     }

     public void setImpneto(double impneto) {
         this.impneto = impneto;
     }

     public float getTasaiva() {
         return tasaiva;
     }

     public void setTasaiva(float tasaiva) {
         this.tasaiva = tasaiva;
     }

     public double getImpiva() {
         return impiva;
     }

     public void setImpiva(double impiva) {
         this.impiva = impiva;
     }

     public double getTotalfac() {
         return totalfac;
     }

     public void setTotalfac(double totalfac) {
         this.totalfac = totalfac;
     }

     public String getFacndc() {
         return facndc;
     }

     public void setFacndc(String facndc) {
         this.facndc = facndc;
     }
      
     
}
