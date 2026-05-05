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

import { viajeDTO } from '../../../../entidades/viajeDTO';

import { FacClienteComponent } from '../../facs-clientes/fac-cliente/fac-cliente.component';

import { PagoscliComponent } from '../pagoscli/pagoscli.component';
import { facclDTO } from '../../../../entidades/facclDTO';
import { intPagocli, pagocliDTO } from '../../../../entidades/pagocliDTO';
import { clienteDTO, intSalCli, saldoCliDTO } from '../../../../entidades/clienteDTO';
import { SaldocliComponent } from '../saldocli/saldocli.component';


@Component({
  selector: 'app-ctactecli',
   imports: [CommonModule,MatTableModule,MatSelectModule,],
  providers : [
          DatePipe,
          CurrencyPipe],
  templateUrl: './ctactecli.component.html',
  styleUrl: './ctactecli.component.css',
})
export class CtactecliComponent {
public cviajes        : viajeDTO[]=[];
public cfacsCli       : facclDTO[]=[];
public cpagoscli      : pagocliDTO[]=[]; 

public cmovscc        : ctactecDTO[]=[];
public csaldos        : saldoCliDTO[];
public cargandoCtaCte : boolean = true;
 
public saldofinal     : number;

public numcliente     : number ;  // pasados commo parametro
public nomcliente     : string;

public  saldoinicial  : number=0;
public  mensSaldo      : string;
public  cbsaldos      : FormControl;
private cliente       : clienteDTO;
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
     const pnro      = params.get('nrocliente');
     const pnombre   = params.get('nomcliente');
     this.filter     = params.get('filtro')||'';
     console.log("Filtro en CtaCte : "+this.filter);
     this.numcliente = pnro!=undefined?Number(pnro):0;
     this.nomcliente = pnombre!=undefined?pnombre:"";
     this.cargandoCtaCte = true;
     this.saldofinal     = 0;
     var preparo : boolean=false;
     forkJoin({  // consultas para armar la cta.cte del cliente en paralelo
        salcli     :       this.servicio.getSaldosCliente(this.numcliente),      
        facturascli:       this.servicio.getFactCliXCliente(this.numcliente),      
        pagoscli   :       this.servicio.getPagosxCliente(this.numcliente),
        client     :       this.servicio.leerCliente(this.numcliente),
        maxpagos   :       this.servicio.getCantPagosCli(),

      }).subscribe(res2 => {
        this.csaldos    = res2.salcli;
       
        this.cfacsCli   = res2.facturascli;
        
        this.cpagoscli  = res2.pagoscli;
        this.cliente    = res2.client;   
        this.maxpago    = res2.maxpagos;

                             
           
        //console.log(JSON.stringify(this.chof));                       
        this.saldoinicial = this.cliente.saldoini;
        if (this.cliente.saldoini==0){
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
 
// vuelca Facturas de clientes y Pagos al array de movimientos y los ordena por fecha
if (this.cpagoscli!=undefined){
  for (let index=0; index<this.cpagoscli.length;index++){
    var regmovim : ctactecDTO = {
     idMov      : this.cpagoscli[index].idPago,
     fecha      : this.cpagoscli[index].fecha!,   
     tipomov    : "PAG",
     descmov    : "PAG nro. "+this.cpagoscli[index].idPago+" - Fac Nro.: "+this.cpagoscli[index].idFactura,                      
     importe   :  this.cpagoscli[index].imptotal*-1, // pago resta
     saldo     :  0
  };
  this.cmovscc.push(regmovim);
  };
}


if (this.cfacsCli!=undefined){
  for (let index=0; index<this.cfacsCli.length; index++){
    var regmov : ctactecDTO = {
      idMov      : this.cfacsCli[index].idFactura,
      fecha      : this.cfacsCli[index].fecha,   
      tipomov    : this.cfacsCli[index].facndc==="FAC"? "FAC" : "NDC",
      descmov    : (this.cfacsCli[index].facndc==="FAC"? "FAC" : "NDC")+" - "+
                   this.cfacsCli[index].nrofactura+" - "+
                   this.cfacsCli[index].cantit+" viajes",
      importe    : this.cfacsCli[index].facndc==="FAC"? this.cfacsCli[index].totalfac : this.cfacsCli[index].totalfac*-1, // factura suma
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
  (s): s is saldoCliDTO => s != null
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
  this.router.navigate(['/clientes',this.filter]);
}

agregarPago(){
     // Llama al componente de pago "pagoscli" para agregar un pago al cliente
     const data : intPagocli= {
        idPago     : this.maxpago + 1,
        idCliente  : this.numcliente,
        nombre     : this.nomcliente,
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
      const dialogRef =  this.dialog.open(PagoscliComponent, dialogConfig);
            dialogRef.afterClosed().subscribe( // 
            (data:any) => { if (data.clicked === 'Alta'){        // Agregó un cobro           
                             this.actualizarxUltPago();   // leer pagos y rearmar cmovims y recalcular totales                                            
                             }
                            })
}

modificarPago(idmov:number ){
  const data : intPagocli = {
    idPago     : idmov,
    idCliente   : this.cliente.idCliente,
    nombre      : this.nomcliente,
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
  const dialogRef =  this.dialog.open(PagoscliComponent, dialogConfig);
        dialogRef.afterClosed().subscribe( // 
        (data:any) => { if (data.clicked === 'Modi'){        // Modifico el cobro seleccionado           
                        this.actualizarxUltPago();   // leer pagos, rearmar cmovims y recalcular totales                                                      // leer ultimo cobro y agregar a cmovims y recalcular totales                                            
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
    
    const dialogRef =  this.dialog.open(FacClienteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( // 
          (data:any) => { if (data.clicked === 'Ver'){                   
             
          }})
 
   }

actualizarxUltPago(){
  // Vuelve  a  leer los pagos al chofer para reflejar el último en la cta.cte
  var subs1 : Subscription;
  this.cargandoCtaCte = true;  
  this.cmovscc = [];
  this.cpagoscli = [];
  subs1 = this.servicio.getPagosxChofer(this.numcliente) // traer los pagos al chofer
      .pipe(
        finalize(() => {                                    
         
          this.prepararMovimientos();      
          this.generarColSaldo(); 
          this.cargandoCtaCte = false;   
          this.cdr.detectChanges();                                                          
          subs1.unsubscribe;
      }))           
      .subscribe((data:any):void => {
        this.cpagoscli = data;
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
 const datas : intSalCli = {
    nrocli     : this.numcliente,    
    nrosaldo    : nros,
    nomcli     : this.nomcliente,
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
  const dialogRef =  this.dialog.open(SaldocliComponent, dialogConfig);
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
  subs = this.servicio.getSaldosCliente(this.numcliente)
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
   var salc : saldoCliDTO = {
      idCliente  : this.numcliente,
      nroSaldo   : 0,
      fecha      : new Date(),
      saldo      : this.saldoinicial
    }  
  
    var subscri : Subscription;         
    var resu : number;
    subscri = this.servicio.updateSaldoInicialCli(salc)
      .pipe(
         finalize(() => { 
            this.notiService.showNotification("Saldo inicial para el cliente : "+this.nomcliente+
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
    
    const title = 'Cuenta Corriente del cliente : '+this.nomcliente;
  
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
            doc.save('CCChofer'+this.nomcliente+'.pdf');                               
  
}
BorrarPago(nropago:number){
 var resu : string;
   this.sinoServicio.abrirSiNoDialogo("Confirmación",
                        "¿ Está seguro de quiere borrar el Pago del cliente Nro."+nropago+" ?")
        .then(result => {
           if (result) {
               var subscri : Subscription;
               subscri = this.servicio.elimPagoCli(nropago)
                  .pipe(finalize(() => {
                     this.notiService.showNotification("El Pago Nro "+nropago+" se ha eliminado con éxito "+resu,'Aceptar','mensaje',500); 
                     var subs : Subscription;
                     this.cpagoscli  = [];
                     this.cmovscc    = [];
                     subs = this.servicio.getPagosxCliente(this.numcliente) // recargo los pagos del cliente
                         .pipe(finalize(()=> {
                           this.cargandoCtaCte = false;
                           this.saldoinicial = this.cliente.saldoini;
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
                           this.cpagoscli = data
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
