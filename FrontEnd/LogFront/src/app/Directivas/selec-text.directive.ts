import { Directive, ElementRef, HostListener } from '@angular/core';
/* Directiva que selecciona el texto de un input text cuando se obtiene el foco*/
@Directive({
  selector: 'input[selecText]',
  standalone: true
})
export class SelecTextDirective {

  constructor(private eleRef:ElementRef) { 
    console.log("Se esta usando la directiva..."+eleRef);
  }
  @HostListener('focus',['$event'])
  onFocus(event : FocusEvent){
     const input = event.target as HTMLInputElement;

     if (input) {
        input.select();
     }
  }
  /*onFocus(inp:HTMLInputElement) {    
    inp.selectionStart =  0
    inp.selectionEnd   = inp.size-1
  }*/
}

