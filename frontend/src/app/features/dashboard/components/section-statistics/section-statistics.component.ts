import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map, Observable, of } from 'rxjs';
import { IApiData } from '../../../../core/interfaces/api-response.interface';
import { IUser } from '../../../users/interfaces/user.interface';
import { UsersService } from '../../../users/services/users.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { OnBookingService } from '../../../../core/services/on-booking.service';
import { IBooking } from '../../../../core/interfaces/booking.interface';
import { IEducationalSpace } from '../../../management-educational-spaces/interfaces/educational-spaces.interface';
import { ManagementEducationalSpacesService } from '../../../../core/services/management-educational-spaces.service';
import { ICareer } from '../../../careers/interfaces/careers.interface';
import { CareersService } from '../../../careers/services/careers.service';
import { IBuilding } from '../../../buildings/interfaces/building.interface';
import { BuildingService } from '../../../buildings/services/building.service';

@Component({
  selector: 'app-section-statistics',
  standalone: true,
  imports: [MatCardModule, AsyncPipe, JsonPipe],
  templateUrl: './section-statistics.component.html',
  styleUrl: './section-statistics.component.scss',
})
export class SectionStatisticsComponent implements OnInit {
  public buildings$: Observable<IApiData<IBuilding[]>> = of({
    result: [],
    totalCount: 0,
  });
  public careers$: Observable<IApiData<ICareer[]>> = of({
    result: [],
    totalCount: 0,
  });
  public eduSpaces$: Observable<IApiData<IEducationalSpace[]>> = of({
    result: [],
    totalCount: 0,
  });
  public bookings$: Observable<IApiData<IBooking[]>> = of({
    result: [],
    totalCount: 0,
  });

  constructor(
    private _buildingService: BuildingService,
    private _careersService: CareersService,
    private _educationalSpaceService: ManagementEducationalSpacesService,
    private _onBookingService: OnBookingService
  ) {}

  ngOnInit(): void {
    this.buildings$ = this.fetchBuildings();
    this.careers$ = this.fetchCareers();
    this.eduSpaces$ = this.fetchEduSpaces();
    this.bookings$ = this.fetchBookings();
    // this.users$ = this.fetchUsers();
  }

  private fetchBuildings() {
    return this._buildingService.list().pipe(
      map(
        (res) =>
          res.data || {
            result: [],
            totalCount: 0,
          }
      )
    );
  }

  private fetchCareers() {
    return this._careersService.list().pipe(
      map(
        (res) =>
          res.data || {
            result: [],
            totalCount: 0,
          }
      )
    );
  }

  private fetchEduSpaces() {
    return this._educationalSpaceService.list().pipe(
      map(
        (res) =>
          res.data || {
            result: [],
            totalCount: 0,
          }
      )
    );
  }

  private fetchBookings() {
    return this._onBookingService.list({}).pipe(
      map(
        (res) =>
          res.data || {
            result: [],
            totalCount: 0,
          }
      )
    );
  }
}
