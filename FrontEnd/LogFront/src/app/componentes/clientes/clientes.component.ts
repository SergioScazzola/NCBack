import { Component, ElementRef, ViewChild } from '@angular/core';
import { camionDTO } from '../../../entidades/camionDTO';

import { ServiciosService } from '../../servicios/service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { SinoService } from '../../servicios/sino.service';
import { NotiserviceService } from '../../servicios/notiservice.service';
import { finalize, Subscription } from 'rxjs';
import { ClienteComponent } from './cliente/cliente.component';
import { clienteDTO } from '../../../entidades/clienteDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, MatTableModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent {
@ViewChild('filtroInput') inputRef!: ElementRef<HTMLInputElement>;
   
   
   //public inputRef    = viewChild.required<ElementRef>('filtroInput');
   public filtro       : string;
   public cclientes    : clienteDTO[]=[];

   cantcliente           : number;
   formcliente           : boolean;
   clientemod            : number;
   dataSource            = new MatTableDataSource<any>();

        idCliente      : number;
   nombre         : string;
   domicilio      : string;
   localidad      : string;
   telefono       : string;
   contacto       : string;
   cuit           : string;
   notas          : string;
   saldoini       : number;   
  

   colClientes : string[] = ["idCliente" , "nombre","domicilio","localidad","telefono","cuit","notas","M","B" ];
 
   
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
      this.leerClientes();  
      })       
       
 }
       
   leerClientes(){
        var subs : Subscription;
        subs = this.servicio.getClientes()
           .pipe(finalize(()=> {
               this.cantcliente = this.cclientes.length;
                this.dataSource.data = this.cclientes;         
                this.dataSource.filterPredicate = (dato : clienteDTO, fil : string) => {
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
                            this.cclientes = data});  
     } 
   agCliente(){
     const data = {
          nrocliente    : 0,    
          nombre        : "",      
          accion        : "A",
     }       
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
     const dialogRef =  this.dialog.open(ClienteComponent, dialogConfig);
     dialogRef.afterClosed().subscribe( // 
        (data:any) => { if (data.clicked === 'Alta'){                   
          this.leerClientes();
         }})
     this.formcliente = true;
     this.clientemod  = 0; 
   }
   modificarCliente(nrocli : number,nom : string){      
    const data = {
      nrocliente : nrocli,        
      nombre     : nom,
      accion     : "M"
    }       
    const dialogConfig = new MatDialogConfig();
   
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
  
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    
    const dialogRef =  this.dialog.open(ClienteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe( // 
          (data:any) => { if (data.clicked === 'Modi'){                   
              this.leerClientes(); // refrescar lista
          }})
 
   }
   borrarCliente(nrocli : number,nom : string){
     var resu : string;
      this.sinoServicio.abrirSiNoDialogo("Confirmación",
                               "¿ Está seguro de quiere borrar el Cliente Nro."+nrocli+"-"+nom+" ?")
        .then(result => {
           if (result) {
               var subscri : Subscription;
               subscri = this.servicio.elimCliente(nrocli)
                  .pipe(finalize(() => {
                     this.notiServicio.showNotification("El Cliente Nro "+nrocli+" se ha eliminado con éxito "+resu,'Aceptar','mensaje',500); 
                     subscri.unsubscribe();
                    this.leerClientes(); // refrescar lista
 
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
         this.formcliente = false;
           this.leerClientes(); // refrescar lista
     } else {
       this.formcliente = false;
     }
    }

 
   aplicarFiltro(valor : string)  {
    this.dataSource.filter = valor.trim().toLowerCase();
 }
}
