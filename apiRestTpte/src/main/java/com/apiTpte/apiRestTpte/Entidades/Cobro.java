package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

// Entidad de Cobro al Cliente

public class Cobro {
  private  int     idCobro;
   private Date    fecha;
   private int     idCliente;
   private String  nomcliente;
   private String  nrofactura;
   private int     idmpago;
   private String  mediopago;
   private String  nrompago;
   private String  banco;
   private double  importe; 
   private String  observaciones;

   public Cobro(){}

   public int getIdCliente() {
    return idCliente;
}

   public String getNrofactura() {
      return nrofactura;
   }

   public void setNrofactura(String nrofactura) {
      this.nrofactura = nrofactura;
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

  public String getNrompago() {
    return nrompago;
  }

  public void setNrompago(String nrompago) {
    this.nrompago = nrompago;
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
   
}
