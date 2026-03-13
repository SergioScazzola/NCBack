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
  imports: [    MatFormField,
                 MatLabel,   
                 MatInputModule,      
                 MatSelectModule,
                 MatDatepickerModule,
                 MatNativeDateModule,
                 ReactiveFormsModule,                                
                 CommonModule,
                 DragDropModule,
                 FormsModule,],
   providers : [
    { provide : DateAdapter, useClass: DateFnsAdapter },
    { provide : MAT_DATE_FORMATS, useValue: DATE_FORMATS},
    { provide : MAT_DATE_LOCALE, useValue: es}
  ],
  templateUrl: './viaje.component.html',
  styleUrl: './viaje.component.css',
})
export class ViajeComponent {
 public nameInput = viewChild<ElementRef>('fecha');
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
             fecha        : [''],
             idChofer     : [1],
             idCliente    : [1],
             idCamion     : [1],
             domChasis    : [''],
             origen       : [''],
             destino      : [''],
             ctg          : [''],
             cantkm       : [''],
             cargaton     : [''],
             tarifap      : [''],
             ltsgasoil    : [''],
             impviaje     : [''],
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
    this.formCamion.controls["domAcoplado"].setValue(this.camionn.domAcoplado), 
    this.formCamion.controls["idMarca"].setValue(this.camionn.idMarca),                   
    this.formCamion.controls["marca"].setValue(this.camionn.marca),
    this.formCamion.controls["modelo"].setValue(this.camionn.modelo),                    
    this.formCamion.controls["anio"].setValue(this.camionn.anio),   
    this.formCamion.controls["descrip"].setValue(this.camionn.descrip),   
    this.formCamion.controls["idEmptpte"].setValue(this.camionn.idEmptpte),                    
    this.formCamion.controls["emptpte"].setValue(this.camionn.emptpte),                    
             
    this.idEmpresaSel = this.camionn.idEmptpte;
    
                           
   }

   AgregarCamion(){

    var indemp = this.cempresas.findIndex(p=>p.idEmpresa==this.idEmpresaSel);
    var indmarca = this.cmarcas.findIndex(p=>p.idMarca==this.idMarcaSel);
    
    var camion : camionDTO = {
        idCamion     : this.formCamion.controls["nrocam"].value,
        idEmptpte    : this.formCamion.controls["idEmptpte"].value,   
        emptpte      : this.cempresas[indemp].nombre,
        domChasis    : this.formCamion.controls["domChasis"].value,
        domAcoplado  : this.formCamion.controls["domAcoplado"].value,
        descrip      : this.formCamion.controls["descrip"].value,
        idMarca      : this.formCamion.controls["idMarca"].value,
        marca        : this.cmarcas[indmarca].marca,
        modelo       : this.formCamion.controls["modelo"].value,
        anio         : this.formCamion.controls["anio"].value,                          
    }   
    
        
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.grabarCamion(camion)  
            .pipe(finalize(() => {   
             console.log("Error : "+resu);
             this.notiService.showNotification("El Camión Nro. "+camion.idCamion+" - "+
                                        camion.descrip+" se ha agregado con éxito",'Aceptar','mensaje',500); 
                subscri.unsubscribe();
                this.dialogRef.close({ clicked : "Alta"})
                }))                  
           .subscribe((data : any): void => { resu = data });   
    }
    
    
    ModificarCamion(){
     var indemp = this.cempresas.findIndex(p=>p.idEmpresa==this.idEmpresaSel);
     var indmarca = this.cmarcas.findIndex(p=>p.idMarca==this.idMarcaSel); 
     var camion : camionDTO = {
        idCamion     : this.formCamion.controls["nrocam"].value,
        idEmptpte    : this.formCamion.controls["idEmptpte"].value,   
        emptpte      : this.cempresas[indemp].nombre,
        domChasis    : this.formCamion.controls["domChasis"].value,
        domAcoplado  : this.formCamion.controls["domAcoplado"].value,
        descrip      : this.formCamion.controls["descrip"].value,
        idMarca      : this.formCamion.controls["idMarca"].value,
        marca        : this.cmarcas[indmarca].marca,
        modelo       : this.formCamion.controls["modelo"].value,
        anio         : this.formCamion.controls["anio"].value,      
   
    }    
   
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.updateCamion(camion.idCamion,camion)  
            .pipe(finalize(() => {   
             this.notiService.showNotification("El Camión Nro. "+this.data.nrocamion+" - "+
                                                camion.descrip+" se ha modificado con éxito",'Aceptar','mensaje',500); 
             subscri.unsubscribe();
             this.dialogRef.close({ clicked : "Modi"})
                }))                  
           .subscribe((data : any): void => {resu=data});   
    }
             
onSelectionEmpresa($event : any){
  // recibo un idEmpresa
 this.idEmpresaSel = $event.value;
 
}

onSelectionMarca($event : any){
   this.idMarcaSel = $event.value; 
   var indmarca = this.cmarcas.findIndex(p=>p.idMarca==this.idMarcaSel);
   this.formCamion.controls["marca"].setValue(this.cmarcas[indmarca].marca); 

   this.formCamion.controls["descrip"].setValue( this.cmarcas[indmarca].marca+" "+
                                                 this.formCamion.controls["modelo"].value+" "+
                                                 this.formCamion.controls["anio"].value+"-"+
                                                 this.formCamion.controls["domChasis"].value )
  
}

onModeloChange(event : Event ){
 const target = event.target as HTMLInputElement;
 var modelo = target.value;
 this.formCamion.controls["descrip"].setValue(this.formCamion.controls["marca"].value+" "+
                                              modelo+" "+
                                              this.formCamion.controls["anio"].value+"-"+
                                              this.formCamion.controls["domChasis"].value)

}

onAnioChange(event : Event ){
  const target = event.target as HTMLInputElement;
  var anioo = target.value;
  this.formCamion.controls["descrip"].setValue(this.formCamion.controls["marca"].value+" "+
                                               this.formCamion.controls["modelo"].value+" "+
                                               anioo+"-"+
                                               this.formCamion.controls["domChasis"].value)
  
}
Anular(){
      this.dialogRef.close({ clicked : "Cancelar"})
     }
}
