package com.apiTpte.apiRestTpte.Entidades;


// Item de Factura emitida por la Empresa de Transporte

public class ItfactT {
     private int    idFactura;    
     private int    nroitem;
     private int    idViaje;
     private int    idChofer;
     private String nomChofer; 
     private String origen;
     private String destino;     
     private double tarifa;  // tarifa del tpte = 0.9 * tarifa plena
     private float  cargaton;
     private float  cantkm;
     private float  ltsgasoil;
     private double impneto;    
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

     
     public String getOrigen() {
         return origen;
     }
     
     public String getDestino() {
        return destino;
    }

     public void setDestino(String destino) {
         this.destino = destino;
     }
     public void setOrigen(String orig) {
         this.origen = orig;
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

        public float getCantkm() {
            return cantkm;
        }

        public void setCantkm(float cantkm) {
            this.cantkm = cantkm;
        }

        public float getLtsgasoil() {
            return ltsgasoil;
        }

        public void setLtsgasoil(float ltsgasoil) {
            this.ltsgasoil = ltsgasoil;
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

     public double getTotalitem() {
         return totalitem;
     }

     public void setTotalitem(double totalitem) {
         this.totalitem = totalitem;
     }

   
   
     
     
}
