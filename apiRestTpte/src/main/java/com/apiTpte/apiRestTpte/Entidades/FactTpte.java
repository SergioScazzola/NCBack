package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

public class FactTpte {
     private int    idFactura;
     private String nrofactura;
     private Date   fecha;
     private int    idViaje;
     private int    idChofer;
     private String nomChofer;
     private int    idEmptpte;
     private String nomemptpte;
     private double tarifap;
     private float  cargaton;
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
     public int getIdViaje() {
         return idViaje;
     }
     public void setIdViaje(int idViaje) {
         this.idViaje = idViaje;
     }
     public int getIdChofer() {
         return idChofer;
     }
     public void setIdChofer(int idChofer) {
         this.idChofer = idChofer;
     }
     public String getNomChofer() {
         return nomChofer;
     }
     public void setNomChofer(String nomChofer) {
         this.nomChofer = nomChofer;
     }
     public int getIdEmptpte() {
         return idEmptpte;
     }
     public void setIdEmptpte(int idEmptpte) {
         this.idEmptpte = idEmptpte;
     }
     public String getNomemptpte() {
         return nomemptpte;
     }
     public void setNomemptpte(String nomemptpte) {
         this.nomemptpte = nomemptpte;
     }
     public double getTarifap() {
         return tarifap;
     }
     public void setTarifap(double tarifap) {
         this.tarifap = tarifap;
     }
     public float getCargaton() {
         return cargaton;
     }
     public void setCargaton(float cargaton) {
         this.cargaton = cargaton;
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
     
     
}
