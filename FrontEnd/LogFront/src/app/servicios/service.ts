import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConfigService } from './config.service';
import { choferDTO } from '../../entidades/choferDTO';
import { empTpteDTO } from '../../entidades/empTpteDTO';
import { camionDTO } from '../../entidades/camionDTO';
import { marcaDTO } from '../../entidades/marcaDTO';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  usuario?: string;
  subscri?: Subscription;
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
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


}