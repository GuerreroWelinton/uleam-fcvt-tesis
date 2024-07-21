import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.dev';
import {
  BASE_ENDPOINTS,
  MAIN_ENDPOINTS,
} from '../../../core/enums/endpoints.enum';
import { IApiResponse } from '../../../core/interfaces/api-response.interface';
import { AlertService } from '../../../core/services/alert.service';
import { ISubject } from '../interfaces/subjects.interface';

@Injectable({ providedIn: 'root' })
export class SubjectsService {
  private baseUrl: string = `${environment.API_URL}${MAIN_ENDPOINTS.SUBJECTS}`;

  constructor(
    private _httpClient: HttpClient,
    private _alertService: AlertService
  ) {}

  public list(): Observable<IApiResponse<ISubject[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST}`;
    return this._httpClient.get<IApiResponse<ISubject[]>>(endpoint);
  }

  public register(
    subject: Partial<ISubject>
  ): Observable<IApiResponse<ISubject>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.REGISTER}`;
    return this._httpClient
      .post<IApiResponse<ISubject>>(endpoint, subject)
      .pipe(
        tap((res) => {
          this._alertService.showAlert({
            type: 'success',
            message: res.message,
          });
        })
      );
  }

  public delete(id: string): Observable<IApiResponse<ISubject>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.DELETE}/${id}`;
    return this._httpClient.delete<IApiResponse<ISubject>>(endpoint).pipe(
      tap((res) => {
        this._alertService.showAlert({
          type: 'success',
          message: res.message,
        });
      })
    );
  }

  public update(
    id: string,
    subject: Partial<ISubject>
  ): Observable<IApiResponse<ISubject>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.UPDATE}/${id}`;
    return this._httpClient
      .patch<IApiResponse<ISubject>>(endpoint, subject)
      .pipe(
        tap((res) => {
          this._alertService.showAlert({
            type: 'success',
            message: res.message,
          });
        })
      );
  }
}
