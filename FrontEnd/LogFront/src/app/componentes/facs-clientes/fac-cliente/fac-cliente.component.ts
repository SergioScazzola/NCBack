import { ChangeDetectorRef, Component, effect, ElementRef, Inject, NgZone, viewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subscription, finalize, forkJoin, max, switchMap } from 'rxjs';
import { CurrencyPipe,DatePipe,DecimalPipe} from '@angular/common';
import { NotiserviceService } from '../../../servicios/notiservice.service';
import { ServiciosService } from '../../../servicios/service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelecTextDirective } from "../../../Directivas/selec-text.directive";
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import {es} from 'date-fns/locale';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule} from '@angular/material/core';
import { intItFacTp, itfactpDTO } from '../../../../entidades/itfactpDTO';
import {MatDatepickerModule,MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { facclDTO, intFacCl, Ticket } from '../../../../entidades/facclDTO';
import { intItFacCl, itfacclDTO } from '../../../../entidades/itfacclDTO';
import { clienteDTO } from '../../../../entidades/clienteDTO';
import { ItfacClienteComponent } from './itfac-cliente/itfac-cliente.component';
import { AfipCredentials } from '../../../../entidades/AfipCredentials';

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
  selector: 'app-fac-cliente',
imports: [     MatFormField,
                 MatLabel,   
                 MatInputModule,      
                 MatSelectModule,
                 ReactiveFormsModule,     
                 MatDatepickerModule,                   
                 MatTableModule,                      
                 CommonModule,
                 DragDropModule,
                 FormsModule],
 providers : [
    CurrencyPipe,
    { provide : DateAdapter, useClass: DateFnsAdapter },
    { provide : MAT_DATE_FORMATS, useValue: DATE_FORMATS},
    { provide : MAT_DATE_LOCALE, useValue: es},
    
  ],                    
  templateUrl: './fac-cliente.component.html',
  styleUrl: './fac-cliente.component.css',
})
export class FacClienteComponent {
 public nameInput = viewChild<ElementRef>('nrofactura');
  isloading        : boolean = true;
  cfacscl          : facclDTO[]=[];
  cdetfaccl        : itfacclDTO[]=[];
  cclientes        : clienteDTO[]=[];
  ticket           : Ticket;  
  operacion        : string;
  formFaccl        : FormGroup;
  idclienteSel     : number = 1;
  maxfaccl         : number;
  nfaccpalta       : number;
  totfactura       : number;
  factpp           : facclDTO = {
     idFactura      : 0,
     nrofactura     : "",
     facndc         : "FAC",  // fac : suma, ndc : resta
     fecha          : new Date(),
     idCliente      : 1,
     nomcliente     : "",
     cantit         : 0,        
     impneto        : 0, 
     impiva         : 0,
     totalfac       : 0
  };  
  itemfac : itfacclDTO = {
    
    idFactura      : 0,    
    nroitem        : 0,
    idViaje        : 0,
    idChofer       : 0,
    nomChofer      : "", 
    origen         : "",
    destino        : "",
    tarifa         : 0,  // tarifa del tpte = 0.9 * tarifa plena
    cargaton       : 0,
    cantkm         : 0,
    ltsgasoil      : 0,    
    impneto        : 0,
    impiva         : 0,
    totalitem      : 0
  };
  
  
  constructor(  public fb           : FormBuilder,
                public servicio     : ServiciosService,
                public dialogRef    : MatDialogRef<FacClienteComponent>,
                public  dialog      : MatDialog,
                private cdr         : ChangeDetectorRef,
                private zone        : NgZone,
                @Inject(MAT_DIALOG_DATA) public data: intFacCl,  
                private notiService : NotiserviceService )
   { effect(() => {
            this.nameInput()?.nativeElement.focus(); //enfoca  iniciar
        });
    
  }
  colDFaccl : string[] = ["nroitem","idViaje","origen","destino","cantkm","ltsgasoil","totalitem","M"]

