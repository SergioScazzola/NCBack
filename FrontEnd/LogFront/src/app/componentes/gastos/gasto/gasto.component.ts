import { ChangeDetectorRef, Component, effect, ElementRef, EventEmitter, Inject, Input, NgZone, Output, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ServiciosService } from '../../../servicios/service';
import { NotiserviceService } from '../../../servicios/notiservice.service';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { choferDTO, intChofer } from '../../../../entidades/choferDTO';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';



import { TGastoDTO, UnidadDTO } from '../../../../entidades/marcaDTO';
import { gastoDTO, intGasto } from '../../../../entidades/gastoDTO';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { viajeDTO } from '../../../../entidades/viajeDTO';
import { MatCheckbox } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { es } from 'date-fns/locale';

import { ImporteDirective } from "../../../Directivas/importeDirective";

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
  selector: 'app-gasto',
 standalone: true,
   imports: [MatFormField,
    MatLabel,
    MatInputModule,
    MatSelectModule,
    MatCheckbox,
    ReactiveFormsModule,
    MatDatepickerModule,
    CommonModule,
    DragDropModule,
    FormsModule,
    ImporteDirective],
  providers : [
   CurrencyPipe,
    { provide : DateAdapter, useClass: DateFnsAdapter },
    { provide : MAT_DATE_FORMATS, useValue: DATE_FORMATS},
    { provide : MAT_DATE_LOCALE, useValue: es},
    
  ],  
  templateUrl: './gasto.component.html',
  styleUrl: './gasto.component.css',
})
export class GastoComponent {
 //@ViewChild('nombreempleado') nameInput: ElementRef;
  public nameInput = viewChild<ElementRef>('nombre');
  formGasto       : FormGroup;
  operacion        : string = "";
  resumod          : string;
  ngastoalta       : number;
  maxgasto         : number;
  selchofer        : number; // nro.de chofer seleccionado en el select
  selviaje         : number; // nro.de viaje seleccionado en el select
  cunidades        : UnidadDTO[]=[];
  ctiposgasto      : TGastoDTO[]=[];
  cchoferes        : choferDTO[]=[];
  cviajes          : viajeDTO[]=[];
  
  isloading        : boolean = true;
  private gastoo   : gastoDTO;  
  private viaje0   : viajeDTO = {
    
    idViaje        : 0,
    fecha          : null,
    idChofer       : 0,
    nomchofer      : "",
    idCliente      : 0,
    nomcliente     : "",   
    idCamion       : 0,
    descrip        : "",
    origen         : "Origen",
    destino        : "Destino",
    ctg            : "",
    cantkm         : 0,
    cargaton       : 0,
    tarifap        : 0,
    ltsgasoil      : 0,
    impneto        : 0,
    impviaje       : 0,
    fact           : 0,
    facc           : 0
  }
  constructor(  public fb           : FormBuilder,
                public servicio     : ServiciosService,
                public dialogRef    : MatDialogRef<GastoComponent>,
                private cdr         : ChangeDetectorRef,
                private zone        : NgZone,
                @Inject(MAT_DIALOG_DATA) public data: intGasto,  
                private notiService : NotiserviceService )
   { effect(() => {
            this.nameInput()?.nativeElement.focus(); //enfoca fecha al iniciar
        });

  }
 
  ngOnInit(){
      this.initFormulario();
      forkJoin({
               unidades:   this.servicio.getUnidades(),    
               tiposgasto: this.servicio.getTiposGasto(),
               choferes:   this.servicio.getChoferes(), // para mostrar el nombre del chofer en el select
              
            }).subscribe(res2 => {
                this.cunidades   = res2.unidades;
                this.ctiposgasto = res2.tiposgasto;
                this.cchoferes   = res2.choferes;   
              

            if (this.data.accion=="M"){ 
               // MODIFICAR
               var subs2 : Subscription;            
               subs2 = this.servicio.leerGasto(this.data.idgasto)
                  .subscribe((datas:any):void =>{                           
                    this.gastoo = datas;
                    this.operacion = "Modificar Gasto Nro. "+this.data.idgasto+" - "+this.gastoo.provgasto;
                    this.actualizarControles();
                    subs2.unsubscribe();
                    this.isloading = false;
                    this.cdr.detectChanges(); // <--- Asegura que el nuevo valor se pinte sin errores
                  })
                 
            } else { // ALTA -> accion = "A"
                               
              this.ngastoalta = this.data.idgasto;
              this.operacion = "Agregar Gasto Nro. "+this.ngastoalta;
              this.formGasto.controls["idGasto"].setValue(this.ngastoalta);
              this.isloading = false;
              this.cdr.detectChanges(); // <--- Asegura que el nuevo valor se pinte sin errores
            }                                              
            })
                                         
   }

