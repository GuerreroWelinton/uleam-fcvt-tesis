import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map, Observable, of } from 'rxjs';
import { IApiData } from '../../../../core/interfaces/api-response.interface';
import { ComunicationDashboardService } from '../../../../core/services/comunication-dashboard.service';
import { ManagementEducationalSpacesService } from '../../../../core/services/management-educational-spaces.service';
import { OnBookingService } from '../../../../core/services/on-booking.service';
import { IBuilding } from '../../../buildings/interfaces/building.interface';
import { BuildingService } from '../../../buildings/services/building.service';
import { ICareer } from '../../../careers/interfaces/careers.interface';
import { CareersService } from '../../../careers/services/careers.service';
import { IEducationalSpace } from '../../../management-educational-spaces/interfaces/educational-spaces.interface';

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

  public bookings$ = this._comunicationDashboardService.getValue();

  constructor(
    private _buildingService: BuildingService,
    private _careersService: CareersService,
    private _educationalSpaceService: ManagementEducationalSpacesService,
    private _onBookingService: OnBookingService,
    private _comunicationDashboardService: ComunicationDashboardService
  ) {}

  ngOnInit(): void {
    this.buildings$ = this.fetchBuildings();
    this.careers$ = this.fetchCareers();
    this.eduSpaces$ = this.fetchEduSpaces();
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
}