  ngAfterViewInit(){
    this.isloading = false
  }
  ngOnInit(){                 
      //setTimeout(() => {
      this.initFormulario();
          // 1. Lanzamos las peticiones base en paralelo             
      if (this.data.accion === "V") {
        forkJoin({
          clientes: this.servicio.getClientes(),    
          factura: this.servicio.leerFacCL(this.data.idFactura),
          detalle: this.servicio.getItemsFacsCL(this.data.idFactura),
          tickett: this.servicio.getTicket(),    
        }).subscribe(res2 => {
           this.cclientes  = res2.clientes;
           this.factpp     = res2.factura;
           this.cdetfaccl  = res2.detalle;
           this.ticket     = res2.tickett;
             
           this.operacion = `Consulta Factura Nro. ${this.factpp.nrofactura}`;
           this.actualizarFormulario();
           this.isloading = false;
           this.cdr.markForCheck()// <--- Importante: fuerza la detección si sigue el error    
          
        });
      }
      if (this.data.accion === "A") { // data.accion = "A" -> Alta          
          this.servicio.getClientes()
            .subscribe((data3:any):void => {    
                this.cclientes = data3;                    
                this.mostrarHora();
                //this.servicio.getCantFacsTP().subscribe(max => {           
                this.nfaccpalta = this.data.idFactura;
                
                this.operacion = "Agregar Factura al Cliente Nro. " + this.nfaccpalta;
                this.formFaccl.controls["idFactura"].setValue(this.nfaccpalta);                
                var indcliente = this.cclientes.findIndex(p=>p.idCliente=this.idclienteSel);
                this.factpp.nomcliente = this.cclientes[indcliente].nombre;                            
                this.isloading = false;
                this.cdr.markForCheck(); // <--- Asegura que el nuevo valor se pinte sin errores
          })                       
      }                           
      //},100);
   
   }

   initFormulario() {
     this.formFaccl = this.fb.group({        
             idFactura    : [0], 
             nrofactura   : ['',[Validators.required]],
             facndc       : ['FAC',[Validators.required, Validators.pattern(/^(FAC|NDC)$/)]],
             fecha        : [new Date()],
             idCliente    : [1],
             impneto      : [0],           
             impiva       : [0],       
             totalfac     : [0],
             cantit       : [0]   
      })       

    }
  actualizarFormulario(){
    var indcliente = this.cclientes.findIndex(p=>p.idCliente=this.idclienteSel);
    this.factpp.nomcliente = this.cclientes[indcliente].nombre;
    this.formFaccl.controls["idFactura"].setValue(this.factpp.idFactura), 
    this.formFaccl.controls["nrofactura"].setValue(this.factpp.nrofactura),              
    this.formFaccl.controls["facndc"].setValue(this.factpp.facndc), 
    this.formFaccl.controls["fecha"].setValue(this.factpp.fecha), 
    this.formFaccl.controls["idCliente"].setValue(this.factpp.idCliente), 
    this.formFaccl.controls["impneto"].setValue(this.factpp.impneto), 
    this.formFaccl.controls["impiva"].setValue(this.factpp.impiva), 
    this.formFaccl.controls["totalfac"].setValue(this.factpp.totalfac), 
    this.formFaccl.controls["cantit"].setValue(this.factpp.cantit), 
    this.idclienteSel = this.factpp.idCliente;
    this.factpp.nomcliente = this.cclientes[indcliente].nombre;
                           
   }
       
             
onSelectionCliente($event : any){
  // recibo un idCliente
 this.idclienteSel = $event.value;
 this.factpp.idCliente = this.idclienteSel;
 var indcli = this.cclientes.findIndex(p=>p.idCliente==this.idclienteSel);
 this.factpp.nomcliente = this.cclientes[indcli].nombre; 
}

 onFechaChange(event: any) {
    const nuevaFecha: Date = event.value; // Fecha seleccionada en el datepicker
    const ahora = new Date(); // Hora actual
  
    // Copiar la hora actual a la fecha seleccionada
    nuevaFecha.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds(), 0);
  
    // Establecer la fecha con hora en el form
    this.formFaccl.controls['fecha'].setValue(nuevaFecha);
  }

