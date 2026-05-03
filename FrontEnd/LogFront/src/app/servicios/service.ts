import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConfigService } from './config.service';
import { choferDTO } from '../../entidades/choferDTO';
import { empTpteDTO } from '../../entidades/empTpteDTO';
import { camionDTO } from '../../entidades/camionDTO';
import { marcaDTO, MPagoDTO, TGastoDTO, UnidadDTO } from '../../entidades/marcaDTO';
import { clienteDTO } from '../../entidades/clienteDTO';
import { viajeDTO } from '../../entidades/viajeDTO';
import { AgChof, factpDTO} from '../../entidades/factpDTO';
import { facclDTO } from '../../entidades/facclDTO';
import { itfactpDTO } from '../../entidades/itfactpDTO';
import { itfacclDTO } from '../../entidades/itfacclDTO';
import { saldoChofDTO } from '../../entidades/saldoChofDTO';
import { gastoDTO } from '../../entidades/gastoDTO';
import { pagoDTO } from '../../entidades/pagoDTO';
import { pagocliDTO } from '../../entidades/pagocliDTO';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  usuario?: string;
  subscri?: Subscription;
  private apiUrl: string;
  private tasaiva: number = 21;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }

  public getTasaIVA() {
    return this.tasaiva;
  }
  public getChoferes() {
    return this.http.get<choferDTO[]>(this.apiUrl + `chofer/choferes`);
  }

  public getCantChoferes() {
    return this.http.get<number>(this.apiUrl + `chofer/max`);
  }

  public leerChofer(nrochof: number) {
    return this.http.get<choferDTO>(
      this.apiUrl + `chofer/chofer?id=` + nrochof
    );
  }
  
  public grabarChofer(chofer: choferDTO) {
    return this.http.post<choferDTO>(
      this.apiUrl + `chofer/chofer/nuevo`,
      chofer
    );
  }

  public updateChofer(nrochofer : number, chofer: choferDTO) {
    return this.http.put<choferDTO>(
      environment.apiUrl + `chofer/chofer/actualizar?id=` + nrochofer,
      chofer
    );
  }

  public elimChofer(nrochofer: number) {
    return this.http.delete(
      environment.apiUrl + `chofer/chofer?id=` + nrochofer
    );
  }
  
 public getSaldosChofer(nrochof : number) {
  return this.http.get<saldoChofDTO[]>(this.apiUrl + `chofer/saldosxchof?nrochof=`+nrochof);
  }

  public updateSaldoInicial(saldo: saldoChofDTO) {
    return this.http.put<choferDTO>(
      environment.apiUrl + `chofer/actsaldoini`,saldo);
  }

 public AgregarSaldoChofer(saldoc : saldoChofDTO) {
    return this.http.post<saldoChofDTO>(this.apiUrl + `chofer/saldo/nuevo`,saldoc);
  }
  
  public leerSaldoChofer(nrochof: number, nrosaldo: number) {
    return this.http.get<choferDTO>( this.apiUrl + `chofer/saldo?idchofer=`+nrochof+`&nrosaldo=`+nrosaldo);
  }

  public updateSaldoChofer( saldoc : saldoChofDTO){
     return this.http.put<saldoChofDTO>(environment.apiUrl + `chofer/actsaldochof`,saldoc);
  }

  public getFactTpteXChofer(nrochof : number) {
    return this.http.get<factpDTO[]>(this.apiUrl + `chofer/factxchofer?idchof=`+nrochof);
  }

  public getGastosxChofer(nrochof : number) {
    return this.http.get<gastoDTO[]>(this.apiUrl + `chofer/gastosxchofer?idchof=`+nrochof);
  }

  public getPagosxChofer(nrochof : number) {
    return this.http.get<pagoDTO[]>(this.apiUrl + `chofer/pagosxchofer?idchof=`+nrochof);
  }
  
  // PAGOS AL CHOFER
   public getCantPagos() {
    return this.http.get<number>(this.apiUrl + `pago/max`);
  }
  public elimPago(nropago: number) {
    return this.http.delete(
      environment.apiUrl + `pago/pago?id=` + nropago
    );
  }

  public grabarPagoChofer(pago : pagoDTO) {
    return this.http.post<pagoDTO>(this.apiUrl + `pago/pago/nuevo`,pago);
  }

  public updatePagoChofer(nropago : number, pagochofer : pagoDTO){
     return this.http.put<pagoDTO>(environment.apiUrl + `pago/pago/actualizar?id=`+nropago,pagochofer);
  }


  public leerPagoChofer(nropago: number) {
    return this.http.get<pagoDTO>( this.apiUrl + `pago/pago?id=`+nropago);
  }


  // ** CAMIONES ** //

   public getCamiones() {
    return this.http.get<camionDTO[]>(this.apiUrl + `camion/camiones`);
  }

  public getCantCamiones() {
    return this.http.get<number>(this.apiUrl + `camion/max`);
  }

  public leerCamion(nrocamion: number) {
    return this.http.get<camionDTO>(
      this.apiUrl + `camion/camion?id=` + nrocamion
    );
  }
  
  public grabarCamion(camion : camionDTO) {
    return this.http.post<camionDTO>(
      this.apiUrl + `camion/camion/nuevo`, camion);
  }

  public updateCamion(nrocamion : number, camion : camionDTO) {
    return this.http.put<camionDTO>(
      environment.apiUrl + `camion/camion/actualizar?id=` + nrocamion, camion);
  }

  public elimCamion(nrocamion : number) {
    return this.http.delete(
      environment.apiUrl + `camion/camion?id=` + nrocamion);
  }

  // ** Empresas de Transporte ** //

   public getEmpresas() {
    return this.http.get<empTpteDTO[]>(this.apiUrl + `empt/emps`);
  }

  public getCantEmpresas() {
    return this.http.get<number>(this.apiUrl + `empt/max`);
  }

  public leerEmpresa(nroemp: number) {
    return this.http.get<empTpteDTO>(
      this.apiUrl + `empt/empt?id=` + nroemp
    );
  }
  
  public grabarEmpresa(empresat : empTpteDTO) {
    return this.http.post<empTpteDTO>(
      this.apiUrl + `empt/empt/nuevo`,
      empresat
    );
  }

  public updateEmpresa(nroemp : number, empresat: empTpteDTO) {
    return this.http.put<empTpteDTO>(
      environment.apiUrl + `empt/empt/actualizar?id=` + nroemp,
      empresat
    );
  }

  public elimEmpresa(nroempresa: number) {
    return this.http.delete(
      environment.apiUrl + `empt/empt?id=` + nroempresa
    );
  }

 public getMarcas() {
    return this.http.get<marcaDTO[]>(this.apiUrl + `tablas/marcas`);
 } 
