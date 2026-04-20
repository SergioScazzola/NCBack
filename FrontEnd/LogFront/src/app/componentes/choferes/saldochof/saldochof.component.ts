import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiciosService } from '../../../servicios/service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { intSalChof, saldoChofDTO } from '../../../../entidades/saldoChofDTO';
import { NotiserviceService } from '../../../servicios/notiservice.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { es } from 'date-fns/locale';

import { finalize, Subscription } from 'rxjs';

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
  selector: 'app-saldochof',
  imports: [      MatFormField,
                  MatLabel,         
                  MatInputModule,
                  ReactiveFormsModule,      
                  MatDatepickerModule,
                  MatNativeDateModule,    
                  MatIconModule,            
                  CommonModule,
                  DragDropModule,
                  FormsModule,],
  providers : [
    CurrencyPipe,
    DatePipe,
    { provide : DateAdapter, useClass: DateFnsAdapter },
    { provide : MAT_DATE_FORMATS, useValue: DATE_FORMATS},
    { provide : MAT_DATE_LOCALE, useValue: es}
  ],  
  templateUrl: './saldochof.component.html',
  styleUrl: './saldochof.component.css',
})
export class SaldochofComponent {

 formSal!        : FormGroup;
 hoy             : Date=new Date();
 operacion       : string;
 itsaldo         : saldoChofDTO  = {
     idChofer   : 0,
     nrosaldo   : 1,
     fecha      : null,
     saldo      : 0

 };


    constructor(public  fb            : FormBuilder,
                  private servicio    : ServiciosService,    
                  private currencyPipe: CurrencyPipe,        
                  private     datePipe: DatePipe,    
                  public dialogRef    : MatDialogRef<SaldochofComponent>,
                  @Inject(MAT_DIALOG_DATA) public data: intSalChof,  
                  private notiService : NotiserviceService )
       {  }

ngOnInit(){
  this.formSal = this.fb.group({        
    nrochof    : [''], 
    nrosaldo   : [''], 
    fecha      : [''],           
    saldo      : ['',[Validators.required]],                
  });
 
  if (this.data.accion=="A"){
    this.formSal.controls['fecha'].setValue(this.hoy);
    this.mostrarHora();
    this.formSal.controls['nrochof'].setValue(this.data.nrochof);
    this.formSal.controls['nrosaldo'].setValue(this.data.nrosaldo);
    if (this.data.nrosaldo==1){
        this.operacion = "Agregar Saldo inicial al Chofer : "+this.data.nomchof  
    } else {
      this.operacion = "Agregar Saldo al Chofer : "+this.data.nomchof  
    }
  } else {
    if (this.data.accion=="I"){
     this.operacion = "Modificar Saldo inicial al Chofer : "+this.data.nomchof
     var subs : Subscription;
     console.log("Anttes de leerr Saldo : "+this.data.nrosaldo);
     subs = this.servicio.leerSaldoChofer(this.data.nrochof,this.data.nrosaldo)
          .pipe(finalize(() => {
                      this.formSal.controls['nrochof'].setValue(this.itsaldo.idChofer);
                      this.formSal.controls['nrosaldo'].setValue(this.itsaldo.nrosaldo);
                      this.formSal.controls['fecha'].setValue(this.itsaldo.fecha);
                      this.formSal.controls['saldo'].setValue(this.itsaldo.saldo)             
                      subs.unsubscribe();                    
                  }))
          .subscribe((data : any): void => {
                       this.itsaldo = data});      
    } else {
       this.operacion = "Agregar saldo inicial al Chofer : "+this.data.nomchof;

       this.itsaldo.idChofer = this.data.nrochof;
       this.itsaldo.nrosaldo = this.data.nrosaldo;
       this.itsaldo.fecha    = this.data.fecprmv;
       this.itsaldo.saldo    = 0;
 
       this.formSal.controls['nrochof'].setValue(this.data.nrochof);
       this.formSal.controls['nrosaldo'].setValue(this.data.nrosaldo);
       this.formSal.controls['fecha'].setValue(this.data.fecprmv);
       this.formSal.controls['saldo'].setValue(0)             

    }
    

  }

}

 mostrarHora() {
    // mantiene actualizado el control "fecha" con Horas minutos y segundos
    setInterval(() => {
      this.hoy = new Date();
      
      const valorControl = this.formSal.controls['fecha'].value;
      const fechaform = new Date(valorControl); // ✅ convierte string/objeto a Date real
  
      fechaform.setHours(this.hoy.getHours(), this.hoy.getMinutes(), this.hoy.getSeconds());
  
      this.formSal.controls['fecha'].setValue(fechaform); // ✅ se actualiza con una fecha válida
      console.log("Fecha : "+this.formSal.controls['fecha'].value);
    }, 1000);
  }
  onFechaChange(event: any) {
    const nuevaFecha: Date = event.value; // Fecha seleccionada en el datepicker
    const ahora = new Date(); // Hora actual
  
    // Copiar la hora actual a la fecha seleccionada
    nuevaFecha.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds(), 0);
  
