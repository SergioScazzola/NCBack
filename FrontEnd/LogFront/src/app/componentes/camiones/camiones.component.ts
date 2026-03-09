import { Component, ElementRef, ViewChild } from '@angular/core';
import { camionDTO } from '../../../entidades/camionDTO';

import { ServiciosService } from '../../servicios/service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { SinoService } from '../../servicios/sino.service';
import { NotiserviceService } from '../../servicios/notiservice.service';
import { finalize, Subscription } from 'rxjs';
import { CamionComponent } from './camion/camion.component';

@Component({
  selector: 'app-camiones',
imports: [ MatTableModule],
  templateUrl: './camiones.component.html',
  styleUrl: './camiones.component.css',
})
export class CamionesComponent {
 @ViewChild('filtroInput') inputRef!: ElementRef<HTMLInputElement>;
   
   
   //public inputRef    = viewChild.required<ElementRef>('filtroInput');
   public filtro       : string;
   public ccamiones    : camionDTO[]=[];

   cantcamion            : number;
   formcamion            : boolean;
   camionmod             : number;
   dataSource            = new MatTableDataSource<any>();

        
   colCamiones : string[] = ["idCamion" , "domChasis","domAcoplado","marca","modelo","anio","idEmptpte","emptpte","M","B" ];
 
   
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
      this.leerCamiones();  
      })       
       
 }
       
   leerCamiones(){
        var subs : Subscription;
        subs = this.servicio.getChoferes()
           .pipe(finalize(()=> {
               this.cantcamion = this.ccamiones.length;
                this.dataSource.data = this.ccamiones;         
                this.dataSource.filterPredicate = (dato : camionDTO, fil : string) => {
                     return dato.marca.toLowerCase().includes(fil);
                                     };    
                // Aplica filtro si hay uno
                if (this.filtro!=='') {                                 
                    this.dataSource.filter = this.filtro;                                                                       
                    this.inputRef.nativeElement.value = this.filtro;//setAttribute('value', this.filtro);
                }
               subs.unsubscribe();
           }))
           .subscribe((data : any): void => {
                            this.ccamiones = data});  
     } 
   agCamion(){
     const data = {
          nrochof    : 0,    
          nombre     : "",      
          accion     : "A",
     }       
     const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
     const dialogRef =  this.dialog.open(CamionComponent, dialogConfig);
     dialogRef.afterClosed().subscribe( // 
        (data:any) => { if (data.clicked === 'Alta'){                   
          this.leerCamiones();
         }})
     this.formcamion = true;
     this.camionmod  = 0; 
   }
   modificarCamion(nrocam : number,desc : string){      
    const data = {
      nrocamion : nrocam,        
      nombre    : desc,
      accion     : "M"
    }       
    const dialogConfig = new MatDialogConfig() 
   
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    
    const dialogRef =  this.dialog.open(CamionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( // 
          (data:any) => { if (data.clicked === 'Modi'){                   
              this.leerCamiones(); // refrescar lista
          }})
 
   }
   borrarCamion(nrocam : number){
     var resu : string;
      this.sinoServicio.abrirSiNoDialogo("Confirmación",
                               "¿ Está seguro de quiere borrar el Camión Nro."+nrocam+" ?")
        .then(result => {
           if (result) {
               var subscri : Subscription;
               subscri = this.servicio.elimChofer(nrocam)
                  .pipe(finalize(() => {
                     this.notiServicio.showNotification("El Camión Nro "+nrocam+" se ha eliminado con éxito "+resu,'Aceptar','mensaje',500); 
                     subscri.unsubscribe();
                    this.leerCamiones(); // refrescar lista
 
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
         this.formcamion = false;
           this.leerCamiones(); // refrescar lista
     } else {
       this.formcamion = false;
     }
    }

 
   aplicarFiltro(valor : string)  {
    this.dataSource.filter = valor.trim().toLowerCase();
 }
}
