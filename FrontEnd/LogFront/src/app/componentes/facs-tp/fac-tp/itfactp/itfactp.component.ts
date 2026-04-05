import { ChangeDetectorRef, Component, effect, ElementRef, Inject, viewChild,LOCALE_ID } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { viajeDTO } from '../../../../../entidades/viajeDTO';
import { FormBuilder, FormGroup,Validators,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { choferDTO } from '../../../../../entidades/choferDTO';
import { ServiciosService } from '../../../../servicios/service';
import { intItFacTp, itfactpDTO } from '../../../../../entidades/itfactpDTO';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NotiserviceService } from '../../../../servicios/notiservice.service';
import { forkJoin } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';

registerLocaleData(localeEsAr);

@Component({
  selector: 'app-itfactp',
  imports: [    MatFormField,
                 MatLabel,   
                 MatInputModule,      
                 MatSelectModule,
                 ReactiveFormsModule,                                        
                 CommonModule,
                 DragDropModule,
                 FormsModule,],
  providers : [ CurrencyPipe,{ provide: LOCALE_ID, useValue: 'es-AR' }
    ],
  templateUrl: './itfactp.component.html',
  styleUrl: './itfactp.component.css',
})

export class ItfactpComponent {
 //public nameInput = viewChild<ElementRef>('idViaje');
 isloading        : boolean = true;
 cviajes          : viajeDTO[]=[];
 cchoferes        : choferDTO[]=[];
 operacion        : string;
 formItfac        : FormGroup;
 idchoferSel      : number = 1;

   constructor( public fb           : FormBuilder,
                public servicio     : ServiciosService,
                public dialogRef    : MatDialogRef<ItfactpComponent>,
                private currencyPipe: CurrencyPipe,
                public  dialog      : MatDialog,  
                private cdr         : ChangeDetectorRef,         
                @Inject(MAT_DIALOG_DATA) public data: intItFacTp,  
                private notiService : NotiserviceService )
  { /*effect(() => {
            this.nameInput()?.nativeElement.focus(); //enfoca  iniciar
        });*/
          
  }

 ngOnInit(){     
      this.initFormulario();        
      
      // 1. Lanzamos las peticiones base en paralelo
      forkJoin({
              viajes: this.servicio.getViajesxChofer(this.data.ditFac.idChofer),                          
      }).subscribe(res => {         
            this.cviajes   = res.viajes;             
            if (this.data.accion === "M") {
              /*  this.servicio.leerI(this.data.idFactura).subscribe(data4 => {
           this.factpp = data4;
           this.operacion = `Modificar Factura tpte Nro. ${this.data.idFactura} - ${this.data.nrofactura}`;
           this.actualizarControles();
           this.cdr.detectChanges(); // <--- Importante: fuerza la detección si sigue el error
            });*/
            } else if (this.data.accion === "A") { // data.accion = "A" -> Alta
           
                 this.operacion = "Item "+this.data.nroitem+" - Fac."+this.data.nrofactura+" - Chofer: "+this.data.nomchof;    
                 this.formItfac.controls["nroitem"].setValue(this.data.nroitem);
                 this.formItfac.controls["idViaje"].setValue(this.cviajes[0].idViaje)
                 this.seleccionoViaje(0);
                 if (this.cviajes.length > 0) {
                   this.formItfac.controls["idViaje"].setValue(this.cviajes[0].idViaje);
                   this.seleccionoViaje(0);
                  
                 } else {
                    this.notiService.showNotification("El chofer seleccionado no tiene viajes disponibles", "Cerrar", "error", 5000);
                 };
                 this.isloading = false;
                 this.cdr.detectChanges(); // <--- Asegura que el nuevo valor se pinte sin errores

            };
      })
      
  }
            

  initFormulario() {
       this.formItfac = this.fb.group({        
             nroitem      : [this.data.nroitem], 
             idViaje      : [0],
             idChofer     : [this.data.ditFac.idChofer],
             origen       : [''],
             destino      : [''],
             tarifa       : [0],        
             cargaton     : [0],
             cantkm       : [0],
             ltsgasoil    : [0],
             impneto      : [0],            
             impiva       : [0],       
             totalitem    : [0],             
      })    
    }   

