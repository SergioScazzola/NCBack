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
import { ImporteDecimalDirective } from "../../../Directivas/importeDecimal";
import { ImporteDirective } from "../../../Directivas/importeDirective";
import { SinoService } from '../../../servicios/sino.service';
import { facclDTO } from '../../../../entidades/facclDTO';
import { intPagocli, pagocliDTO } from '../../../../entidades/pagocliDTO';

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
  selector: 'app-pagoscli',
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
    SelecTextDirective, ImporteDirective],
 providers : [
      CurrencyPipe,   
      { provide : DateAdapter, useClass: DateFnsAdapter },
          { provide : MAT_DATE_FORMATS, useValue: DATE_FORMATS},
          { provide : MAT_DATE_LOCALE, useValue: es},
          { provide : LOCALE_ID, useValue: 'es-AR' }
  ],                        
  templateUrl: './pagoscli.component.html',
  styleUrl: './pagoscli.component.css',
})
export class PagoscliComponent {
 public   operacion     : string;
  public  formPag       : FormGroup;
  public  cmediospago   : MPagoDTO[]=[];
  public  cfacsCli      : facclDTO[]=[];
  public  hoy           : Date = new Date();
  public  pagocli       : pagocliDTO;
  public  imppago       : number;
  private imps          : number[]=[0,0,0];
  public  isloading     : boolean = true;
  private maxpago       : number;
  private pagopalta     : number;
  public  deshAlta      : boolean = false; // para deshabilitar boton de alta

  private mpagoSel        : number;
  private facclSel        : number;
  public  imprimeconcepto : boolean = true;

 constructor(     public  fb             : FormBuilder,
                  private servicio       : ServiciosService,                
                  public dialogRef       : MatDialogRef<PagoscliComponent>,
                  @Inject(MAT_DIALOG_DATA) public data: intPagocli,  
                  private zone           : NgZone,
                   private sinoServicio : SinoService,
                  private cdr            : ChangeDetectorRef,  
                  private currencyPipe   : CurrencyPipe,
                  public  dialog         : MatDialog,                                
                  public  util           : UtilService,
                  private notiService    : NotiserviceService )
       {  }
  /*ngAfterViewInit(){
    this.isloading = false
  }*/
  ngOnInit() {
    registerLocaleData(localeEsAR, 'es-AR');
    this.imppago = 0;
    this.initFormulario();
     forkJoin({  // consultas traer info para pago
                    
           facturascli:  this.servicio.getFactCliXCliente(this.data.idCliente),                        
           mediospago:    this.servicio.getMediosPago(),
   
         }).subscribe(res2 => {
           this.cfacsCli = res2.facturascli;
           this.cmediospago = res2.mediospago;

           if (this.data.accion=="A"){  // Alta de Pago
                    this.mostrarHora();
                    this.pagopalta =  this.data.idPago;  // viene del modulo que llama                                                     
                    this.operacion = "Agregar Pago del Cliente : "+this.data.nombre;
                  
                    if (this.prepararAlta()){
                       this.isloading = false;
                       this.cdr.detectChanges()
                    } else {
                      this.deshAlta = true; // deshabilita el boton de alta, eligio no agregar el pago
                    }
                    
              } else if (this.data.accion=="M"){   // Modificación de un pago  -> Lee el pago
                    var subs2 : Subscription;
                    subs2 = this.servicio.leerPagoCliente(this.data.idPago)
                       .pipe(finalize(() => {  
                            this.operacion = "Modificar Pago Nro.: "+this.data.idPago+" del Cliente : "+this.data.nombre;                
                            subs2.unsubscribe;
                            this.prepararModificacion();
                            this.isloading = false;
                            this.cdr.detectChanges()
                         
                       }))
                       .subscribe((datas:any):void =>{
                           this.pagocli = datas
                       })                                                                                                
                  }
          })
      
  }
  
