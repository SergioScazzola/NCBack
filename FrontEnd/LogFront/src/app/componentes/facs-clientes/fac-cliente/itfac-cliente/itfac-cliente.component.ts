import { ChangeDetectorRef, Component, effect, ElementRef, Inject, viewChild,LOCALE_ID } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { viajeDTO } from '../../../../../entidades/viajeDTO';
import { FormBuilder, FormGroup,Validators,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { choferDTO } from '../../../../../entidades/choferDTO';
import { ServiciosService } from '../../../../servicios/service';
import { intItFacTp } from '../../../../../entidades/itfactpDTO';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NotiserviceService } from '../../../../servicios/notiservice.service';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { intItFacCl, itfacclDTO } from '../../../../../entidades/itfacclDTO';

@Component({
  selector: 'app-itfac-cliente',
   imports: [ MatFormField,
                 MatLabel,   
                 MatInputModule,      
                 MatSelectModule,
                 ReactiveFormsModule,                                        
                 CommonModule,
                 DragDropModule,
                 FormsModule],
  providers : [ CurrencyPipe,{ provide: LOCALE_ID, useValue: 'es-AR' }
    ],                 
  templateUrl: './itfac-cliente.component.html',
  styleUrl: './itfac-cliente.component.css',
})
export class ItfacClienteComponent {
//public nameInput = viewChild<ElementRef>('idViaje');
 isloading        : boolean = true;
 cviajes          : viajeDTO[]=[];
 cchoferes        : choferDTO[]=[];
 operacion        : string;
 formItfac        : FormGroup;
 idviajeSel      : number = 1;

   constructor( public fb           : FormBuilder,
                public servicio     : ServiciosService,
                public dialogRef    : MatDialogRef<ItfacClienteComponent>,
                private currencyPipe: CurrencyPipe,
                public  dialog      : MatDialog,  
                private cdr         : ChangeDetectorRef,         
                @Inject(MAT_DIALOG_DATA) public data: intItFacCl,  
                private notiService : NotiserviceService )
  { /*effect(() => {
            this.nameInput()?.nativeElement.focus(); //enfoca  iniciar
        });*/
          
  }

  ngAfterViewInit() {
      this.isloading = false; // refrescar la vista si no llego a renderizar  
  }

 ngOnInit(){     
     this.initFormulario();        
      
      // 1. Lanzamos las peticiones base en paralelo
    forkJoin({
              viajes: this.servicio.getViajesxCliente(this.data.nrocli),                          
            }).subscribe(res => {         
             this.cviajes   = res.viajes;            
             this.isloading = false;
             this.cdr.markForCheck(); // <--- Asegura que el nuevo valor se pinte sin errores  //        
            if (this.data.accion === "V") {  // sólo visualizar item
                 this.operacion = "Item "+this.data.nroitem+" - Fac."+this.data.nrofactura+" - Cliente : "+this.data.nomcli;                    
                 this.idviajeSel = this.data.ditFac.idViaje;
                 this.actualizarFormulario();
            } else if (this.data.accion === "A") { // data.accion = "A" -> Alta
           
                 this.operacion = "Item "+this.data.nroitem+" - Fac."+this.data.nrofactura+" - Cliente : "+this.data.nomcli;    
                 this.formItfac.controls["nroitem"].setValue(this.data.nroitem);
                 this.formItfac.controls["idViaje"].setValue(this.cviajes[0].idViaje);
                 this.formItfac.controls["nomchofer"].setValue(this.cviajes[0].nomchofer);                 
                 if (this.cviajes.length > 0) {
                   this.idviajeSel = this.cviajes[0].idViaje;
                   this.formItfac.controls["idViaje"].setValue(this.idviajeSel);                   
                   this.seleccionoViaje(0);
                   this.isloading = false;
                   this.cdr.markForCheck(); // <--- Asegura que el nuevo valor se pinte sin errores  //     
                 } else {
                    this.notiService.showNotification("El cliente seleccionado no tiene viajes disponibles", "Cerrar", "error", 5000);
                    
                 };
                

            };
      })
                                           
  }
            

