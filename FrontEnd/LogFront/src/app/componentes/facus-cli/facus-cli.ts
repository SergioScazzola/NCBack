import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ServiciosService } from '../../servicios/service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { SinoService } from '../../servicios/sino.service';
import { NotiserviceService } from '../../servicios/notiservice.service';
import { finalize, Subscription } from 'rxjs';
import { DatePipe,DecimalPipe} from '@angular/common';
import { CommonModule } from '@angular/common';
import { facclDTO } from '../../../entidades/facclDTO';
import { Factcli } from './factcli/factcli';
import { MatDateFormats } from '@angular/material/core';

@Component({
  selector: 'app-facus-cli',
  imports: [ CommonModule,DatePipe,DecimalPipe,MatTableModule],
  templateUrl: './facus-cli.html',
  styleUrl: './facus-cli.css',
})
export class FacusCli {
@ViewChild('filtroInput') inputRef!: ElementRef<HTMLInputElement>;
   
   
   //public inputRef    = viewChild.required<ElementRef>('filtroInput');
   public filtro       : string;
  
   isloading             : boolean = true;
   cantfaccl             : number;
   formFaccl             : boolean;
   factpmod              : number; 
   cfacsCL               : facclDTO[]=[];
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
      this.leerFacsCL;  
      })       
       
 }
         
 leerFacsCL(){
    var subs : Subscription;
    subs = this.servicio.getFacsCL()
        .pipe(finalize(()=> {
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
            subs.unsubscribe();
       }))
       .subscribe((data : any): void => {
           this.cfacsCL = data});                 
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
  
     const dialogRef =  this.dialog.open(Factcli, dialogConfig);
     dialogRef.afterClosed().subscribe(
        (datass:any) => { if (datass.clicked === 'Alta'){               
                             console.log("Evento recibido de Factcli:");    
                             this.leerFacsCL();
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
   
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    
    const dialogRef =  this.dialog.open(Factcli, dialogConfig);
    dialogRef.afterClosed().subscribe( // 
          (data:any) => { if (data.clicked === 'Ver'){                   
              this.leerFacsCL(); // refrescar lista
          }})
 
   }
   borrarFacCL(idfac : number, nrofac : string){
     var resu : string;
      this.sinoServicio.abrirSiNoDialogo("Confirmación",
                               "¿ Está seguro de quiere borrar Definitivamente la Factura Nro."+idfac+"-"+nrofac+" ?")
        .then(result => {
           if (result) {
               var subscri : Subscription;
               subscri = this.servicio.elimFacCL(idfac)               
                  .pipe(finalize(() => {
                     this.notiServicio.showNotification("La Factura Nro "+idfac+" se ha eliminado con éxito "+resu,'Aceptar','mensaje',500); 
                     subscri.unsubscribe();
                    this.leerFacsCL(); // refrescar lista
 
                   }))
                   .subscribe((data : any): void => {
                        resu = data});       
           } else {
             console.log('El usuario seleccionó "No"');
           }
     })
  }
  
   manejarOperacion($event:any){
     if ($event==="Alta" || $event==="Modi"){
         this.formFaccl = false;
         this.leerFacsCL(); // refrescar lista
      
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
