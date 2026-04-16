import {
  Directive,
  ElementRef,
  HostListener,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: '[appImporteDecimal]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImporteDecimalDirective),
      multi: true
    }
  ]
})
export class ImporteDecimalDirective implements ControlValueAccessor {

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private el: ElementRef) {}

  // 👉 Escribe el valor en el input (form -> vista)
  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      this.el.nativeElement.value = this.formatear(value);
    } else {
      this.el.nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


 @HostListener('input', ['$event'])
 onInput(event: Event) {
  const input = event.target as HTMLInputElement | null;

  if (!input) return;

  const valor = input.value;

  const limpio = this.parsear(valor);
  this.onChange(limpio);

  input.value = this.formatear(limpio);
}
  private parsear(valor: string): number |null{
    if (!valor) return null;

    // quitar puntos de miles y reemplazar coma decimal
    valor = valor.replace(/\./g, '').replace(',', '.');

    return parseFloat(valor);
  }
  // 🎨 Formatea número a string visible
  private formatear(valor: number|null): string {
    if (valor === null || valor === undefined) return '';

    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  }
}