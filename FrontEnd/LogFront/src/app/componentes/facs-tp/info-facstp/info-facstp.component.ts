import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { finalize, Subscription } from 'rxjs';
import { ServiciosService } from '../../../servicios/service';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { es } from 'date-fns/locale';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';

import { MatSelect, MatSelectModule } from '@angular/material/select';

import { factpDTO } from '../../../../entidades/factpDTO';
import { choferDTO } from '../../../../entidades/choferDTO';

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
  selector: 'app-info-facstp',
   imports: [ MatDatepickerModule,
              MatNativeDateModule, 
              ReactiveFormsModule,
              FormsModule,
              CommonModule, 
              MatFormField,
              MatTableModule,
              MatSelectModule,
              MatInputModule,   ],
              
  providers : [ DatePipe,CurrencyPipe,
    { provide : DateAdapter, useClass: DateFnsAdapter },
    { provide : MAT_DATE_FORMATS, useValue: DATE_FORMATS},
    { provide : MAT_DATE_LOCALE, useValue: es}
  ],            
  templateUrl: './info-facstp.component.html',
  styleUrl: './info-facstp.component.css',
})

export class InfoFacstpComponent {
  public   formInfoFacs : FormGroup;
  public   dfecha    : Date;
  public   hfecha    : Date = new Date();
  public   cfacstp   : factpDTO[]=[];
  public   cfacssubt : factpDTO[]=[];
 
  public   resumen   : number = 0;
  public   cchoferes : choferDTO[]=[];
  public   eligiochof: boolean = false;
  private  filter     : string;   //filtro de laboreos para devolver
  private  dfec       : string = " ";
  private  hfec       : string = " ";

  private  hoy        : Date = new Date();
  private  fecprim    : Date = new Date();

  colspdf = [
    { header: 'id.Fac', dataKey: 'idFactura' },    
    { header: 'Fecha', dataKey: 'fecha' },    
    { header: 'Nro.Factura', dataKey: 'nrofactura' },
    { header: 'F/C', dataKey: 'facndc' },
    { header: 'NroCh', dataKey: 'idChofer' },
    { header: 'Chofer', dataKey: 'nomchofer' },
    { header: 'Itf', dataKey: 'cantit' },
    { header: 'Imp. NETO', dataKey: 'impneto' },
    { header: 'Imp. IVA', dataKey: 'impiva' },
    { header: 'Total FACTURA', dataKey: 'totalfac' },
    
  ];
  filas    : any[];
  colFacs: string[] = [
    'idFactura',
    'fecha',
    'nrofactura',
    'facndc',
    'idChofer',
    'nomchofer',
    'cantit',
    'impneto',
    'impiva',
    'totalfac',    
  ];
  
  tipoinforme : string[] = [ 'Tipo de Informe','Informe Detallado', 'Agrupado x Chofer','Informe de chofer'];
   constructor(private servicio : ServiciosService,
               private rutaActiva : ActivatedRoute,
               private router   : Router,
               public  fb       : FormBuilder,
               public datepipe  : DatePipe,
               private currencyPipe: CurrencyPipe,){}


