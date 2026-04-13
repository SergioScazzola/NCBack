export interface pagoDTO {
      idPago      : number,
      fecha       : Date,
      idChofer    : number,
      nomchofer   : string,
      nrofactura  : string,
      idmpago1    : number,
      mediopago1  : string,
      nrompago1   : string,
      banco1      : string,
      importe1    : number,
      idmpago2    : number,
      mediopago2  : string,
      nrompago2   : string,
      banco2      : string,
      importe2    : number,
      idmpago3    : number,
      mediopago3  : string,
      nrompago3   : string,
      banco3      : string,
      importe3    : number,
      imptotal    : number,
      observaciones : string
}

export interface intPago {
    idPago   : number,  
    nombre    : string;
    accion    : string,
   
}
