package com.apiTpte.apiRestTpte.Entidades;

import java.time.LocalDateTime;


public class Ticket {
     private int              nroreg;
     private String           fechasol;
     private String           fechaexp;
     private String           token;
     private String           sign;


     public Ticket(){}


     public int getNroreg() {
          return nroreg;
     }


     public void setNroreg(int nroreg) {
          this.nroreg = nroreg;
     }


     public String getFechasol() {
          return fechasol;
     }


     public void setFechasol(String fechasol) {
          this.fechasol = fechasol;
     }


     public String getFechaexp() {
          return fechaexp;
     }


     public void setFechaexp(String fechaexp) {
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
