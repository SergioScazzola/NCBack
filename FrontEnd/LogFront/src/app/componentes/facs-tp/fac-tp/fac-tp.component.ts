import { Component, effect, ElementRef, Inject, viewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, finalize } from 'rxjs';
import { DatePipe,DecimalPipe} from '@angular/common';
import { NotiserviceService } from '../../../servicios/notiservice.service';
import { ServiciosService } from '../../../servicios/service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelecTextDirective } from "../../../Directivas/selec-text.directive";
import { factpDTO, intFacTp } from '../../../../entidades/factpDTO';
import { choferDTO } from '../../../../entidades/choferDTO';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import {es} from 'date-fns/locale';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule} from '@angular/material/core';
import { itfactpDTO } from '../../../../entidades/itfactpDTO';
import {MatDatepickerModule,MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';

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
  selector: 'app-fac-tp',
 imports: [    MatFormField,
                 MatLabel,   
                 MatInputModule,      
                 MatSelectModule,
                 ReactiveFormsModule,     
                 MatDatepickerModule,     
                 MatTableModule,                      
                 CommonModule,
                 DragDropModule,
                 FormsModule,],
 providers : [
    { provide : DateAdapter, useClass: DateFnsAdapter },
    { provide : MAT_DATE_FORMATS, useValue: DATE_FORMATS},
    { provide : MAT_DATE_LOCALE, useValue: es}
  ],                 
  templateUrl: './fac-tp.component.html',
  styleUrl: './fac-tp.component.css',
})
export class FacTpComponent {
  public nameInput = viewChild<ElementRef>('nrofactura');
  cfacstp          : factpDTO[]=[];
  cdetfactp        : itfactpDTO[]=[];
  cchoferes        : choferDTO[]=[];
  operacion        : string;
  formFactp        : FormGroup;
  idchoferSel      : number;
  maxfactp         : number;
  nfactpalta       : number;
  private factpp   : factpDTO;  
  
  constructor(  public fb           : FormBuilder,
                public servicio     : ServiciosService,
                public dialogRef    : MatDialogRef<FacTpComponent>,
                @Inject(MAT_DIALOG_DATA) public data: intFacTp,  
                private notiService : NotiserviceService )
   { effect(() => {
            this.nameInput()?.nativeElement.focus(); //enfoca  iniciar
        });

  }
  colDFactp : string[] = ["nroitem",]
  ngOnInit(){
   
      this.formFactp = this.fb.group({        
             idFactura    : [''], 
             nrofactura   : ['',[Validators.required]],
             facndc       : ['',[Validators.required, Validators.pattern(/^(FAC|NDC)$/)]],
             fecha        : [new Date()],
             idChofer     : [''],
             impneto      : [0],
             tasaiva      : [21,[Validators.required,Validators.pattern("^[1-9]+([.]?[0-9]{1,2})?$")]],
             impiva       : [0],       
             totalfac     : [0],
             cantit       : [0]
             
      })
      var subs : Subscription;
      subs = this.servicio.getItemsFacsTP(this.data.idFactura)
         .subscribe((data2:any):void => {
           this.cdetfactp = data2;
           var subs1 : Subscription;
           subs1 = this.servicio.getFacsTP()
           .subscribe((data1:any):void =>{
               this.cfacstp = data1;                       
               if (this.data.accion=="M"){ 
                // MODIFICAR
                var subs2 : Subscription;            
                subs2 = this.servicio.leerFacTP(this.data.idFactura)
                  .subscribe((data3:any):void =>{                           
                    this.factpp   = data3;
                    this.operacion = "Modificar Factura tpte Nro. "+this.data.idFactura+" - "+this.data.nrofactura;
                    this.actualizarControles();
                  })
                 
               } else { // ALTA -> accion = "A"
                  var subs2 : Subscription;
                  subs2 = this.servicio.getCantFacsTP()
                   .subscribe((data1:any):void =>{                           
                      this.maxfactp = data1;
                      this.nfactpalta = this.maxfactp + 1;
                      this.operacion = "Agregar Factura Tpte. Nro. "+this.nfactpalta;
                      this.formFactp.controls["idFactura"].setValue(this.nfactpalta);
                    })                                              
                }
           })
         })
           
                                                                            
   }
  actualizarControles(){
   
    this.formFactp.controls["idFactura"].setValue(this.factpp.idFactura), 
    this.formFactp.controls["nrofactura"].setValue(this.factpp.nrofactura),              
    this.formFactp.controls["facndc"].setValue(this.factpp.facndc), 
    this.formFactp.controls["fecha"].setValue(this.factpp.fecha), 
    this.formFactp.controls["idChofer"].setValue(this.factpp.idChofer), 
    this.formFactp.controls["impneto"].setValue(this.factpp.impneto), 
    this.formFactp.controls["tasaiva"].setValue(this.factpp.tasaiva), 
    this.formFactp.controls["impiva"].setValue(this.factpp.impiva), 
    this.formFactp.controls["totalfac"].setValue(this.factpp.totalfac), 
    this.formFactp.controls["cantit"].setValue(this.factpp.cantit), 
    this.idchoferSel = this.factpp.idChofer;
  
                           
   }