   initFormulario(){
    this.formGasto = this.fb.group({
      idGasto         : [0],
      fecha           : [new Date(), Validators.required],
      gastogeneral    : [0],
      idChofer        : [0, Validators.required],
      nomchofer       : [''],
      idViaje         : [0],
      compgasto       : [''],
      provgasto       : [''],
      ntipogasto      : [0],
      cantgasto       : [0],
      nunidgasto      : [0],
      pregasto        : [0],
      descgasto       : [''],
      impgasto        : [0],
    });
   }

  actualizarControles(){
    // mapeo el texto que viene en gastoo al indice de los array para mostrar el valor correcto en los select
    var indu = this.cunidades.findIndex(p=>p.unidad==this.gastoo.unidgasto);
    var indt = this.ctiposgasto.findIndex(p=>p.tipogasto==this.gastoo.tipogasto);

    this.formGasto.controls["idGasto"].setValue(this.gastoo.idGasto);
    this.formGasto.controls["fecha"].setValue(this.gastoo.fecha);
    this.formGasto.controls["idChofer"].setValue(this.gastoo.idChofer);
    this.formGasto.controls["nomchofer"].setValue(this.gastoo.nomchofer);
    this.formGasto.controls["idViaje"].setValue(this.gastoo.idViaje);
    this.formGasto.controls["compgasto"].setValue(this.gastoo.compgasto);
    this.formGasto.controls["provgasto"].setValue(this.gastoo.provgasto);
    this.formGasto.controls["ntipogasto"].setValue(this.ctiposgasto[indt].idtipogasto);
    this.formGasto.controls["cantgasto"].setValue(this.gastoo.cantgasto);
    this.formGasto.controls["nunidgasto"].setValue(this.cunidades[indu].idUnidad);
    this.formGasto.controls["pregasto"].setValue(this.gastoo.pregasto);
    this.formGasto.controls["descgasto"].setValue(this.gastoo.descgasto);
    this.formGasto.controls["impgasto"].setValue(this.gastoo.impgasto);
                           
   }

   AgregarGasto(){
    // los array estan ordenados por id, entonces el id es indice 
    var indt = this.formGasto.controls["ntipogasto"].value - 1;
    var indu = this.formGasto.controls["nunidgasto"].value - 1;
    var indchofer = this.cchoferes.findIndex(p=>p.idChofer==this.formGasto.controls["idChofer"].value);
    var gasto : gastoDTO = {
        idGasto     : this.formGasto.controls["idGasto"].value,
        fecha       : this.formGasto.controls["fecha"].value,   
        idChofer    : this.formGasto.controls["idChofer"].value,
        nomchofer   : this.cchoferes[indchofer].nombre, 
        idViaje     : this.formGasto.controls["idViaje"].value, 
        compgasto   : this.formGasto.controls["compgasto"].value,
        provgasto   : this.formGasto.controls["provgasto"].value,
        tipogasto   : this.ctiposgasto[indt].tipogasto, // se graba el texto, no el indice
        cantgasto   : this.formGasto.controls["cantgasto"].value,
        unidgasto   : this.cunidades[indu].unidad, // se graba el texto, no el indice
        pregasto    : this.formGasto.controls["pregasto"].value,  
        descgasto   : this.formGasto.controls["descgasto"].value,
        impgasto    : this.formGasto.controls["impgasto"].value,  
    }               
    var subs : Subscription;
    var resu : string;
    subs = this.servicio.grabarGasto(gasto)  
            .pipe(finalize(() => {   
             console.log("Error : "+resu);
             this.notiService.showNotification("El Gasto Nro. "+gasto.idGasto+" - "+
                                        gasto.impgasto+" se ha agregado con éxito",'Aceptar','mensaje',500); 
                subs.unsubscribe();
                this.dialogRef.close({ clicked : "Alta"})
                }))                  
           .subscribe((data : any): void => { resu = data });   
  }
    
    
  ModificarGasto(){
     // los array estan ordenados por id, entonces el id es indice 
    var indt = this.formGasto.controls["ntipogasto"].value - 1;
    var indu = this.formGasto.controls["nunidgasto"].value - 1;
     
   var gasto : gastoDTO = {
        idGasto     : this.formGasto.controls["idGasto"].value,
        fecha       : this.formGasto.controls["fecha"].value,   
        idChofer    : this.formGasto.controls["idChofer"].value,
        nomchofer   : this.formGasto.controls["nomchofer"].value,
        idViaje     : this.formGasto.controls["idViaje"].value, 
        compgasto   : this.formGasto.controls["compgasto"].value,
        provgasto   : this.formGasto.controls["provgasto"].value,
        tipogasto   : this.ctiposgasto[indt].tipogasto, // se graba el texto, no el indice
        cantgasto   : this.formGasto.controls["cantgasto"].value,
        unidgasto   : this.cunidades[indu].unidad, // se graba el texto, no el indice
        pregasto    : this.formGasto.controls["pregasto"].value,  
        descgasto   : this.formGasto.controls["descgasto"].value,
        impgasto    : this.formGasto.controls["impgasto"].value,  
    }               
   
    var subs : Subscription;
    var resu    : string;
    subs = this.servicio.updateGasto(gasto.idGasto,gasto)  
            .pipe(finalize(() => {   
             this.notiService.showNotification("El Gasto Nro. "+gasto.idGasto+" de "+
                                                gasto.nomchofer+" se ha modificado con éxito",'Aceptar','mensaje',500); 
             subs.unsubscribe();
             this.dialogRef.close({ clicked : "Modi"})
                }))                  
           .subscribe((data : any): void => {resu=data});   
    }
             
