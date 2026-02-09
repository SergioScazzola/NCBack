package com.apiTpte.apiRestTpte.Entidades;

public class Cliente {
   private int idCliente;
   private String nombre;
   private String telefono;
   private String contacto;
   private String cuit;
   private String notas; 
   private double saldoini;

   public Cliente(){

   }
   public Cliente(String nom,String telef, String cuitt){
    this.nombre = nom;
    this.telefono = telef;
    this.cuit = cuitt;
   }
   
public String getNombre() {
    return nombre;
}
public void setNombre(String nombre) {
    this.nombre = nombre;
}
public String getTelefono() {
    return telefono;
}
public void setTelefono(String telefono) {
    this.telefono = telefono;
}
public String getContacto() {
    return contacto;
}
public void setContacto(String contacto) {
    this.contacto = contacto;
}
public String getCuit() {
    return cuit;
}
public void setCuit(String cuit) {
    this.cuit = cuit;
}
public String getNotas() {
    return notas;
}
public void setNotas(String notas) {
    this.notas = notas;
}
public int getIdCliente() {
    return idCliente;
}
public void setIdCliente(int idCliente) {
    this.idCliente = idCliente;
}
public double getSaldoini() {
    return saldoini;
}
public void setSaldoini(double saldoini) {
    this.saldoini = saldoini;
}
}
