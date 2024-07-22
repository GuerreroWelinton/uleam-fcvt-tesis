import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.dev';
import {
  BASE_ENDPOINTS,
  MAIN_ENDPOINTS,
} from '../../../core/enums/endpoints.enum';
import { IApiResponse } from '../../../core/interfaces/api-response.interface';
import { IPagination } from '../../../core/interfaces/component.interface';
import { AlertService } from '../../../core/services/alert.service';
import { buildQueryParams } from '../../../core/utils/general.util';
import { IUser } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private baseUrl: string = `	${environment.API_URL}${MAIN_ENDPOINTS.USERS}`;

  constructor(
    private _httpClient: HttpClient,
    private _alertService: AlertService
  ) {}

  public list(
    filters: Partial<IUser>,
    pagination: IPagination
  ): Observable<IApiResponse<IUser[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST}`;
    const queryParams: string = buildQueryParams<Partial<IUser>>({
      ...filters,
      ...pagination,
    });
    return this._httpClient.get<IApiResponse<IUser[]>>(
      `${endpoint}?${queryParams}`
    );
  }

  public findById(id: string): Observable<IApiResponse<IUser>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.FIND_BY_ID}/${id}`;
    return this._httpClient.get<IApiResponse<IUser>>(endpoint);
  }

  public registerGroup(
    users: Partial<IUser>[]
  ): Observable<IApiResponse<IUser[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.REGISTER_GROUP}`;
    return this._httpClient
      .post<IApiResponse<IUser[]>>(endpoint, users)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public delete(id: string): Observable<IApiResponse<IUser>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.DELETE}/${id}`;
    return this._httpClient
      .delete<IApiResponse<IUser>>(endpoint)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public update(
    id: string,
    user: Partial<IUser>
  ): Observable<IApiResponse<IUser>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.UPDATE}/${id}`;
    return this._httpClient
      .patch<IApiResponse<IUser>>(endpoint, user)
      .pipe(tap((res) => this.showAlert(res)));
  }

  private showAlert(res: IApiResponse<IUser | IUser[]>): void {
    this._alertService.showAlert({
      type: 'success',
      message: res.message,
    });
  }
}