 onFechaChange(event: any) {
    const nuevaFecha: Date = event.value; // Fecha seleccionada en el datepicker
    const ahora = new Date(); // Hora actual
  
    // Copiar la hora actual a la fecha seleccionada
    nuevaFecha.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds(), 0);
  
    // Establecer la fecha con hora en el form
    this.formGasto.controls['fecha'].setValue(nuevaFecha);
  }

  mostrarHora() {
   this.zone.runOutsideAngular(() => {
    setInterval(() => {
      const hoy = new Date();
      const valorControl = this.formGasto.controls['fecha'].value;
      
      if (valorControl) {
        const fechaform = new Date(valorControl);
        fechaform.setHours(hoy.getHours(), hoy.getMinutes(), hoy.getSeconds());

        // Volvemos a la zona de Angular solo para actualizar el valor
        this.zone.run(() => {
          this.formGasto.controls['fecha'].setValue(fechaform, { emitEvent: false });
          this.cdr.detectChanges(); // Forzamos la actualización sin romper el ciclo
        });
      }
    }, 1000);
  }) 
  }
onSelectionChofer($event : any){
    // al seleccionar un chofer
    this.selchofer = $event.value; // idChofer seleccionado
    if (this.selchofer != 0){ // si se selecciona un chofer
      var subs : Subscription;            
      subs = this.servicio.getViajesxChofer(this.selchofer)
                  .subscribe((datas:any):void =>{ this.cviajes = datas || [];
                      subs.unsubscribe(); 
                      if (this.cviajes.length > 0){
                           this.cviajes = [this.viaje0, ...this.cviajes];
                           this.formGasto.controls["idViaje"].setValue(this.cviajes[0].idViaje);
                           this.formGasto.controls["idViaje"].enable(); // limpio el campo viaje                           
                           this.isloading = false;
                           this.cdr.detectChanges();   
                      } else {
                        this.notiService.showNotification("No existen Viajes ingresados para este chofer, "+
                                         " el gasto se asignará al chofer",'Aceptar','mensaje',500); 
                           this.formGasto.controls["idViaje"].setValue(0);
                           this.formGasto.controls["idViaje"].disable(); // limpio el campo viaje                           
                      }                          
                  }) 
    } else { // si se selecciona "Sin Chofer"
      subs = this.servicio.getViajes()  // los ultimos viajes
             .subscribe((datas:any):void =>{ this.cviajes = datas;
                  subs.unsubscribe(); 
                  this.formGasto.controls["idViaje"].enable(); // limpio el campo viaje                           
                  this.isloading = false;
                  this.cdr.detectChanges(); })   
}
}
onSelectionViaje($event : any){
    this.selviaje = $event.value; // idViaje seleccionado
}

cambioGastoGeneral(){
  if (this.formGasto.controls["gastogeneral"].value == 1){ // es un gasto general, entonces no se asigna a un viaje ni a un chofer
    this.formGasto.controls["idViaje"].setValue(0); // limpio el campo viaje
    this.formGasto.controls["idViaje"].disable(); // bloqueo el campo viaje
    this.formGasto.controls["idChofer"].setValue(0); // limpio el campo viaje
    this.formGasto.controls["idChofer"].disable(); // bloqueo el campo viaje

  } else { // no es un gasto general, entonces se asigna a un viaje y a un chofer
    this.formGasto.controls["idChofer"].enable(); // habilito el campo chofer 
   
  }
}
onSelectionTipoGasto(event : any){
 this.formGasto.controls["ntipogasto"].setValue(event.value); 
}

onSelectionUnidadGasto(event :any ){
   this.formGasto.controls["nunidgasto"].setValue(event.value); // actualizo el indice de la unidad seleccionada
}

calcularImporte(){

  var cant = this.formGasto.controls["cantgasto"].value;
  var pre = this.formGasto.controls["pregasto"].value;
  var imp = this.redondearAdos(cant * pre);
  this.formGasto.controls["impgasto"].setValue(imp);

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


