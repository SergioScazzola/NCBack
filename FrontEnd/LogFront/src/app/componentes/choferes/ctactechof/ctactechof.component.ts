import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { finalize, forkJoin, map, of, Subscription } from 'rxjs';
import { ServiciosService } from '../../../servicios/service';
import { ctactecDTO } from '../../../../entidades/ctactecDTO';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NotiserviceService } from '../../../servicios/notiservice.service';
import { SinoService } from '../../../servicios/sino.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { choferDTO } from '../../../../entidades/choferDTO';
import { intPago, pagoDTO } from '../../../../entidades/pagoDTO';
import { gastoDTO } from '../../../../entidades/gastoDTO';
import { intSalChof, saldoChofDTO } from '../../../../entidades/saldoChofDTO';
import { viajeDTO } from '../../../../entidades/viajeDTO';
import { factpDTO } from '../../../../entidades/factpDTO';
import { FacTpComponent } from '../../facs-tp/fac-tp/fac-tp.component';
import { PagoschofComponent } from '../pagoschof/pagoschof.component';
import { SaldochofComponent } from '../saldochof/saldochof.component';


@Component({
  selector: 'app-ctactechof',
  standalone: true,
  imports: [CommonModule,MatTableModule,MatSelectModule,],
  providers : [
          DatePipe,
          CurrencyPipe],
  templateUrl: './ctactechof.component.html',
  styleUrl: './ctactechof.component.css'
})
export class CtacteComponent implements OnInit {
//@Input() nrocliente  : number;
//@Input() nomcliente  : string;

public cviajes        : viajeDTO[]=[];
public cfacTpte       : factpDTO[]=[];
public cpagos         : pagoDTO[]=[]; 
public cgastos        : gastoDTO[]=[];
public cmovscc        : ctactecDTO[]=[];
public csaldos        : saldoChofDTO[];
public cargandoCtaCte : boolean = true;
 
public saldofinal     : number;

public numchofer     : number ;  // pasados commo parametro
public nomchofer     : string;

public  saldoinicial  : number=0;
public  mensSaldo      : string;
public  cbsaldos      : FormControl;
private chof          : choferDTO;
private maxpago       : number;
private filter        : string;
  colMovsCC: string[] = ["fecha" , "tipomov", "idMov", "descmov","importe","saldo","pag","bpag"];

