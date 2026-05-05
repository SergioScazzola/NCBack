package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

public class SaldoCli {
 private int  idCliente;
 private int  nrosaldo;
 private Date fecha;
 private double saldo;

public  SaldoCli() {}

    public int getIdCliente() {
        return idCliente;
    }
    public void setIdCliente(int idcli) {
        this.idCliente = idcli;
    }
    public int getNroSaldo() {
        if (nrosaldo==0){
            return nrosaldo+1;
        } else {
            return nrosaldo;
        }
        
    }
    public void setNroSaldo(int nroSaldo) {
        this.nrosaldo = nroSaldo;
    }
    public Date getFecha() {
        return fecha;
    }
    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }
    public double getSaldo() {
        return saldo;
    }
    public void setSaldo(double saldo) {
        this.saldo = saldo;
     }

}
