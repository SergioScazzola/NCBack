import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ServiciosService } from '../../servicios/service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { SinoService } from '../../servicios/sino.service';
import { NotiserviceService } from '../../servicios/notiservice.service';
import { finalize, forkJoin, Subscription, switchMap } from 'rxjs';
import { DatePipe,DecimalPipe} from '@angular/common';
import { CommonModule } from '@angular/common';
import { facclDTO } from '../../../entidades/facclDTO';
import { FacClienteComponent } from './fac-cliente/fac-cliente.component';
import { MatDateFormats } from '@angular/material/core';
import { itfacclDTO } from '../../../entidades/itfacclDTO';

@Component({
  selector: 'app-facs-clientes',
 imports: [ CommonModule,DatePipe,DecimalPipe,MatTableModule],
  templateUrl: './facs-clientes.component.html',
  styleUrl: './facs-clientes.component.css',
})
export class FacsClientesComponent {
@ViewChild('filtroInput') inputRef!: ElementRef<HTMLInputElement>;
   
   
   //public inputRef    = viewChild.required<ElementRef>('filtroInput');
   public filtro       : string;
  
   isloading             : boolean = true;
   cantfaccl             : number;
   formFaccl             : boolean;
   factpmod              : number; 
   cfacsCL               : facclDTO[]=[];
   cdetfaccl             : itfacclDTO[]=[];
   dataSource            = new MatTableDataSource<any>();

 
   colfaccl : string[] = ["idFactura" , "nrofactura","facndc","fecha","nomcliente","impneto","impiva","totalfac","M","B" ];
 

   constructor(     private servicio     : ServiciosService,               
                    private rutaActiva   : ActivatedRoute,
                    private router       : Router,
                    public  dialog       : MatDialog,
                    private sinoServicio : SinoService,
                    private cdr          : ChangeDetectorRef,     
                    private notiServicio : NotiserviceService
                               ) {    }     
  
 ngOnInit(){         
     this.rutaActiva.queryParamMap.subscribe((params) => { // lee el parametro de ruteo y lo asigna al filtro
        var fil  = params.get('filtro')||'';     
      this.filtro = fil;   
      if (this.inputRef) {
          this.inputRef.nativeElement.value = this.filtro;   
      }             
      this.leerCFacsCL(); // carga la lista de facturas al cliente
       
      })
  }
         
 leerCFacsCL(){
         forkJoin({
              facturas: this.servicio.getFacsCL(),    
           // lee factura y detalle en paralelo para mostrar en el formulario      
         }).subscribe(res2 => {
            this.cfacsCL = res2.facturas;

            this.cantfaccl = this.cfacsCL.length;
            this.dataSource.data = this.cfacsCL;         
            this.dataSource.filterPredicate = (dato : facclDTO, fil : string) => {
                return dato.nomcliente.toLowerCase().startsWith(fil);
            };    
            // Aplica filtro si hay uno
            if (this.filtro!=='') {                                 
               this.dataSource.filter = this.filtro;                                                                       
               this.inputRef.nativeElement.value = this.filtro;//setAttribute('value', this.filtro);
            }
            if (this.cantfaccl == 0){
                this.notiServicio.showNotification("No existen Facturas emitidas al Cliente",'Aceptar','mensaje',500)
            }
            this.isloading = false;
            this.cdr.detectChanges();
         })  
      
    }

   agFacCL(){
    console.log("CCCCCCCCCCCCCCCCCCCC : "+this.cantfaccl);
     const data1 = {
          idFactura    : this.cantfaccl + 1,  
          nrofactura   : "",
          accion       : "A",
     }
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data             =   data1;
    dialogConfig.width            =  '700px';         // ancho máximo de la ventana
    dialogConfig.maxWidth         =  '95vw';      
    dialogConfig.height           = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass       = 'custom-dialog-container';
    dialogConfig.disableClose     =  false; // opcional según necesidad
  
     const dialogRef =  this.dialog.open(FacClienteComponent, dialogConfig);
     dialogRef.afterClosed().subscribe(
        (datass:any) => { if (datass.clicked === 'Alta'){               
                             console.log("Evento recibido de Factcli:");    
                             this.leerCFacsCL();
                        }})
     this.formFaccl = true;
     this.factpmod  = 0; 
   }
  
   verFacCL(idfac : number,nrof : string){      
    const data = {
      idFactura     : idfac,        
      nrofactura    : nrof,
      accion        : "V"
    }       
    const dialogConfig = new MatDialogConfig();
   
    dialogConfig.width =  '500';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    
    const dialogRef =  this.dialog.open(FacClienteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( // 
          (data:any) => { if (data.clicked === 'Ver'){                   
              this.leerCFacsCL(); // refrescar lista
          }})
 
   }

   borrarFacCL(idfac : number, nrofac : string){
    // Desmarca los registros de viaje de acuerdo al detalle y luego
    // borra la factura y el detalle en cascada (definido en BD)
     var resu : string;
     this.servicio.getItemsFacsCL(idfac).subscribe((data:any) => { 
        this.cdetfaccl = data;

        const observables = this.cdetfaccl.map(item => {                         
        return this.servicio.updateFactC(item.idViaje, 0);
     });

     forkJoin(observables).subscribe({
      next: (results) => {
       console.log('Todos los items grabados:', results);

      // 👉 recién acá eliminar
       this.servicio.elimFacCL(idfac).subscribe((data:any) => { 
        resu = data;
        this.leerCFacsCL();  // refrescar lista de facturas
        this.notiServicio.showNotification(
          "Factura : " + nrofac + " Eliminada (" + resu + ")",
          'Aceptar',
          'mensaje',
          500
        );
      });

    }, 
    error: (err) => {
      console.error('Error al grabar items:', err);
    }
  });
});

}
  
   manejarOperacion($event:any){
     if ($event==="Alta" || $event==="Modi"){
         this.formFaccl = false;
         this.leerCFacsCL(); // refrescar lista
      
     } else {
       this.formFaccl = false;
     }
    }

 volver(){
    this.router.navigate(['/ppal']);
 }
   aplicarFiltro(valor : string)  {
    this.dataSource.filter = valor.trim().toLowerCase();
 }
}
