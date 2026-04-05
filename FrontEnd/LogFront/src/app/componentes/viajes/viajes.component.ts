import { Component, ElementRef, ViewChild } from '@angular/core';
import { DatePipe,DecimalPipe} from '@angular/common';
import { ServiciosService } from '../../servicios/service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { SinoService } from '../../servicios/sino.service';
import { NotiserviceService } from '../../servicios/notiservice.service';
import { finalize, Subscription } from 'rxjs';
import { viajeDTO } from '../../../entidades/viajeDTO';
import { ViajeComponent } from './viaje/viaje.component';

@Component({
  selector: 'app-viajes',
  imports: [ MatTableModule,DatePipe,DecimalPipe],
  templateUrl: './viajes.component.html',
  styleUrl: './viajes.component.css',
})
export class ViajesComponent {
@ViewChild('filtroInput') inputRef!: ElementRef<HTMLInputElement>;
   
   
   //public inputRef    = viewChild.required<ElementRef>('filtroInput');
   public filtro       : string;
   public cviajes      : viajeDTO[]=[];

   cantviaje             : number;
   formviaje             : boolean;
   viajemod              : number;
   dataSource            = new MatTableDataSource<any>();
   
   colViajes : string[] = ["idViaje","fecha","nomcliente","nomchofer","descrip","destino","tarifap","cantkm","impviaje","M","B" ];
 
   
   constructor(     private servicio     : ServiciosService,               
                    private rutaActiva   : ActivatedRoute,
                    private router       : Router,
                    public  dialog       : MatDialog,
                    private sinoServicio : SinoService,
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
      this.leerViajes();  
      })       
       
 }
       
   leerViajes(){
        var subs : Subscription;
        subs = this.servicio.getViajes()
           .pipe(finalize(()=> {
               this.cantviaje = this.cviajes.length;
                this.dataSource.data = this.cviajes;         
                this.dataSource.filterPredicate = (dato : viajeDTO, fil : string) => {
                     return dato.destino.toLowerCase().startsWith(fil);
                                     };    
                // Aplica filtro si hay uno
                if (this.filtro!=='') {                                 
                    this.dataSource.filter = this.filtro;                                                                       
                    this.inputRef.nativeElement.value = this.filtro;//setAttribute('value', this.filtro);
                }
               subs.unsubscribe();
           }))
           .subscribe((data : any): void => {
                            this.cviajes = data});  
     } 
   agViaje(){
     const data = {
          nroviaje     : 0,    
          descrip      : "",      
          accion     : "A",
     }       
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    dialogConfig.width =  '1000px';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '1200px' //'95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
     const dialogRef =  this.dialog.open(ViajeComponent, dialogConfig);
     dialogRef.afterClosed().subscribe( // 
        (data:any) => { if (data.clicked === 'Alta'){                   
          this.leerViajes();
         }})
     this.formviaje = true;
     this.viajemod  = 0; 
   }
   modificarViaje(nrovje : number,desc : string){      
    const data = {
      nroviaje    : nrovje,        
      descrip     : desc,
      accion      : "M"
    }       
    const dialogConfig = new MatDialogConfig();
   
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    
    const dialogRef =  this.dialog.open(ViajeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( // 
          (data:any) => { if (data.clicked === 'Modi'){                   
              this.leerViajes(); // refrescar lista
          }})
 
   }
   borrarViaje(nrovje : number,desc : string){
     var resu : string;
      this.sinoServicio.abrirSiNoDialogo("Confirmación",
                               "¿ Está seguro de quiere borrar el Viaje Nro."+nrovje+"-"+desc+" ?")
        .then(result => {
           if (result) {
               var subscri : Subscription;
               subscri = this.servicio.elimViaje(nrovje)
                  .pipe(finalize(() => {
                     this.notiServicio.showNotification("El Viaje Nro "+nrovje+" se ha eliminado con éxito "+resu,'Aceptar','mensaje',500); 
                     subscri.unsubscribe();
                    this.leerViajes(); // refrescar lista
 
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
         this.formviaje = false;
           this.leerViajes(); // refrescar lista
     } else {
       this.formviaje = false;
     }
    }

  volver(){
    this.router.navigate(['/ppal']);
 }
   aplicarFiltro(valor : string)  {
    this.dataSource.filter = valor.trim().toLowerCase();
 }
}
