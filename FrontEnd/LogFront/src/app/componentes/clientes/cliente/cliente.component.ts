import { Component, effect, ElementRef, EventEmitter, Inject, Input, Output, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ServiciosService } from '../../../servicios/service';
import { NotiserviceService } from '../../../servicios/notiservice.service';
import { finalize, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { empTpteDTO } from '../../../../entidades/empTpteDTO';
import { CuitFormatDirective } from '../../../Directivas/cuit-format.directive';
import { cuitValidator } from '../../../servicios/cuit.validator';
import { clienteDTO, intCliente } from '../../../../entidades/clienteDTO';

@Component({
  selector: 'app-cliente',
 imports: [    MatFormField,
                MatLabel,         
                MatInputModule,
                MatSelectModule,
                ReactiveFormsModule,  
                CuitFormatDirective,                
                CommonModule,
                DragDropModule,
                FormsModule,],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
})
export class ClienteComponent {
 //@ViewChild('nombreempleado') nameInput: ElementRef;
  public nameInput = viewChild<ElementRef>('nombre');
  formCliente      : FormGroup;
  operacion        : string = "";
  resumod          : string;
  nclialta        : number;
  maxcli           : number;
 
  
  private clientee  : clienteDTO;  
  
  constructor(  public fb           : FormBuilder,
                public servicio     : ServiciosService,
                public dialogRef    : MatDialogRef<ClienteComponent>,
                @Inject(MAT_DIALOG_DATA) public data: intCliente,  
                private notiService : NotiserviceService )
   { effect(() => {
            this.nameInput()?.nativeElement.focus(); //enfoca fecha al iniciar
        });

  }
 
  ngOnInit(){
      this.formCliente = this.fb.group({        
          nrocliente : [''], 
          nombre     : ['',[Validators.required]],
          domicilio  : [''],
          localidad  : [''],
          telefono   : [''],     
          email      : [''],
          contacto   : [''],          
          cuit       : ['',[Validators.required,cuitValidator]],                                 
          notas      : [''],     
          saldoini   : [0]   
      })    
      if (this.data.accion=="M"){ 
          // MODIFICAR
          var subs2 : Subscription;            
          subs2 = this.servicio.leerCliente(this.data.nrocliente)
                  .subscribe((data:any):void =>{                           
                    this.clientee = data;
                    this.operacion = "Modificar Cliente Nro. "+this.data.nrocliente+" - "+this.data.nombre;
                    this.actualizarControles();
                  })                 
            } else { // ALTA -> accion = "A"
               var subs2 : Subscription;
               subs2 = this.servicio.getCantClientes()
                  .subscribe((data:any):void =>{                           
                    this.maxcli = data;
                    this.nclialta = this.maxcli + 1;
                    this.operacion = "Agregar Cliente Nro. "+this.nclialta;
                    this.formCliente.controls["nrocliente"].setValue(this.nclialta);
                   })                                              
            }
          
   }
  actualizarControles(){
    // Actualiza controles para modificar
         
        this.formCliente.controls["nrocliente"].setValue(this.clientee.idCliente);
        this.formCliente.controls["nombre"].setValue(this.clientee.nombre);
        this.formCliente.controls["domicilio"].setValue(this.clientee.domicilio);
        this.formCliente.controls["localidad"].setValue(this.clientee.localidad);
        this.formCliente.controls["telefono"].setValue(this.clientee.telefono);
        this.formCliente.controls["email"].setValue(this.clientee.email);
        this.formCliente.controls["cuit"].setValue(this.clientee.cuit);      
        this.formCliente.controls["contacto"].setValue(this.clientee.contacto);                                      
        this.formCliente.controls["notas"].setValue(this.clientee.notas);
        this.formCliente.controls["saldoini"].setValue(this.clientee.saldoini);                                                      
   }

   AgregarCliente(){    
    var cuitingre = this.formCliente.controls["cuit"].value;

    var cliente : clienteDTO = {
        idCliente     : this.formCliente.controls["nrocliente"].value,
        nombre        : this.formCliente.controls["nombre"].value,   
        domicilio     : this.formCliente.controls["domicilio"].value,           
        localidad     : this.formCliente.controls["localidad"].value,
        telefono      : this.formCliente.controls["telefono"].value,     
        email         : this.formCliente.controls["email"].value,      
        contacto      : this.formCliente.controls["contacto"].value,         
        cuit          : cuitingre.slice(0,11)+"-"+cuitingre.slice(11),                
        notas         : this.formCliente.controls["notas"].value,
        saldoini     : 0 
    }   
    
        
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.grabarCliente(cliente)  
            .pipe(finalize(() => {   
             console.log("Error : "+resu);
             this.notiService.showNotification("El Cliente Nro. "+cliente.idCliente+" - "+
                                        cliente.nombre+" se ha agregado con éxito",'Aceptar','mensaje',500); 
                subscri.unsubscribe();
                this.dialogRef.close({ clicked : "Alta"})
                }))                  
           .subscribe((data : any): void => { resu = data });   
    }
    
    
    ModificarCliente(){
   
     var cuitingre = this.formCliente.controls["cuit"].value;
     if (cuitingre.length < 13){
        cuitingre = cuitingre.slice(0,11)+"-"+cuitingre.slice(11);
     }
     var cliente : clienteDTO = {
        idCliente     : this.formCliente.controls["nrocliente"].value,
        nombre        : this.formCliente.controls["nombre"].value,   
        domicilio     : this.formCliente.controls["domicilio"].value,           
        localidad     : this.formCliente.controls["localidad"].value,
        telefono      : this.formCliente.controls["telefono"].value,  
        email         : this.formCliente.controls["email"].value,  
        contacto      : this.formCliente.controls["contacto"].value,         
        cuit          : cuitingre,                
        notas         : this.formCliente.controls["notas"].value,
        saldoini      :  this.formCliente.controls["saldoini"].value,
    }   
   
    var subscri : Subscription;
    var resu    : string;
    subscri = this.servicio.updateCliente(cliente.idCliente,cliente)  
            .pipe(finalize(() => {   
             this.notiService.showNotification("El Cliente Nro. "+this.data.nrocliente+" - "+
                                                cliente.nombre+" se ha modificado con éxito",'Aceptar','mensaje',500); 
             subscri.unsubscribe();
             this.dialogRef.close({ clicked : "Modi"})
                }))                  
           .subscribe((data : any): void => {resu=data});   
    }
             
Anular(){
      this.dialogRef.close({ clicked : "Cancelar"})
     }
}
