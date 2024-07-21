import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../../core/services/alert.service';
import { environment } from '../../../../environments/environment.dev';
import {
  BASE_ENDPOINTS,
  MAIN_ENDPOINTS,
} from '../../../core/enums/endpoints.enum';
import { IApiResponse } from '../../../core/interfaces/api-response.interface';
import { Observable, tap } from 'rxjs';
import { IPeriod } from '../interfaces/period.interface';

@Injectable({ providedIn: 'root' })
export class PeriodService {
  private baseUrl: string = `	${environment.API_URL}${MAIN_ENDPOINTS.PERIODS}`;

  constructor(
    private _httpClient: HttpClient,
    private _alertService: AlertService
  ) {}

  public list(): Observable<IApiResponse<IPeriod[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST}`;
    return this._httpClient.get<IApiResponse<IPeriod[]>>(endpoint);
  }

  public register(period: Partial<IPeriod>): Observable<IApiResponse<IPeriod>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.REGISTER}`;
    return this._httpClient.post<IApiResponse<IPeriod>>(endpoint, period).pipe(
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
    period: Partial<IPeriod>
  ): Observable<IApiResponse<IPeriod>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.UPDATE}/${id}`;
    return this._httpClient.patch<IApiResponse<IPeriod>>(endpoint, period).pipe(
      tap((res) => {
        this._alertService.showAlert({
          type: 'success',
          message: res.message,
        });
      })
    );
  }

  public delete(id: string): Observable<IApiResponse<IPeriod>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.DELETE}/${id}`;
    return this._httpClient.delete<IApiResponse<IPeriod>>(endpoint).pipe(
      tap((res) => {
        this._alertService.showAlert({
          type: 'success',
          message: res.message,
        });
      })
    );
  }
}
