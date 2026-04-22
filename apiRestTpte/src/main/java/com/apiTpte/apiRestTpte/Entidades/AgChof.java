package com.apiTpte.apiRestTpte.Entidades;
// Entidad utilizada para devolver informe de facturas agrupado por chofer
public class AgChof {
     private int    idChofer;
     private int    cuenta;        
     private String nomchofer;
     private double impneto;   
     private double impiva;
     private double totalfac;
     
/*  String selec = "SELECT idChofer,COUNT(idChofer) AS cuenta ,nomchofer,"+
                             "SUM(impneto) AS impneto, SUM(impiva) AS impiva, SUM(totalfac) AS totalfac "+
                      "FROM facstpte WHERE fecha BETWEEN ? AND ? GROUP BY idChofer,nomchofer ORDER BY nomchofer ASC"; */
     public AgChof(){}

     public int getIdChofer() {
         return idChofer;
     }

     public void setIdChofer(int idChofer) {
         this.idChofer = idChofer;
     }

     public int getCuenta() {
         return cuenta;
     }

     public void setCuenta(int cuenta) {
         this.cuenta = cuenta;
     }

     public String getNomchofer() {
         return nomchofer;
     }

     public void setNomchofer(String nomchofer) {
         this.nomchofer = nomchofer;
     }

     public double getImpneto() {
         return impneto;
     }

     public void setImpneto(double impneto) {
         this.impneto = impneto;
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
