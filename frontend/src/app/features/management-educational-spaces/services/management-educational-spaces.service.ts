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
import { IEducationalSpace } from '../interfaces/educational-spaces.interface';

@Injectable({
  providedIn: 'root',
})
export class ManagementEducationalSpacesService {
  private baseUrl: string = `  ${environment.API_URL}${MAIN_ENDPOINTS.EDUCATIONAL_SPACES}`;

  constructor(
    private _httpClient: HttpClient,
    private _alertService: AlertService
  ) {}

  public list(): Observable<IApiResponse<IEducationalSpace[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST}`;
    return this._httpClient.get<IApiResponse<IEducationalSpace[]>>(endpoint);
  }

  public register(
    educationalSpace: Partial<IEducationalSpace>
  ): Observable<IApiResponse<IEducationalSpace>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.REGISTER}`;
    return this._httpClient
      .post<IApiResponse<IEducationalSpace>>(endpoint, educationalSpace)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public delete(id: string): Observable<IApiResponse<IEducationalSpace>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.DELETE}/${id}`;
    return this._httpClient
      .delete<IApiResponse<IEducationalSpace>>(endpoint)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public update(
    id: string,
    educationalSpace: Partial<IEducationalSpace>
  ): Observable<IApiResponse<IEducationalSpace>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.UPDATE}/${id}`;
    return this._httpClient
      .put<IApiResponse<IEducationalSpace>>(endpoint, educationalSpace)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public listByUserId(
    id: string
  ): Observable<IApiResponse<IEducationalSpace[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST_BY_USER}/${id}`;
    return this._httpClient.get<IApiResponse<IEducationalSpace[]>>(endpoint);
  }

  private showAlert(res: IApiResponse<IEducationalSpace>): void {
    this._alertService.showAlert({
      type: 'success',
      message: res.message,
    });
  }
}
