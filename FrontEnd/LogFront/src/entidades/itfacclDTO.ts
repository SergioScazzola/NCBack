export interface itfacclDTO {
    idFactura      : number;    
    nroitem        : number;
    idViaje        : number;
    idChofer       : number;
    nomChofer      : string; 
    origen         : string;
    destino        : string;
    tarifa         : number;  // tarifa del tpte = 0.9 * tarifa plena
    cargaton       : number;
    cantkm         : number;
    ltsgasoil      : number;
    impneto        : number;
    impiva         : number;
    totalitem      : number;
        
}
 
export interface intItFacCl {
    // interfaz para enviar item al componente de edicion de item
    nrofactura   : string;
    nroitem      : number;
    nrocli       : number;
    nomcli       : string;
    accion       : string;
    ditFac       : itfacclDTO
}