  initFormulario(){
     this.formPag = this.fb.group({        
          nropag      : [''], 
          fecha       : [''],           
          idCliente    : ['',[Validators.required]],    
          idFactura   : [0,[Validators.required]],    
          idmpago1    : [1,[Validators.required]],                            
          nrompago1   : [''],
          banco1      : [''],                   
          importe1    : ['',[Validators.required]],
          idmpago2    : [{ value : 1, disabled : true}],                        
          nrompago2   : [{ value : '', disabled : true}],
          banco2      : [{ value : '', disabled : true}],                   
          importe2    : [{ value : 0, disabled : true}],
          idmpago3    : [{ value : 1, disabled : true}],                     
          nrompago3   : [{ value : '', disabled : true}],
          banco3      : [{ value : '', disabled : true}],                   
          importe3    : [{ value : 0, disabled : true}],
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
    this.formPag.controls['idFactura'].setValue(event.target.value);
    console.log("Factura seleccionada : "+event.target.value);
    this.facclSel = event.target.value
  }


  onFechaChange(event: any) {
    const nuevaFecha: Date = event.value; // Fecha seleccionada en el datepicker
    const ahora = new Date(); // Hora actual
  
    // Copiar la hora actual a la fecha seleccionada
    nuevaFecha.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds(), 0);
  
    // Establecer la fecha con hora en el form
    this.formPag.controls['fecha'].setValue(nuevaFecha);
  }
 

  onSelectionChangeMedioPago(event : any){
      this.mpagoSel = event.value;
  }
prepararAlta(): boolean{
   var retorno = true;
   if (this.cfacsCli==undefined || this.cfacsCli.length==0){ // no hay facturas del cliente
       this.sinoServicio.abrirSiNoDialogo("Confirmación", "No hay facturas emitidas para el cliente "+this.data.nombre+
                                          ". ¿Desea agregar el pago sin vincularlo a una factura?")
        .then(result => {
            if (result) {  //continua con agregar pago
              this.inicializarFormulario(0);                          
            } else {
               retorno = false;              
            }
          })   
  } else {
    var idf = this.cfacsCli[0].idFactura;
    this.facclSel = idf;
    this.inicializarFormulario(idf);
   
  }
  return retorno;
}
  
  inicializarFormulario(idfac : number){
     this.formPag.controls['nropag'].setValue(this.pagopalta);
     this.formPag.controls['fecha'].setValue(this.hoy);
     this.formPag.controls['idCliente'].setValue(1);
     this.formPag.controls['idFactura'].setValue(idfac);
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
     this.formPag.controls['importe3'].setValue(' ');

   this.formPag.controls['imptotal'].setValue(0);
   this.formPag.controls['observ'].setValue('');
  }

  prepararModificacion(){
   this.facclSel = this.pagocli.idFactura;
   this.formPag.controls['nropag'].setValue(this.pagocli.idPago);
   this.formPag.controls['fecha'].setValue(this.pagocli.fecha);
   this.formPag.controls['idCliente'].setValue(this.pagocli.idCliente);
   this.formPag.controls['idFactura'].setValue(this.pagocli.idFactura);
   this.formPag.controls['idmpago1'].setValue(this.pagocli.idmpago1);
   this.formPag.controls['nrompago1'].setValue(this.pagocli.nrompago1);
   this.formPag.controls['banco1'].setValue(this.pagocli.banco1);  
   this.formPag.controls['importe1'].setValue(this.formatearNumero(this.pagocli.importe1));  

   this.formPag.controls['idmpago2'].setValue(this.pagocli.idmpago2);
   this.formPag.controls['nrompago2'].setValue(this.pagocli.nrompago2);
   this.formPag.controls['banco2'].setValue(this.pagocli.banco2);  

   
   this.formPag.controls['importe2'].setValue(this.formatearNumero(this.pagocli.importe2));  

   this.formPag.controls['idmpago3'].setValue(this.pagocli.idmpago3);
   this.formPag.controls['nrompago3'].setValue(this.pagocli.nrompago3);
   this.formPag.controls['banco3'].setValue(this.pagocli.banco3);  
   
   this.formPag.controls['importe3'].setValue(this.formatearNumero(this.pagocli.importe3));  

   this.formPag.controls['imptotal'].setValue(this.pagocli.imptotal);  
   this.formPag.controls['observ'].setValue(this.pagocli.observ);
  this.imps[0] = this.pagocli.importe1;
  this.imps[1] = this.pagocli.importe2;
  this.imps[2] = this.pagocli.importe3;
  if (this.pagocli.importe2>0){ // habilito segunda fila si el importe es mayor a cero
    this.formPag.get('idmpago2')?.enable();
    this.formPag.get('nrompago2')?.enable();
    this.formPag.get('banco2')?.enable();
    this.formPag.get('importe2')?.enable();
  }
  if (this.pagocli.importe3>0){ // habilito tercera fila si el importe es mayor a cero
    this.formPag.get('idmpago3')?.enable();
    this.formPag.get('nrompago3')?.enable();
    this.formPag.get('banco3')?.enable();
    this.formPag.get('importe3')?.enable();
  }
  this.totalizarPago()
  
  }


 modificoImporte(control:string , nro:number) {
  var  cadena = this.formPag.controls[control].value;  // Valor formateado para ver    
  //console.log("cadenaaaaaaaa : "+cadena);
  //cadena = cadena.toString()
  //  .replace(/\./g, '')   // saca puntos
  //  .replace(/,/g, '.');  // cambia coma por punto  
  
  const valor = parseFloat(cadena);
  this.imps[nro-1] = valor; // pongo el valor en el array para sumar      
  this.totalizarPago(); // refresco valor del pago
  if (nro < 3){ // habilito siguiente fila si el importe es mayor a cero
    nro++
    this.formPag.get('idmpago'+nro)?.enable();
    this.formPag.get('nrompago'+nro)?.enable();
    this.formPag.get('banco'+nro)?.enable();
    this.formPag.get('importe'+nro)?.enable();
  }
  
  }
  formatearNumero(nro : number) : string {
    const cadena = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
    }).format(nro);
    return cadena
  }

  totalizarPago(){
    var totalpago = this.imps[0]+this.imps[1]+this.imps[2];
  
     this.formPag.controls['imptotal'].setValue(totalpago);
  }

  GrabarPago(){
   
   
      var impt = this.formPag.controls['imptotal'].value;
    

      var pago : pagocliDTO = {
             
         idPago         : this.formPag.controls['nropag'].value,
         fecha          : this.formPag.controls['fecha'].value,
         idCliente       : this.data.idCliente,
         idFactura      : this.formPag.controls['idFactura'].value,
         idmpago1       : this.formPag.controls['idmpago1'].value,
         nrompago1      : this.formPag.controls['nrompago1'].value,      
         banco1         : this.formPag.controls['banco1'].value,        
         importe1       : this.imps[0],
                                                               
         idmpago2       : this.formPag.controls['idmpago2'].value,
         nrompago2      : this.formPag.controls['nrompago2'].value,      
         banco2         : this.formPag.controls['banco2'].value,
         importe2       : this.imps[1],

         idmpago3       : this.formPag.controls['idmpago3'].value,
         nrompago3      : this.formPag.controls['nrompago3'].value,      
         banco3         : this.formPag.controls['banco3'].value,
         importe3       : this.imps[2],
      
        imptotal       : parseFloat(impt),
        observ         : this.formPag.controls['observ'].value
            
      }
      var subs : Subscription;
      var resu : number;
      subs = this.servicio.grabarPagoCli(pago)
        .pipe(finalize(() => {  
           this.notiService.showNotification("El Pago Nro : "+pago.idPago+
                                      " del Cliente : "+this.data.nombre+" ("+resu+") se ha agregado con éxito",'Aceptar','mensaje',500);      
           this.dialogRef.close({ clicked : "Alta"})
           subs.unsubscribe
        }))
        .subscribe((datas:any):void =>{
           resu = datas
        })                                                                                                  
    
}
ModificarPago(){
 
  var impt  = this.formPag.controls['imptotal'].value;

  var pago : pagocliDTO = {
    idPago         : this.formPag.controls['nropag'].value,
    fecha          : this.formPag.controls['fecha'].value,
    idCliente      : this.data.idCliente,
    idFactura      : this.formPag.controls['idFactura'].value,
    idmpago1       : this.formPag.controls['idmpago1'].value,
    nrompago1      : this.formPag.controls['nrompago1'].value,
    banco1         : this.formPag.controls['banco1'].value,
    importe1       :  this.imps[0],
    idmpago2       : this.formPag.controls['idmpago2'].value,
    nrompago2      : this.formPag.controls['nrompago2'].value,
    banco2         : this.formPag.controls['banco2'].value,
    importe2       :  this.imps[1],
    idmpago3       : this.formPag.controls['idmpago3'].value,
    nrompago3      : this.formPag.controls['nrompago3'].value,
    banco3         : this.formPag.controls['banco3'].value,
    importe3       : this.imps[2],
    imptotal       : parseFloat(impt),
    observ         : this.formPag.controls['observ'].value,
  }
  var subs : Subscription;
  var resu : number;
  subs = this.servicio.updatePagoCli(pago.idPago,pago)
  .pipe(finalize(() => {  
    this.notiService.showNotification("El Pago Nro : "+pago.idPago+
                                      " del Cliente : "+this.data.nombre+" ("+resu+") ha sido modificado con éxito",'Aceptar','mensaje',500);      
    this.dialogRef.close({ clicked : "Modi"})
    subs.unsubscribe
}))
.subscribe((datas:any):void =>{
   resu = datas
})           
  }

  Anular(){
    this.dialogRef.close({ clicked : "Cancelar"})
  }
  // Recibo de Pago al Empleado
  generarReciboPDF() : void {
               
    const doc = new jsPDF('p','mm','A4');
   
    //var indl  =  this.claboreos.findIndex(p=>p.idLaboreo==this.pagoemp.nrolaboreo);//  laboreo del pago
    const title = 'RECIBO DE PAGO DEL CLIENTE NRO. '+this.pagocli.idPago;
    
  
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
    doc.text("Logistica NC", 10, 15, { align: 'left' });
     
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
    doc.text('Recibí de '+this.data.nombre+', la cantidad de pesos : '+
             this.currencyPipe.transform(this.pagocli.imptotal, '$','code','1.2-2'),10,45,{align:'left'});
    doc.setFontSize(10);         
    if (this.imprimeconcepto){    
      var indf = this.cfacsCli.findIndex(p=>p.idFactura==this.facclSel);
      doc.text('En concepto de Transporte factura Nro :  '+this.cfacsCli[indf].nrofactura,10,50,{align:'left'});
    }
    
    doc.setFontSize(10);    
     var cadimpo = this.currencyPipe.transform(this.pagocli.imptotal, 'ARS','code','1.2-2')?.replace('ARS','');
    var cvos = cadimpo?.substring(cadimpo.length-2,cadimpo.length);
    var centavos = "";
    if (cvos=='00'){
      centavos = ".-"
    } else {
      centavos = ' con '+cvos+'/100.-' 
    }
    doc.text('Son pesos : '+this.util.numLetras(Math.trunc(this.pagocli.imptotal))+
             centavos,10,60,{align:'left'});          

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setDrawColor(156,156,156);
    doc.line(pageWidth-10-60,80,pageWidth-10,80); //margen derecho 10, long linea = 60
    doc.text(this.data.nombre,pageWidth-50,85);

    doc.setFontSize(8);   
    doc.text('Forma de pago : '+this.cmediospago[this.pagocli.idmpago1-1].mediopago.padEnd(15)+' - '+
                          this.pagocli.nrompago1.padEnd(15)+' - '+
                          this.pagocli.banco1.padEnd(15)+' - '+
                          this.currencyPipe.transform(this.pagocli.importe1, 'ARS','code','1.2-2')?.replace('ARS',''),
              10,98,{align:'left'});
    if (this.pagocli.importe2>0){ // si hay importe2
      doc.text(this.cmediospago[this.pagocli.idmpago2-1].mediopago.padEnd(15)+' - '+
                          this.pagocli.nrompago2.padEnd(15)+' - '+
                          this.pagocli.banco2.padEnd(15)+' - '+
                          this.currencyPipe.transform(this.pagocli.importe2, 'ARS','code','1.2-2')?.replace('ARS',''),
              32,103,{align:'left'});
    }      
    if (this.pagocli.importe3>0){ // si hay importe3
      doc.text(this.cmediospago[this.pagocli.idmpago3-1].mediopago.padEnd(15)+' - '+
                          this.pagocli.nrompago3.padEnd(15)+' - '+
                          this.pagocli.banco3.padEnd(15)+' - '+
                          this.currencyPipe.transform(this.pagocli.importe3, 'ARS','code','1.2-2')?.replace('ARS',''),
              32,108,{align:'left'});
    }      
    //doc.text('Observaciones : '+this.pagoemp.observaciones,10,110,{align:'left'});
    doc.save('ReciboDePago'+this.pagocli.idPago);       
        
    }
 
    updatechecked(checked : boolean){
      this.imprimeconcepto = checked;
    }
}
