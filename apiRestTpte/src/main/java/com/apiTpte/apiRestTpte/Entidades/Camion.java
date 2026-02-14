package com.apiTpte.apiRestTpte.Entidades;

public class Camion {
     private int    idCamion;
     private String domChasis;   
     private String domAcoplado;
     private String marca;
     private String modelo;
     private String anio;
     private int    idEmptpte;
     private String emptpte;

     public Camion(){}

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

     public String getMarca() {
         return marca;
     }

     public void setMarca(String marca) {
         this.marca = marca;
     }

     public String getModelo() {
         return modelo;
     }

     public void setModelo(String modelo) {
         this.modelo = modelo;
     }

     public String getAnio() {
         return anio;
     }

     public void setAnio(String anio) {
         this.anio = anio;
     }

     public String getEmptpte() {
         return emptpte;
     }

     public void setEmptpte(String empresa) {
         this.emptpte = empresa;
     }

     public int getIdEmpresa() {
         return idEmptpte;
     }

     public void setIdEmpresa(int idEmpresa) {
         this.idEmptpte = idEmpresa;
     }

     public String getDomAcoplado() {
         return domAcoplado;
     }

     public void setDomAcoplado(String domAcoplado) {
         this.domAcoplado = domAcoplado;
     };

     
}
