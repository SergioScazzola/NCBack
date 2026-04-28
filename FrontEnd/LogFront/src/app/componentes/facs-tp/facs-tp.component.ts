import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ServiciosService } from '../../servicios/service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { SinoService } from '../../servicios/sino.service';
import { NotiserviceService } from '../../servicios/notiservice.service';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { DatePipe,DecimalPipe} from '@angular/common';
import { CommonModule } from '@angular/common';
import { factpDTO } from '../../../entidades/factpDTO';
import { FacTpComponent } from './fac-tp/fac-tp.component';
import { MatDateFormats } from '@angular/material/core';
import { itfactpDTO } from '../../../entidades/itfactpDTO';




@Component({
  selector: 'app-facs-tp',
  imports: [ CommonModule,DatePipe,DecimalPipe,MatTableModule],
  templateUrl: './facs-tp.component.html',
  styleUrl: './facs-tp.component.css',
})
export class FacsTPComponent {
@ViewChild('filtroInput') inputRef!: ElementRef<HTMLInputElement>;
   
   
   //public inputRef    = viewChild.required<ElementRef>('filtroInput');
   public filtro       : string;
  
   isloading             : boolean = true;
   cantfactp             : number;
   formFactp             : boolean;
   factpmod              : number; 
   cfacsTP               : factpDTO[]=[];
   cdetfacTP             : itfactpDTO[]=[];
   dataSource            = new MatTableDataSource<any>();

 
   colfactp : string[] = ["idFactura" , "nrofactura","facndc","fecha","nomchofer","impneto","impiva","totalfac","M","B" ];
 

   constructor(     private servicio     : ServiciosService,               
                    private rutaActiva   : ActivatedRoute,
                    private router       : Router,
                    public  dialog       : MatDialog,
                    private sinoServicio : SinoService,
                    private cdr          : ChangeDetectorRef,     
                    private notiServicio : NotiserviceService
                               ) {    
   }         
 ngOnInit(){         
     this.rutaActiva.queryParamMap.subscribe((params) => { // lee el parametro de ruteo y lo asigna al filtro
        var fil  = params.get('filtro')||'';     
      this.filtro = fil;   
      if (this.inputRef) {
          this.inputRef.nativeElement.value = this.filtro;   
      }             
      this.leerFacsTP();        
      })       
       
 }
       
   leerFacsTP(){
      var subs : Subscription;
      subs = this.servicio.getFacsTP()
           .pipe(finalize(()=> {
               this.cantfactp = this.cfacsTP.length;
                this.dataSource.data = this.cfacsTP;         
                this.dataSource.filterPredicate = (dato : factpDTO, fil : string) => {
                     return dato.nomchofer.toLowerCase().includes(fil);
                                     };    
                // Aplica filtro si hay uno
                if (this.filtro!=='') {                                 
                    this.dataSource.filter = this.filtro;                                                                       
                    this.inputRef.nativeElement.value = this.filtro;//setAttribute('value', this.filtro);
                }
                this.isloading = false;
                this.cdr.detectChanges();
               subs.unsubscribe();
           }))
           .subscribe((data : any): void => {
                            this.cfacsTP = data});      
    
   } 

   agFacTP(){
     const data1 = {
          idFactura    : this.cantfactp + 1,  
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
  
     const dialogRef =  this.dialog.open(FacTpComponent, dialogConfig);
     dialogRef.afterClosed().subscribe(
        (datass:any) => { if (datass.clicked === 'Alta'){      
                             console.log("FACTURA TPTE Grabada...");             
                             this.leerFacsTP();
                        }})
     this.formFactp = true;
     this.factpmod  = 0; 
   }
  
   verFacTP(idfac : number,nrof : string){      
    const data = {
      idFactura     : idfac,        
      nrofactura    : nrof,
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
              this.leerFacsTP(); // refrescar lista
          }})
 
   }
   borrarFacTP(idfac : number, nrofac : string){
    var resu : string;
    // Desmarca los registros de viaje de acuerdo al detalle y luego
    // borra la factura y el detalle en cascada (definido en BD)
    var resu : string;
    this.servicio.getItemsFacsTP(idfac).subscribe((data:any) => { 
            this.cdetfacTP    = data;
    
            const observables = this.cdetfacTP.map(item => {                         
            return this.servicio.updateFactT(item.idViaje, 0);
         });
    
         forkJoin(observables).subscribe({
          next: (results) => {
           console.log('Todos los items grabados:', results);
    
          // 👉 recién acá eliminar
           this.servicio.elimFacTP(idfac).subscribe((data:any) => { 
            resu = data;
            this.leerFacsTP();  // refrescar lista de facturas
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
         this.formFactp = false;
         this.leerFacsTP(); // refrescar lista
     } else {
       this.formFactp = false;
     }
    }

  volver(){
    this.router.navigate(['/ppal']);
 }
   aplicarFiltro(valor : string)  {
    this.dataSource.filter = valor.trim().toLowerCase();
 }
informeFacturasTP(){  
    this.router.navigate(['/factpte','infofacstp']);
}

}
