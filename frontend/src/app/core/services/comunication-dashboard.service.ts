import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComunicationDashboardService {
  private valueSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {}

  getValue(): Observable<any> {
    return this.valueSubject.asObservable();
  }

  setValue(newValue: any): void {
    this.valueSubject.next(newValue);
  }
}
