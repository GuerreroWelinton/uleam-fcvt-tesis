import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IEducationalSpace } from '../../features/management-educational-spaces/interfaces/educational-spaces.interface';

@Injectable({
  providedIn: 'root',
})
export class PreBookingService {
  private selectedEduSpace: BehaviorSubject<IEducationalSpace | null> =
    new BehaviorSubject<IEducationalSpace | null>(null);

  constructor() {}

  public getSelectedEduSpace(): Observable<IEducationalSpace | null> {
    return this.selectedEduSpace.asObservable();
  }

  public updateSelectedEduSpace(eduSpace: IEducationalSpace | null): void {
    this.selectedEduSpace.next(eduSpace);
  }
}