public getMediosPago() {
    return this.http.get<MPagoDTO[]>(this.apiUrl + `tablas/mediospago`);
 } 
public getUnidades() {
    return this.http.get<UnidadDTO[]>(this.apiUrl + `tablas/unidades`);
 } 

public getTiposGasto() {
    return this.http.get<TGastoDTO[]>(this.apiUrl + `tablas/tiposgasto`);
 } 


 // ** CLIENTES ** //

   public getClientes() {
    return this.http.get<clienteDTO[]>(this.apiUrl + `cliente/clientes`);
  }

  public getCantClientes() {
    return this.http.get<number>(this.apiUrl + `cliente/max`);
  }

  public leerCliente(nrocli : number) {
    return this.http.get<clienteDTO>(
      this.apiUrl + `cliente/cliente?id=` + nrocli
    );
  }
  
  public grabarCliente(cliente : clienteDTO) {
    return this.http.post<clienteDTO>(
      this.apiUrl + `cliente/cliente/nuevo`, cliente
    );
  }

  public updateCliente(nrocli : number, cliente: clienteDTO) {
    return this.http.put<clienteDTO>(
      environment.apiUrl + `cliente/cliente/actualizar?id=` + nrocli,cliente
    );
  }

  public elimCliente(nrocli: number) {
    return this.http.delete(
      environment.apiUrl + `cliente/cliente?id=` + nrocli
    );
  }

  // PAGOS DEL CLIENTE
   public getCantPagosCli() {
    return this.http.get<number>(this.apiUrl + `pagocli/pago/max`);
  }
  public elimPagoCli(nropago: number) {
    return this.http.delete(
      environment.apiUrl + `pagocli/pago?id=` + nropago
    );
  }

  public grabarPagoCli(pago : pagocliDTO) {
    return this.http.post<pagocliDTO>(this.apiUrl + `pagocli/pago/nuevo`,pago);
  }

  public updatePagoCli(nropago : number, pagocli : pagocliDTO){
     return this.http.put<pagocliDTO>(environment.apiUrl + `pagocli/pago/actualizar?id=`+nropago,pagocli);
  }

  public leerPagoCliente(nropago: number) {
    return this.http.get<pagocliDTO>( this.apiUrl + `pagocli/pago?id=`+nropago);
  }

   // ** VIAJES ** //

   public getViajes() {
    return this.http.get<viajeDTO[]>(this.apiUrl + `viaje/viajes`);
  }

  public getCantViajes() {
    return this.http.get<number>(this.apiUrl + `viaje/max`);
  }

   public getViajesxChofer(nrochof : number) {
    return this.http.get<viajeDTO[]>(this.apiUrl + `viaje/viajesxchofer?idchof=`+nrochof);
  }
  
  public getGastosXViaje(nroviaje : number) {
    return this.http.get<gastoDTO[]>(this.apiUrl + `gasto/gastosxviaje?idviaje=`+nroviaje);
  }

   public getCantViajesxChofer(nrochof : number) {
    return this.http.get<number>(this.apiUrl + `viaje/cantViajesxChofer?idchof=`+nrochof);
  }

   public getViajesxCliente(nrocli : number) {
    return this.http.get<viajeDTO[]>(this.apiUrl + `viaje/viajesxcliente?idcliente=`+nrocli);
  }
  
  public getCantViajesxCliente(nrocliente : number) {
    return this.http.get<number>(this.apiUrl + `viaje/cantViajesxCliente?idcliente=`+nrocliente);
  }

  public leerViaje(nroviaje: number) {
    return this.http.get<viajeDTO>(
      this.apiUrl + `viaje/viaje?id=` + nroviaje
    );
  }
  
  public grabarViaje(viaje : viajeDTO) {
    return this.http.post<viajeDTO>(
      this.apiUrl + `viaje/viaje/nuevo`, viaje);
  }


  // Actualiza el campo "fact" de Viajes para marcar que se emitio la factura de transporte 
  public updateFactT(nroviaje : number, facturado : number) {
    return this.http.put(environment.apiUrl + `viaje/viaje/actuft?id=`+nroviaje+`&factu=`+facturado,nroviaje);
  } 

  // Actualiza el campo "facc" de Viajes para marcar que se emitio la factura al cliente 
   public updateFactC(nroviaje : number, facturado : number) {
    return this.http.put(environment.apiUrl + `viaje/viaje/actufc?id=`+nroviaje+`&factu=`+facturado,nroviaje);
  } 

  public updateViaje(nroviaje : number, viaje : viajeDTO) {
    return this.http.put<viajeDTO>(
      environment.apiUrl + `viaje/viaje/actualizar?id=` + nroviaje, viaje);
  }

  public elimViaje(nroviaje : number) {
    return this.http.delete(
      environment.apiUrl + `viaje/viaje?id=` + nroviaje);
  }

   // ** Facturas al Cliente ** //

   public getFacsCL() {
    return this.http.get<facclDTO[]>(this.apiUrl + `faccl/facscl`);
  }
  public getFactCliXCliente(nrocli : number) {
    return this.http.get<facclDTO[]>(this.apiUrl + `faccl/factxcliente?idcli=`+nrocli);
  }
  
  public getFacsCliXClienteYF(idcliente : number, fechi : string, fechh : string) {
    return this.http.get<facclDTO[]>(this.apiUrl + `faccl/factxclienteYF?idcli=`+idcliente+`&feci=`+fechi+`&fecf=`+fechh);
  }
  public getCantFacsCL() {
    return this.http.get<number>(this.apiUrl + `faccl/max`);
  }

  public leerFacCL(nrof: number) {
    return this.http.get<facclDTO>(
      this.apiUrl + `faccl/faccl?id=` + nrof
    );
  }
  
  public grabarFacCL(faccl : facclDTO) {
    return this.http.post<facclDTO>(
      this.apiUrl + `faccl/faccl/nuevo`, faccl);
  }

  public updateFacCL(nrofaccl : number, faccl : facclDTO) {
    return this.http.put<facclDTO>(
      environment.apiUrl + `faccl/faccl/actualizar?id=` + nrofaccl, faccl);
  }

  public elimFacCL(nrofaccl : number) {
    return this.http.delete(
      environment.apiUrl + `faccl/faccl?id=` + nrofaccl);
  }

   // ** Items de Facturas al Cliente ** //
    
   public getItemsFacsCL(idfactura : number) {
    return this.http.get<itfacclDTO[]>(this.apiUrl + `faccl/faccl/detalle?idfac=`+idfactura);
  }

      
  
  public grabarItemFacCL(itfaccl : itfacclDTO) {
    return this.http.post<itfacclDTO>(
      this.apiUrl + `faccl/detalle/nuevo`, itfaccl);
  }

  public updateItFacCL(itfaccl : itfacclDTO) {
    return this.http.put<itfacclDTO>(
      environment.apiUrl + `faccl/detalle/actualizar`,itfaccl);
  }

  public elimItFacCL(nrofac : number,nroitem : number) {
    return this.http.delete(
      environment.apiUrl + `faccl/detalle/borrar=idfac=`+nrofac+`&&nroitem=`+nroitem);
  }

   // ** Facturas de Transporte ** //

   public getFacsTP() {
    return this.http.get<factpDTO[]>(this.apiUrl + `factp/facstp`);
  }
   /*@GetMapping(value="/infofactpxfecha",params={"feci","fecf"})*/

  public getFacsTPxFecha(fechi : string, fechh : string) {
    return this.http.get<factpDTO[]>(this.apiUrl + `factp/infofactpxfecha?feci=`+fechi+`&fecf=`+fechh);
  }

  public getFacsTPxChoferYF(idchof : number, fechi : string, fechh : string) {
    return this.http.get<factpDTO[]>(this.apiUrl + `factp/factxchoferYF?idchof=`+idchof+`&feci=`+fechi+`&fecf=`+fechh);
  }

  public getFacsAgrupxChof(fechi : string, fechh : string) {
    return this.http.get<AgChof[]>(this.apiUrl + `factp/agrupchof?feci=`+fechi+`&fecf=`+fechh);
  }
  public getCantFacsTP() {
    return this.http.get<number>(this.apiUrl + `factp/max`);
  }

  public leerFacTP(nrof: number) {
    return this.http.get<factpDTO>(
      this.apiUrl + `factp/factp?id=` + nrof
    );
  }
  
  public grabarFacTP(factp : factpDTO) {
    return this.http.post<factpDTO>(
      this.apiUrl + `factp/factp/nuevo`, factp);
  }

  public updateFacTP(nrofactp : number, factp : factpDTO) {
    return this.http.put<factpDTO>(
      environment.apiUrl + `factp/factp/actualizar?id=` + nrofactp, factp);
  }

  public elimFacTP(nrofactp : number) {
    return this.http.delete(
      environment.apiUrl + `factp/factp?id=` + nrofactp);
  }

   // ** Items de Facturas de Transporte ** //
    
   public getItemsFacsTP(idfactura : number) {
    return this.http.get<itfactpDTO[]>(this.apiUrl + `factp/factp/detalle?idfac=`+idfactura);
  }

      
  
  public grabarItemFacTP(itfactp : itfactpDTO) {
    return this.http.post<itfactpDTO>(
      this.apiUrl + `factp/detalle/nuevo`, itfactp);
  }

  public updateItFacTP(itfactp : itfactpDTO) {
    return this.http.put<itfactpDTO>(
      environment.apiUrl + `factp/detalle/actualizar`,itfactp);
  }

  public elimItFacTP(nrofac : number,nroitem : number) {
    return this.http.delete(
      environment.apiUrl + `factp/detalle/borrar=idfac=`+nrofac+`&&nroitem=`+nroitem);
  }

  //  GASTOS (de viajes, choferes y generales)

  public getGastos() {
    return this.http.get<gastoDTO[]>(this.apiUrl + `gasto/gastos`);
  }

  public getCantGastos() {
    return this.http.get<number>(this.apiUrl + `gasto/max`);
  }

  public leerGasto(nrogasto: number) {
     return this.http.get<gastoDTO>( this.apiUrl + `gasto/gasto?id=` + nrogasto);
  }


  public grabarGasto(gasto : gastoDTO) {
    return this.http.post<gastoDTO>( this.apiUrl + `gasto/gasto/nuevo`, gasto);
  }


  public updateGasto(nrogasto : number, gasto : gastoDTO) {
    return this.http.put<gastoDTO>( environment.apiUrl + `gasto/gasto/actualizar?id=` + nrogasto, gasto);
  }

    public elimGasto(nrogasto : number) {
    return this.http.delete( environment.apiUrl + `gasto/gasto?id=` + nrogasto);
  }
   
}