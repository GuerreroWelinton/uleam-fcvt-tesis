import {
  Directive,
  HostListener,
  Input,
  Renderer2,
  ElementRef,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[sharedMaxChar]',
})
export class MaxCharDirective {
  @Input({ required: true }) sharedMaxChar: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > this.sharedMaxChar) {
      this.renderer.setProperty(
        input,
        'value',
        input.value.slice(0, this.sharedMaxChar)
      );
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      const input = this.el.nativeElement as HTMLInputElement;
      if (input.value.length + pastedText.length > this.sharedMaxChar) {
        event.preventDefault();
        const textToPaste = pastedText.slice(
          0,
          this.sharedMaxChar - input.value.length
        );
        this.renderer.setProperty(input, 'value', input.value + textToPaste);
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = this.el.nativeElement as HTMLInputElement;
    if (
      input.value.length >= this.sharedMaxChar &&
      event.key !== 'Backspace' &&
      event.key !== 'Delete' &&
      !this.isNavigationKey(event)
    ) {
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
    ];
    return navigationKeys.includes(event.key);
  }
}
