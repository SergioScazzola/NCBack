package com.apiTpte.apiRestTpte.Entidades;


// Item de Factura emitida por la Empresa de Transporte

public class ItfactT {
     private int    idFactura;    
     private int    nroitem;
     private int    idViaje;
     private int    idChofer;
     private String nomChofer;
     private int    idEmptpte;
     private String nomemptpte;
     private String ctg;
     private double tarifa;  // tarifa del tpte = 0.9 * tarifa plena
     private float  cargaton;
     private double impneto;
     private float  tasaiva;
     private double impiva;
     private double totalitem;

     public ItfactT(){
        
     }

     public int getIdFactura() {
         return idFactura;
     }

     public void setIdFactura(int idFactura) {
         this.idFactura = idFactura;
     }
     
       public int getNroitem() {
         return nroitem;
     }

     public void setNroitem(int nroitem) {
         this.nroitem = nroitem;
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

     public String getCtg() {
         return ctg;
     }

     public void setCtg(String ctg) {
         this.ctg = ctg;
     }

     public double getTarifa() {
         return tarifa;
     }

     public void setTarifa(double tarifa) {
         this.tarifa = tarifa;
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

     public double getTotalitem() {
         return totalitem;
     }

     public void setTotalitem(double totalitem) {
         this.totalitem = totalitem;
     }

   
   
     
     
}
