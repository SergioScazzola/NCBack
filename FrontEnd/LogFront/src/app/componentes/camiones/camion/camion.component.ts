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
import { marcaDTO } from '../../../../entidades/marcaDTO';
import { SelecTextDirective } from "../../../Directivas/selec-text.directive";

@Component({
  selector: 'app-camion',
  imports: [    MatFormField,
                 MatLabel,   
                 MatInputModule,      
                 MatSelectModule,
                 ReactiveFormsModule,                                
                 CommonModule,
                 DragDropModule,
                 FormsModule,],
  templateUrl: './camion.component.html',
  styleUrl: './camion.component.css',
})
export class CamionComponent {
 public nameInput = viewChild<ElementRef>('domChasis');
  formCamion       : FormGroup;
  operacion        : string = "";
  resumod          : string;
  ncamalta         : number;
  maxcam           : number;
  cempresas        : empTpteDTO[]=[];
  cmarcas          : marcaDTO[]=[];
  idEmpresaSel     : number = 1;
  idMarcaSel       : number;
  private camionn  : camionDTO;  
  
  constructor(  public fb           : FormBuilder,
                public servicio     : ServiciosService,
                public dialogRef    : MatDialogRef<CamionComponent>,
                @Inject(MAT_DIALOG_DATA) public data: intCamion,  
                private notiService : NotiserviceService )
   { effect(() => {
            this.nameInput()?.nativeElement.focus(); //enfoca  iniciar
        });

  }
 
  ngOnInit(){
      this.formCamion = this.fb.group({        
             nrocam       : [''], 
             domChasis    : ['',[Validators.required]],
             domAcoplado  : [''],
             idMarca      : [1],
             marca        : [''],
             modelo       : [''],
             anio         : [''],
             descrip      : [''],       
             idEmptpte    : [1],
             emptpte      : [''],
      })
      var subs1 : Subscription;
      subs1 = this.servicio.getEmpresas()
          .subscribe((data1:any):void =>{
            this.cempresas = data1;
            var subs : Subscription;
            subs = this.servicio.getMarcas()
              .subscribe((data2:any):void =>{
                this.cmarcas = data2;
                
                if (this.data.accion=="M"){ 
                 // MODIFICAR
                 var subs2 : Subscription;            
                 subs2 = this.servicio.leerCamion(this.data.nrocamion)
                  .subscribe((data3:any):void =>{                           
                    this.camionn   = data3;
                    this.operacion = "Modificar Camión Nro. "+this.data.nrocamion+" - "+this.data.descrip;
                    this.actualizarControles();
                  })
                 
                } else { // ALTA -> accion = "A"
                  var subs2 : Subscription;
                  subs2 = this.servicio.getCantCamiones()
                   .subscribe((data1:any):void =>{                           
                      this.maxcam = data1;
                      this.ncamalta = this.maxcam + 1;
                      this.operacion = "Agregar Camión Nro. "+this.ncamalta;
                      this.formCamion.controls["nrocam"].setValue(this.ncamalta);
                    })                                              
                }
              })            
          })                                               
         
   }
  actualizarControles(){
    // Actualiza controles para modificar
                        
    this.formCamion.controls["nrocam"].setValue(this.camionn.idCamion), 
    this.formCamion.controls["domChasis"].setValue(this.camionn.domChasis), 
    this.formCamion.controls["domAcoplado"].setValue(this.camionn.domAcoplado), 
    this.formCamion.controls["idMarca"].setValue(this.camionn.idMarca),                   
    this.formCamion.controls["marca"].setValue(this.camionn.marca),
    this.formCamion.controls["modelo"].setValue(this.camionn.modelo),                    
    this.formCamion.controls["anio"].setValue(this.camionn.anio),   
    this.formCamion.controls["descrip"].setValue(this.camionn.descrip),   
    this.formCamion.controls["idEmptpte"].setValue(this.camionn.idEmptpte),                    
    this.formCamion.controls["emptpte"].setValue(this.camionn.emptpte),                    
             
    this.idEmpresaSel = this.camionn.idEmptpte;
    this.idMarcaSel   = this.camionn.idMarca;
    
                           
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
                                                 this.formCamion.controls["anio"].value+" - "+
                                                 this.formCamion.controls["domChasis"].value )
  
}

onModeloChange(event : Event ){
 const target = event.target as HTMLInputElement;
 var modelo = target.value;
 this.formCamion.controls["descrip"].setValue(this.formCamion.controls["marca"].value+" "+
                                              modelo+" "+
                                              this.formCamion.controls["anio"].value+" - "+
                                              this.formCamion.controls["domChasis"].value)

}

onAnioChange(event : Event ){
  const target = event.target as HTMLInputElement;
  var anioo = target.value;
  this.formCamion.controls["descrip"].setValue(this.formCamion.controls["marca"].value+" "+
                                               this.formCamion.controls["modelo"].value+" "+
                                               anioo+" - "+
                                               this.formCamion.controls["domChasis"].value)
  
}
Anular(){
      this.dialogRef.close({ clicked : "Cancelar"})
     }
}
