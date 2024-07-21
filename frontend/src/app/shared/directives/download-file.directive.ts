import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDownloadFile]',
  standalone: true,
})
export class DownloadFileDirective {
  @Input({ required: true }) fileUrl: string;
  @Input({ required: true }) fileName: string;

  constructor() {}

  @HostListener('click')
  downloadFile(): void {
    const link = document.createElement('a');
    link.href = `${this.fileUrl}${this.fileName}`;
    link.download = this.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
