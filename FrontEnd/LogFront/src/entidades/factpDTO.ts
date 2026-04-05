export interface factpDTO {
     // Factura emitida por el chofer por uno omas viajes
     idFactura      : number;
     nrofactura     : string;
     facndc         : string;  // fac : suma, ndc : resta
     fecha          : Date;
     idChofer       : number;
     nomchofer      : string;
     cantit         : number;        
     impneto        : number; 
     impiva         : number;
     totalfac       : number;
        
}

export interface intFacTp {
    idFactura    : number,  
    nrofactura   : string;
    accion       : string,
   
}

