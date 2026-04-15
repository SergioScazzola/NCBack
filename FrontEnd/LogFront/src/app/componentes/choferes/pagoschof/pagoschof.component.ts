import { Component, Inject,  NgZone,LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { SelecTextDirective } from '../../../Directivas/selec-text.directive';
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import localeEsAR from '@angular/common/locales/es-AR';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ServiciosService } from '../../../servicios/service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotiserviceService } from '../../../servicios/notiservice.service';

import { MPagoDTO } from '../../../../entidades/marcaDTO';
import { finalize, forkJoin, Subscription } from 'rxjs';

import { es } from 'date-fns/locale';
//import { DATE_FORMATS } from '../../laboreos/laboreo/laboreo.component';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import jsPDF from 'jspdf';
import { UtilService } from '../../../servicios/util.service';
import autoTable from 'jspdf-autotable';
import { viajeDTO } from '../../../../entidades/viajeDTO';
import { factpDTO } from '../../../../entidades/factpDTO';
import { intPago, pagoDTO } from '../../../../entidades/pagoDTO';

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
  selector: 'app-pagoschof',
 imports: [MatFormField,
                  MatLabel,         
                  MatInputModule,
                  MatTableModule,
                  ReactiveFormsModule,
                  MatDatepickerModule,
                  MatNativeDateModule,    
                  MatIconModule,
                  MatCheckboxModule,
                  CommonModule,
                  FormsModule,
                  MatSelectModule,
                  DragDropModule,                
                  SelecTextDirective],
 providers : [
      CurrencyPipe,   
      { provide : DateAdapter, useClass: DateFnsAdapter },
          { provide : MAT_DATE_FORMATS, useValue: DATE_FORMATS},
          { provide : MAT_DATE_LOCALE, useValue: es},
          { provide : LOCALE_ID, useValue: 'es-AR' }
  ],                        
  templateUrl: './pagoschof.component.html',
  styleUrl: './pagoschof.component.css',
})
export class PagoschofComponent {
  public  operacion     : string;
  public  formPag       : FormGroup;
  public  cmediospago   : MPagoDTO[]=[];
  public  cviajes       : viajeDTO[]=[];
  public  cfacsTpte     : factpDTO[]=[];
  public  hoy           : Date = new Date();
  public  pagochof      : pagoDTO;
  public  imppago       : number;

  private maxpago       : number;
  private pagopalta     : number;


  private mpagoSel      : number;
  private factpSel       : number;
  public  imprimeconcepto : boolean = true;

 constructor(     public  fb               : FormBuilder,
                  private servicio       : ServiciosService,                
                  public dialogRef       : MatDialogRef<PagoschofComponent>,
                  @Inject(MAT_DIALOG_DATA) public data: intPago,  
                  private zone           : NgZone,
                  private cdr            : ChangeDetectorRef,  
                  private currencyPipe   : CurrencyPipe,
                  public  dialog         : MatDialog,                                
                  public  util           : UtilService,
                  private notiService    : NotiserviceService )
       {  }

  ngOnInit() {
    registerLocaleData(localeEsAR, 'es-AR');
    this.imppago = 0;
    this.initFormulario();
     forkJoin({  // consultas traer info para pago
          
           viajeschof:    this.servicio.getViajesxChofer(this.data.idChofer),
           facturaschof:  this.servicio.getFactTpteXChofer(this.data.idChofer),  
             
           //chofer:        this.servicio.leerPagoChofer(this.data.idPago),
           mediospago:    this.servicio.getMediosPago(),
   
         }).subscribe(res2 => {
       
           this.cviajes     = res2.viajeschof;
           this.cfacsTpte   = res2.facturaschof;
           this.cmediospago = res2.mediospago;
           if (this.data.accion=="A"){  // Alta de Pago
                    this.mostrarHora();
                    this.pagopalta =  this.maxpago+1;                                                       
                    this.operacion = "Agregar Pago al Chofer : "+this.data.nombre;
           
                    this.prepararAlta();
                  } else {   // Modificación de un pago  -> Lee el pago
                    var subs2 : Subscription;
                    subs2 = this.servicio.leerPagoChofer(this.data.idPago)
                       .pipe(finalize(() => {  
                            this.operacion = "Modificar Pago Nro.: "+this.data.idPago+" al Chofer : "+this.data.nombre;                
                            subs2.unsubscribe;
                            this.prepararModificacion();
                       }))
                       .subscribe((datas:any):void =>{
                           this.pagochof = datas
                       })                                                                                                
                  }
          })
      
  }
  
