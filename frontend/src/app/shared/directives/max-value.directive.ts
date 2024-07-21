import {
  Directive,
  HostListener,
  Input,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[sharedMaxValue]',
})
export class MaxValueDirective {
  @Input({ required: true }) sharedMaxValue: number;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    let inputValue = parseInt(input.value, 10);

    if (inputValue > this.sharedMaxValue) {
      inputValue = this.sharedMaxValue;
      this.renderer.setProperty(input, 'value', inputValue);
      if (this.control && this.control.control) {
        this.control.control.setValue(inputValue);
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      const pastedValue = parseInt(pastedText, 10);
      if (pastedValue > this.sharedMaxValue) {
        event.preventDefault();
        this.renderer.setProperty(
          this.el.nativeElement,
          'value',
          this.sharedMaxValue
        );
        if (this.control && this.control.control) {
          this.control.control.setValue(this.sharedMaxValue);
        }
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const inputValue = parseInt(input.value, 10);

    if (
      inputValue >= this.sharedMaxValue &&
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
      'Tab',
    ];
    return navigationKeys.includes(event.key);
  }
}
