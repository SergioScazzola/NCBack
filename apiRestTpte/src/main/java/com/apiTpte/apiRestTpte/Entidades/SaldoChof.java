package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

public class SaldoChof {
 private int  idChofer;
 private int  nroSaldo;
 private Date fecha;
 private double saldo;

public  SaldoChof() {}

    public int getIdChofer() {
        return idChofer;
    }
    public void setIdChofer(int idChofer) {
        this.idChofer = idChofer;
    }
    public int getNroSaldo() {
        return nroSaldo;
    }
    public void setNroSaldo(int nroSaldo) {
        this.nroSaldo = nroSaldo;
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
