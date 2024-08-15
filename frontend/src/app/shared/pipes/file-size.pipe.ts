import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true,
})
export class FileSizePipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) {
      return '';
    }
    const mb = value / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }
}
