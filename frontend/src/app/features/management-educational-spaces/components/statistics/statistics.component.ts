import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { IBooking } from '../../../../core/interfaces/booking.interface';
import { OnBookingService } from '../../../../core/services/on-booking.service';
import { AppState } from '../../../../core/store';
import { selectAuthUser } from '../../../../core/store/user/user.selectors';
import { CustomizerSettingsService } from '../../../../shared/components/customizer-settings/customizer-settings.service';
import { StatusFormatterPipe } from '../../../../shared/pipes/status-formatter.pipe';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    StatusFormatterPipe,
    NgClass,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export default class StatisticsComponent implements OnInit {
  private eduSpaceId: string | null = null;
  public eduSpaceName: string | null = null;

  public isLoading: boolean = false;
  public dataSource$: Observable<MatTableDataSource<any>> = of(
    new MatTableDataSource<any>([])
  );
  public displayedColumns: string[] = ['startTime', 'endTime', 'status'];

  constructor(
    public themeService: CustomizerSettingsService,
    private _route: ActivatedRoute,
    private _store: Store<AppState>,
    private _onBookingService: OnBookingService
  ) {}

  ngOnInit(): void {
    this.dataSource$ = this.fetchBookingStatistics();
  }

  private fetchBookingStatistics(): Observable<MatTableDataSource<any>> {
    return combineLatest([
      this._route.paramMap,
      this._store.select(selectAuthUser),
    ]).pipe(
      switchMap(([params, user]) => {
        this.eduSpaceId = params.get('id');
        this.eduSpaceName = params.get('name');

        let filter = {};
        if (this.eduSpaceId && user) {
          filter = { eduSpaceId: this.eduSpaceId, teacherId: user.id };
        }
        return this._onBookingService.list(filter).pipe(
          map((res) => {
            return this.transformBookingData(res.data?.result || []);
          })
        );
      })
    );
  }

  private transformBookingData(bookings: IBooking[]): MatTableDataSource<any> {
    this.isLoading = false;
    const bookingMap = bookings.map(({ startTime, endTime, status }) => {
      return {
        startTime: new Date(startTime).toLocaleString(),
        endTime: new Date(endTime).toLocaleString(),
        status,
      };
    });
    return new MatTableDataSource<any>(bookingMap || []);
  }
}
