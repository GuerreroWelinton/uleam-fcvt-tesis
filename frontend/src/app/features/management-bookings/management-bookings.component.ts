import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PreBookingService } from '../../core/services/pre-booking.service';
import { IEducationalSpace } from '../management-educational-spaces/interfaces/educational-spaces.interface';
import { ManagementOnBookingComponent } from './components/management-on-booking/management-on-booking.component';
import { ManagementPreBookingComponent } from './components/management-pre-booking/management-pre-booking.component';

@Component({
  selector: 'app-management-bookings',
  standalone: true,
  imports: [
    AsyncPipe,
    ManagementPreBookingComponent,
    ManagementOnBookingComponent,
  ],
  templateUrl: './management-bookings.component.html',
})
export default class ManagementBookingsComponent implements OnInit, OnDestroy {
  public selectedEduSpace$: Observable<IEducationalSpace | null> = of(null);

  constructor(private _preBookingService: PreBookingService) {}

  ngOnInit(): void {
    this.selectedEduSpace$ = this.fetchSelectedEduSpace();
  }

  ngOnDestroy(): void {
    this.updateSelectedEduSpace();
  }

  private fetchSelectedEduSpace(): Observable<IEducationalSpace | null> {
    return this._preBookingService.getSelectedEduSpace();
  }

  public onBack(): void {
    this.updateSelectedEduSpace();
  }

  private updateSelectedEduSpace(): void {
    this._preBookingService.updateSelectedEduSpace(null);
  }
}
