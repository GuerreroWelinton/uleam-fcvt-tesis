import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Directive, HostListener, Input } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../../core/services/alert.service';

@Directive({
  selector: '[appDownloadFile]',
  standalone: true,
})
export class DownloadFileDirective {
  @Input({ required: true }) fileUrl: string;
  @Input({ required: true }) fileName: string;

  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService
  ) {}

  @HostListener('click')
  downloadFile(): void {
    const filePath = `${this.fileUrl}${this.fileName}`;
    this.httpClient
      .get(filePath, { responseType: 'blob' })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)))
      .subscribe((response) => this.handleResponse(response, filePath));
  }

  private handleError(error: HttpErrorResponse) {
    this.alertService.showAlert({
      type: 'danger',
      message:
        error.status === 404
          ? 'El archivo no esta disponible, comuníquese con el administrador'
          : 'No se pudo verificar la existencia del archivo, comuníquese con el administrador',
    });
    return of(null);
  }

  private handleResponse(response: Blob | null, filePath: string) {
    if (response && response.type !== 'text/html') {
      this.downloadBlob(response, this.fileName);
    } else {
      this.alertService.showAlert({
        type: 'danger',
        message: 'Archivo no encontrado, comuníquese con el administrador',
      });
    }
  }

  private downloadBlob(blob: Blob, fileName: string) {
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    this.alertService.showAlert({
      type: 'success',
      message: 'Archivo descargado correctamente',
    });
  }
}
