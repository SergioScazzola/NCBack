export interface pagoDTO {
      idPago      : number,
      fecha       : Date,
      idChofer    : number,     
      idFactura   : number,
      idmpago1    : number,     
      nrompago1   : string,
      banco1      : string,
      importe1    : number,
      idmpago2    : number,    
      nrompago2   : string,
      banco2      : string,
      importe2    : number,
      idmpago3    : number,     
      nrompago3   : string,
      banco3      : string,
      importe3    : number,
      imptotal    : number,
      observ      : string
}

export interface intPago {
    idPago   : number,  
    idChofer : number,
    nombre    : string;
    accion    : string,
   
}
