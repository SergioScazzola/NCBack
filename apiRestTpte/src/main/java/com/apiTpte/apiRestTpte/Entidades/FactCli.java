package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;
// Factura que NC Logistica le emite a un Cliente por 1 o mas viajes
public class FactCli {
     private int    idFactura;
     private String nrofactura;
     private String facndc; // fac : suma, ndc : resta
     private Date   fecha;   
     private int    cantit;
     private int    idCliente;
     private String nomcliente;
     private double impneto;
     private float  tasaiva;
     private double impiva;
     private double totalfac;

     public FactCli(){
        
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

     public int getCantit() {
         return cantit;
     }

     public void setCantit(int cantit) {
         this.cantit = cantit;
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
