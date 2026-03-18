export interface itfactpDTO {
    idFactura      : number;    
    nroitem        : number;
    idViaje        : number;
    idChofer       : number;
    nomChofer      : string; 
    origen         : string;
    destino        : string;
    tarifa         : number;  // tarifa del tpte = 0.9 * tarifa plena
    cargaton       : number;
    impneto        : number;
    tasaiva        : number;
    impiva         : number;
    totalitem      : number;
        
}

export interface intItFacTp {
    idFactura    : number;
    nroitem      : number;
    nomchof      : string;
    accion       : string;
    ditFac       : itfactpDTO
}

