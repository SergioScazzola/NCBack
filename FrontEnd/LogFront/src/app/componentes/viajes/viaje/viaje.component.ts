import { Component, effect, ElementRef, Inject, viewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { empTpteDTO } from '../../../../entidades/empTpteDTO';
import { NotiserviceService } from '../../../servicios/notiservice.service';
import { ServiciosService } from '../../../servicios/service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { camionDTO, intCamion } from '../../../../entidades/camionDTO';
import {MatDatepickerModule,MatDatepickerInputEvent} from '@angular/material/datepicker';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateFnsModule } from '@angular/material-date-fns-adapter';
import {es} from 'date-fns/locale';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule} from '@angular/material/core';
import { SelecTextDirective } from "../../../Directivas/selec-text.directive";
import { choferDTO } from '../../../../entidades/choferDTO';
import { clienteDTO } from '../../../../entidades/clienteDTO';
import { intViaje, viajeDTO } from '../../../../entidades/viajeDTO';

export const DATE_FORMATS : MatDateFormats = {

  
  parse : { dateInput : "dd-MM-yyyy"},
  display : {
      dateInput :  "dd-MM-yyyy",
      monthYearLabel : "MMM yyyy",
      dateA11yLabel : "LL",
      monthYearA11yLabel : "yyyy",
  }
 
}
@Component({
  selector: 'app-viaje',
  imports: [MatFormField,
    MatLabel,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CommonModule,
    DragDropModule,
    FormsModule, SelecTextDirective],
   providers : [
    { provide : DateAdapter, useClass: DateFnsAdapter },
    { provide : MAT_DATE_FORMATS, useValue: DATE_FORMATS},
    { provide : MAT_DATE_LOCALE, useValue: es}
  ],
  templateUrl: './viaje.component.html',
  styleUrl: './viaje.component.css',
})
export class ViajeComponent {
 public nameInput = viewChild<ElementRef>('fechaviaje');
  formViaje        : FormGroup;
  operacion        : string = "";
  resumod          : string;
  nviajealta       : number;
  maxviaje         : number;
  cchoferes        : choferDTO[]=[];
  cclientes        : clienteDTO[]=[];
  ccamiones        : camionDTO[]=[];
  idChoferSel      : number = 1;
  idClienteSel     : number = 1;
  idCamionSel      : number = 1;
  private viajee   : viajeDTO;  
  hoy              : Date = new Date();
  
  constructor(  public fb           : FormBuilder,
                public servicio     : ServiciosService,
                public dialogRef    : MatDialogRef<ViajeComponent>,
                @Inject(MAT_DIALOG_DATA) public data: intViaje,  
                private notiService : NotiserviceService )
   { effect(() => {
            this.nameInput()?.nativeElement.focus(); //enfoca  iniciar
        });

  }
 