  initFormulario(){
     this.formPag = this.fb.group({        
          nropag      : [''], 
          fecha       : [''],           
          idChofer    : ['',[Validators.required]],    
          idFactura   : [0,[Validators.required]],    
          idmpago1    : [1,[Validators.required]],                            
          nrompago1   : [' '],
          banco1      : [' '],                   
          importe1    : ['',[Validators.required]],
          idmpago2    : [1],                        
          nrompago2   : [' '],
          banco2      : [' '],                   
          importe2    : [''],
          idmpago3    : [1],                     
          nrompago3   : [''],
          banco3      : [''],                   
          importe3    : [''],
          imptotal    : [''],
          observ      : ['']
        }) 
  }
  mostrarHora() {
   this.zone.runOutsideAngular(() => {
    setInterval(() => {
      const hoy = new Date();
      const valorControl = this.formPag.controls['fecha'].value;
      
      if (valorControl) {
        const fechaform = new Date(valorControl);
        fechaform.setHours(hoy.getHours(), hoy.getMinutes(), hoy.getSeconds());

        // Volvemos a la zona de Angular solo para actualizar el valor
        this.zone.run(() => {
          this.formPag.controls['fecha'].setValue(fechaform, { emitEvent: false });
          this.cdr.detectChanges(); // Forzamos la actualización sin romper el ciclo
        });
      }
    }, 1000);
  }) 
  }
  onSelectionFactura(event: any){
    
  }

  onSelectionChangeMPago($event: any, nro : number){

  }
  onFechaChange(event: any) {
    const nuevaFecha: Date = event.value; // Fecha seleccionada en el datepicker
    const ahora = new Date(); // Hora actual
  
    // Copiar la hora actual a la fecha seleccionada
    nuevaFecha.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds(), 0);
  
    // Establecer la fecha con hora en el form
    this.formPag.controls['fecha'].setValue(nuevaFecha);
  }

  onSelectionChangeFactura(event : any){
     
  }

  onSelectionChangeMedioPago(event : any){
      this.mpagoSel = event.value;
  }