   ngOnInit(){
     //this.rutaActiva.paramMap.subscribe((params) => {
        
      this.filter     = this.rutaActiva.snapshot.params['filtro'];
      console.log("filtro a devolver : "+this.filter);
      this.fecprim  = new Date(this.hoy.getFullYear(),this.hoy.getMonth(),1);
      var cad = this.datepipe.transform(this.fecprim,"yyyy-MM-dd");
      this.dfec = cad!=null?cad:" ";
      cad = this.datepipe.transform(this.hoy,"yyyy-MM-dd")+"T23:59"; 
      this.hfec = cad!=null?cad:" ";
      this.initFormulario();
      var subs : Subscription;
      subs = this.servicio.getChoferes()
        .pipe(finalize(() => {                               
            subs.unsubscribe();
        }))
        .subscribe((data : any): void => {
            this.cchoferes = data});

    //this.mostrarHora();
    
    }
initFormulario(){
   this.formInfoFacs = this.fb.group({        
        dfecha     : [this.fecprim], 
        hfecha     : [this.hoy], 
        chof       : [0],
        tipoinfo   : [0]})
}
    ondFechaChange(event : any){
       const nuevaFecha: Date = event.value; // Fecha seleccionada en el datepicker
       this.formInfoFacs.controls['dfecha'].setValue(nuevaFecha);             
       var cad = this.datepipe.transform(nuevaFecha,"yyyy-MM-dd");    
       this.dfec = cad!=null?cad:" ";
       this.borrarArreglos();
    }
    onhFechaChange(event : any){
       const nuevaFecha: Date = event.value; // Fecha seleccionada en el datepicker
       this.formInfoFacs.controls['hfecha'].setValue(nuevaFecha);  
       var cad = this.datepipe.transform(nuevaFecha,"yyyy-MM-dd")+"T23:59";     
       this.hfec = cad!=null?cad:" ";
       this.borrarArreglos();
    }
    desplegarInformeSubtotales(){
    var subs : Subscription;
   
    this.borrarArreglos();
    subs = this.servicio.getFacsTPxFecha(this.dfec,this.hfec)
       .pipe(
          finalize(() => {             
            subs.unsubscribe();
            this.eligiochof = false;
            this.armarconSubtotales(); // Armar arreglo con subtotales para desplegar
          })
             )
             .subscribe((data: any): void => {
               this.cfacstp = data;
             }); 
    }
    armarconSubtotales(){
    // genera el array "cfacssubt" a partir de "cfacstp" insertando subtotales por chofer
   
    var subtchof   = 0;    
    var totalneto  = 0;
    var totaliva   = 0;
    var total      = 0;    
    var i          = 0;
    var facchof    = 0;
    while (i<this.cfacstp.length){

      facchof  = 0;
      subtchof = 0;
      var nrochof = this.cfacstp[i].idChofer;
      var nomchof = this.cfacstp[i].nomchofer;
      while (i<this.cfacstp.length && this.cfacstp[i].idChofer==nrochof){       
        subtchof  += this.cfacstp[i].totalfac;          
        totalneto += this.cfacstp[i].impneto;          
        totaliva  += this.cfacstp[i].impiva;          
        total     += this.cfacstp[i].totalfac;          
        this.cfacssubt.push(this.cfacstp[i]);        
        facchof++;
        i++;
      }
      // corte de chofer
      var fact : factpDTO = {
        idFactura    : 0,
        fecha        : new Date(),        
        nrofactura   : "",
        facndc       : "",
        idChofer     : nrochof,
        nomchofer    :  "* SUBTOTAL - Cant.: "+facchof+" *",
        cantit       : 0,
        impneto      : 0,
        impiva       : 0,
        totalfac     : subtchof
      };   
      this.cfacssubt.push(fact);
    }
    var fact : factpDTO = {
        idFactura    : 0,
        fecha        : new Date(),        
        nrofactura   : "",
        facndc       : "",
        idChofer     : 0,
        nomchofer    : "* TOTALES - Cant.: "+(i-1)+" *",
        cantit       : 0,
        impneto      : totalneto,
        impiva       : totaliva,
        totalfac     : total
      };
    this.cfacssubt.push(fact);
       
  }

  armarconTotales(){
    // genera el array "cfacssubt" a partir de "cfacstp" insertando totales al final       
    var totalneto  = 0;
    var totaliva   = 0;
    var total      = 0;    
    var i          = 0;    
    while (i<this.cfacstp.length){
      this.cfacssubt.push(this.cfacstp[i]);  
      totalneto += this.cfacstp[i].impneto;          
      totaliva  += this.cfacstp[i].impiva;          
      total     += this.cfacstp[i].totalfac;          
      i++;
    }
    var fact : factpDTO = {
        idFactura    : 0,
        fecha        : new Date(),        
        nrofactura   : "",
        facndc       : "",
        idChofer     : 0,
        nomchofer    : "* TOTALES - Cant.: "+(i-1)+" *",
        cantit       : 0,
        impneto      : totalneto,
        impiva       : totaliva,
        totalfac     : total
      };   
    this.cfacssubt.push(fact);
       
  }

