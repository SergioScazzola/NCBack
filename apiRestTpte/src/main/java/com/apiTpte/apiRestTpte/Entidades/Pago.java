package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

// Entidad de Pago efectuado a la empresa de Transporte

public class Pago {
    private int     idPago;
    private Date    fecha;
    private int     idChofer;  
    private String  nomchofer;        
    private int     idmpago;
    private String  mediopago;
    private String  nrompago;
    private String  banco;
    private double  importe;
    private String  observaciones;
  
  public Pago(){}

  public int getidPago() {
    return idPago;
  }

  public void setidPago(int nrop) {
    this.idPago = nrop;
  }

 

  public Date getFecha() {
    return fecha;
  }

  public void setFecha(Date fecha) {
    this.fecha = fecha;
  }


    public int getIdChofer() {
        return idChofer;
    }

    public void setIdChofer(int idChofer) {
        this.idChofer = idChofer;
    }

    public String getNomchofer() {
        return nomchofer;
    }

    public void setNomchofer(String nomchofer) {
        this.nomchofer = nomchofer;
    }
  public int getIdmpago() {
    return idmpago;
  }

  public void setIdmpago(int idmpago) {
    this.idmpago = idmpago;
  }

  public String getMediopago() {
    return mediopago;
  }

  public void setMediopago(String mediopago) {
    this.mediopago = mediopago;
  }

  public String getBanco() {
    return banco;
  }

  public void setBanco(String banco) {
    this.banco = banco;
  }

  public double getImporte() {
    return importe;
  }

  public void setImporte(double importe) {
    this.importe = importe;
  }

 

  public String getObservaciones() {
    return observaciones;
  }

  public void setObservaciones(String observaciones) {
    this.observaciones = observaciones;
  }

  public String getNrompago() {
    return nrompago;
  }

  public void setNrompago(String nrompago) {
    this.nrompago = nrompago;
  }

}
