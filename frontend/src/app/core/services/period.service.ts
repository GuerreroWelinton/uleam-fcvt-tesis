import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { MAIN_ENDPOINTS, PERIODS_ENDPOINTS } from '../enums/endpoints.enum';
import { IApiResponse } from '../interfaces/api-response.interface';
import { KEYS_LOCAL_STORAGE } from '../enums/local-storage.enum';
import { BASE_RECORD_STATES } from '../enums/common.enum';
import { IPeriod } from '../../features/periods/interfaces/period.interface';

@Injectable({ providedIn: 'root' })
export class PeriodService {
  private baseUrl: string = `${environment.API_URL}${MAIN_ENDPOINTS.PERIODS}`;
  private periodKey: string = KEYS_LOCAL_STORAGE.PERIOD;

  private selectedPeriodSubject: BehaviorSubject<IPeriod | null> =
    new BehaviorSubject<IPeriod | null>(null);

  constructor(private _httpClient: HttpClient) {}

  public selectedPeriod$ = this.selectedPeriodSubject.asObservable();

  public setSelectedPeriod(period: IPeriod): void {
    this.selectedPeriodSubject.next(period);
    if (this.getPeriodCode()) {
      this.clearPeriodCode();
    }
    this.setPeriodCode(period.code);
  }

  public getSelectedPeriod(): IPeriod | null {
    return this.selectedPeriodSubject.value;
  }

  public clearPeriodCode(): void {
    localStorage.removeItem(this.periodKey);
  }

  public setPeriodCode(code: string): void {
    localStorage.setItem(this.periodKey, code);
  }

  public getPeriodCode(): string | null {
    return localStorage.getItem(this.periodKey);
  }

  public selectLatestPeriod(periods: IPeriod[]): void {
    const activePeriods = periods.filter(
      (period) => period.status === BASE_RECORD_STATES.ACTIVE
    );

    if (activePeriods.length > 0) {
      const latestPeriod = activePeriods.reduce((prev, current) => {
        return new Date(prev.createdAt) > new Date(current.createdAt)
          ? prev
          : current;
      });
      this.setSelectedPeriod(latestPeriod);
    } else {
      this.clearPeriodCode();
    }
  }

  public getPeriods(): Observable<IApiResponse<IPeriod[]>> {
    const endpoint: string = `${this.baseUrl}${PERIODS_ENDPOINTS.LIST}`;
    return this._httpClient.get<IApiResponse<IPeriod[]>>(endpoint);
  }
}
