import { ChangeDetectorRef, Component, effect, ElementRef, Inject, viewChild } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { viajeDTO } from '../../../../../entidades/viajeDTO';
import { FormBuilder, FormGroup,Validators,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { choferDTO } from '../../../../../entidades/choferDTO';
import { ServiciosService } from '../../../../servicios/service';
import { intItFacTp } from '../../../../../entidades/itfactpDTO';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NotiserviceService } from '../../../../servicios/notiservice.service';
import { forkJoin } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
  providers : [
    CurrencyPipe ],
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
            } else { // data.accion = "A" -> Alta
           
             
              this.operacion = "Item "+this.data.nroitem+" - Fac."+this.data.nrofactura+" - Chofer: "+this.data.nomchof;    
              this.formItfac.controls["nroitem"].setValue(this.data.nroitem)
              this.isloading = false;
              this.cdr.detectChanges(); // <--- Asegura que el nuevo valor se pinte sin errores
              this.onSelectionViaje(0);
            };
      })
      
  }
            

  initFormulario() {
       this.formItfac = this.fb.group({        
             nroitem      : [this.data.nroitem], 
             idViaje      : [1],
             idChofer     : [this.data.ditFac.idChofer],
             origen       : [''],
             destino      : [''],
             tarifa       : [0],        
             cargaton     : [0],
             impneto      : [0],
             tasaiva      : [0],
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
     var cantkm = this.cviajes[indv].cantkm;
     var tarifa = this.redondearAdos(this.cviajes[indv].tarifap * 0.9);
     this.formItfac.controls['impneto'].setValue(this.cviajes[indv].cargaton);
     var importeneto = this.redondearAdos(cantkm * tarifa);
     var impo = this.currencyPipe.transform(importeneto, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['impneto'].setValue(impo);
     var tiva = this.formItfac.controls['tasaiva'].value / 100;
     var impiva = this.redondearAdos(importeneto * tiva);
     var impo = this.currencyPipe.transform(impiva, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['impiva'].setValue(impo);
     var totitem = importeneto + impiva;
     var impo = this.currencyPipe.transform(totitem, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['totalitem'].setValue(impo);


    }
    selectionoViaje(nroviaje : number){
      // Selecciono un viaje, calcular datos del item                      
     this.formItfac.controls['origen'].setValue(this.cviajes[nroviaje].origen);
     this.formItfac.controls['destino'].setValue(this.cviajes[nroviaje].destino);
     this.formItfac.controls['tarifa'].setValue(this.redondearAdos(this.cviajes[nroviaje].tarifap*0.9));
     this.formItfac.controls['cargaton'].setValue(this.cviajes[nroviaje].cargaton);
     var cantkm = this.cviajes[nroviaje].cantkm;
     var tarifa = this.redondearAdos(this.cviajes[nroviaje].tarifap * 0.9);
     this.formItfac.controls['impneto'].setValue(this.cviajes[nroviaje].cargaton);
     var importeneto = this.redondearAdos(cantkm * tarifa);
     var impo = this.currencyPipe.transform(importeneto, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['impneto'].setValue(impo);
     var tiva = this.formItfac.controls['tasaiva'].value / 100;
     var impiva = this.redondearAdos(importeneto * tiva);
     var impo = this.currencyPipe.transform(impiva, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['impiva'].setValue(impo);
     var totitem = importeneto + impiva;
     var impo = this.currencyPipe.transform(totitem, '$', 'symbol', '1.2-2', 'es-AR');
     this.formItfac.controls['totalitem'].setValue(impo);


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

  }

  ModificarItemFactp(){

  }

  Anular(){
      this.dialogRef.close({ clicked : "Cancelar"})
     }

}