agItemFaccl(){ // Se llama unicamente en alta de factura
   console.log("Tamaño array detalle: " + this.cdetfaccl.length);
   const datas : intItFacCl = {
     nrofactura :   this.formFaccl.controls["nrofactura"].value,
     nroitem    :   this.cdetfaccl.length+1,   
     nrocli     :   this.factpp.idCliente,
     nomcli     :   this.factpp.nomcliente,
     accion     : "A",
     ditFac     : {   // donde se recibe  el item creado 
      idFactura      : this.formFaccl.controls["idFactura"].value,      
      nroitem        : this.cdetfaccl.length+1,  
      idViaje        : 1,           
      idChofer       : 1,
      nomChofer      : "",
      origen         : "",
      destino        : "",
      tarifa         : 0,
      cargaton       : 0,
      cantkm         : 0,
      ltsgasoil      : 0,
      impneto        : 0,
      impiva         : 0,
      totalitem      : 0

     }
    }       
 
   const dialogConfig = new MatDialogConfig();   

   dialogConfig.autoFocus = false;
   dialogConfig.data         = datas;
   dialogConfig.width        =  '900px';         // ancho máximo de la ventana
   dialogConfig.maxWidth     = '95vw';      
   dialogConfig.height       = 'auto';        // altura se ajusta al contenido
   dialogConfig.panelClass   = 'custom-dialog-container';
   dialogConfig.disableClose =  false; // opcional según necesidad

   const dialogRef =  this.dialog.open(ItfacClienteComponent, dialogConfig);
   dialogRef.afterClosed().subscribe((datai: any) => {
            console.log("DATAI:", datai);
     
     if (datai?.clicked === 'Alta') {

        const nuevoItem = {
           idFactura:    datai.item.idFactura,
           nroitem:      datai.item.nroitem,
           idViaje:      datai.item.idViaje,
           idChofer:     datai.item.idChofer,
           nomChofer:    datai.item.nomChofer,
           origen:       datai.item.origen,
           destino:      datai.item.destino,
           tarifa:       datai.item.tarifa,
           cargaton:     datai.item.cargaton,
           cantkm:       datai.item.cantkm,
           ltsgasoil:    datai.item.ltsgasoil,
           impneto:      datai.item.impneto,
           impiva:       datai.item.impiva,
           totalitem:    datai.item.totalitem
        };

      this.cdetfaccl = [...this.cdetfaccl, nuevoItem];

      this.totalizarFactura();
      console.log("Long.Array: " + this.cdetfaccl.length);
    }});
}   
          
 GrabarFacturaCL() { // Graba Sólo nueva factura con el detalle incluído en cdetfactp
  // Graba cabecera y detalle de la factura
   var grabo : boolean  = false;
   var indcli = this.cclientes.findIndex(p=>p.idCliente==this.idclienteSel);   
   var faccl : facclDTO = {
        idFactura     : this.formFaccl.controls["idFactura"].value,
        nrofactura    : this.formFaccl.controls["nrofactura"].value,   
        facndc        : this.formFaccl.controls["facndc"].value,   
        fecha         : this.formFaccl.controls["fecha"].value,   
        idCliente     : this.formFaccl.controls["idCliente"].value,   
        nomcliente    : this.cclientes[indcli].nombre,
        cantit        : this.formFaccl.controls["cantit"].value,   
        impneto       : this.formFaccl.controls["impneto"].value,   
        impiva        : this.formFaccl.controls["impiva"].value,   
        totalfac      : this.formFaccl.controls["totalfac"].value,   
       
        
  }   
   
  var resu : number;
  var subs : Subscription;  
      subs = this.servicio.grabarFacCL(faccl)
         .pipe(finalize(() => {        
            this.notiService.showNotification("La Factura Nro : "+faccl.nrofactura+" del  "+faccl.nomcliente+"("+resu+
                                        ") se ha agregado con éxito",'Aceptar','mensaje',500);    
           grabo  = true;
           
           const observables = this.cdetfaccl.map(item => {
               const itfaccl: itfacclDTO = {    
                  idFactura      : item.idFactura,    
                  nroitem        : item.nroitem,
                  idViaje        : item.idViaje,
                  idChofer       : item.idChofer,
                  nomChofer      : item.nomChofer, 
                  origen         : item.origen,
                  destino        : item.destino,
                  tarifa         : item.tarifa,
                  cargaton       : item.cargaton,
                  cantkm         : item.cantkm,
                  ltsgasoil      : item.ltsgasoil,    
                  impneto        : item.impneto,
                  impiva         : item.impiva,
                  totalitem      : item.totalitem
               };
            // Graba item y marca en el viaje asociado que ha sido facturado al cliente
              return this.servicio.grabarItemFacCL(itfaccl).pipe(
                 switchMap(() => this.servicio.updateFactC(itfaccl.idViaje, 1))
            )});
           
           
            forkJoin(observables).subscribe({
                next: (results) => {
                  console.log('Todos los items grabados:', results);     
                  this.dialogRef.close({ clicked : "Alta"}) // grabé una nueva factura
                  }, 
                error: (err) => {
                  console.error('Error al grabar items:', err);
                }
            });
          }))
         .subscribe((datas:any):void =>{
              resu = datas
      })
  }
      




