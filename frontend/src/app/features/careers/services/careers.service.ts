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
import { ICareer } from '../interfaces/careers.interface';

@Injectable({ providedIn: 'root' })
export class CareersService {
  private baseUrl: string = `	${environment.API_URL}${MAIN_ENDPOINTS.CAREERS}`;

  constructor(
    private _httpClient: HttpClient,
    private _alertService: AlertService
  ) {}

  public list(): Observable<IApiResponse<ICareer[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST}`;
    return this._httpClient.get<IApiResponse<ICareer[]>>(endpoint);
  }

  public register(career: Partial<ICareer>): Observable<IApiResponse<ICareer>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.REGISTER}`;
    return this._httpClient.post<IApiResponse<ICareer>>(endpoint, career).pipe(
      tap((res) =>
        this._alertService.showAlert({
          type: 'success',
          message: res.message,
        })
      )
    );
  }

  public delete(id: string): Observable<IApiResponse<ICareer>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.DELETE}/${id}`;
    return this._httpClient.delete<IApiResponse<ICareer>>(endpoint).pipe(
      tap((res) =>
        this._alertService.showAlert({
          type: 'success',
          message: res.message,
        })
      )
    );
  }

  public update(
    id: string,
    career: Partial<ICareer>
  ): Observable<IApiResponse<ICareer>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.UPDATE}/${id}`;
    return this._httpClient.patch<IApiResponse<ICareer>>(endpoint, career).pipe(
      tap((res) =>
        this._alertService.showAlert({
          type: 'success',
          message: res.message,
        })
      )
    );
  }
}