    // Establecer la fecha con hora en el form
    this.formSal.controls['fecha'].setValue(nuevaFecha);
  }
   formatearComoMoneda() {  // formatea como moneda al salir de "importe"
    const valor = parseFloat(this.formSal.controls['saldo'].value?.toString().replace(',', '.'));
    if (!isNaN(valor)) {
      const valorFormateado = this.currencyPipe.transform(valor, '$', 'symbol', '1.2-2');
      console.log("Valor Fomateado : "+valorFormateado);
      this.formSal.controls['saldo'].setValue(valorFormateado, { emitEvent: false });
    }
  }
  

  quitarFormatoMoneda() {
    const valor = this.formSal.controls['saldo'].value;
    if (typeof valor === 'string') {
        const sinFormato = valor.replace(/[^\d,.-]/g, '').replace(',', '');
      this.formSal.controls['saldo'].setValue(sinFormato, { emitEvent: false });
    }
  }

  GrabarSaldo(){
     var fecc = this.formSal.controls['fecha'].value as Date;
    if (this.verifFechaSaldo(fecc)){
    var esnum : boolean;
     var valorsaldo = this.formSal.controls['saldo'].value;
     if (typeof valorsaldo==="string"){
        esnum = false;
    } else {
      esnum = true;
    }
    var saldo : saldoChofDTO = {
        idChofer  : this.formSal.controls['nrochof'].value,
        nrosaldo  : this.formSal.controls['nrosaldo'].value,
        fecha     : this.formSal.controls['fecha'].value,
        saldo     : esnum?this.formSal.controls['saldo'].value:
                Number(this.formSal.controls['saldo'].value.replaceAll('$','').replaceAll(',', '')),
    }
    console.log("saldo Nro : "+saldo.nrosaldo+" fecha : "+saldo.fecha+" saldo : "+saldo.saldo);
    console.log("antes de agregar saldo : "+this.data.nrosaldo);
    var subs : Subscription;
    var resu : number;
   
    subs = this.servicio.AgregarSaldoChofer(saldo)
      .pipe(finalize(() => {        
          this.notiService.showNotification("El Saldo nro.: "+this.data.nrosaldo+" del Chofer "+
                                             this.data.nomchof+"("+resu+
                                            ") se ha agregado con éxito",'Aceptar','mensaje',500);   
          this.dialogRef.close({ clicked : "Alta"});                                       
          subs.unsubscribe();
      }))
      .subscribe((datas:any):void =>{
          resu = datas
       }) 
      }
  }

   ModificarSaldo(){
    var fecc = this.formSal.controls['fecha'].value as Date;
    if (this.verifFechaSaldo(fecc)){
    var esnum : boolean;
     var valorsaldo = this.formSal.controls['saldo'].value;
     if (typeof valorsaldo==="string"){
        esnum = false;
    } else {
      esnum = true;
    }
    var saldo : saldoChofDTO = {
        idChofer  : this.formSal.controls['nrochof'].value,
        nrosaldo  : this.formSal.controls['nrosaldo'].value,
        fecha     : this.formSal.controls['fecha'].value,
        saldo     : esnum?this.formSal.controls['saldo'].value:
                Number(this.formSal.controls['saldo'].value.replaceAll('$','').replaceAll(',', '')),
    }
    
    var subs : Subscription;
    var resu : number;
     console.log("Anttes de agregaar Saldpo : "+saldo.saldo);
    subs = this.servicio.updateSaldoChofer(saldo)
      .pipe(finalize(() => {        
          this.notiService.showNotification("El Saldo nro.: "+this.data.nrosaldo+" del chofer "+
                                             this.data.nomchof+"("+resu+
                                            ") se ha Modificado con éxito",'Aceptar','mensaje',10000)
         
          this.dialogRef.close({ clicked : "Modi"});                                       
          subs.unsubscribe;
      }))
      .subscribe((datas:any):void =>{
          resu = datas
       }) 
    }
  }

   Anular(){
    this.dialogRef.close({ clicked : "Cancelar"})
  }
 verifFechaSaldo(fecing: Date): boolean {
  let retorno: boolean;

  const fecprmv = this.data.fecprmv;

  if (fecprmv === null) {
    return true;
  };

  if ( this.data.accion === 'I' || (this.data.accion === 'A' && this.data.nrosaldo === 1)  ) {
    var cfec1 = this.datePipe.transform(fecprmv,'yyyyMMdd');
    var cfeci = this.datePipe.transform(fecing,'yyyyMMdd');
    console.log("fecprmv : " + cfec1 + " ffecing :  " + cfeci);  
      if(cfeci! >= cfec1!){
        this.notiService.showNotification(
        "La fecha del saldo inicial debe ser anterior a la fecha del 1er movimiento, NO se grabará",
        'Aceptar',
        'mensaje',
        10000
      );
      retorno = false;
    } else {
      retorno = true;
    }
  } else {
    retorno = true;
  }

  return retorno;
}

}

