import { Component, effect, ElementRef, Inject, viewChild } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { viajeDTO } from '../../../../../entidades/viajeDTO';
import { FormBuilder, FormGroup,Validators,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { choferDTO } from '../../../../../entidades/choferDTO';
import { ServiciosService } from '../../../../servicios/service';
import { intItFacTp } from '../../../../../entidades/itfactpDTO';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';
import { NotiserviceService } from '../../../../servicios/notiservice.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-itfactp',
  imports: [ FormsModule,
             MatFormField,
             MatLabel,   
             MatInputModule,  
             CurrencyPipe,    
             MatSelectModule,
             ReactiveFormsModule,     
  ],
  templateUrl: './itfactp.component.html',
  styleUrl: './itfactp.component.css',
})
export class ItfactpComponent {
 public nameInput = viewChild<ElementRef>('nrofactura');
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
                @Inject(MAT_DIALOG_DATA) public data: intItFacTp,  
                private notiService : NotiserviceService )
  { effect(() => {
            this.nameInput()?.nativeElement.focus(); //enfoca  iniciar
        });

  }

 ngOnInit(){             
         
    
          // 1. Lanzamos las peticiones base en paralelo
      forkJoin({
              viajes: this.servicio.getViajesxChofer(this.data.ditFac.idChofer),                          
      }).subscribe(res => {         
            this.cviajes   = res.viajes;            
      });
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
     var nroviaje = event.value;
     var indv = this.cviajes.findIndex(p=>p.idViaje==nroviaje);

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

    redondearAdos(nro : number): number{  
    var numero : number = nro+0.005;
    // está redondeado a dos decimales, pero tiene mas de 2 decimales
    // convierto a cadena y le saco los decimales que no necesito
    var cade : string = String(numero);  
    var posi : number = cade.indexOf(".");
    numero = Number(cade.substring(0,posi+3));  
    return numero
  }  
 
}