   AgregarCamion(){

    var indchof = this.cchoferes.findIndex(p=>p.idChofer==this.idchoferSel);
    
    
    var factp : factpDTO = {
        idFactura     : this.formFactp.controls["idFactura"].value,
        nrofactura    : this.formFactp.controls["nrofactura"].value,   
        facndc        : this.formFactp.controls["facndc"].value,   
        fecha         : this.formFactp.controls["fecha"].value,   
        idChofer      : this.formFactp.controls["idChofer"].value,   
        nomchofer     : this.cchoferes[indchof].nombre,
        impneto       : this.formFactp.controls["impneto"].value,   
        tasaiva       : this.formFactp.controls["tasaiva"].value,   
        impiva        : this.formFactp.controls["impiva"].value,   
        totalfac      : this.formFactp.controls["totalfac"].value,   
        cantit        : this.formFactp.controls["cantit"].value,   
        
    }   
    
        
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.grabarFacTP(factp)  
            .pipe(finalize(() => {   
             console.log("Error : "+resu);
             this.notiService.showNotification("La Factura de tpte Nro. "+factp.idFactura+" - "+
                                        factp.nrofactura+" se ha agregado con éxito",'Aceptar','mensaje',500); 
                subscri.unsubscribe();
                this.dialogRef.close({ clicked : "Alta"})
                }))                  
           .subscribe((data : any): void => { resu = data });   
    }
    
    
    ModificarCamion(){
      var indchof = this.cchoferes.findIndex(p=>p.idChofer==this.idchoferSel);
    
    
      var factp : factpDTO = {
        idFactura     : this.formFactp.controls["idFactura"].value,
        nrofactura    : this.formFactp.controls["nrofactura"].value,   
        facndc        : this.formFactp.controls["facndc"].value,   
        fecha         : this.formFactp.controls["fecha"].value,   
        idChofer      : this.formFactp.controls["idChofer"].value,   
        nomchofer     : this.cchoferes[indchof].nombre,
        impneto       : this.formFactp.controls["impneto"].value,   
        tasaiva       : this.formFactp.controls["tasaiva"].value,   
        impiva        : this.formFactp.controls["impiva"].value,   
        totalfac      : this.formFactp.controls["totalfac"].value,   
        cantit        : this.formFactp.controls["cantit"].value,   
   
    }    
   
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.updateFacTP(factp.idFactura,factp)  
            .pipe(finalize(() => {   
             this.notiService.showNotification("La Factura de tpte Nro. "+factp.idFactura+" - "+
                                                factp.nrofactura+" se ha modificado con éxito",'Aceptar','mensaje',500); 
             subscri.unsubscribe();
             this.dialogRef.close({ clicked : "Modi"})
                }))                  
           .subscribe((data : any): void => {resu=data});   
    }
             
onSelectionChofer($event : any){
  // recibo un idChofer
 this.idchoferSel = $event.value;
 
}

 onFechaChange(event: any) {
    const nuevaFecha: Date = event.value; // Fecha seleccionada en el datepicker
    const ahora = new Date(); // Hora actual
  
    // Copiar la hora actual a la fecha seleccionada
    nuevaFecha.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds(), 0);
  
    // Establecer la fecha con hora en el form
    this.formFactp.controls['fecha'].setValue(nuevaFecha);
  }

Anular(){
      this.dialogRef.close({ clicked : "Cancelar"})
     }
}
