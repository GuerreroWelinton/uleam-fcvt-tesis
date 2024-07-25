import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.dev';
import { IUser } from '../../features/users/interfaces/user.interface';
import { UsersService } from '../../features/users/service/users.service';
import { AUTH_ENDPOINTS, MAIN_ENDPOINTS } from '../enums/endpoints.enum';
import { BASE_RECORD_STATES } from '../enums/general.enum';
import { IApiResponse } from '../interfaces/api-response.interface';
import { AlertService } from './alert.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl: string = `${environment.API_URL}${MAIN_ENDPOINTS.AUTH}`;

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _userService: UsersService,
    private _alertService: AlertService,
    private _tokenService: TokenService
  ) {}

  public login(
    email: string,
    password: string
  ): Observable<IApiResponse<IUser>> {
    const endpoint = `${this.baseUrl}${AUTH_ENDPOINTS.LOGIN}`;
    return this._httpClient
      .post<IApiResponse<IUser>>(endpoint, { email, password })
      .pipe(
        tap((res) => {
          if (res.token) {
            this._tokenService.setToken(res.token);
          }
          this._alertService.showAlert({
            type: 'success',
            message: res.message,
          });
        })
      );
  }

  public isAuthenticated(): Observable<{
    user: IUser | null;
    token: string | null;
  }> {
    if (!this._tokenService.hasValidToken()) {
      this.logout();
      return of({ user: null, token: null });
    }

    const token = this._tokenService.getToken();
    const { id } = this._tokenService.decodeToken(token!);

    return this._userService.findById(id).pipe(
      filter((res) => !!res.data),
      map((res) => {
        const user = res.data?.result;
        if (!user || user.status === BASE_RECORD_STATES.INACTIVE) {
          this.logout();
          return { user: null, token: null };
        }
        return { user, token };
      }),
      catchError((error) => {
        this.logout();
        return of({ user: null, token: null });
      })
    );
  }

  public logout(): void {
    this._tokenService.removeToken();
    this._router.navigate(['/authentication']);
  }
}
