import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[sharedOnlyNumbers]',
})
export class OnlyNumbersDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    const initialValue = input.value;

    // Eliminar caracteres no numéricos
    input.value = initialValue.replace(/[^0-9]*/g, '');
    if (initialValue !== input.value) {
      event.stopPropagation();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      // Si el texto pegado contiene caracteres no numéricos, prevenir la acción
      if (!/^\d*$/.test(pastedText)) {
        event.preventDefault();
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = this.el.nativeElement as HTMLInputElement;

    // Permitir teclas de navegación, retroceso, etc.
    if (this.isNavigationKey(event) || this.isControlKey(event)) {
      return;
    }

    // Prevenir cualquier tecla que no sea un número
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    const textData = event.dataTransfer?.getData('text');
    // Prevenir el drop si el texto contiene caracteres no numéricos
    if (textData && !/^\d*$/.test(textData)) {
      event.preventDefault();
    }
  }

  private isNavigationKey(event: KeyboardEvent): boolean {
    const navigationKeys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'Backspace',
      'Tab',
    ];
    return navigationKeys.includes(event.key);
  }

  private isControlKey(event: KeyboardEvent): boolean {
    return event.ctrlKey || event.metaKey || event.key === 'Delete';
  }
}