  ngOnInit(){
      this.formViaje = this.fb.group({        
             nroviaje     : [''], 
             fecha        : [new Date()],
             idChofer     : [1],
             idCliente    : [1],
             idCamion     : [1],
             descrip      : [''],
             origen       : [''],
             destino      : [''],
             ctg          : [''],
             cantkm       : [0],
             cargaton     : [0],
             tarifap      : [0],
             ltsgasoil    : [0],
             impviaje     : [0],
      })
      var subs1 : Subscription;
      subs1 = this.servicio.getChoferes()
          .subscribe((data1:any):void =>{
            this.cchoferes = data1;
            var subs : Subscription;
            subs = this.servicio.getClientes()
              .subscribe((data2:any):void =>{
                this.cclientes = data2;
                var subsc : Subscription;            
                subsc = this.servicio.getCamiones()
                .subscribe((data1:any):void =>{
                  this.ccamiones = data1;
                
                  if (this.data.accion=="M"){ 
                    // MODIFICAR VIAJE
                    var subs2 : Subscription;            
                    subs2 = this.servicio.leerViaje(this.data.nroviaje)
                      .subscribe((data3:any):void =>{                           
                      this.viajee   = data3;
                      this.operacion = "Modificar Viaje Nro. "+this.data.nroviaje+" - "+this.data.descrip;
                      this.actualizarControles();
                      })
                 
                } else { // ALTA DE VIAJE -> accion = "A"
                  this.mostrarHora(); //muesta y modica Horas y minutos
                  var subs2 : Subscription;
                  subs2 = this.servicio.getCantViajes()
                   .subscribe((data1:any):void =>{                           
                      this.maxviaje = data1;
                      this.nviajealta = this.maxviaje + 1;
                      this.operacion = "Agregar Viaje Nro. "+this.nviajealta;
                      this.formViaje.controls["nroviaje"].setValue(this.nviajealta);
                    })                                              
                }
              })            
          })   
        })                                            
         
   }
  actualizarControles(){
    // Actualiza controles para modificar
                        
    this.formViaje.controls["nroviaje"].setValue(this.viajee.idViaje), 
    this.formViaje.controls["fecha"].setValue(this.viajee.fecha), 
    this.formViaje.controls["idChofer"].setValue(this.viajee.idChofer), 
    this.formViaje.controls["idCliente"].setValue(this.viajee.idCliente),                   
    this.formViaje.controls["idCamion"].setValue(this.viajee.idCamion),
    this.formViaje.controls["descrip"].setValue(this.viajee.descrip),                   
    this.formViaje.controls["origen"].setValue(this.viajee.origen), 
    this.formViaje.controls["destino"].setValue(this.viajee.destino), 
    this.formViaje.controls["ctg"].setValue(this.viajee.ctg),                
    this.formViaje.controls["cantkm"].setValue(this.viajee.cantkm),                
    this.formViaje.controls["cargaton"].setValue(this.viajee.cargaton), 
             
    this.idChoferSel      = this.viajee.idChofer;
    this.idClienteSel     = this.viajee.idCliente;
    this.idCamionSel      = this.viajee.idCamion;
                           
   }

   AgregarViaje(){

    var indchof = this.cchoferes.findIndex(p=>p.idChofer==this.idChoferSel);
    var indcli  = this.cclientes.findIndex(p=>p.idCliente==this.idClienteSel);
    var indcam  = this.ccamiones.findIndex(p=>p.idCamion==this.idCamionSel);
    
    var viaje : viajeDTO = {
        idViaje     : this.formViaje.controls["nroviaje"].value,
        fecha       : this.formViaje.controls["fecha"].value,
        idChofer    : this.formViaje.controls["idChofer"].value,
        nomchofer   : this.cchoferes[indchof].nombre,
        idCliente   : this.formViaje.controls["idCliente"].value,
        nomcliente  : this.cclientes[indcli].nombre,
        idCamion    : this.formViaje.controls["idCamion"].value,
        descrip     : this.ccamiones[indcam].descrip,
        origen      : this.formViaje.controls["origen"].value,                                            
        destino     : this.formViaje.controls["destino"].value,
        ctg         : this.formViaje.controls["ctg"].value,
        cantkm      : this.formViaje.controls["cantkm"].value,
        cargaton    : this.formViaje.controls["cargaton"].value,
        tarifap     : this.formViaje.controls["tarifap"].value,
        ltsgasoil   : this.formViaje.controls["ltsgasoil"].value,
        impviaje    : this.formViaje.controls["impviaje"].value,
        facturado   : 0,
    }   
    
        
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.grabarViaje(viaje)  
            .pipe(finalize(() => {   
             console.log("Error : "+resu);
             this.notiService.showNotification("El Viaje Nro. "+viaje.idViaje+" - "+
                                        viaje.destino+" se ha agregado con éxito",'Aceptar','mensaje',500); 
                subscri.unsubscribe();
                this.dialogRef.close({ clicked : "Alta"})
                }))                  
           .subscribe((data : any): void => { resu = data });   
    }
    
    
    ModificarViaje(){
     var indchof = this.cchoferes.findIndex(p=>p.idChofer==this.idChoferSel);
     var indcli  = this.cclientes.findIndex(p=>p.idCliente==this.idClienteSel);
     var indcam  = this.ccamiones.findIndex(p=>p.idCamion==this.idCamionSel);
    
     var viaje : viajeDTO = {
        idViaje     : this.formViaje.controls["nroviaje"].value,
        fecha       : this.formViaje.controls["fecha"].value,
        idChofer    : this.formViaje.controls["idChofer"].value,
        nomchofer   : this.cchoferes[indchof].nombre,
        idCliente   : this.formViaje.controls["idCliente"].value,
        nomcliente  : this.cclientes[indcli].nombre,
        idCamion    : this.formViaje.controls["idCamion"].value,
        descrip     : this.ccamiones[indcam].descrip,
        origen      : this.formViaje.controls["origen"].value,                                            
        destino     : this.formViaje.controls["destino"].value,
        ctg         : this.formViaje.controls["ctg"].value,
        cantkm      : this.formViaje.controls["cantkm"].value,
        cargaton    : this.formViaje.controls["cargaton"].value,
        tarifap     : this.formViaje.controls["tarifap"].value,
        ltsgasoil   : this.formViaje.controls["ltsgasoil"].value,
        impviaje    : this.formViaje.controls["impviaje"].value,
        facturado   : 0,
    }   
   
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.updateViaje(viaje.idViaje,viaje)  
            .pipe(finalize(() => {   
             this.notiService.showNotification("El Viaje Nro. "+this.data.nroviaje+" - "+
                                                this.data.descrip+" se ha modificado con éxito",'Aceptar','mensaje',500); 
             subscri.unsubscribe();
             this.dialogRef.close({ clicked : "Modi"})
                }))                  
           .subscribe((data : any): void => {resu=data});   
    }
             
onSelectionChofer($event : any){
  // recibo un idChofer
 this.idChoferSel = $event.value;
 
}

onSelectionCliente($event : any){
  // recibo un idCliente
 this.idClienteSel = $event.value;
 
}

onSelectionCamion($event : any){
  // recibo un idCamion
 this.idCamionSel = $event.value;
 
}

