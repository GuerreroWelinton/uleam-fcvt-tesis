import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { BASE_ENDPOINTS, MAIN_ENDPOINTS } from '../enums/endpoints.enum';
import { IApiResponse } from '../interfaces/api-response.interface';
import { IBooking } from '../interfaces/booking.interface';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class OnBookingService {
  private baseUrl: string = `	${environment.API_URL}${MAIN_ENDPOINTS.BOOKINGS}`;

  constructor(
    private _httpClient: HttpClient,
    private _alertService: AlertService
  ) {}

  public list(): Observable<IApiResponse<IBooking[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST}`;
    return this._httpClient.get<IApiResponse<IBooking[]>>(endpoint);
  }

  public register(booking: object): Observable<IApiResponse<IBooking>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.REGISTER}`;
    return this._httpClient
      .post<IApiResponse<IBooking>>(endpoint, booking)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public update(
    id: string,
    booking: object
  ): Observable<IApiResponse<IBooking>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.UPDATE}/${id}`;
    return this._httpClient
      .patch<IApiResponse<IBooking>>(endpoint, booking)
      .pipe(tap((res) => this.showAlert(res)));
  }

  private showAlert(res: IApiResponse<IBooking>): void {
    this._alertService.showAlert({
      type: 'success',
      message: res.message,
    });
  }
}
