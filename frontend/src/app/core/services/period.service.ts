import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { BASE_ENDPOINTS, MAIN_ENDPOINTS } from '../enums/endpoints.enum';
import { IApiResponse } from '../interfaces/api-response.interface';
import { IFilters } from '../interfaces/general.interface';
import { IPeriod } from '../interfaces/period.interface';
import { AlertService } from './alert.service';

@Injectable({ providedIn: 'root' })
export class PeriodService {
  private baseUrl: string = `	${environment.API_URL}${MAIN_ENDPOINTS.PERIODS}`;

  constructor(
    private _httpClient: HttpClient,
    private _alertService: AlertService
  ) {}

  public list(filters: IFilters): Observable<IApiResponse<IPeriod[]>> {
    const params = new HttpParams({ fromObject: filters });
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST}`;
    return this._httpClient.get<IApiResponse<IPeriod[]>>(endpoint, { params });
  }

  public register(period: Partial<IPeriod>): Observable<IApiResponse<IPeriod>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.REGISTER}`;
    return this._httpClient
      .post<IApiResponse<IPeriod>>(endpoint, period)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public delete(id: string): Observable<IApiResponse<IPeriod>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.DELETE}/${id}`;
    return this._httpClient
      .delete<IApiResponse<IPeriod>>(endpoint)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public update(
    id: string,
    period: Partial<IPeriod>
  ): Observable<IApiResponse<IPeriod>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.UPDATE}/${id}`;
    return this._httpClient
      .patch<IApiResponse<IPeriod>>(endpoint, period)
      .pipe(tap((res) => this.showAlert(res)));
  }

  private showAlert(res: IApiResponse<IPeriod>): void {
    this._alertService.showAlert({
      type: 'success',
      message: res.message,
    });
  }
}