  initFormulario() {
      
       this.formItfac = this.fb.group({        
             nroitem      : [this.data.nroitem], 
             idViaje      : [0],
             nomchofer    : [''],
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
actualizarFormulario(){
       var indv = this.cviajes.findIndex(p=>p.idViaje == this.idviajeSel);
       this.formItfac.controls['nroitem'].setValue(this.data.ditFac.nroitem);
       this.formItfac.controls['idViaje'].setValue(this.data.ditFac.idViaje);
       this.formItfac.controls['nomchofer'].setValue(this.cviajes[indv].nomchofer);
       this.formItfac.controls['origen'].setValue(this.data.ditFac.origen);
       this.formItfac.controls['destino'].setValue(this.data.ditFac.destino);
       this.formItfac.controls['tarifa'].setValue(this.data.ditFac.tarifa);
       this.formItfac.controls['cargaton'].setValue(this.data.ditFac.cargaton);
       this.formItfac.controls['cantkm'].setValue(this.data.ditFac.cantkm);
       this.formItfac.controls['ltsgasoil'].setValue(this.data.ditFac.ltsgasoil);
       this.formItfac.controls['impneto'].setValue(this.data.ditFac.impneto);
       this.formItfac.controls['impiva'].setValue(this.data.ditFac.impiva);
       this.formItfac.controls['totalitem'].setValue(this.data.ditFac.totalitem);
       
}
    onSelectionViaje(event : any){
      // Selecciono un viaje, calcular datos del item
      var indv     : number;    
      var nroviaje = event.value;
      this.idviajeSel = nroviaje;
      indv = this.cviajes.findIndex(p=>p.idViaje==nroviaje);
      
     this.formItfac.controls['nomchofer'].setValue(this.cviajes[indv].nomchofer);        
     this.formItfac.controls['origen'].setValue(this.cviajes[indv].origen);
     this.formItfac.controls['destino'].setValue(this.cviajes[indv].destino);
     this.formItfac.controls['tarifa'].setValue(this.redondearAdos(this.cviajes[indv].tarifap));
     this.formItfac.controls['cargaton'].setValue(this.cviajes[indv].cargaton);
     this.formItfac.controls['cantkm'].setValue(this.cviajes[indv].cantkm);
     this.formItfac.controls['ltsgasoil'].setValue(this.cviajes[indv].ltsgasoil);
     var cantkm = this.cviajes[indv].cantkm;
     var tarifa = this.redondearAdos(this.cviajes[indv].tarifap);// el viaje se carga con tarifa plena
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
     this.formItfac.controls['nomchofer'].setValue(this.cviajes[indv].nomchofer);              
     this.formItfac.controls['origen'].setValue(this.cviajes[indv].origen);
     this.formItfac.controls['destino'].setValue(this.cviajes[indv].destino);
     this.formItfac.controls['tarifa'].setValue(this.redondearAdos(this.cviajes[indv].tarifap*0.9));
     this.formItfac.controls['cargaton'].setValue(this.cviajes[indv].cargaton);
     this.formItfac.controls['cantkm'].setValue(this.cviajes[indv].cantkm);
     this.formItfac.controls['ltsgasoil'].setValue(this.cviajes[indv].ltsgasoil);
     var cantkm = this.cviajes[indv].cantkm;
     var tarifa = this.redondearAdos(this.cviajes[indv].tarifap);// el viaje se carga con tarifa plena
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

retornarItemFactp(){ // Devuelve un objeto "itfactpDTO" para que el componente padre lo agregue a la lista
  // Completa los datos del item agregado 
    var indv = this.cviajes.findIndex(p=>p.idViaje == this.idviajeSel);
    console.log("indice de Viajeeeeeeeee : "+indv);
    var iteem : itfacclDTO = {
       idFactura    : this.data.ditFac.idFactura,
       nroitem      : this.formItfac.controls["nroitem"].value,      
       idViaje      : this.formItfac.controls["idViaje"].value,
       idChofer     : this.cviajes[indv].idChofer,
       nomChofer    : this.cviajes[indv].nomchofer, // el nombre del chofer lo saco del viaje seleccionado
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

aceptarItemFactp(){
    this.dialogRef.close({ clicked : "Ver"})
}
}
