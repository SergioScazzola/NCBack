package com.apiTpte.apiRestTpte.Entidades;

import java.util.Date;

public class Ticket {
     private int     nroreg;
     private Date    fechasol;
     private Date    fechaexp;
     private String  token;
     private String  sign;


     public Ticket(){}


     public int getNroreg() {
          return nroreg;
     }


     public void setNroreg(int nroreg) {
          this.nroreg = nroreg;
     }


     public Date getFechasol() {
          return fechasol;
     }


     public void setFechasol(Date fechasol) {
          this.fechasol = fechasol;
     }


     public Date getFechaexp() {
          return fechaexp;
     }


     public void setFechaexp(Date fechaexp) {
          this.fechaexp = fechaexp;
     }


     public String getToken() {
          return token;
     }


     public void setToken(String token) {
          this.token = token;
     }


     public String getSign() {
          return sign;
     }


     public void setSign(String sign) {
          this.sign = sign;
     };


   
}