verItemFactp(nroit  : number){ // prepara datos y los manda al componente "itfactp" para visualizar el item
 
  var nroitem = nroit;
  console.log("item : "+nroitem+" nro.factura : "+this.cdetfaccl[nroitem-1].idFactura)
  const datas : intItFacCl = {
    nrofactura    : this.formFaccl.controls["nrofactura"].value,
    nroitem       : nroitem,
    nrocli        : this.factpp.idCliente,
    nomcli        : this.factpp.nomcliente,
    accion        : "V",
    ditFac   : {   // donde se envia el item a modificar    
      idFactura      : this.formFaccl.controls["idFactura"].value,         
      nroitem        : nroitem,
      idViaje        : this.cdetfaccl[nroitem-1].idViaje,
      idChofer       : this.cdetfaccl[nroitem-1].idChofer,
      nomChofer      : this.cdetfaccl[nroitem-1].nomChofer,
      origen         : this.cdetfaccl[nroitem-1].origen,
      destino        : this.cdetfaccl[nroitem-1].destino,
      tarifa         : this.cdetfaccl[nroitem-1].tarifa,
      cargaton       : this.cdetfaccl[nroitem-1].cargaton,
      cantkm         : this.cdetfaccl[nroitem-1].cantkm,
      ltsgasoil      : this.cdetfaccl[nroitem-1].ltsgasoil,
      impneto        : this.cdetfaccl[nroitem-1].impneto,
      impiva         : this.cdetfaccl[nroitem-1].impiva,
      totalitem      : this.cdetfaccl[nroitem-1].totalitem

     }
  }       
   const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = datas;
    dialogConfig.width =  '900px';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
     const dialogRef =  this.dialog.open(ItfacClienteComponent, dialogConfig);
     dialogRef.afterClosed().subscribe( // 
        (data:any) => { if (data.clicked === 'Ver'){                   
           console.log("Modifico el item nro.: "+datas.nroitem) ;                                                    
         }})
   
}

totalizarFactura(){  // Unicamente para Alta de Factura
  // Recalcula totales despues de agregar o modificar un item de factura
  var totfactura = 0;
  var totneto    = 0;
  var totiva     = 0;

  for (let i=0;i<this.cdetfaccl.length;i++){
    totfactura += this.cdetfaccl[i].totalitem;
    totneto   += this.cdetfaccl[i].impneto;
    totiva    += this.cdetfaccl[i].impiva;
  }
  //var importe = this.currencyPipe.transform(this.totfactura, '$', 'symbol', '1.2-2', 'es-AR');
  this.formFaccl.controls['totalfac'].setValue(this.totfactura);
  this.formFaccl.controls['cantit'].setValue(this.cdetfaccl.length);
  this.formFaccl.controls['impneto'].setValue(totneto);
  this.formFaccl.controls['impiva'].setValue(totiva);
  this.formFaccl.controls['totalfac'].setValue(totfactura);
}

mostrarHora() {
   this.zone.runOutsideAngular(() => {
    setInterval(() => {
      const hoy = new Date();
      const valorControl = this.formFaccl.controls['fecha'].value;
      
      if (valorControl) {
        const fechaform = new Date(valorControl);
        fechaform.setHours(hoy.getHours(), hoy.getMinutes(), hoy.getSeconds());

        // Volvemos a la zona de Angular solo para actualizar el valor
        this.zone.run(() => {
          this.formFaccl.controls['fecha'].setValue(fechaform, { emitEvent: false });
          this.cdr.detectChanges(); // Forzamos la actualización sin romper el ciclo
        });
      }
    }, 1000);
  }) 
  }

AutenticarAfip(){

  var ultimocomp : Number = 0;
  forkJoin({

          ultimoComp: this.servicio.getUltComp("FACA"),          
        }).subscribe(res2 => {
           ultimocomp     = res2.ultimoComp;
            
           this.notiService.showNotification("Ultimo Comp FAC A : "+ultimocomp,'Aceptar','mensaje',500);                                  
                this.isloading = false;
                this.cdr.markForCheck(); // <--- Asegura que el nuevo valor se pinte sin errores
          })              
}
Anular(){
      this.dialogRef.close({ clicked : "Cancelar"})
     }
}