  armarconTotalesChofer(){
    // genera el array "cfacssubt" a partir de "cfacstp" insertando totales de chofer al final       
    var totalneto  = 0;
    var totaliva   = 0;
    var total      = 0;    
    var i          = 0;    
    var nrochof    = this.cfacstp[0].idChofer;
    var nomchof    = this.cfacstp[0].nomchofer;
    while (i<this.cfacstp.length){
      this.cfacssubt.push(this.cfacstp[i]);  
      totalneto += this.cfacstp[i].impneto;          
      totaliva  += this.cfacstp[i].impiva;          
      total     += this.cfacstp[i].totalfac;          
      i++;
    }
    var fact : factpDTO = {
        idFactura    : 0,
        fecha        : new Date(),        
        nrofactura   : "",
        facndc       : "",
        idChofer     : 0,
        nomchofer    : "* TOTALES "+nomchof+"("+nrochof+") - Cant.: "+(i-1)+" *",
        cantit       : 0,
        impneto      : totalneto,
        impiva       : totaliva,
        totalfac     : total
      };   
    this.cfacssubt.push(fact);
       
  }

Cancelar() {
  // Volver a la página de laboreos con filtro
  
  this.router.navigate(['/laboreos',this.filter]);
}  
generarPDF(nomchof : string):void{
 // si nomchof es distinto de "" es un informe de facturas del chofer

  const doc = new jsPDF('l','mm','A4');
   var fd = this.datepipe.transform(this.formInfoFacs.controls['dfecha'].value,"dd/MM/yyyy");
   var fh = this.datepipe.transform(this.formInfoFacs.controls['hfecha'].value,"dd/MM/yyyy");
   var title = "";
   if (nomchof!==''){
        title = "Informe de Facturas de "+nomchof+" desde el "+fd+" al "+fh;
   } else {
        title = 'Informe de Facturas de Choferes desde el '+fd+' al '+fh;
   }
   

  // Fecha actual
  const fecha = new Date();
  const fechaStr = fecha.toLocaleDateString('es-AR');
  
  this.filas = this.cfacssubt.map((item)=> [
    item.idFactura,    
    this.datepipe.transform(item.fecha,"dd/MM/yyyy"),
    item.nrofactura,
    item.facndc,
    item.idChofer,
    item.nomchofer,
    item.cantit,    
     this.currencyPipe.transform(item.impneto, 'ARS','code','1.2-2')?.replace('ARS',''),
     this.currencyPipe.transform(item.impiva, 'ARS','code','1.2-2')?.replace('ARS',''),
     this.currencyPipe.transform(item.totalfac, 'ARS','code','1.2-2')?.replace('ARS',''),
    
  ])
  autoTable(doc, 
    {
     head: [this.colspdf.map((item)=>item.header)],
     body: this.filas,
     columns: this.colspdf,
     styles: { fontSize: 8 },
     headStyles: { fillColor: [63, 81, 181], halign: 'center' },
     startY: 25, // Espacio debajo del título
     columnStyles: {
        idFactura : { halign: 'center' },
        fecha     : { halign: 'left' },        
        nrofactura: { halign: 'left' },
        facndc    : { halign: 'center' },
        idChofer  : { halign: 'center' },
        nomchofer : { halign: 'left' },
        cantit    : { halign: 'center' },
        impneto   : { halign: 'right' },
        impiva    : { halign: 'right' },        
        totalfac  : { halign: 'right' }
        
     },
     
      didDrawPage: (data) => {        
          if (data.pageNumber>=1){
               data.settings.margin.top = 25;                
          }
      },
       
     margin: { left: 0, right: 0 }}                      
 );         
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const text = `Página ${i} de ${totalPages}`;
    doc.setFontSize(10);
    doc.text("Logistica NC", 10, 15, { align: 'left' });

     // Título centrado
    doc.setFontSize(10);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
  
    // Fecha alineada a la derecha
    doc.setFontSize(10);
    doc.text(`Fecha: ${fechaStr}`, doc.internal.pageSize.getWidth() - 20, 10, { align: 'right' });
    doc.setFontSize(10);
    doc.text(text, pageSize.width - 20, 15, { align: 'right' });
  }
  doc.save('InformeDeFacsTP');       
 
}

desplegarXChofer(nrochof : number){
  var subs : Subscription;
  subs = this.servicio.getFacsTPxChoferYF(nrochof, this.dfec, this.hfec) // factura del chofer en el rengo de fechas
      .pipe(
         finalize(() => {
            this.armarconTotalesChofer();
            subs.unsubscribe();          
         }))
      .subscribe((data: any): void => {
               this.cfacstp = data;
             });
} 

onSelectionChangeChofer(event:any){
      
    this.desplegarXChofer(event.value);
}
onSelectionChangeInforme(event:any){
  'Tipo de Informe','Informe Detallado','Con Subtotales x Chofer' ,'Resumen x Chofer','Informe de chofer'
    console.log("Tipo de informe : "+event.value);
    switch (event.value){
      case 1 : {  
                  this.desplegarXCultivo();
                  break
               };
      case 2 : { this.desplegarXLabor();
                 break
               };
      case 3 : { this.desplegarXCampo();
                 break
               };
      case 4 : { this.desplegarXMaquina();
                 break
               };               
      default : {break};
      
    }
}
borrarArreglos(){
  this.cresucult = [];
  this.cresucamp = [];
  this.cresulab  = []; // para ocultar tablas de resumenes
  this.cresumaq  = [];
  this.clabosubt = [];
}
}

