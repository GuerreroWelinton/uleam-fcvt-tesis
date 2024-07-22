import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[sharedMaxWidthEllipsis]',
  standalone: true,
})
export class MaxWidthEllipsisDirective implements OnInit {
  @Input('sharedMaxWidthEllipsis') maxWidth: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.applyEllipsis();
  }

  private applyEllipsis(): void {
    const element = this.el.nativeElement;
    const text = element.innerText;
    const maxWidth = this.maxWidth;

    this.renderer.setStyle(element, 'white-space', 'nowrap');
    this.renderer.setStyle(element, 'overflow', 'hidden');
    this.renderer.setStyle(element, 'text-overflow', 'ellipsis');
    this.renderer.setStyle(element, 'display', 'inline-block');
    this.renderer.setStyle(element, 'max-width', `${maxWidth}px`);
  }
}
