import { ChangeDetectorRef, Component, effect, ElementRef, input, signal, viewChild, ViewChild, WritableSignal } from '@angular/core';

import { ServiciosService } from '../../servicios/service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SinoService } from '../../servicios/sino.service';
import { NotiserviceService } from '../../servicios/notiservice.service';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { gastoDTO } from '../../../entidades/gastoDTO';
import { GastoComponent } from './gasto/gasto.component';
import { UnidadDTO } from '../../../entidades/marcaDTO';

@Component({
  selector: 'app-gastos',
imports: [CommonModule, MatTableModule],
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.css',
})
export class GastosComponent {
 @ViewChild('filtroInput') inputRef!: ElementRef<HTMLInputElement>;
   
   
   //public inputRef    = viewChild.required<ElementRef>('filtroInput');
   public filtro       : string;
   public cgastos      : gastoDTO[]=[];
  
 

   cantgasto           : number;
   formgasto           : boolean;
   gastomod            : number;
   dataSource = new MatTableDataSource<any>();
 
        
   colGastos : string[] = ["idGasto" ,"fecha","nomchofer","cantgasto","unidgasto","pregasto","descgasto", "provgasto",
                           "tipogasto","impgasto","M","B" ];
 
   
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
      this.leerGastos();  
      })       
       
 }
       
   leerGastos(){
    forkJoin({
        gastos    : this.servicio.getGastos(),    
        cantgastos: this.servicio.getCantGastos(),

                
     }).subscribe(res2 => {
        this.cgastos = res2.gastos;
        this.cantgasto = res2.cantgastos;

       
       
        this.dataSource.data = this.cgastos;
        this.dataSource.filterPredicate = (dato : gastoDTO, fil : string) => {
               return dato.nomchofer.toLowerCase().startsWith(fil); }
                                    
                // Aplica filtro si hay uno
                if (this.filtro!=='') {                                 
                    this.dataSource.filter = this.filtro;                                                                       
                    this.inputRef.nativeElement.value = this.filtro;//setAttribute('value', this.filtro);
                }
      })
     
   }

   agregarGasto(){
     const data = {
          nrogasto    : this.cantgasto+1,    
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
  
     const dialogRef =  this.dialog.open(GastoComponent, dialogConfig);
     dialogRef.afterClosed().subscribe( // 
        (data:any) => { if (data.clicked === 'Alta'){                   
          this.leerGastos();
         }})
     this.formgasto = true;
     this.gastomod  = 0; 
   }
   modificarGasto(numgasto : number){      
    const data = {
      nrogasto : numgasto,        
      nombre   : "",
      accion   : "M"
    }       
    const dialogConfig = new MatDialogConfig() 
   
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    
    const dialogRef =  this.dialog.open(GastoComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( // 
          (data:any) => { if (data.clicked === 'Modi'){                   
              this.leerGastos(); // refrescar lista
          }})
 
   }
   borrarGasto(nrogasto : number){
     var resu : string;
      this.sinoServicio.abrirSiNoDialogo("Confirmación",
                               "¿ Está seguro de quiere borrar el Gasto Nro."+nrogasto+" ?")
        .then(result => {
           if (result) {
               var subscri : Subscription;
               subscri = this.servicio.elimGasto(nrogasto)
                  .pipe(finalize(() => {
                     this.notiServicio.showNotification("El Gasto Nro "+nrogasto+" se ha eliminado con éxito "+resu,'Aceptar','mensaje',500); 
                     subscri.unsubscribe();
                    this.leerGastos(); // refrescar lista
 
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
         this.formgasto = false;
           this.leerGastos(); // refrescar lista
     } else {
       this.formgasto = false;
     }
    }

  
  volver(){
    this.router.navigate(['/ppal']);
 }
   aplicarFiltro(valor : string)  {
    this.dataSource.filter = valor.trim().toLowerCase();
 }
}


