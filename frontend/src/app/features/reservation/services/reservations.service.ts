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
import { ICalendar } from '../interfaces/calendar.interface';

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private baseUrl: string = `	${environment.API_URL}${MAIN_ENDPOINTS.RESERVATION}`;

  constructor(
    private _httpClient: HttpClient,
    private _alertService: AlertService
  ) {}

  public list(
    filters: Partial<ICalendar>,
    pagination: IPagination
  ): Observable<IApiResponse<ICalendar[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST}`;
    const queryParams: string = buildQueryParams<Partial<ICalendar>>({
      ...filters,
      ...pagination,
    });
    return this._httpClient.get<IApiResponse<ICalendar[]>>(
      `${endpoint}?${queryParams}`
    );
  }

  public findById(id: string): Observable<IApiResponse<ICalendar>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.FIND_BY_ID}/${id}`;
    return this._httpClient.get<IApiResponse<ICalendar>>(endpoint);
  }

  // public register(user: Partial<ICalendar>): Observable<IApiResponse<ICalendar>> {
  //   const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.REGISTER}`;
  //   return this._httpClient
  //     .post<IApiResponse<ICalendar>>(endpoint, user)
  //     .pipe(tap((res) => this.showAlert(res)));
  // }

  // public registerGroup(
  //   users: Partial<ICalendar>[]
  // ): Observable<IApiResponse<ICalendar[]>> {
  //   const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.REGISTER_GROUP}`;
  //   return this._httpClient
  //     .post<IApiResponse<ICalendar[]>>(endpoint, users)
  //     .pipe(tap((res) => this.showAlert(res)));
  // }

  public delete(id: string): Observable<IApiResponse<ICalendar>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.DELETE}/${id}`;
    return this._httpClient
      .delete<IApiResponse<ICalendar>>(endpoint)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public update(
    id: string,
    reservation: Partial<ICalendar>
  ): Observable<IApiResponse<ICalendar>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.UPDATE}/${id}`;
    return this._httpClient
      .patch<IApiResponse<ICalendar>>(endpoint, reservation)
      .pipe(tap((res) => this.showAlert(res)));
  }

  private showAlert(res: IApiResponse<ICalendar | ICalendar[]>): void {
    this._alertService.showAlert({
      type: 'success',
      message: res.message,
    });
  }
}
