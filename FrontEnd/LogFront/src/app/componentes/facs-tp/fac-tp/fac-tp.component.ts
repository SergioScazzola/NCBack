import { ChangeDetectorRef, Component, effect, ElementRef, Inject, NgZone, viewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subscription, finalize, forkJoin } from 'rxjs';
import { CurrencyPipe,DatePipe,DecimalPipe} from '@angular/common';
import { NotiserviceService } from '../../../servicios/notiservice.service';
import { ServiciosService } from '../../../servicios/service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelecTextDirective } from "../../../Directivas/selec-text.directive";
import { factpDTO, intFacTp } from '../../../../entidades/factpDTO';
import { choferDTO } from '../../../../entidades/choferDTO';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import {es} from 'date-fns/locale';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule} from '@angular/material/core';
import { intItFacTp, itfactpDTO } from '../../../../entidades/itfactpDTO';
import {MatDatepickerModule,MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { ItfactpComponent } from '../../facs-tp/fac-tp/itfactp/itfactp.component'

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
    CurrencyPipe,
    { provide : DateAdapter, useClass: DateFnsAdapter },
    { provide : MAT_DATE_FORMATS, useValue: DATE_FORMATS},
    { provide : MAT_DATE_LOCALE, useValue: es},
    
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
  idchoferSel      : number = 1;
  maxfactp         : number;
  nfactpalta       : number;
  totfactura       : number;
  factpp           : factpDTO = {
     idFactura      : 0,
     nrofactura     : "",
     facndc         : "FAC",  // fac : suma, ndc : resta
     fecha          : new Date(),
     idChofer       : 1,
     nomchofer      : "",
     cantit         : 0,        
     impneto        : 0, 
     tasaiva        : 0,
     impiva         : 0,
     totalfac       : 0
  };  
  itemfac : itfactpDTO = {
    
    idFactura      : 0,    
    nroitem        : 1,
    idViaje        : 0,
    idChofer       : 0,
    nomChofer      : "", 
    origen         : "",
    destino        : "",
    tarifa         : 0,  // tarifa del tpte = 0.9 * tarifa plena
    cargaton       : 0,
    impneto        : 0,
    tasaiva        : 0,
    impiva         : 0,
    totalitem      : 0
  };
  
  
  constructor(  public fb           : FormBuilder,
                public servicio     : ServiciosService,
                public dialogRef    : MatDialogRef<FacTpComponent>,
                private currencyPipe: CurrencyPipe,
                public  dialog      : MatDialog,
                private cdr         : ChangeDetectorRef,
                private zone        : NgZone,
                @Inject(MAT_DIALOG_DATA) public data: intFacTp,  
                private notiService : NotiserviceService )
   { effect(() => {
            this.nameInput()?.nativeElement.focus(); //enfoca  iniciar
        });

  }
  colDFactp : string[] = ["nroitem","idViaje","origen","destino","nomchofer","totalitem","M"]
  ngOnInit(){             
      this.cdetfactp.push(this.itemfac);
     
      this.initFormulario();
          // 1. Lanzamos las peticiones base en paralelo
      forkJoin({
              choferes: this.servicio.getChoferes(),
              //itfac   : this.servicio.getItemsFacsTP(this.data.idFactura),
              facturas: this.servicio.getFacsTP()
      }).subscribe(res => {
              this.cchoferes = res.choferes;
              //this.cdetfactp = res.itfac;
              this.cfacstp   = res.facturas;
      
          // 2. Ahora que tenemos los maestros, ejecutamos la lógica de negocio
       
      if (this.data.accion === "M") {
         this.servicio.leerFacTP(this.data.idFactura).subscribe(data4 => {
           this.factpp = data4;
           this.operacion = `Modificar Factura tpte Nro. ${this.data.idFactura} - ${this.data.nrofactura}`;
           this.actualizarControles();
           this.cdr.detectChanges(); // <--- Importante: fuerza la detección si sigue el error
            });
      } else { // data.accion = "A" -> Alta
           this.mostrarHora();
           this.servicio.getCantFacsTP().subscribe(max => {
           this.maxfactp = max;
           this.nfactpalta = this.maxfactp + 1;
           this.operacion = "Agregar Factura tpte. Nro. " + this.nfactpalta;
           this.formFactp.controls["idFactura"].setValue(this.nfactpalta);
           var indchofer = this.cchoferes.findIndex(p=>p.idChofer=this.idchoferSel);
           this.factpp.nomchofer = this.cchoferes[indchofer].nombre;   
           this.cdr.detectChanges(); // <--- Asegura que el nuevo valor se pinte sin errores
          });
      }
      });                                                                               
   }
   
   initFormulario() {
     this.formFactp = this.fb.group({        
             idFactura    : [''], 
             nrofactura   : ['',[Validators.required]],
             facndc       : ['FAC',[Validators.required, Validators.pattern(/^(FAC|NDC)$/)]],
             fecha        : [new Date()],
             idChofer     : [1],
             impneto      : [0],
             tasaiva      : [21,[Validators.required,Validators.pattern("^[1-9]+([.]?[0-9]{1,2})?$")]],
             impiva       : [0],       
             totalfac     : [0],
             cantit       : [0]   
      })       

    }
  actualizarControles(){
    var indchofer = this.cchoferes.findIndex(p=>p.idChofer=this.idchoferSel);
    this.factpp.nomchofer = this.cchoferes[indchofer].nombre;
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
    this.factpp.nomchofer = this.cchoferes[indchofer].nombre;
                           
   }

   AgregarFactp(){

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
    
    
    ModificarFactp(){
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
agItemFactp(){

   const datas : intItFacTp = {
     idFactura :  this.data.accion=="A"?this.nfactpalta :this.data.idFactura, // si es modif el nro de cobro viene en data
     nroitem   : this.cdetfactp.length + 1,   
     nomchof   : this.factpp.nomchofer,
     accion   : "A",
     ditFac   : {   // donde se recibe  el item creado 
      idFactura      : this.data.accion=="A"?this.nfactpalta:this.data.idFactura,
      nroitem        : this.cdetfactp.length + 1,  
      idViaje        : 0,           
      idChofer       : this.factpp.idChofer,
      nomChofer      : "",
      origen         : "",
      destino        : "",
      tarifa         : 0,
      cargaton       : 0,
      impneto        : 0,
      tasaiva        : 0,
      impiva         : 0,
      totalitem      : 0

     }
    }       
 
   const dialogConfig = new MatDialogConfig();   
   dialogConfig.autoFocus = false;
   dialogConfig.data = datas;
   dialogConfig.width =  '900';         // ancho máximo de la ventana
   dialogConfig.maxWidth = '95vw';      
   dialogConfig.height   = 'auto';        // altura se ajusta al contenido
   dialogConfig.panelClass = 'custom-dialog-container';
   dialogConfig.disableClose =  false; // opcional según necesidad
   const dialogRef =  this.dialog.open(ItfactpComponent, dialogConfig);
   dialogRef.afterClosed().subscribe( // 
      (data:any) => { if (data.accion === 'Alta'){        // Agregó un item  de cobro - agregarlo al detalle
                
        this.cdetfactp = [...this.cdetfactp, datas.ditFac]; // forzar la creacion del array para que detecte el cambio                           
        this.totalizarFactura();                                                                
    }})
         
}

modItemFactp(nrofac : number,nroit  : number){
 
  const datas : intItFacTp = {
    idFactura     : nrofac, 
    nroitem       : nroit,
    nomchof       : this.cdetfactp[nroit-1].nomChofer,
    accion        : "M",
    ditFac   : {   // donde se recibe  el item modificado    
      idFactura      : nrofac,         
      nroitem        : nroit,
      idViaje        : this.cdetfactp[nroit].idViaje,
      idChofer       : this.cdetfactp[nroit-1].idChofer,
      nomChofer      : this.cdetfactp[nroit-1].nomChofer,
      origen         : this.cdetfactp[nroit-1].origen,
      destino        : this.cdetfactp[nroit-1].destino,
      tarifa         : this.cdetfactp[nroit-1].tarifa,
      cargaton       : this.cdetfactp[nroit-1].cargaton,
      impneto        : this.cdetfactp[nroit-1].impneto,
      tasaiva        : this.cdetfactp[nroit-1].tasaiva,
      impiva         : this.cdetfactp[nroit-1].impiva,
      totalitem      : this.cdetfactp[nroit-1].totalitem

     }
  }       
   const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = datas;
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
     const dialogRef =  this.dialog.open(ItfactpComponent, dialogConfig);
     dialogRef.afterClosed().subscribe( // 
        (data:any) => { if (data.clicked === 'Modi'){                   
           console.log("Modifico el item nro.: "+datas.nroitem) ;
           var indm = datas.nroitem - 1;
                                
           this.cdetfactp[indm].idFactura    = datas.idFactura,     
           this.cdetfactp[indm].idViaje      = datas.ditFac.idViaje,
           this.cdetfactp[indm].idChofer     = datas.ditFac.idChofer,
           this.cdetfactp[indm].nomChofer    = datas.ditFac.nomChofer,
           this.cdetfactp[indm].origen       = datas.ditFac.origen,
           this.cdetfactp[indm].destino      = datas.ditFac.destino,
           this.cdetfactp[indm].tarifa       = datas.ditFac.tarifa,
           this.cdetfactp[indm].cargaton     = datas.ditFac.cargaton,
           this.cdetfactp[indm].impneto      = datas.ditFac.impneto,
           this.cdetfactp[indm].tasaiva      = datas.ditFac.tasaiva,
           this.cdetfactp[indm].impiva       = datas.ditFac.impiva,
           this.cdetfactp[indm].totalitem    = datas.ditFac.totalitem,
     

           this.cdetfactp = [...this.cdetfactp]; // forzar la creacion del array para que detecte el cambio

           this.totalizarFactura();
         }})
   
}

totalizarFactura(){
  this.totfactura = 0;
  for (let i=0;i<this.cdetfactp.length;i++){
    this.totfactura += this.cdetfactp[i].totalitem
  }
  var importe = this.currencyPipe.transform(this.totfactura, '$', 'symbol', '1.2-2', 'es-AR');
  this.formFactp.controls['totalfac'].setValue(importe);
  this.formFactp.controls['cantit'].setValue(this.cdetfactp.length);
  
}

mostrarHora() {
   this.zone.runOutsideAngular(() => {
    setInterval(() => {
      const hoy = new Date();
      const valorControl = this.formFactp.controls['fecha'].value;
      
      if (valorControl) {
        const fechaform = new Date(valorControl);
        fechaform.setHours(hoy.getHours(), hoy.getMinutes(), hoy.getSeconds());

        // Volvemos a la zona de Angular solo para actualizar el valor
        this.zone.run(() => {
          this.formFactp.controls['fecha'].setValue(fechaform, { emitEvent: false });
          this.cdr.detectChanges(); // Forzamos la actualización sin romper el ciclo
        });
      }
    }, 1000);
  }) 
  }

Anular(){
      this.dialogRef.close({ clicked : "Cancelar"})
     }
}
