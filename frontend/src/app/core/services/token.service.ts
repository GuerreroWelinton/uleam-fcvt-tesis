import { Injectable } from '@angular/core';
import { KEYS_LOCAL_STORAGE, USER_ROLES } from '../enums/general.enum';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private tokenKey: string = KEYS_LOCAL_STORAGE.TOKEN;

  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public decodeToken(token: string): {
    id: string;
    exp: number;
    roles: USER_ROLES[];
  } {
    try {
      const payload: string = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error decoding token:', e);
      return { id: '', exp: 0, roles: [] };
    }
  }

  public isTokenExpired(exp: number): boolean {
    const now: number = Date.now() / 1000;
    return now >= exp;
  }

  public getUserRoles(): USER_ROLES[] {
    const token = this.getToken();
    if (!token) return [];

    const { roles, exp } = this.decodeToken(token);
    return this.isTokenExpired(exp) ? [] : roles;
  }

  public hasRole(allowedRoles: USER_ROLES[]): boolean {
    const roles = this.getUserRoles();
    return roles.some((role) => allowedRoles.includes(role));
  }

  public hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const { exp } = this.decodeToken(token);
    return !this.isTokenExpired(exp);
  }
}