 mostrarHora() {
    // mantiene actualizado el control "fecha" con Horas minutos y segundos
    setInterval(() => {
      this.hoy = new Date();
      
      const valorControl = this.formViaje.controls['fecha'].value;
      const fechaform = new Date(valorControl); // ✅ convierte string/objeto a Date real
  
      fechaform.setHours(this.hoy.getHours(), this.hoy.getMinutes(), this.hoy.getSeconds());
  
      this.formViaje.controls['fecha'].setValue(fechaform); // ✅ se actualiza con una fecha válida
      
    }, 1000);
  }
 
  
  onFechaChange(event: any) {
    const nuevaFecha: Date = event.value; // Fecha seleccionada en el datepicker
    const ahora = new Date(); // Hora actual
  
    // Copiar la hora actual a la fecha seleccionada
    nuevaFecha.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds(), 0);
  
    // Establecer la fecha con hora en el form
    this.formViaje.controls['fecha'].setValue(nuevaFecha);
  }

  onBlurCantKm($event : any){
 // Calcula el importe del viaje cuando cambia la cantidad de km y lo actualiza
    
    var ckm      = this.formViaje.controls["cantkm"].value;
    var tarifap  =  this.formViaje.controls["tarifap"].value; // tarifa plena
    var tiva     =  0.21;
    
    var tarifav  =  this.redondearAdos(tarifap * 0.90); // tarifa del viaje
    var valorviaje = this.redondearAdos(ckm * tarifav);
    var netociva = valorviaje * (1+tiva);   
    this.formViaje.controls["impviaje"].setValue(this.redondearAdos(netociva))
  }

  onBlurTarifaP($event : any){
    // Calcula el importe del viaje cuando cambia la tarifa plena y lo actualiza
    
    var ckm      = this.formViaje.controls["cantkm"].value;
    var tarifap  =  this.formViaje.controls["tarifap"].value; // tarifa plena
    var tiva     =  0.21;
    
    var tarifav  =  this.redondearAdos(tarifap * 0.90); // tarifa del viaje
    var valorviaje = this.redondearAdos(ckm * tarifav);
    var netociva = valorviaje * (1+tiva);   
    this.formViaje.controls["impviaje"].setValue(this.redondearAdos(netociva))
  }
  redondearAdos(nro : number): number{  
    var numero : number = nro+0.005;
    // está redondeado a dos decimales, pero tiene mas de 2 decimales
    // convierto a cadena y le saco los decimales que no necesito
    var cade : string = String(numero);  
    var posi : number = cade.indexOf(".");
    numero = Number(cade.substring(0,posi+3));  
    return numero
  }  
Anular(){
      this.dialogRef.close({ clicked : "Cancelar"})
     }
}
