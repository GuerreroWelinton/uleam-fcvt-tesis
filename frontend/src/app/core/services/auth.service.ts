import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.dev';
import { UsersService } from '../../features/users/service/users.service';
import { AUTH_ENDPOINTS, MAIN_ENDPOINTS } from '../enums/endpoints.enum';
import { BASE_RECORD_STATES, KEYS_LOCAL_STORAGE } from '../enums/general.enum';
import { IApiResponse } from '../interfaces/api-response.interface';
import { IUser } from '../../features/users/interfaces/user.interface';
import { AlertService } from './alert.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl: string = `${environment.API_URL}${MAIN_ENDPOINTS.AUTH}`;
  private tokenKey: string = KEYS_LOCAL_STORAGE.TOKEN;

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _userService: UsersService,
    private _alertService: AlertService
  ) {}

  public login(
    email: string,
    password: string
  ): Observable<IApiResponse<IUser>> {
    const endpoint: string = `${this.baseUrl}${AUTH_ENDPOINTS.LOGIN}`;
    return this._httpClient
      .post<IApiResponse<IUser>>(endpoint, { email, password })
      .pipe(
        tap((res) => {
          if (res.token) this.setToken(res.token);
          this._alertService.showAlert({
            type: 'success',
            message: res.message,
          });
        })
      );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private decodeToken(token: string): { id: string; exp: number } {
    const payload: string = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  private isTokenExpired(exp: number): boolean {
    const now: number = new Date().getTime() / 1000;
    return now >= exp;
  }

  public isAuthenticated(): Observable<IUser | null> {
    const token: string | null = this.getToken();
    if (!token) return of(null);

    const { id, exp } = this.decodeToken(token);

    if (this.isTokenExpired(exp)) {
      this.logout();
      return of(null);
    }

    return this._userService.findById(id).pipe(
      filter((res) => !!res.data),
      map((res) => {
        if (res.data?.result?.status === BASE_RECORD_STATES.INACTIVE) {
          this.logout();
          return null;
        }
        return res.data?.result || null;
      }),
      catchError(() => of(null))
    );
  }

  public hasValidToken(): boolean {
    const token: string | null = this.getToken();
    if (!token) return false;

    const { exp } = this.decodeToken(token);
    return !this.isTokenExpired(exp);
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._router.navigate(['/authentication']);
  }
}