prepararAlta(){
   this.formPag.controls['nropag'].setValue(this.pagopalta);
   this.formPag.controls['fecha'].setValue(this.hoy);
   this.formPag.controls['idChofer'].setValue(1);
   this.formPag.controls['idFactura'].setValue(0);
   this.formPag.controls['idmpago1'].setValue(1);
   this.formPag.controls['nrompago1'].setValue(' ');
   this.formPag.controls['banco1'].setValue(' ');
   this.formPag.controls['importe1'].setValue(' ');

   this.formPag.controls['idmpago2'].setValue(1);
   this.formPag.controls['nrompago2'].setValue(' ');
   this.formPag.controls['banco2'].setValue(' ');
   this.formPag.controls['importe2'].setValue(' ');

   this.formPag.controls['idmpago3'].setValue(1);
   this.formPag.controls['nrompago3'].setValue(' ');
   this.formPag.controls['banco3'].setValue(' ');
   this.formPag.controls['importe2'].setValue(' ');

   this.formPag.controls['imptotal'].setValue(0);
   this.formPag.controls['observ'].setValue('');

  }
  
  prepararModificacion(){
   this.formPag.controls['nropag'].setValue(this.pagopalta);
   this.formPag.controls['fecha'].setValue(this.pagochof.fecha);
   this.formPag.controls['idChofer'].setValue(this.pagochof.idChofer);
   this.formPag.controls['idFactura'].setValue(this.cfacsTpte[this.cfacsTpte.findIndex(f=>f.idFactura==this.pagochof.idFactura)].idFactura);
   this.formPag.controls['idmpago1'].setValue(this.pagochof.idmpago1);
   this.formPag.controls['nrompago1'].setValue(this.pagochof.nrompago1);
   this.formPag.controls['banco1'].setValue(this.pagochof.banco1);  
   this.formPag.controls['importe1'].setValue(this.pagochof.importe1);  

   this.formPag.controls['idmpago2'].setValue(this.pagochof.idmpago2);
   this.formPag.controls['nrompago2'].setValue(this.pagochof.nrompago2);
   this.formPag.controls['banco2'].setValue(this.pagochof.banco2);  
   this.formPag.controls['importe2'].setValue(this.pagochof.importe2);  

   this.formPag.controls['idmpago3'].setValue(this.pagochof.idmpago3);
   this.formPag.controls['nrompago3'].setValue(this.pagochof.nrompago3);
   this.formPag.controls['banco3'].setValue(this.pagochof.banco3);  
   this.formPag.controls['importe3'].setValue(this.pagochof.importe3);  

   this.formPag.controls['imptotal'].setValue(this.pagochof.imptotal);
   this.formPag.controls['observ'].setValue(this.pagochof.observ);
  }


  formatearComoMoneda() {  // formatea como moneda al salir de "importe"
    const valor = parseFloat(this.formPag.controls['importe'].value?.toString().replace(',', '.'));
    if (!isNaN(valor)) {
      const valorFormateado = this.currencyPipe.transform(valor, '$', 'symbol', '1.2-2');
      console.log("Valor Fomateado : "+valorFormateado);
      this.formPag.controls['importe'].setValue(valorFormateado, { emitEvent: false });
    }
  }
  

 
  GrabarPago(){
   
      

      var pago : pagoDTO = {
             
         idPago         : this.formPag.controls['nropag'].value,
         fecha          : this.formPag.controls['fecha'].value,
         idChofer       : this.data.idChofer,
         idFactura      : this.formPag.controls['idFactura'].value,
         idmpago1       : this.formPag.controls['idmpago1'].value,
         nrompago1      : this.formPag.controls['nrompago1'].value,      
         banco1         : this.formPag.controls['banco1'].value,
         importe1       : this.formPag.controls['importe1'].value,
                                                               
         idmpago2       : this.formPag.controls['idmpago2'].value,
         nrompago2      : this.formPag.controls['nrompago2'].value,      
         banco2         : this.formPag.controls['banco2'].value,
         importe2       : this.formPag.controls['importe2'].value,

         idmpago3       : this.formPag.controls['idmpago3'].value,
         nrompago3      : this.formPag.controls['nrompago3'].value,      
         banco3         : this.formPag.controls['banco3'].value,
         importe3       : this.formPag.controls['importe3'].value,
      
        imptotal       : this.formPag.controls['imptotal'].value,
        observ         : this.formPag.controls['observ'].value
            
      }
      var subs : Subscription;
      var resu : number;
      subs = this.servicio.grabarPagoChofer(pago)
        .pipe(finalize(() => {  
           this.notiService.showNotification("El Pago Nro : "+pago.idPago+
                                      " al Chofer : "+this.data.nombre+" ("+resu+") se ha agregado con éxito",'Aceptar','mensaje',500);      
           this.dialogRef.close({ clicked : "Alta"})
           subs.unsubscribe
        }))
        .subscribe((datas:any):void =>{
           resu = datas
        })                                                                                                  
    
}
/*ModificarPago(){
  var indmp = this.cmediospago.findIndex(p=>p.idmpago==this.mpagoSel);
  var pago : pagoEmpDTO = {
    idPagoemp      : this.formPag.controls['nropag'].value,
    fecha          : this.formPag.controls['fecha'].value,
    nroemp         : this.data.nroempleado,
    nomemp         : this.data.nomempleado,
    idmpago        : this.mpagoSel,
    mediopago      : this.cmediospago[indmp].mediodepago,
    nrompago       : this.formPag.controls['nrompago'].value,
    banco          : this.formPag.controls['banco'].value,
    importe        : Number(this.formPag.controls['importe'].value.replaceAll('$', '')
                                                                  .replaceAll('.', '')
                                                                  .replaceAll(',','.')),
    nrolaboreo     : this.laboSel,
    observaciones  : this.formPag.controls['observ'].value,
  }
  var subs : Subscription;
  var resu : number;
  subs = this.servicio.updatePagoEmpleado(pago)
  .pipe(finalize(() => {  
    this.notiService.showNotification("El Pago Nro : "+pago.idPagoemp+
                                      " al empleado : "+pago.nomemp+" ("+resu+") ha sido modificado con éxito",'Aceptar','mensaje',500);      
    this.dialogRef.close({ clicked : "Modi"})
    subs.unsubscribe
}))
.subscribe((datas:any):void =>{
   resu = datas
})           
  }*/

  Anular(){
    this.dialogRef.close({ clicked : "Cancelar"})
  }
  // Recibo de Pago al Empleado
  /*generarReciboPDF() : void {
               
    const doc = new jsPDF('p','mm','A4');
   
    var indl  =  this.claboreos.findIndex(p=>p.idLaboreo==this.pagoemp.nrolaboreo);//  laboreo del pago
    const title = 'RECIBO DE PAGO NRO. '+this.data.nropago;
    
  
    // Fecha actual
    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-AR');                         
    
         
    autoTable(doc, 
      {
        head : [],      
        startY:  100,   // 25,  Espacio debajo del título      63, 81, 181      
        margin: { left: 10, right: 10 }
      }                      
    );         
              
     
     
    doc.setPage(1);
        
        
    doc.setFontSize(10);
    doc.text("Degros S.A.", 10, 15, { align: 'left' });
     
    // Fecha alineada a la derecha
    doc.setFontSize(10);
    doc.text(`Fecha: ${fechaStr}`, doc.internal.pageSize.getWidth() - 20, 15, { align: 'right' });

    // Título centrado
    doc.setFontSize(12);
    const xx = doc.internal.pageSize.getWidth() / 2;
    const yy = 30;
    const padding = 2;
    const textDimensions = doc.getTextDimensions(title);

    // Centrar el rectángulo horizontalmente
    const rectX = xx - (textDimensions.w / 2) - padding;
    const rectY = yy - textDimensions.h - padding;
    const rectWidth = textDimensions.w + padding * 2;
    const rectHeight = textDimensions.h + padding * 3;
    doc.setLineWidth(0.1);
    doc.setDrawColor(156,156,156);
    doc.rect(rectX , rectY , rectWidth,rectHeight);
    doc.text(title, xx, yy, { align: 'center' });
              
    doc.setFontSize(12);
    doc.text('Recibí de Degros S.A., la cantidad de pesos : '+
             this.currencyPipe.transform(this.pagoemp.importe, '$','code','1.2-2'),10,45,{align:'left'});
    doc.setFontSize(10);         
    if (this.imprimeconcepto){
       doc.text('En concepto de trabajos de '+this.claboreos[indl].nlabor+' - '+
             this.claboreos[indl].ncultivo+' - Campo : '+this.claboreos[indl].ncampo+' - lotes : '+
             this.claboreos[indl].potreros+' - '+
             this.claboreos[indl].hasTrab+' Hectáreas',10,50,{align:'left'})
    }
    
    doc.setFontSize(10);    
     var cadimpo = this.currencyPipe.transform(this.pagoemp.importe, 'ARS','code','1.2-2')?.replace('ARS','');
    var cvos = cadimpo?.substring(cadimpo.length-2,cadimpo.length);
    var centavos = "";
    if (cvos=='00'){
      centavos = ".-"
    } else {
      centavos = ' con '+cvos+'/100.-' 
    }
    doc.text('Son pesos : '+this.util.numLetras(Math.trunc(this.pagoemp.importe))+
             centavos,10,60,{align:'left'});          

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setDrawColor(156,156,156);
    doc.line(pageWidth-10-60,80,pageWidth-10,80); //margen derecho 10, long linea = 60
    doc.text(this.pagoemp.nomemp,pageWidth-50,85);

  
    doc.text('Forma de pago : '+this.pagoemp.mediopago+' - '+this.pagoemp.nrompago+' - '+this.pagoemp.banco,
              10,98,{align:'left'});
    doc.text('Observaciones : '+this.pagoemp.observaciones,10,110,{align:'left'});
    doc.save('ReciboDePago'+this.pagoemp.idPagoemp);       
        
    }
 
    updatechecked(checked : boolean){
      this.imprimeconcepto = checked;
    }*/
}

