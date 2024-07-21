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
import { IBuilding } from '../interfaces/building.interface';

@Injectable({ providedIn: 'root' })
export class BuildingService {
  private baseUrl: string = `	${environment.API_URL}${MAIN_ENDPOINTS.BUILDINGS}`;

  constructor(
    private _httpClient: HttpClient,
    private _alertService: AlertService
  ) {}

  public list(): Observable<IApiResponse<IBuilding[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST}`;
    return this._httpClient.get<IApiResponse<IBuilding[]>>(endpoint);
  }

  public register(
    building: Partial<IBuilding>
  ): Observable<IApiResponse<IBuilding>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.REGISTER}`;
    return this._httpClient
      .post<IApiResponse<IBuilding>>(endpoint, building)
      .pipe(
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
    building: Partial<IBuilding>
  ): Observable<IApiResponse<IBuilding>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.UPDATE}/${id}`;
    return this._httpClient
      .patch<IApiResponse<IBuilding>>(endpoint, building)
      .pipe(
        tap((res) =>
          this._alertService.showAlert({
            type: 'success',
            message: res.message,
          })
        )
      );
  }

  public delete(id: string): Observable<IApiResponse<IBuilding>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.DELETE}/${id}`;
    return this._httpClient.delete<IApiResponse<IBuilding>>(endpoint).pipe(
      tap((res) =>
        this._alertService.showAlert({
          type: 'success',
          message: res.message,
        })
      )
    );
  }
}
