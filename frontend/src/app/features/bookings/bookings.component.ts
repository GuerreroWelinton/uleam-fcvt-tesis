import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PreBookingService } from '../../core/services/pre-booking.service';
import { IEducationalSpace } from '../management-educational-spaces/interfaces/educational-spaces.interface';
import { OnBookingComponent } from './components/on-booking/on-booking.component';
import { PreBookingComponent } from './components/pre-booking/pre-booking.component';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [AsyncPipe, PreBookingComponent, OnBookingComponent],
  templateUrl: './bookings.component.html',
})
export default class BookingsComponent implements OnInit {
  public selectedEduSpace$: Observable<IEducationalSpace | null> = of(null);

  constructor(private _preBookingService: PreBookingService) {}

  ngOnInit(): void {
    this.selectedEduSpace$ = this.fetchSelectedEduSpace();
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
