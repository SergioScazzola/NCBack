package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

// Entidad de Cobro al Cliente

public class Cobro {
  private  int     idCobro;
   private Date    fecha;
   private int     idCliente;
   private String  nomcliente;
   private String  nrofactura;
   private int     idmpago1;
   private String  mediopago1;
   private String  nrompago1;
   private String  banco1;
   private double  importe1; 
   private int     idmpago2;
   private String  mediopago2;
   private String  nrompago2;
   private String  banco2;
   private double  importe2; 
   private int     idmpago3;
   private String  mediopago3;
   private String  nrompago3;
   private String  banco3;
   private double  importe3; 
   private double  imptotal;
   private String  observaciones;

   public Cobro(){}

   public int getIdCobro() {
     return idCobro;
   }

   public void setIdCobro(int idCobro) {
     this.idCobro = idCobro;
   }

   public Date getFecha() {
     return fecha;
   }

   public void setFecha(Date fecha) {
     this.fecha = fecha;
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

   public String getNrofactura() {
     return nrofactura;
   }

   public void setNrofactura(String nrofactura) {
     this.nrofactura = nrofactura;
   }

   public int getIdmpago1() {
     return idmpago1;
   }

   public void setIdmpago1(int idmpago1) {
     this.idmpago1 = idmpago1;
   }

   public String getMediopago1() {
     return mediopago1;
   }

   public void setMediopago1(String mediopago1) {
     this.mediopago1 = mediopago1;
   }

   public String getNrompago1() {
     return nrompago1;
   }

   public void setNrompago1(String nrompago1) {
     this.nrompago1 = nrompago1;
   }

   public String getBanco1() {
     return banco1;
   }

   public void setBanco1(String banco1) {
     this.banco1 = banco1;
   }

   public double getImporte1() {
     return importe1;
   }

   public void setImporte1(double importe1) {
     this.importe1 = importe1;
   }

   public int getIdmpago2() {
     return idmpago2;
   }

   public void setIdmpago2(int idmpago2) {
     this.idmpago2 = idmpago2;
   }

   public String getMediopago2() {
     return mediopago2;
   }

   public void setMediopago2(String mediopago2) {
     this.mediopago2 = mediopago2;
   }

   public String getNrompago2() {
     return nrompago2;
   }

   public void setNrompago2(String nrompago2) {
     this.nrompago2 = nrompago2;
   }

   public String getBanco2() {
     return banco2;
   }

   public void setBanco2(String banco2) {
     this.banco2 = banco2;
   }

   public double getImporte2() {
     return importe2;
   }

   public void setImporte2(double importe2) {
     this.importe2 = importe2;
   }

   public int getIdmpago3() {
     return idmpago3;
   }

   public void setIdmpago3(int idmpago3) {
     this.idmpago3 = idmpago3;
   }

   public String getMediopago3() {
     return mediopago3;
   }

   public void setMediopago3(String mediopago3) {
     this.mediopago3 = mediopago3;
   }

   public String getNrompago3() {
     return nrompago3;
   }

   public void setNrompago3(String nrompago3) {
     this.nrompago3 = nrompago3;
   }

   public String getBanco3() {
     return banco3;
   }

   public void setBanco3(String banco3) {
     this.banco3 = banco3;
   }

   public double getImporte3() {
     return importe3;
   }

   public void setImporte3(double importe3) {
     this.importe3 = importe3;
   }

   public String getObservaciones() {
     return observaciones;
   }

   public void setObservaciones(String observaciones) {
     this.observaciones = observaciones;
   }

   public double getImptotal() {
     return imptotal;
   }

   public void setImptotal(double imptotal) {
     this.imptotal = imptotal;
   }

 
   
}
