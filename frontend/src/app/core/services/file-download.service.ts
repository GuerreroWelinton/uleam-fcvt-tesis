import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { IApiResponse } from '../interfaces/api-response.interface';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  private baseUrl = environment.API_URL;

  constructor(private http: HttpClient, private _alertService: AlertService) {}

  public downloadFile(filePath: string): Observable<Blob> {
    const url = `${this.baseUrl}/${filePath.replace('\\', '/')}`;
    return this.http
      .get(url, { responseType: 'blob' })
      .pipe(tap(() => this.showAlert()));
  }

  public triggerDownload(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  private showAlert(): void {
    this._alertService.showAlert({
      type: 'success',
      message: '¡Se ha completado la descarga con éxito!',
    });
  }
}
