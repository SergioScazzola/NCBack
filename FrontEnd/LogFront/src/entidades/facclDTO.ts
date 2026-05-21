export interface facclDTO {
     // Factura emitida al Cliente por uno o mas viajes
     idFactura      : number;
     nrofactura     : string;
     facndc         : string;  // fac : suma, ndc : resta
     fecha          : Date;
     idCliente      : number;
     nomcliente     : string;
     cantit         : number;        
     impneto        : number; 
     impiva         : number;
     totalfac       : number;
        
}
     
export interface intFacCl {
    idFactura    : number;
    nrofactura   : string;
    accion       : string;   
}

export interface Ticket {
    nroren       : number;
    fechasol     : Date|null;
    fechaexp     : Date|null;
    token        : string;   
    sign         : string    
}


