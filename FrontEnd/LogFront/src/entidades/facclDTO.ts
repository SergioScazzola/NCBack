export interface facclDTO {
     // Factura emitida al Cliente por uno o mas viajes
     idFactura      : number;
     nrofactura     : string;
     facndc         : string;  // fac : suma, ndc : resta
     fecha          : Date;
     idCliente      : number;
     nomCliente     : string;
     cantit         : number;        
     impneto        : number; 
     impiva         : number;
     totalfac       : number;
        
}
     
export interface intFacCl {
    idFactura    : number,  
    nrofactura   : string;
    accion       : string,
   
}

