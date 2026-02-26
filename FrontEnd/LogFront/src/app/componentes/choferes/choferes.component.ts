import { Component, effect, ElementRef, input, signal, viewChild, ViewChild, WritableSignal } from '@angular/core';
import { choferDTO } from '../../../entidades/choferDTO';
import { ServiciosService } from '../../servicios/service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SinoService } from '../../servicios/sino.service';
import { NotiserviceService } from '../../servicios/notiservice.service';
import { finalize, Subscription } from 'rxjs';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ChoferComponent } from './chofer/chofer.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-choferes',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './choferes.component.html',
  styleUrl: './choferes.component.css'
})
export class ChoferesComponent {  
   @ViewChild('filtroInput') inputRef!: ElementRef<HTMLInputElement>;
   
   
   //public inputRef    = viewChild.required<ElementRef>('filtroInput');
   public filtro       : string;
   public cchoferes    : choferDTO[]=[];

   cantchof            : number;
   formchof            : boolean;
   chofmod             : number;
   dataSource = new MatTableDataSource<any>();
   
        
   colChoferes : string[] = ["idChofer" , "nombre","domicilio","localidad","empresa","cuit","telefono","notas","M","B" ];
 
   
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
      this.leerChoferes();  
      })       
       
 }
       
   leerChoferes(){
        var subs : Subscription;
        subs = this.servicio.getChoferes()
           .pipe(finalize(()=> {
               this.cantchof = this.cchoferes.length;
                this.dataSource.data = this.cchoferes;         
                this.dataSource.filterPredicate = (dato : choferDTO, fil : string) => {
                     return dato.nombre.toLowerCase().includes(fil);
                                     };    
                // Aplica filtro si hay uno
                if (this.filtro!=='') {                                 
                    this.dataSource.filter = this.filtro;                                                                       
                    this.inputRef.nativeElement.value = this.filtro;//setAttribute('value', this.filtro);
                }
               subs.unsubscribe();
           }))
           .subscribe((data : any): void => {
                            this.cchoferes = data});  
     } 
   agChofer(){
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
  
     const dialogRef =  this.dialog.open(ChoferComponent, dialogConfig);
     dialogRef.afterClosed().subscribe( // 
        (data:any) => { if (data.clicked === 'Alta'){                   
          this.leerChoferes();
         }})
     this.formchof = true;
     this.chofmod  = 0; 
   }
   modificarChofer(nrochofer : number,nom : string){      
    const data = {
      nrochof : nrochofer,        
      nombre    : nom,
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
    
    const dialogRef =  this.dialog.open(ChoferComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( // 
          (data:any) => { if (data.clicked === 'Modi'){                   
              this.leerChoferes(); // refrescar lista
          }})
 
   }
   borrarChofer(nrochofer : number){
     var resu : string;
      this.sinoServicio.abrirSiNoDialogo("Confirmación",
                               "¿ Está seguro de quiere borrar el Chofer Nro."+nrochofer+" ?")
        .then(result => {
           if (result) {
               var subscri : Subscription;
               subscri = this.servicio.elimChofer(nrochofer)
                  .pipe(finalize(() => {
                     this.notiServicio.showNotification("El Chofer Nro "+nrochofer+" se ha eliminado con éxito "+resu,'Aceptar','mensaje',500); 
                     subscri.unsubscribe();
                    this.leerChoferes(); // refrescar lista
 
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
         this.formchof = false;
           this.leerChoferes(); // refrescar lista
     } else {
       this.formchof = false;
     }
    }

 
   aplicarFiltro(valor : string)  {
    this.dataSource.filter = valor.trim().toLowerCase();
 }
}
