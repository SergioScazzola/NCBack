import { ChangeDetectorRef, Component, effect, ElementRef, EventEmitter, Inject, Input, Output, viewChild, ViewChild } from '@angular/core';
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
import { CuitFormatDirective } from '../../../Directivas/cuit-format.directive';
import { cuitValidator } from '../../../servicios/cuit.validator';


export class AppModule {}

@Component({
  selector: 'app-chofer',
  standalone: true,
  imports: [    MatFormField,
                MatLabel,         
                MatInputModule,
                MatSelectModule,
                ReactiveFormsModule,  
                CuitFormatDirective,                
                CommonModule,
                DragDropModule,
                FormsModule,],
  templateUrl: './chofer.component.html',
  styleUrl: './chofer.component.css'
})
export class ChoferComponent {
 //@ViewChild('nombreempleado') nameInput: ElementRef;
  public nameInput = viewChild<ElementRef>('nombre');
  formChofer       : FormGroup;
  operacion        : string = "";
  resumod          : string;
  nchofalta        : number;
  maxchof          : number;
  cempresas        : empTpteDTO[]=[];
  idEmpresaSel     : number = 1;
  isloading        : boolean = true;
  private choferr  : choferDTO;  
  
  constructor(  public fb           : FormBuilder,
                public servicio     : ServiciosService,
                public dialogRef    : MatDialogRef<ChoferComponent>,
                private cdr         : ChangeDetectorRef,
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
       //   cuit       : ['',[Validators.pattern("^(20|23|24|25|27|30|33|34|40|41|45|46|47|49|55)[0-9]{8}[0-9]{1}$" )]],          
          // cuitValidator esta definida en servicios, y determina si el cuit el valido ó no
          cuit       : ['',[Validators.required,cuitValidator]],          
          nrodoc     : [''],   
          telefono   : [''],          
          nroempresa : [1],
          notas      : [''],     
          saldoini   : ['']   
      })
      var subs1 : Subscription;
      subs1 = this.servicio.getEmpresas()
          .subscribe((data:any):void =>{
            this.cempresas = data;
            if (this.data.accion=="M"){ 
               // MODIFICAR
               var subs2 : Subscription;            
               subs2 = this.servicio.leerChofer(this.data.nrochof)
                  .subscribe((data:any):void =>{                           
                    this.choferr = data;
                    this.operacion = "Modificar Chofer Nro. "+this.data.nrochof+" - "+this.data.nombre;
                    this.actualizarControles();
                    this.isloading = false;
                    this.cdr.detectChanges(); // <--- Asegura que el nuevo valor se pinte sin errores
                  })
                 
            } else { // ALTA -> accion = "A"
               var subs2 : Subscription;
               subs2 = this.servicio.getCantChoferes()
                  .subscribe((data:any):void =>{                           
                    this.maxchof = data;
                    this.nchofalta = this.maxchof + 1;
                    this.operacion = "Agregar Chofer Nro. "+this.nchofalta;
                    this.formChofer.controls["nrochof"].setValue(this.nchofalta);
                    this.isloading = false;
                    this.cdr.detectChanges(); // <--- Asegura que el nuevo valor se pinte sin errores
                   })                                              
            }
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
                  this.formChofer.controls["saldoini"].setValue(this.choferr.saldoini),    
                  this.idEmpresaSel = this.choferr.idEmpresa;
                  subscri1.unsubscribe;
                }))                                              
                .subscribe((data : any): void => {
                       this.choferr = data});
                           
   }

   AgregarChofer(){

    var indemp = this.cempresas.findIndex(p=>p.idEmpresa==this.idEmpresaSel);
    var cuitingre = this.formChofer.controls["cuit"].value;

    var chofer : choferDTO = {
        idChofer     : this.formChofer.controls["nrochof"].value,
        idEmpresa    : this.formChofer.controls["nroempresa"].value,   
        empresa      : this.cempresas[indemp].nombre,
        nombre       : this.formChofer.controls["nombre"].value,
        domicilio    : this.formChofer.controls["domicilio"].value,
        localidad    : this.formChofer.controls["localidad"].value,
        cuit         : cuitingre.slice(0,11)+"-"+cuitingre.slice(11),
        nrodoc       : this.formChofer.controls["nrodoc"].value,
        telefono     : this.formChofer.controls["telefono"].value,                  
        notas        : this.formChofer.controls["notas"].value,
        saldoini     : 0
 
    }   
    
        
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.grabarChofer(chofer)  
            .pipe(finalize(() => {   
             console.log("Error : "+resu);
             this.notiService.showNotification("El Chofer Nro. "+chofer.idChofer+" - "+
                                        chofer.nombre+" se ha agregado con éxito",'Aceptar','mensaje',500); 
                subscri.unsubscribe();
                this.dialogRef.close({ clicked : "Alta"})
                }))                  
           .subscribe((data : any): void => { resu = data });   
    }
    
    
    ModificarChofer(){
     var indemp = this.cempresas.findIndex(p=>p.idEmpresa==this.idEmpresaSel);
     var cuitingre = this.formChofer.controls["cuit"].value;
     if (cuitingre.length < 13){
        cuitingre = cuitingre.slice(0,11)+"-"+cuitingre.slice(11);
     }
     var chofer : choferDTO = {
        idChofer     : this.formChofer.controls["nrochof"].value,
        idEmpresa    : this.formChofer.controls["nroempresa"].value,   
        empresa      : this.cempresas[indemp].nombre,
        nombre       : this.formChofer.controls["nombre"].value,
        domicilio    : this.formChofer.controls["domicilio"].value,
        localidad    : this.formChofer.controls["localidad"].value,
        cuit         : cuitingre,
        nrodoc       : this.formChofer.controls["nrodoc"].value,
        telefono     : this.formChofer.controls["telefono"].value,                  
        notas        : this.formChofer.controls["notas"].value,
        saldoini     : this.formChofer.controls["saldoini"].value,
   
    }    
   
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.updateChofer(chofer.idChofer,chofer)  
            .pipe(finalize(() => {   
             this.notiService.showNotification("El Chofer Nro. "+this.data.nrochof+" - "+
                                                chofer.nombre+" se ha modificado con éxito",'Aceptar','mensaje',500); 
             subscri.unsubscribe();
             this.dialogRef.close({ clicked : "Modi"})
                }))                  
           .subscribe((data : any): void => {resu=data});   
    }
             
onSelectionEmpresa($event : any){
  // recibo un idEmpresa
 this.idEmpresaSel = $event.value;
 console.log("empresa : "+this.idEmpresaSel);
}


Anular(){
      this.dialogRef.close({ clicked : "Cancelar"})
     }
}
