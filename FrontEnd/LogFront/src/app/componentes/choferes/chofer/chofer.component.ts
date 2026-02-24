import { Component, effect, ElementRef, EventEmitter, Inject, Input, Output, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ServiciosService } from '../../../servicios/service';
import { NotiserviceService } from '../../../servicios/notiservice.service';
import { finalize, Subscription } from 'rxjs';
import { choferDTO, intChofer } from '../../../../entidades/choferDTO';
import { CommonModule } from '@angular/common';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { empTpteDTO } from '../../../../entidades/empTpteDTO';

@Component({
  selector: 'app-chofer',
  standalone: true,
  imports: [    MatFormField,
                MatLabel,         
                MatInputModule,
                MatSelectModule,
                ReactiveFormsModule,                  
                CommonModule,
                DragDropModule,
                FormsModule,],
  templateUrl: './chofer.component.html',
  styleUrl: './chofer.component.css'
})
export class ChoferComponent {
 //@ViewChild('nombreempleado') nameInput: ElementRef;
  public nameInput = viewChild<ElementRef>('nombrechofer');
  formChofer       : FormGroup;
  operacion        : string;
  resumod          : string;
  nchofalta        : number;
  maxchof          : number;
  public cempresas : empTpteDTO[];
  idEmpresaSel     : Number;
  private choferr  : choferDTO;  
 

 
 
  constructor(  public fb           : FormBuilder,
                public servicio     : ServiciosService,
                public dialogRef    : MatDialogRef<ChoferComponent>,
                @Inject(MAT_DIALOG_DATA) public data: intChofer,  
                private notiService : NotiserviceService )
   { effect(() => {
            this.nameInput()?.nativeElement.focus(); //enfoca fecha al iniciar
        });

  }
 
  ngOnInit(){
      this.formChofer = this.fb.group({        
          nrochof     : [''], 
          nombre     : ['',[Validators.required]],
          domicilio  : [''],
          localidad  : [''],
          cuit       : [''],
          nrodoc     : [''],   
          telefono   : [''],          
          nroempresa : [''],
          notas      : [''],     
          saldoini   : ['']   
      })
      var subs1 : Subscription;
      subs1 = this.servicio.getEmpresas()
         .pipe(finalize(()=> {            
            subs1.unsubscribe();                        
            if (this.data.accion=="M"){ 
               // MODIFICAR
               var subs2 : Subscription;            
               subs2 = this.servicio.leerChofer(this.data.nrochof)
                 .pipe(finalize(()=> {            
                    subs2.unsubscribe()
                    this.operacion = "Modificar Chofer : "+this.data.nombre;
                    this.actualizarControles();
                 }))
                 .subscribe((data:any):void => {
                     this.choferr = data;
                 })
            } else { // ALTA -> accion = "A"
               var subs2 : Subscription;
               subs2 = this.servicio.getCantChoferes()
                 .pipe(finalize(()=> {            
                    subs2.unsubscribe()
                    this.nchofalta = this.maxchof+1;
                    this.operacion = "Agregar Chofer Nro. "+this.nchofalta;
                    this.formChofer.controls["nrochof"].setValue(this.nchofalta);
                 }))
                 .subscribe((data:any):void => {
                     this.maxchof = data;
                 })                                   
            }
          }))
          .subscribe((data:any):void => {
              this.cempresas = data;
          })
   }
  actualizarControles(){
    // Actualiza controles para modificar
         var subscri1 : Subscription;
        
         subscri1 =  this.servicio.leerChofer(this.data.nrochof)            
                .pipe(finalize(() => {                                        
                  this.formChofer.controls["nrochof"].setValue(this.choferr.idChofer), 
                  this.formChofer.controls["nombre"].setValue(this.choferr.nombre), 
                  this.formChofer.controls["domicilio"].setValue(this.choferr.domicilio),                    
                  this.formChofer.controls["localidad"].setValue(this.choferr.localidad),
                  this.formChofer.controls["cuit"].setValue(this.choferr.cuit),                    
                  this.formChofer.controls["nrodoc"].setValue(this.choferr.nrodoc),   
                  this.formChofer.controls["telefono"].setValue(this.choferr.telefono),   
                  this.formChofer.controls["nroempresa"].setValue(this.choferr.idEmpresa),                    
                  this.formChofer.controls["notas"].setValue(this.choferr.notas),      
                 
                  subscri1.unsubscribe;
                }))                                              
                .subscribe((data : any): void => {
                       this.choferr = data});
                           
   }

   AgregarChofer(){

    var indemp = this.cempresas.findIndex(p=>p.idEmpresa==this.idEmpresaSel);
    var chofer : choferDTO = {
        idChofer     : this.formChofer.controls["nrochof"].value,
        idEmpresa    : this.formChofer.controls["nroempresa"].value,   
        empresa      : this.cempresas[indemp].nombre,
        nombre       : this.formChofer.controls["nombre"].value,
        domicilio    : this.formChofer.controls["domicilio"].value,
        localidad    : this.formChofer.controls["localidad"].value,
        cuit         : this.formChofer.controls["cuit"].value,
        nrodoc       : this.formChofer.controls["nrodoc"].value,
        telefono     : this.formChofer.controls["telefono"].value,                  
        notas        : this.formChofer.controls["notas"].value,
   
    }   
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.grabarChofer(chofer)  
            .pipe(finalize(() => {   
             this.notiService.showNotification("El Chofer "+chofer.nombre+" se ha agregado con éxito",'Aceptar','mensaje',500); 
                subscri.unsubscribe();
                this.dialogRef.close({ clicked : "Alta"})
                }))                  
           .subscribe((data : any): void => { resu = data });   
    }
    
    
    ModificarChofer(){
     var indemp = this.cempresas.findIndex(p=>p.idEmpresa==this.idEmpresaSel);
     var chofer : choferDTO = {
        idChofer     : this.formChofer.controls["nrochof"].value,
        idEmpresa    : this.formChofer.controls["nroempresa"].value,   
        empresa      : this.cempresas[indemp].nombre,
        nombre       : this.formChofer.controls["nombre"].value,
        domicilio    : this.formChofer.controls["domicilio"].value,
        localidad    : this.formChofer.controls["localidad"].value,
        cuit         : this.formChofer.controls["cuit"].value,
        nrodoc       : this.formChofer.controls["nrodoc"].value,
        telefono     : this.formChofer.controls["telefono"].value,                  
        notas        : this.formChofer.controls["notas"].value,
   
    }    
   
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.updateChofer(chofer.idChofer,chofer)  
            .pipe(finalize(() => {   
             this.notiService.showNotification("El Chofer "+this.data.nombre+" se ha modificado con éxito",'Aceptar','mensaje',500); 
             subscri.unsubscribe();
             this.dialogRef.close({ clicked : "Modi"})
                }))                  
           .subscribe((data : any): void => {resu=data});   
    }
             
onSelectionEmpresa($event : any){

}
 
    Anular(){
      this.dialogRef.close({ clicked : "Cancelar"})
     }
}
