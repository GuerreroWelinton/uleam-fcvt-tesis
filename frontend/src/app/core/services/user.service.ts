import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { BASE_ENDPOINTS, MAIN_ENDPOINTS } from '../enums/endpoints.enum';
import { IApiResponse } from '../interfaces/api-response.interface';
import { IUser } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl: string = `	${environment.API_URL}${MAIN_ENDPOINTS.USERS}`;

  constructor(private _httpClient: HttpClient) {}

  public findById(id: string): Observable<IApiResponse<IUser>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.FIND_BY_ID}/${id}`;
    return this._httpClient.get<IApiResponse<IUser>>(endpoint);
  }
}
