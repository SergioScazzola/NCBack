export interface viajeDTO {
    idViaje        : number;
    fecha          : Date;
    idChofer       : number;
    nomchofer      : string;
    idCliente      : number;
    nomcliente     : string;   
    idCamion       : number;    
    domChasis      : string;
    domAcop        : string;
    origen         : string;
    destino        : string;
    ctg            : string;
    cantkm         : number;
    cargaton       : number;
    tarifap        : number;
    ltsgasoil      : number;
    impviaje       : number;
}
export interface intViaje {
    nroviaje   : number,  
    descrip    : string;
    accion     : string,
   
}