  constructor(     private servicio    : ServiciosService,
                   private router      : Router,
                   private currencyPipe: CurrencyPipe,
                   private datepipe    : DatePipe,
                   private notiService : NotiserviceService,
                   private cdr         : ChangeDetectorRef,     
                   private sinoServicio: SinoService,
                   private rutaActiva  : ActivatedRoute,
                   public  dialog      : MatDialog) { }     
ngOnInit()
{
     // Verificar si hay parámetros en la ruta
 this.rutaActiva.paramMap.subscribe((params) => {
     const pnro      = params.get('nrochofer');
     const pnombre   = params.get('nomchofer');
     this.filter     = params.get('filtro')||'';
     console.log("Filtro en CtaCte : "+this.filter);
     this.numchofer = pnro!=undefined?Number(pnro):0;
     this.nomchofer = pnombre!=undefined?pnombre:"";
     this.cargandoCtaCte = true;
     this.saldofinal     = 0;
     var preparo : boolean=false;
     forkJoin({  // consultas para armar la cta.cte del chofer en paralelo
        salchof:       this.servicio.getSaldosChofer(this.numchofer),
        viajeschof:    this.servicio.getViajesxChofer(this.numchofer),
        facturaschof:  this.servicio.getFactTpteXChofer(this.numchofer),
        gastoschof:    this.servicio.getGastosxChofer(this.numchofer),
        pagoschof:     this.servicio.getPagosxChofer(this.numchofer),
        chofer:        this.servicio.leerChofer(this.numchofer),
        maxpagos:      this.servicio.getCantPagos(),

      }).subscribe(res2 => {
        this.csaldos    = res2.salchof;
        this.cviajes    = res2.viajeschof;
        this.cfacTpte   = res2.facturaschof;
        this.cgastos    = res2.gastoschof;
        this.cpagos     = res2.pagoschof;
        this.chof       = res2.chofer;   
        this.maxpago    = res2.maxpagos;

                             
           
        //console.log(JSON.stringify(this.chof));                       
        this.saldoinicial = this.chof.saldoini;
        if (this.chof.saldoini==0){
            this.mensSaldo = "Saldo inicial : "                              
        } else {
            this.mensSaldo = "Saldo inicial al "+
            this.datepipe.transform(this.csaldos[0].fecha,"dd/MM/yyyy")+" : "                              
        };
        this.prepararMovimientos();  
        this.generarColSaldo();              
        this.cargandoCtaCte = false;    
        this.cdr.detectChanges();  
      })
    })   
}

prepararMovimientos(){
 
// vuelca Facturas de tpte, Pagos y Gastos al array de movimientos y los ordena por fecha
if (this.cpagos!=undefined){
  for (let index=0; index<this.cpagos.length;index++){
    var regmovim : ctactecDTO = {
     idMov      : this.cpagos[index].idPago,
     fecha      : this.cpagos[index].fecha!,   
     tipomov    : "PAG",
     descmov    : "PAG nro. "+this.cpagos[index].idPago+" - Fac Nro.: "+this.cpagos[index].idFactura,                      
     importe   :  this.cpagos[index].imptotal*-1, // pago resta
     saldo     :  0
  };
  this.cmovscc.push(regmovim);
  };
}

if (this.cgastos!=undefined){
  for (let index=0; index<this.cgastos.length; index++){
    var regmov : ctactecDTO = {
      idMov      : this.cgastos[index].idGasto,
      fecha      : this.cgastos[index].fecha,   
      tipomov    : "GASTO",
      descmov    : this.cgastos[index].descgasto,
      importe    :  this.cgastos[index].impgasto*-1, // gasto resta
      saldo      :  0
   };  
   this.cmovscc.push(regmov);
  };
}

if (this.cfacTpte!=undefined){
  for (let index=0; index<this.cfacTpte.length; index++){
    var regmov : ctactecDTO = {
      idMov      : this.cfacTpte[index].idFactura,
      fecha      : this.cfacTpte[index].fecha,   
      tipomov    : this.cfacTpte[index].facndc==="FAC"? "FAC" : "NDC",
      descmov    : (this.cfacTpte[index].facndc==="FAC"? "FAC" : "NDC")+" - "+
                   this.cfacTpte[index].nrofactura+" - "+
                   this.cfacTpte[index].cantit+" viajes",
      importe    : this.cfacTpte[index].facndc==="FAC"? this.cfacTpte[index].totalfac : this.cfacTpte[index].totalfac*-1, // factura suma
      saldo      : 0
   };  
   this.cmovscc.push(regmov);
  };
 
}
 
this.cmovscc.sort(function (a,b) {         // ordenar movimientos por fecha
                    if (a.fecha! < b.fecha!){
                      return -1
                    } else if (a.fecha! > b.fecha!){
                      return 1
                    } else {
                      return 0
                    }
                  }); 
console.log("Cantidad de Movimientos : "+this.cmovscc.length);
}
determinarSaldoInicial(): number {
  let indmenor = -9;

 const saldos = this.csaldos.filter(
  (s): s is saldoChofDTO => s != null
);

 const movs = this.cmovscc.filter(
  (m): m is ctactecDTO => m != null
);

  let index = 0;
  let salir = false;

  if (saldos.length && movs.length) {
    const fechaMov = movs[0].fecha;
    if (!fechaMov)   return indmenor
    
    while (index < saldos.length && !salir) {
      const fechaSaldo = saldos[index].fecha;
      if (fechaSaldo && fechaSaldo < fechaMov) {
        indmenor = index;
        index++;
      } else {
        salir = true;
      }
    }
  }

  return indmenor;
}   

generarColSaldo(){
  // FAC suma, NDC,resta PAGO resta, GASTO resta,saldo positivo = deboo al chofer, saldo negativo = me debe el chofer
  // genera columna de saldo en el array de movimientos a partir de un saldo inicial
  // El signo de cada movimiento ya fue asignado en el importe, solo se suma al saldo para obtener el nuevo saldo luego de cada movimiento
  var saldo : number = this.saldoinicial;
  for (let index=0; index<this.cmovscc.length;index++){             
    saldo += this.cmovscc[index].importe;
    this.cmovscc[index].saldo = saldo
  };
  this.saldofinal = saldo;      
  console.log("Saldo final : "+this.saldofinal)
}

Cancelar() {
  // Volver a la página de clientes retomando estado
  this.router.navigate(['/choferes',this.filter]);
}

agregarPago(){
     // Llama al componente de pago "pagoschof" para agregar un pago al chofer
     const data : intPago= {
        idPago     : this.maxpago + 1,
        idChofer   : this.numchofer,
        nombre     : this.nomchofer,
        accion     : "A"
      }       
      const dialogConfig = new MatDialogConfig();   
      dialogConfig.autoFocus = false;
      dialogConfig.data         = data;
      dialogConfig.width        =  '900px';         // ancho máximo de la ventana
      dialogConfig.maxWidth     = '95vw';      
      dialogConfig.height       = 'auto';        // altura se ajusta al contenido
      dialogConfig.panelClass   = 'custom-dialog-container';
      dialogConfig.disableClose =  false; // opcional según necesidad
      const dialogRef =  this.dialog.open(PagoschofComponent, dialogConfig);
            dialogRef.afterClosed().subscribe( // 
            (data:any) => { if (data.clicked === 'Alta'){        // Agregó un cobro           
                             this.actualizarxUltPago();   // leer pagos y rearmar cmovims y recalcular totales                                            
                             }
                            })
}

agregarGasto(){
  
}
modificarPago(idmov:number ){
  const data : intPago = {
    idPago     : idmov,
    idChofer   : this.chof.idChofer,
    nombre     : this.nomchofer,
    accion     : "M"
  };
  const dialogConfig = new MatDialogConfig();   
  dialogConfig.autoFocus = false;
  dialogConfig.data         = data;
  dialogConfig.width        =  '900px';         // ancho máximo de la ventana
  dialogConfig.maxWidth     = '95vw';      
  dialogConfig.height       = 'auto';        // altura se ajusta al contenido
  dialogConfig.panelClass   = 'custom-dialog-container';
  dialogConfig.disableClose =  false; // opcional según necesidad
  const dialogRef =  this.dialog.open(PagoschofComponent, dialogConfig);
        dialogRef.afterClosed().subscribe( // 
        (data:any) => { if (data.clicked === 'Modi'){        // Modifico el cobro seleccionado           
                        this.actualizarxUltPago();   // leer cobros, rearmar cmovims y recalcular totales                                                      // leer ultimo cobro y agregar a cmovims y recalcular totales                                            
                         }
                        })
}

VerFactura(idmov : number){      
    const data = {
      idFactura     : idmov,        
      nrofactura    : "",
      accion        : "V"
    }       
    const dialogConfig = new MatDialogConfig();
   
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    
    const dialogRef =  this.dialog.open(FacTpComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( // 
          (data:any) => { if (data.clicked === 'Ver'){                   
             
          }})
 
   }

actualizarxUltPago(){
  // Vuelve  a  leer los pagos al chofer para reflejar el último en la cta.cte
  var subs1 : Subscription;
  this.cargandoCtaCte = true;  
  this.cmovscc = [];
  this.cpagos = [];
  forkJoin({  //   leer pagos y maxpagos porque se agrego un pago
      pagoschof   :       this.servicio.getPagosxChofer(this.numchofer),  
      maxpagos    :       this.servicio.getCantPagos(),

   }).subscribe(res2 => {
          this.cpagos    = res2.pagoschof;
          this.maxpago   = res2.maxpagos;                  
         
          this.prepararMovimientos();      
          this.generarColSaldo(); 
          this.cargandoCtaCte = false;   
          this.cdr.detectChanges();                                                          
          subs1.unsubscribe;
      })     
}

modifSaldoInicial(){
 var nros : number;
 var acc   : string;  
 var fec   : Date | null;
 if (this.cmovscc[0]!=undefined){
  fec = this.cmovscc[0].fecha;   
 } else {
   fec = null;
 }
 
 if (this.csaldos!=undefined && this.csaldos.length>0){ // modifica saldo inicial
    nros = 1;
    acc  = "I";
 } else {  // no tiene saldos, agrega el primer saldo
    nros = 1; 
    acc  = "A";
 }
 const datas : intSalChof = {
    nrochof     : this.numchofer,    
    nrosaldo    : nros,
    nomchof     : this.nomchofer,
    accion      : acc,
    fecprmv     : fec     // fecha del movimiento mas antiguo
  }    

  const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = datas;
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  const dialogRef =  this.dialog.open(SaldochofComponent, dialogConfig);
        dialogRef.afterClosed().subscribe( // 
        (data:any) => { if (data.clicked === 'Alta' || data.clicked === 'Modi'){ // agrego o modifico saldo inicial
                        this.saldoinicial = data.nsaldo.saldo; //refrescar saldo                        
                        this.regenerarSaldo();   // volver a leer los saldos    
                        this.cdr.detectChanges();                                                   // leer ultimo cobro y agregar a cmovims y recalcular totales                                            
                         }
                        })

}

regenerarSaldo(){
  this.csaldos = [];
  var subs : Subscription;
  subs = this.servicio.getSaldosChofer(this.numchofer)
       .pipe(
         finalize(() => {                                        
                 this.saldoinicial = this.csaldos[0].saldo;
                 this.generarColSaldo();                             
                 subs.unsubscribe
                 this.actualizarSaldoInicial();                                
               }))                       
       .subscribe((data: any): void => {
         this.csaldos = data;
       })
}

onSelectionChangeSaldos($event : any){

}

actualizarSaldoInicial(){
  // Actualiza el saldo  inicial en la table "choferes"
   var salc : saldoChofDTO = {
      idChofer  : this.numchofer,
      nroSaldo  : 0,
      fecha     : new Date(),
      saldo     : this.saldoinicial
    }  
  
    var subscri : Subscription;         
    var resu : number;
    subscri = this.servicio.updateSaldoInicial(salc)
      .pipe(
         finalize(() => { 
            this.notiService.showNotification("Saldo inicial para el chofer : "+this.nomchofer+
                              "("+resu+") modificado con éxito",'Aceptar','mensaje',500);    
            subscri.unsubscribe;
         }))
      .subscribe((data: any): void => {
         resu = data;
    });
     
}
generarCtaCtePDF(){
     var colspdf = [
    { header: 'Fecha', dataKey: 'fecha' },
    { header: 'T.Mov', dataKey: 'tipomov' },
    { header: 'Nro', dataKey: 'idMov' },
    { header: 'Descripcion', dataKey: 'descmov' },
    { header: 'Importe', dataKey: 'importe' },    
    { header: 'SALDO', dataKey: 'saldo' }
  ];
    var filas    :  any[];
    const doc = new jsPDF('p','mm','A4');
    
    const title = 'Cuenta Corriente de : '+this.nomchofer;
  
    // Fecha actual
    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-AR');
         
    filas = this.cmovscc.map((item)=> [    
              this.datepipe.transform(item.fecha,"dd/MM/yyyy"),
              item.tipomov,
              item.idMov,
              item.descmov,
              this.currencyPipe.transform(item.importe, '$', 'symbol', '1.2-2'),
              this.currencyPipe.transform(item.saldo, '$', 'symbol', '1.2-2'),              
           ])
           autoTable(doc, 
             {
               head: [colspdf.map((item)=>item.header)],
               body: filas,
               columns: colspdf,
               styles: { fontSize: 8 },
               headStyles: { fillColor: [63, 81, 181], halign: 'center' },
               startY: 25, // Espacio debajo del título
               columnStyles: {
                 fecha  : { halign: 'left' },
                 tipomov: { halign: 'center' },
                 idMov  : { halign: 'center' },
                 descmov: { halign: 'left' },
                 importe: { halign: 'right' },                 
                 saldo  : { halign: 'right' }
               },
                
               margin: { left: 10, right: 10 }}                      
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
              doc.setFontSize(8);
              doc.text(`Fecha: ${fechaStr}`, doc.internal.pageSize.getWidth() - 20, 10, { align: 'right' });
              doc.setFontSize(8);
              doc.text(text, pageSize.width - 20, 15, { align: 'right' });  

              //if (i==1){ // primer página
              var cade = "";
              if (this.saldoinicial==0){
                   cade = `Saldo Inicial : `+this.currencyPipe.transform(this.saldoinicial, '$', 'symbol', '1.2-2');
              } else {
                   cade = `Saldo Inicial al `+this.datepipe.transform(this.csaldos[0].fecha,'dd/MM/yyyy')+" : "+
                   this.currencyPipe.transform(this.saldoinicial, '$', 'symbol', '1.2-2');
              }    
              doc.setFontSize(8);
              doc.text(cade,doc.internal.pageSize.getWidth()-10, 23,{ align: 'right' });
             //}
            }  
            doc.save('CCChofer'+this.nomchofer+'.pdf');                               
  
}
BorrarPago(nropago:number){
 var resu : string;
   this.sinoServicio.abrirSiNoDialogo("Confirmación",
                        "¿ Está seguro de quiere borrar el Pago Nro."+nropago+" ?")
        .then(result => {
           if (result) {
               var subscri : Subscription;
               subscri = this.servicio.elimPago(nropago)
                  .pipe(finalize(() => {
                     this.notiService.showNotification("El Pago Nro "+nropago+" se ha eliminado con éxito "+resu,'Aceptar','mensaje',500); 
                     var subs : Subscription;
                     this.cpagos  = [];
                     this.cmovscc = [];
                     subs = this.servicio.getPagosxChofer(this.numchofer) // recargo los cobros del cliente
                         .pipe(finalize(()=> {
                           this.cargandoCtaCte = false;
                           this.saldoinicial = this.chof.saldoini;
                           this.prepararMovimientos();   
                           if (this.saldoinicial==0){
                             this.mensSaldo = "Saldo inicial : "                              
                           } else {
                             this.mensSaldo = "Saldo inicial al "+
                           this.datepipe.transform(this.csaldos[0].fecha,"dd/MM/yyyy")+" : "      
                            }
                            subscri.unsubscribe();
                           subs.unsubscribe;
                          }))
                        .subscribe((data : any):void => {
                           this.cpagos = data
                        })                                                                                                                
                   }))
                  .subscribe((data : any): void => {
                        resu = data});       
           } else {
             console.log('El usuario seleccionó "No"');
           }
     })
}
}

