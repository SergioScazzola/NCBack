import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'tr[hoverTable]',
  standalone: true
})
export class HoverTableDirective {
  // Directiva de realce de color de filas de tabla
  // los colores están hardcodeados
  // color de realce : #4772de
  // cuando se abandona la fila se restituyen los colores anteriores
  // color fila par   : #a1b2dd
  // color fila impar : blanco
  
  constructor(private elemento: ElementRef) { }


  @HostListener('mouseenter',['$event']) 
  onMouseEnter(event : MouseEvent){
     const row = event.target as HTMLTableRowElement;
     row.setAttribute("style","background-color:rgb(161, 178, 221)");//  "background-color: #4772de");  

  }
 
  @HostListener('mouseleave',['$event']) 
  onMouseLeave(event : MouseEvent) {   
     const row = event.target as HTMLTableRowElement;
    (row.rowIndex+1) % 2 == 0?
      row.setAttribute("style","background-color: #b6c1dd"): //   "background-color:#a1b2dd;"):
      row.setAttribute("style","background-color:#ffffff")
}
}
