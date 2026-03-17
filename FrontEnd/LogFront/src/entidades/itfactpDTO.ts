export interface itfactpDTO {
    idFactura      : number;    
    nroitem        : number;
    idViaje        : number;
    idChofer       : number;
    nomChofer      : number; 
    ctg            : string;
    tarifa         : number;  // tarifa del tpte = 0.9 * tarifa plena
    cargaton       : number;
    impneto        : number;
    tasaiva        : number;
    impiva         : number;
    totalitem      : number;
        
}

export interface intItFacTp {
    idFactura    : number,  
    nroitem      : number;
    accion       : string,
   
}

