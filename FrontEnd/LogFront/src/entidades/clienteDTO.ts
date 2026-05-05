export interface clienteDTO {
   idCliente      : number;
   nombre         : string;
   domicilio      : string;
   localidad      : string;
   telefono       : string;
   email          : string;
   contacto       : string;
   cuit           : string;
   notas          : string;
   saldoini       : number;
  
}
export interface intCliente {
    nrocliente   : number,  
    nombre       : string;
    accion       : string,   
}

export interface saldoCliDTO {
     idCliente  : number;
     nroSaldo   : number;
     fecha      : Date|null;
     saldo      : number;
}

export interface intSalCli {
     nrocli     : number;
     nrosaldo   : number;
     nomcli     : string;  
     accion     : string;
     fecprmv    : Date|null
}