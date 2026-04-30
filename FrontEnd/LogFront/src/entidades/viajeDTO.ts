export interface viajeDTO {
    idViaje        : number;
    fecha          : Date|null;
    idChofer       : number;
    nomchofer      : string;
    idCliente      : number;
    nomcliente     : string;   
    idCamion       : number;    
    descrip        : string;
    origen         : string;
    destino        : string;
    ctg            : string;
    cantkm         : number;
    cargaton       : number;
    tarifap        : number;
    ltsgasoil      : number;
    impneto        : number;
    impviaje       : number;
    fact           : number;
    facc           : number;
}
export interface intViaje {
    nroviaje   : number,  
    descrip    : string;
    accion     : string,
   
}