    onSelectionViaje(event : any){
      // Selecciono un viaje, calcular datos del item
      var indv     : number;
      var nroviaje : number;
      if (typeof(event)=='number'){ // recibi un numero
         indv = 0;
      } else { // recibi un evento
         nroviaje = event.value;
         indv = this.cviajes.findIndex(p=>p.idViaje==nroviaje);
      }
            
     this.formItfac.controls['origen'].setValue(this.cviajes[indv].origen);
     this.formItfac.controls['destino'].setValue(this.cviajes[indv].destino);
     this.formItfac.controls['tarifa'].setValue(this.redondearAdos(this.cviajes[indv].tarifap*0.9));
     this.formItfac.controls['cargaton'].setValue(this.cviajes[indv].cargaton);
     this.formItfac.controls['cantkm'].setValue(this.cviajes[indv].cantkm);
     this.formItfac.controls['ltsgasoil'].setValue(this.cviajes[indv].ltsgasoil);
     var cantkm = this.cviajes[indv].cantkm;
     var tarifa = this.redondearAdos(this.cviajes[indv].tarifap * 0.9);// el viaje se carga con tarifa plena
     var importe = cantkm * tarifa
     var importeneto = this.redondearAdos(importe);
     // var impo = this.currencyPipe.transform(importeneto, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['impneto'].setValue(importeneto);
  
     var impiva = importeneto * (this.servicio.getTasaIVA() / 100);
     var impivaa = this.redondearAdos(impiva);
     //var impo = this.currencyPipe.transform(impiva, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['impiva'].setValue(impivaa);
     var totitem = importeneto + impivaa;
     //var impo = this.currencyPipe.transform(totitem, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['totalitem'].setValue(totitem);

    }
    seleccionoViaje(indv : number){
      // Selecciono el primer viaje de la lista, calcular datos del item       
                    
     this.formItfac.controls['origen'].setValue(this.cviajes[indv].origen);
     this.formItfac.controls['destino'].setValue(this.cviajes[indv].destino);
     this.formItfac.controls['tarifa'].setValue(this.redondearAdos(this.cviajes[indv].tarifap*0.9));
     this.formItfac.controls['cargaton'].setValue(this.cviajes[indv].cargaton);
     this.formItfac.controls['cantkm'].setValue(this.cviajes[indv].cantkm);
     this.formItfac.controls['ltsgasoil'].setValue(this.cviajes[indv].ltsgasoil);
     var cantkm = this.cviajes[indv].cantkm;
     var tarifa = this.redondearAdos(this.cviajes[indv].tarifap * 0.9);// el viaje se carga con tarifa plena
     var importe = cantkm * tarifa
     var importeneto = this.redondearAdos(importe);
     // var impo = this.currencyPipe.transform(importeneto, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['impneto'].setValue(importeneto);
               
     var impiva = importeneto * (this.servicio.getTasaIVA() / 100);
     var impivaa = this.redondearAdos(impiva);
     //var impo = this.currencyPipe.transform(impiva, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['impiva'].setValue(impivaa);
     var totitem = importeneto + impivaa;
     //var impo = this.currencyPipe.transform(totitem, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['totalitem'].setValue(totitem);

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

AgregarItemFactp(){
  // Completa los datos del item agregado 
   
    var iteem : itfactpDTO = {
       idFactura    : this.data.ditFac.idFactura,
       nroitem      : this.formItfac.controls["nroitem"].value,      
       idViaje      : this.formItfac.controls["idViaje"].value,
       idChofer     : this.formItfac.controls["idChofer"].value,
       nomChofer    : this.cviajes[0].nomchofer, // el nombre del chofer lo saco del viaje seleccionado
       origen       : this.formItfac.controls["origen"].value,
       destino      : this.formItfac.controls["destino"].value,
       tarifa       : this.formItfac.controls["tarifa"].value,
       cargaton     : this.formItfac.controls["cargaton"].value,
       cantkm       : this.formItfac.controls["cantkm"].value,
       ltsgasoil    : this.formItfac.controls["ltsgasoil"].value,
       impneto      : this.formItfac.controls["impneto"].value,
       impiva       : this.formItfac.controls["impiva"].value,
       totalitem    : this.formItfac.controls["totalitem"].value,
    }          
    this.dialogRef.close( {clicked : "Alta",
                           item: { ...iteem }
                          }) // Devuelvo el item creado al componente padre para que lo agregue al detalle


}


ModificarItemFactp(){

  }

  Anular(){
      this.dialogRef.close({ clicked : "Cancelar"})
     }

}
